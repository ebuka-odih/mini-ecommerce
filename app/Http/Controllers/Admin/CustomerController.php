<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::withCount('orders')
            ->withSum('orders', 'total')
            ->with(['orders' => function($q) {
                $q->latest()->limit(1);
            }]);

        // Search filter
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($request->status === 'unverified') {
                $query->whereNull('email_verified_at');
            } elseif ($request->status === 'active') {
                $query->whereNotNull('email_verified_at');
            }
        }

        $customers = $query->orderBy('created_at', 'desc')->get();

        // Add computed fields
        $customers = $customers->map(function($customer) {
            $customer->total_spent = $customer->orders_sum_total ?? 0;
            $customer->last_order_date = $customer->orders->first()?->created_at;
            $customer->status = $customer->email_verified_at ? 'active' : 'inactive';
            return $customer;
        });

        // Calculate stats
        $stats = [
            'total_customers' => User::count(),
            'new_customers_this_month' => User::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count(),
            'verified_customers' => User::whereNotNull('email_verified_at')->count(),
            'total_customer_value' => Order::where('payment_status', 'paid')->sum('total'),
        ];

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
        ];

        return Inertia::render('admin/customers', [
            'customers' => $customers,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $customer)
    {
        $customer->load(['orders' => function($q) {
            $q->with('orderItems.product')->orderBy('created_at', 'desc');
        }]);

        // Calculate customer stats
        $customerStats = [
            'total_orders' => $customer->orders->count(),
            'total_spent' => $customer->orders->where('payment_status', 'paid')->sum('total'),
            'average_order_value' => $customer->orders->count() > 0 
                ? $customer->orders->where('payment_status', 'paid')->avg('total') 
                : 0,
            'last_order_date' => $customer->orders->first()?->created_at,
        ];

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
        ];

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
            'customerStats' => $customerStats,
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Show customer orders.
     */
    public function orders(User $customer)
    {
        $orders = $customer->orders()
            ->with(['orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
        ];

        return Inertia::render('admin/customers/orders', [
            'customer' => $customer,
            'orders' => $orders,
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Update customer status.
     */
    public function updateStatus(Request $request, User $customer)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive'
        ]);

        // For now, we'll use email verification as status indicator
        if ($validated['status'] === 'active') {
            $customer->email_verified_at = $customer->email_verified_at ?? now();
        } else {
            $customer->email_verified_at = null;
        }

        $customer->save();

        return redirect()->back()
            ->with('success', 'Customer status updated successfully!');
    }

    /**
     * Export customers data.
     */
    public function export(Request $request)
    {
        // This would typically generate a CSV/Excel file
        // For now, we'll just redirect back
        return redirect()->back()
            ->with('info', 'Export functionality coming soon!');
    }
}
