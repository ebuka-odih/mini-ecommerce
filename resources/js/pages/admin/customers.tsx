import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Eye, MoreHorizontal, Users, Mail, Phone, MapPin, Calendar, ShoppingCart, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    orders_count?: number;
    total_spent?: number;
    last_order_date?: string;
    status: 'active' | 'inactive';
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zip_code?: string;
    };
}

interface CustomersPageProps {
    customers: Customer[];
    stats: {
        total_customers: number;
        new_customers_this_month: number;
        verified_customers: number;
        total_customer_value: number;
    };
    filters: {
        search?: string;
        status?: string;
        verified?: string;
    };
}

export default function CustomersPage({ customers, stats, filters }: CustomersPageProps) {
    const [searchQuery, setSearchQuery] = React.useState(filters.search || '');
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/customers', { 
            ...filters, 
            search: searchQuery || undefined 
        }, { 
            preserveState: true 
        });
    };

    // Real-time search on input change
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get('/admin/customers', { 
                    ...filters, 
                    search: searchQuery || undefined 
                }, { 
                    preserveState: true,
                    only: ['customers', 'stats']
                });
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const openCustomerDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDetailsModalOpen(true);
    };

    const getCustomerStatus = (customer: Customer) => {
        if (!customer.email_verified_at) {
            return { label: 'Unverified', color: 'bg-yellow-100 text-yellow-800' };
        }
        if (customer.status === 'inactive') {
            return { label: 'Inactive', color: 'bg-gray-100 text-gray-800' };
        }
        return { label: 'Active', color: 'bg-green-100 text-green-800' };
    };

    return (
        <AdminLayout>
            <Head title="Customers - GNOSIS Admin" />

            <PageHeader
                title="Customers"
                description="Manage your customer base and track customer analytics"
            />

            {/* Customer Details Modal */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">Customer Details</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            View detailed information about this customer
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedCustomer && (
                        <div className="space-y-6">
                            {/* Customer Header */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-gray-600 text-white text-lg font-medium">
                                        {selectedCustomer.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white">{selectedCustomer.name}</h3>
                                    <p className="text-gray-400">{selectedCustomer.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={getCustomerStatus(selectedCustomer).color}>
                                            {getCustomerStatus(selectedCustomer).label}
                                        </Badge>
                                        <Badge className="bg-blue-100 text-blue-800">
                                            Customer since {formatDate(selectedCustomer.created_at)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-gray-700 border-gray-600">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="h-4 w-4 text-blue-400" />
                                            <span className="text-sm text-gray-400">Total Orders</span>
                                        </div>
                                        <p className="text-xl font-bold text-white mt-1">
                                            {selectedCustomer.orders_count || 0}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-700 border-gray-600">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-green-400" />
                                            <span className="text-sm text-gray-400">Total Spent</span>
                                        </div>
                                        <p className="text-xl font-bold text-white mt-1">
                                            {formatCurrency(selectedCustomer.total_spent || 0)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-white">Contact Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{selectedCustomer.email}</span>
                                    </div>
                                    {selectedCustomer.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-300">{selectedCustomer.phone}</span>
                                        </div>
                                    )}
                                    {selectedCustomer.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <div className="text-gray-300">
                                                {selectedCustomer.address.street && <p>{selectedCustomer.address.street}</p>}
                                                <p>
                                                    {selectedCustomer.address.city && selectedCustomer.address.city}
                                                    {selectedCustomer.address.state && `, ${selectedCustomer.address.state}`}
                                                </p>
                                                <p>
                                                    {selectedCustomer.address.zip_code && selectedCustomer.address.zip_code}
                                                    {selectedCustomer.address.country && `, ${selectedCustomer.address.country}`}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Close
                                </Button>
                                <Button 
                                    onClick={() => router.get(`/admin/customers/${selectedCustomer.id}/orders`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    View Orders
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Search & Filters */}
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 sm:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>
                        </form>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <Select value={filters.status || 'all'} onValueChange={(value) => router.get('/admin/customers', { ...filters, status: value === 'all' ? undefined : value })}>
                                <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Customers</SelectItem>
                                    <SelectItem value="active" className="text-white hover:bg-gray-600">Active</SelectItem>
                                    <SelectItem value="verified" className="text-white hover:bg-gray-600">Verified</SelectItem>
                                    <SelectItem value="unverified" className="text-white hover:bg-gray-600">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Customers */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Customers</CardTitle>
                            <CardDescription className="text-gray-400">
                                Manage your customer base ({customers.length} customers)
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    {customers.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <div className="rounded-md border border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-700 hover:bg-gray-700/50">
                                                <TableHead className="text-gray-300">Customer</TableHead>
                                                <TableHead className="text-gray-300">Contact</TableHead>
                                                <TableHead className="text-gray-300">Orders</TableHead>
                                                <TableHead className="text-gray-300">Total Spent</TableHead>
                                                <TableHead className="text-gray-300">Status</TableHead>
                                                <TableHead className="text-gray-300 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {customers.map((customer) => {
                                                const customerStatus = getCustomerStatus(customer);
                                                return (
                                                    <TableRow key={customer.id} className="border-gray-700 hover:bg-gray-700/30">
                                                        {/* Customer Info */}
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarFallback className="bg-gray-600 text-white font-medium">
                                                                        {customer.name.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium text-white">{customer.name}</p>
                                                                    <p className="text-sm text-gray-400">
                                                                        Joined {formatDate(customer.created_at)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        {/* Contact */}
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <p className="text-white text-sm">{customer.email}</p>
                                                                {customer.phone && (
                                                                    <p className="text-gray-400 text-sm">{customer.phone}</p>
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        {/* Orders */}
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <p className="text-white font-medium">{customer.orders_count || 0}</p>
                                                                {customer.last_order_date && (
                                                                    <p className="text-xs text-gray-400">
                                                                        Last: {formatDate(customer.last_order_date)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        {/* Total Spent */}
                                                        <TableCell>
                                                            <p className="text-white font-medium">
                                                                {formatCurrency(customer.total_spent || 0)}
                                                            </p>
                                                        </TableCell>

                                                        {/* Status */}
                                                        <TableCell>
                                                            <Badge className={customerStatus.color}>
                                                                {customerStatus.label}
                                                            </Badge>
                                                        </TableCell>

                                                        {/* Actions */}
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                                    <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                                    <DropdownMenuItem 
                                                                        onClick={() => openCustomerDetails(customer)}
                                                                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => router.get(`/admin/customers/${customer.id}/orders`)}
                                                                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                                        View Orders
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                                    <DropdownMenuItem 
                                                                        onClick={() => window.open(`mailto:${customer.email}`)}
                                                                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        Send Email
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4 p-4">
                                {customers.map((customer) => {
                                    const customerStatus = getCustomerStatus(customer);
                                    return (
                                        <Card key={customer.id} className="bg-gray-700 border-gray-600">
                                            <CardContent className="p-4">
                                                <div className="space-y-4">
                                                    {/* Customer Header */}
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="h-12 w-12 flex-shrink-0">
                                                            <AvatarFallback className="bg-gray-600 text-white font-medium">
                                                                {customer.name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-white truncate">{customer.name}</h3>
                                                            <p className="text-sm text-gray-400 truncate">{customer.email}</p>
                                                            <Badge className={customerStatus.color + " mt-1"}>
                                                                {customerStatus.label}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Customer Details */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {/* Orders */}
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Orders</p>
                                                            <p className="text-white font-medium">{customer.orders_count || 0}</p>
                                                            {customer.last_order_date && (
                                                                <p className="text-xs text-gray-400">
                                                                    Last: {formatDate(customer.last_order_date)}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Total Spent */}
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Spent</p>
                                                            <p className="text-white font-medium">
                                                                {formatCurrency(customer.total_spent || 0)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                                                        <p className="text-xs text-gray-400">
                                                            Joined {formatDate(customer.created_at)}
                                                        </p>
                                                        <div className="flex items-center">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-600 h-8 w-8 p-0">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                                    <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                                    <DropdownMenuItem 
                                                                        onClick={() => openCustomerDetails(customer)}
                                                                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => router.get(`/admin/customers/${customer.id}/orders`)}
                                                                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                                        View Orders
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => window.open(`mailto:${customer.email}`)}
                                                                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        Send Email
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12 px-4">
                            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No customers found</h3>
                            <p className="text-gray-400 mb-6">
                                {searchQuery ? 'Try adjusting your search criteria' : 'Customers will appear here once they register'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{(stats.total_customers || 0).toLocaleString()}</div>
                        <p className="text-xs text-gray-400">Registered users</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">New This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{(stats.new_customers_this_month || 0).toLocaleString()}</div>
                        <p className="text-xs text-gray-400">Recent registrations</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Verified</CardTitle>
                        <Mail className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{(stats.verified_customers || 0).toLocaleString()}</div>
                        <p className="text-xs text-gray-400">Email verified</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Customer Value</CardTitle>
                        <CreditCard className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {formatCurrency(stats.total_customer_value || 0)}
                        </div>
                        <p className="text-xs text-gray-400">Total lifetime value</p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
