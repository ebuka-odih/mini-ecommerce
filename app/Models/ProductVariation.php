<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariation extends Model
{
    protected $fillable = [
        'product_id',
        'size_id',
        'color_id',
        'sku',
        'price',
        'stock_quantity',
        'is_active',
        'attributes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
        'attributes' => 'array',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class);
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    // Get display name for this variation
    public function getDisplayNameAttribute(): string
    {
        $parts = [];
        
        if ($this->size) {
            $parts[] = $this->size->display_name ?? $this->size->name;
        }
        
        if ($this->color) {
            $parts[] = $this->color->display_name ?? $this->color->name;
        }
        
        return implode(' - ', $parts) ?: 'Base Product';
    }

    // Get effective price (variation price or product price)
    public function getEffectivePriceAttribute(): float
    {
        return $this->price ?? $this->product->price;
    }

    // Scope for active variations
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
