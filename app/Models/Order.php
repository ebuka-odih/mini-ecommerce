<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'order_number',
        'subtotal',
        'tax',
        'shipping_cost',
        'discount',
        'total',
        'currency',
        'shipping_name',
        'shipping_email',
        'shipping_phone',
        'shipping_address',
        'shipping_city',
        'shipping_state',
        'shipping_country',
        'shipping_zip_code',
        'billing_name',
        'billing_email',
        'billing_phone',
        'billing_address',
        'billing_city',
        'billing_state',
        'billing_country',
        'billing_zip_code',
        'payment_method',
        'payment_status',
        'status',
        'transaction_id',
        'paid_at',
        'shipped_at',
        'delivered_at',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Accessors
    public function getFormattedTotalAttribute(): string
    {
        return '₦' . number_format($this->total, 2);
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return '₦' . number_format($this->subtotal, 2);
    }

    public function getFormattedTaxAttribute(): string
    {
        return '₦' . number_format($this->tax, 2);
    }

    public function getFormattedShippingCostAttribute(): string
    {
        return '₦' . number_format($this->shipping_cost, 2);
    }

    public function getFormattedDiscountAttribute(): string
    {
        return '₦' . number_format($this->discount, 2);
    }

    public function getStatusBadgeAttribute(): string
    {
        $badges = [
            'pending' => 'bg-yellow-900/50 text-yellow-300',
            'processing' => 'bg-blue-900/50 text-blue-300',
            'shipped' => 'bg-purple-900/50 text-purple-300',
            'delivered' => 'bg-green-900/50 text-green-300',
            'cancelled' => 'bg-red-900/50 text-red-300',
            'refunded' => 'bg-gray-900/50 text-gray-300',
        ];

        return $badges[$this->status] ?? 'bg-gray-900/50 text-gray-300';
    }

    public function getPaymentStatusBadgeAttribute(): string
    {
        $badges = [
            'pending' => 'bg-yellow-900/50 text-yellow-300',
            'paid' => 'bg-green-900/50 text-green-300',
            'failed' => 'bg-red-900/50 text-red-300',
            'refunded' => 'bg-gray-900/50 text-gray-300',
        ];

        return $badges[$this->payment_status] ?? 'bg-gray-900/50 text-gray-300';
    }

    public function getIsPaidAttribute(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function getIsShippedAttribute(): bool
    {
        return !is_null($this->shipped_at);
    }

    public function getIsDeliveredAttribute(): bool
    {
        return !is_null($this->delivered_at);
    }

    public function getItemsCountAttribute(): int
    {
        return $this->orderItems->sum('quantity');
    }

    public function getCustomerNameAttribute(): string
    {
        return $this->shipping_name ?? 'Guest Customer';
    }

    public function getCustomerEmailAttribute(): string
    {
        return $this->shipping_email ?? 'No email';
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeShipped($query)
    {
        return $query->where('status', 'shipped');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', Carbon::today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('order_number', 'like', "%{$search}%")
              ->orWhere('shipping_name', 'like', "%{$search}%")
              ->orWhere('shipping_email', 'like', "%{$search}%")
              ->orWhere('transaction_id', 'like', "%{$search}%");
        });
    }

    // Methods
    public function canBeShipped(): bool
    {
        return $this->status === 'processing' && $this->payment_status === 'paid';
    }

    public function canBeDelivered(): bool
    {
        return $this->status === 'shipped';
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    public function markAsShipped(): void
    {
        $this->update([
            'status' => 'shipped',
            'shipped_at' => now(),
        ]);
    }

    public function markAsDelivered(): void
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
    }

    public function markAsCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }

    public function getStatusTimeline(): array
    {
        $timeline = [];

        // Order created
        $timeline[] = [
            'status' => 'Order Placed',
            'description' => 'Order #' . $this->order_number . ' was created',
            'date' => $this->created_at,
            'completed' => true,
        ];

        // Payment
        if ($this->is_paid) {
            $timeline[] = [
                'status' => 'Payment Received',
                'description' => 'Payment of ' . $this->formatted_total . ' received',
                'date' => $this->paid_at,
                'completed' => true,
            ];
        }

        // Processing
        if (in_array($this->status, ['processing', 'shipped', 'delivered'])) {
            $timeline[] = [
                'status' => 'Processing',
                'description' => 'Order is being prepared for shipping',
                'date' => $this->paid_at,
                'completed' => true,
            ];
        }

        // Shipped
        if ($this->is_shipped) {
            $timeline[] = [
                'status' => 'Shipped',
                'description' => 'Order has been shipped',
                'date' => $this->shipped_at,
                'completed' => true,
            ];
        }

        // Delivered
        if ($this->is_delivered) {
            $timeline[] = [
                'status' => 'Delivered',
                'description' => 'Order has been delivered',
                'date' => $this->delivered_at,
                'completed' => true,
            ];
        }

        return $timeline;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . date('Y') . '-' . str_pad(static::whereYear('created_at', date('Y'))->count() + 1, 6, '0', STR_PAD_LEFT);
            }
        });
    }
}
