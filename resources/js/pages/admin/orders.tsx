import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Eye, 
    MoreHorizontal, 
    Search, 
    Filter, 
    Download, 
    Calendar,
    Package,
    User,
    CreditCard,
    MapPin,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Truck,
    ChevronDown
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OrdersTableMobileSimple from '@/components/admin/orders-table-mobile-simple';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: string;
    order_number: string;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        avatar?: string;
    };
    items: OrderItem[];
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    created_at: string;
    updated_at: string;
    shipping_address: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
}

interface OrdersPageProps {
    orders: Order[];
    stats: {
        total_orders: number;
        pending_orders: number;
        completed_orders: number;
        total_revenue: number;
    };
    layout_stats?: {
        total_orders: number;
        pending_orders: number;
    };
    site_settings?: {
        site_name: string;
        site_logo: string;
        currency: string;
    };
}

const Orders: React.FC<OrdersPageProps> = ({ 
    orders = [], 
    stats = {
        total_orders: 0,
        pending_orders: 0,
        completed_orders: 0,
        total_revenue: 0
    },
    layout_stats,
    site_settings
}) => {
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<string>('all');
    const [paymentFilter, setPaymentFilter] = React.useState<string>('all');

    const formatCurrency = (amount: number) => {
        const currency = site_settings?.currency || 'NGN';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'refunded':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-3 w-3" />;
            case 'processing':
                return <Package className="h-3 w-3" />;
            case 'shipped':
                return <Truck className="h-3 w-3" />;
            case 'delivered':
                return <CheckCircle className="h-3 w-3" />;
            case 'cancelled':
                return <XCircle className="h-3 w-3" />;
            default:
                return <AlertCircle className="h-3 w-3" />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
        
        return matchesSearch && matchesStatus && matchesPayment;
    });

    return (
        <AdminLayout title="Orders - GNOSIS Admin" stats={layout_stats} site_settings={site_settings}>
            <Head title="Orders Management" />
            
            <PageHeader 
                title="Orders" 
                description="Manage customer orders and track their status"
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </PageHeader>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{(stats.total_orders || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Pending Orders</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{(stats.pending_orders || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{(stats.completed_orders || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{formatCurrency(stats.total_revenue || 0)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                    <CardTitle className="text-white">Orders</CardTitle>
                    <CardDescription className="text-gray-400">
                        Manage and track all customer orders
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search orders, customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Status</SelectItem>
                                    <SelectItem value="pending" className="text-white hover:bg-gray-600">Pending</SelectItem>
                                    <SelectItem value="processing" className="text-white hover:bg-gray-600">Processing</SelectItem>
                                    <SelectItem value="shipped" className="text-white hover:bg-gray-600">Shipped</SelectItem>
                                    <SelectItem value="delivered" className="text-white hover:bg-gray-600">Delivered</SelectItem>
                                    <SelectItem value="cancelled" className="text-white hover:bg-gray-600">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder="Payment" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Payment</SelectItem>
                                    <SelectItem value="paid" className="text-white hover:bg-gray-600">Paid</SelectItem>
                                    <SelectItem value="pending" className="text-white hover:bg-gray-600">Pending</SelectItem>
                                    <SelectItem value="failed" className="text-white hover:bg-gray-600">Failed</SelectItem>
                                    <SelectItem value="refunded" className="text-white hover:bg-gray-600">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table - Responsive */}
            <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-700">
                                            <TableHead className="text-gray-300">Order</TableHead>
                                            <TableHead className="text-gray-300">Customer</TableHead>
                                            <TableHead className="text-gray-300">Status</TableHead>
                                            <TableHead className="text-gray-300">Payment</TableHead>
                                            <TableHead className="text-gray-300">Total</TableHead>
                                            <TableHead className="text-gray-300">Date</TableHead>
                                            <TableHead className="text-gray-300">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <TableRow key={order.id} className="border-gray-700 hover:bg-gray-700/50">
                                                    <TableCell className="font-medium text-white">
                                                        <div>
                                                            <div className="font-semibold">#{order.order_number}</div>
                                                            <div className="text-sm text-gray-400">
                                                                {order.items && Array.isArray(order.items) ? (
                                                                    `${order.items.length} item${order.items.length !== 1 ? 's' : ''}`
                                                                ) : (
                                                                    '0 items'
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="bg-gray-600 text-white text-xs">
                                                                    {order.customer?.name ? order.customer.name.charAt(0).toUpperCase() : '?'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium text-white">{order.customer?.name || 'N/A'}</div>
                                                                <div className="text-sm text-gray-400">{order.customer?.email || 'N/A'}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${getStatusColor(order.status)} border flex items-center gap-1 w-fit`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${getPaymentStatusColor(order.payment_status)} border flex items-center gap-1 w-fit`}>
                                                            <CreditCard className="h-3 w-3" />
                                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-white">
                                                        {formatCurrency(order.total)}
                                                    </TableCell>
                                                    <TableCell className="text-gray-300">
                                                        {formatDate(order.created_at)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                                <DropdownMenuItem 
                                                                    className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    onClick={() => setSelectedOrder(order)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                                                                    <Package className="mr-2 h-4 w-4" />
                                                                    Update Status
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    Download Invoice
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-gray-700" />
                                                                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer">
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Cancel Order
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <div className="flex flex-col items-center">
                                                        <Package className="h-12 w-12 text-gray-600 mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-400 mb-2">No orders found</h3>
                                                        <p className="text-gray-500">No orders match your current filters</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                    <OrdersTableMobileSimple 
                        orders={filteredOrders} 
                        onViewOrder={setSelectedOrder}
                    />
                </div>
            </div>

            {/* Order Details Sheet */}
            {selectedOrder && (
                <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                    <SheetContent side="right" className="w-96 bg-gray-800 border-gray-700 overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle className="text-white">Order Details</SheetTitle>
                        </SheetHeader>
                        
                        <div className="space-y-6 mt-6">
                            {/* Order Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Order Information</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order Number:</span>
                                        <span className="text-white font-medium">#{selectedOrder.order_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date:</span>
                                        <span className="text-white">{formatDate(selectedOrder.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        <Badge className={`${getStatusColor(selectedOrder.status)} border`}>
                                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Payment:</span>
                                        <Badge className={`${getPaymentStatusColor(selectedOrder.payment_status)} border`}>
                                            {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Customer Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-gray-600 text-white">
                                                {selectedOrder.customer?.name ? selectedOrder.customer.name.charAt(0).toUpperCase() : '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-white">{selectedOrder.customer?.name || 'N/A'}</div>
                                            <div className="text-sm text-gray-400">{selectedOrder.customer?.email || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">{selectedOrder.customer?.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Shipping Address</h3>
                                {selectedOrder.shipping_address ? (
                                    <div className="space-y-1 text-sm">
                                        <div className="text-white">{selectedOrder.shipping_address.street || 'N/A'}</div>
                                        <div className="text-gray-400">
                                            {selectedOrder.shipping_address.city || 'N/A'}, {selectedOrder.shipping_address.state || 'N/A'}
                                        </div>
                                        <div className="text-gray-400">
                                            {selectedOrder.shipping_address.zip_code || 'N/A'}, {selectedOrder.shipping_address.country || 'N/A'}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm">No shipping address available</div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex gap-3 p-3 bg-gray-700 rounded-lg">
                                                <div className="w-12 h-12 bg-gray-600 rounded flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-white">{item?.name || 'Unknown Item'}</div>
                                                    <div className="text-sm text-gray-400">Qty: {item?.quantity || 0}</div>
                                                    <div className="text-sm font-medium text-white">{formatCurrency(item?.price || 0)}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-400 text-center py-4">No items found</div>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Order Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Subtotal:</span>
                                        <span className="text-white">{formatCurrency(selectedOrder.total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Shipping:</span>
                                        <span className="text-white">Free</span>
                                    </div>
                                    <div className="border-t border-gray-700 pt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-white">Total:</span>
                                            <span className="font-bold text-white text-lg">{formatCurrency(selectedOrder.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </AdminLayout>
    );
};

export default Orders;
