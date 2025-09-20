<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        // Get current date and previous periods
        $now = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();
        $lastWeek = Carbon::now()->subWeek();
        $thisWeekStart = Carbon::now()->startOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();

        // Total Sales Statistics
        $totalSales = Order::where('payment_status', 'paid')->sum('total');
        $lastMonthSales = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])
            ->sum('total');
        $thisWeekSales = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$thisWeekStart, $now])
            ->sum('total');
        $lastWeekSales = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastWeekStart, $thisWeekStart])
            ->sum('total');

        // Calculate sales growth percentage
        $salesGrowth = $lastWeekSales > 0 ? (($thisWeekSales - $lastWeekSales) / $lastWeekSales) * 100 : 0;

        // Orders Statistics
        $totalOrders = Order::count();
        $thisWeekOrders = Order::whereBetween('created_at', [$thisWeekStart, $now])->count();
        $lastWeekOrders = Order::whereBetween('created_at', [$lastWeekStart, $thisWeekStart])->count();
        $ordersGrowth = $lastWeekOrders > 0 ? (($thisWeekOrders - $lastWeekOrders) / $lastWeekOrders) * 100 : 0;

        // Average Order Value
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        $thisWeekAvgOrder = $thisWeekOrders > 0 ? $thisWeekSales / $thisWeekOrders : 0;
        $lastWeekAvgOrder = $lastWeekOrders > 0 ? $lastWeekSales / $lastWeekOrders : 0;
        $avgOrderGrowth = $lastWeekAvgOrder > 0 ? (($thisWeekAvgOrder - $lastWeekAvgOrder) / $lastWeekAvgOrder) * 100 : 0;

        // Customers Statistics
        $totalCustomers = User::count();
        $thisWeekCustomers = User::whereBetween('created_at', [$thisWeekStart, $now])->count();
        $lastWeekCustomers = User::whereBetween('created_at', [$lastWeekStart, $thisWeekStart])->count();
        $customersGrowth = $lastWeekCustomers > 0 ? (($thisWeekCustomers - $lastWeekCustomers) / $lastWeekCustomers) * 100 : 0;

        // Products and Categories
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $activeProducts = Product::where('is_active', true)->count();

        // Recent Orders
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Top Products (by sales)
        $topProducts = OrderItem::with('product')
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(total_price) as total_revenue'))
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        // Sales data for charts (last 7 days)
        $salesChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $daySales = Order::where('payment_status', 'paid')
                ->whereDate('created_at', $date)
                ->sum('total');
            $salesChartData[] = [
                'date' => $date->format('M d'),
                'sales' => $daySales
            ];
        }

        // Orders data for charts (last 7 days)
        $ordersChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayOrders = Order::whereDate('created_at', $date)->count();
            $ordersChartData[] = [
                'date' => $date->format('M d'),
                'orders' => $dayOrders
            ];
        }

        return view('admin.index', compact(
            'totalSales',
            'lastMonthSales',
            'thisWeekSales',
            'salesGrowth',
            'totalOrders',
            'thisWeekOrders',
            'ordersGrowth',
            'averageOrderValue',
            'thisWeekAvgOrder',
            'avgOrderGrowth',
            'totalCustomers',
            'thisWeekCustomers',
            'customersGrowth',
            'totalProducts',
            'totalCategories',
            'activeProducts',
            'recentOrders',
            'topProducts',
            'salesChartData',
            'ordersChartData'
        ));
    }
}
