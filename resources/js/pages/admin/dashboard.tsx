import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    ShoppingCart, 
    Users, 
    Package,
    Eye,
    MoreHorizontal,
    BarChart3
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';
import StatsCard from '@/components/admin/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface DashboardStats {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    total_products: number;
    revenue_change: number;
    orders_change: number;
    customers_change: number;
    products_change: number;
}

interface RecentOrder {
    id: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
}

interface AdminDashboardProps {
    stats: DashboardStats;
    recent_orders: RecentOrder[];
    low_stock_products: any[];
    layout_stats?: {
        total_orders: number;
        pending_orders: number;
    };
    site_settings?: {
        site_name: string;
        site_logo: string;
    };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    stats = {
        total_revenue: 0,
        total_orders: 0,
        total_customers: 0,
        total_products: 0,
        revenue_change: 0,
        orders_change: 0,
        customers_change: 0,
        products_change: 0,
    },
    recent_orders = [],
    low_stock_products = [],
    layout_stats,
    site_settings
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout title="Dashboard - GNOSIS Admin" stats={layout_stats} site_settings={site_settings}>
            <Head title="Dashboard" />
            
            <PageHeader 
                title="Dashboard" 
                description="Welcome back! Here's what's happening with your store today."
            >
                <Button variant="outline" asChild className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500">
                    <Link href="/">
                        <Eye className="mr-2 h-4 w-4" />
                        View Store
                    </Link>
                </Button>
            </PageHeader>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.total_revenue)}
                    change={stats.revenue_change}
                    icon={DollarSign}
                    iconColor="text-green-600"
                />
                <StatsCard
                    title="Orders"
                    value={stats.total_orders.toLocaleString()}
                    change={stats.orders_change}
                    icon={ShoppingCart}
                    iconColor="text-blue-600"
                />
                <StatsCard
                    title="Customers"
                    value={stats.total_customers.toLocaleString()}
                    change={stats.customers_change}
                    icon={Users}
                    iconColor="text-purple-600"
                />
                <StatsCard
                    title="Products"
                    value={stats.total_products.toLocaleString()}
                    change={stats.products_change}
                    icon={Package}
                    iconColor="text-orange-600"
                />
            </div>

            {/* Content Grid */}
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {/* Recent Orders */}
                <Card className="xl:col-span-2 bg-gray-800 border-gray-700">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Recent Orders</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Latest orders from your customers
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_orders.length > 0 ? (
                                recent_orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                    {order.customer_name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-white">{order.customer_name}</p>
                                                <p className="text-xs text-gray-400">Order #{order.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                            <p className="text-sm font-medium text-white">{formatCurrency(order.total)}</p>
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">No recent orders</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                        <CardDescription className="text-gray-400">
                            Common tasks and shortcuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700" variant="outline" asChild>
                            <Link href="/admin/products/create">
                                <Package className="mr-2 h-4 w-4" />
                                Add New Product
                            </Link>
                        </Button>
                        <Button className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700" variant="outline" asChild>
                            <Link href="/admin/orders">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                View Orders
                            </Link>
                        </Button>
                        <Button className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700" variant="outline" asChild>
                            <Link href="/admin/customers">
                                <Users className="mr-2 h-4 w-4" />
                                Manage Customers
                            </Link>
                        </Button>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-300">Low Stock Alert</h4>
                            {low_stock_products.length > 0 ? (
                                <div className="text-sm text-orange-400">
                                    {low_stock_products.length} products need restocking
                                </div>
                            ) : (
                                <div className="text-sm text-green-400">
                                    All products are well stocked
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Dashboard Content */}
            <div className="grid gap-4 md:gap-8">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Sales Overview</CardTitle>
                        <CardDescription className="text-gray-400">
                            Revenue and sales performance metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
                            <div className="text-center text-gray-400">
                                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-white">Sales chart will be displayed here</p>
                                <p className="text-xs text-gray-500">Integration with Chart.js or similar</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
