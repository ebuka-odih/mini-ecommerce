<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'orderItems.product']);

        // Search filter
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('order_number', 'like', "%{$searchTerm}%")
                  ->orWhereHas('user', function($userQuery) use ($searchTerm) {
                      $userQuery->where('name', 'like', "%{$searchTerm}%")
                               ->orWhere('email', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Payment status filter
        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        // Calculate stats
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'completed_orders' => Order::where('status', 'delivered')->count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'orders_today' => Order::whereDate('created_at', today())->count(),
        ];

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
            'currency' => Setting::getValue('currency', 'NGN'),
        ];

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'payment_status' => $request->payment_status,
            ],
            'layout_stats' => [
                'total_orders' => $stats['total_orders'],
                'pending_orders' => $stats['pending_orders'],
            ],
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['user', 'orderItems.product']);

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
            'currency' => Setting::getValue('currency', 'NGN'),
        ];

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->update($validated);

        return redirect()->back()
            ->with('success', 'Order status updated successfully!');
    }

    /**
     * Update payment status.
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,paid,failed,refunded'
        ]);

        $order->update($validated);

        return redirect()->back()
            ->with('success', 'Payment status updated successfully!');
    }

    /**
     * Bulk update orders.
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
            'action' => 'required|in:mark_shipped,mark_delivered,cancel',
        ]);

        $statusMap = [
            'mark_shipped' => 'shipped',
            'mark_delivered' => 'delivered',
            'cancel' => 'cancelled',
        ];

        Order::whereIn('id', $validated['order_ids'])
            ->update(['status' => $statusMap[$validated['action']]]);

        return redirect()->back()
            ->with('success', 'Orders updated successfully!');
    }

    /**
     * Export orders.
     */
    public function export(Request $request)
    {
        // This would typically generate a CSV/Excel file
        // For now, we'll just redirect back
        return redirect()->back()
            ->with('info', 'Export functionality coming soon!');
    }

    /**
     * Show analytics.
     */
    public function analytics()
    {
        $analytics = [
            'daily_orders' => Order::selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->limit(30)
                ->get(),
            'status_breakdown' => Order::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get(),
            'revenue_by_month' => Order::where('payment_status', 'paid')
                ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total_amount) as revenue')
                ->groupBy('year', 'month')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->limit(12)
                ->get(),
        ];

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
            'currency' => Setting::getValue('currency', 'NGN'),
        ];

        return Inertia::render('admin/orders/analytics', [
            'analytics' => $analytics,
            'site_settings' => $siteSettings,
        ]);
    }
}