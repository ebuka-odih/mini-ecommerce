import React from 'react';
import { Eye, MoreHorizontal, Package, User, CreditCard, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

interface OrdersTableMobileSimpleProps {
    orders: Order[];
    onViewOrder: (order: Order) => void;
}

const OrdersTableMobileSimple: React.FC<OrdersTableMobileSimpleProps> = ({ orders, onViewOrder }) => {
    const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
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
                return '⏰';
            case 'processing':
                return '📦';
            case 'shipped':
                return '🚚';
            case 'delivered':
                return '✅';
            case 'cancelled':
                return '❌';
            default:
                return '⚠️';
        }
    };

    return (
        <div className="space-y-4">
            {orders.length > 0 ? (
                orders.map((order) => (
                    <Card key={order.id} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-white text-lg">
                                        #{order.order_number}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className={`${getStatusColor(order.status)} border text-xs`}>
                                            {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                        <Badge className={`${getPaymentStatusColor(order.payment_status)} border text-xs`}>
                                            💳 {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                        <DropdownMenuItem 
                                            className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                            onClick={() => onViewOrder(order)}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                                            <Package className="mr-2 h-4 w-4" />
                                            Update Status
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-gray-700" />
                                        <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer">
                                            Cancel Order
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                            {/* Customer Info */}
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gray-600 text-white">
                                        {order.customer.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium text-white">{order.customer.name}</div>
                                    <div className="text-sm text-gray-400">{order.customer.email}</div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Total:</span>
                                    <div className="font-semibold text-white">{formatCurrency(order.total)}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Items:</span>
                                    <div className="font-semibold text-white">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-400">
                                <span className="text-gray-400">Date:</span>
                                <div className="font-medium text-white">{formatDate(order.created_at)}</div>
                            </div>

                            {/* Simple Details Toggle */}
                            <div className="space-y-3">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full justify-between text-gray-400 hover:text-white hover:bg-gray-700"
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                >
                                    <span>View Details</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                                </Button>

                                {expandedOrder === order.id && (
                                    <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
                                        {/* Shipping Address */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white text-sm">Shipping Address</h4>
                                            <div className="text-sm text-gray-400 space-y-1">
                                                <div>{order.shipping_address.street}</div>
                                                <div>{order.shipping_address.city}, {order.shipping_address.state}</div>
                                                <div>{order.shipping_address.zip_code}, {order.shipping_address.country}</div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white text-sm">Order Items</h4>
                                            <div className="space-y-2">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex gap-3 p-2 bg-gray-600 rounded">
                                                        <div className="w-10 h-10 bg-gray-500 rounded flex-shrink-0"></div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm">{item.name}</div>
                                                            <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                                                            <div className="text-xs font-medium text-white">{formatCurrency(item.price)}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                    onClick={() => onViewOrder(order)}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Full Details
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Update Status
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No orders found</h3>
                        <p className="text-gray-500">No orders match your current filters</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default OrdersTableMobileSimple;














