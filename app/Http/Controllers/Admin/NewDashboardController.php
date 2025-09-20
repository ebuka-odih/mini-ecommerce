<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class NewDashboardController extends Controller
{
    public function index()
    {
        // Calculate dashboard statistics
        $stats = $this->getDashboardStats();
        
        // Get recent orders
        $recent_orders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->user->name ?? 'Guest Customer',
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Get low stock products
        $low_stock_products = Product::where('stock_quantity', '<=', 5)
            ->where('is_active', true)
            ->get(['id', 'name', 'stock_quantity']);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recent_orders' => $recent_orders,
            'low_stock_products' => $low_stock_products,
            'layout_stats' => [
                'total_orders' => $stats['total_orders'],
                'pending_orders' => Order::where('status', 'pending')->count(),
            ],
        ]);
    }

    private function getDashboardStats()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        // Current month stats
        $currentRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $currentMonth)
            ->sum('total');

        $currentOrders = Order::where('created_at', '>=', $currentMonth)->count();
        
        $currentCustomers = User::where('created_at', '>=', $currentMonth)->count();
        
        $totalProducts = Product::where('is_active', true)->count();

        // Last month stats for comparison
        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])
            ->sum('total');

        $lastMonthOrders = Order::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
        
        $lastMonthCustomers = User::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        // Calculate percentage changes
        $revenueChange = $lastMonthRevenue > 0 
            ? (($currentRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        $ordersChange = $lastMonthOrders > 0 
            ? (($currentOrders - $lastMonthOrders) / $lastMonthOrders) * 100 
            : 0;

        $customersChange = $lastMonthCustomers > 0 
            ? (($currentCustomers - $lastMonthCustomers) / $lastMonthCustomers) * 100 
            : 0;

        return [
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'total_orders' => Order::count(),
            'total_customers' => User::count(),
            'total_products' => $totalProducts,
            'revenue_change' => $revenueChange,
            'orders_change' => $ordersChange,
            'customers_change' => $customersChange,
            'products_change' => 0, // Could track new products added
        ];
    }
}
