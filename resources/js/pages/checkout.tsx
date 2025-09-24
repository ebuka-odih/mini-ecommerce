import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, Lock } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/fashion-utils';

interface CheckoutItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        images: Array<{
            id: number;
            url: string;
            thumbnail_url: string;
            alt_text?: string;
            is_featured: boolean;
        }>;
    };
    variation?: {
        id: number;
        size?: {
            id: number;
            display_name: string;
        };
        color?: {
            id: number;
            display_name: string;
            hex_code: string;
        };
    };
}

interface CheckoutData {
    items: CheckoutItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
}

interface CheckoutPageProps {
    cart: CheckoutData;
}

interface CheckoutForm {
    // Contact Information
    email: string;
    phone: string;
    
    // Shipping Information
    shipping_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_country: string;
    shipping_zip_code: string;
    
    // Billing Information (optional, defaults to shipping)
    billing_name: string;
    billing_address: string;
    billing_city: string;
    billing_state: string;
    billing_country: string;
    billing_zip_code: string;
    
    // Payment
    payment_method: string;
    
    // Order Notes
    order_notes: string;
    
    // Same as shipping checkbox
    same_as_shipping: boolean;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart }) => {
    const { data, setData, post, processing, errors } = useForm<CheckoutForm>({
        // Contact Information
        email: '',
        phone: '',
        
        // Shipping Information
        shipping_name: '',
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_country: 'Nigeria',
        shipping_zip_code: '',
        
        // Billing Information
        billing_name: '',
        billing_address: '',
        billing_city: '',
        billing_state: '',
        billing_country: 'Nigeria',
        billing_zip_code: '',
        
        // Payment
        payment_method: 'paystack',
        
        // Order Notes
        order_notes: '',
        
        // Same as shipping
        same_as_shipping: true,
    });

    const handleSameAsShippingChange = (checked: boolean) => {
        setData('same_as_shipping', checked);
        if (checked) {
            setData('billing_name', data.shipping_name);
            setData('billing_address', data.shipping_address);
            setData('billing_city', data.shipping_city);
            setData('billing_state', data.shipping_state);
            setData('billing_country', data.shipping_country);
            setData('billing_zip_code', data.shipping_zip_code);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout', {
            onSuccess: (page) => {
                // Redirect to payment or success page
                if (page.props.payment_url) {
                    window.location.href = page.props.payment_url;
                }
            },
            onError: (errors) => {
                console.error('Checkout errors:', errors);
            }
        });
    };

    const getItemImage = (item: CheckoutItem) => {
        const featuredImage = item.product.images.find(img => img.is_featured);
        const firstImage = item.product.images[0];
        const image = featuredImage || firstImage;
        
        if (image) {
            return image.thumbnail_url || `/storage/${image.path}`;
        }
        return '/images/placeholder-product.jpg';
    };

    const getItemTitle = (item: CheckoutItem) => {
        let title = item.product.name;
        if (item.variation?.size || item.variation?.color) {
            const parts = [];
            if (item.variation.size) parts.push(item.variation.size.display_name);
            if (item.variation.color) parts.push(item.variation.color.display_name);
            title += ` (${parts.join(', ')})`;
        }
        return title;
    };

    const nigerianStates = [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
        'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
        'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
    ];

    return (
        <MainLayout title="Checkout - GNOSIS">
            <Head title="Checkout" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/cart">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Cart
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-light text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Contact Information */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Contact Information
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={errors.email ? 'border-red-500' : ''}
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className={errors.phone ? 'border-red-500' : ''}
                                            placeholder="+234 800 000 0000"
                                        />
                                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Shipping Information
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="shipping_name">Full Name *</Label>
                                        <Input
                                            id="shipping_name"
                                            value={data.shipping_name}
                                            onChange={(e) => setData('shipping_name', e.target.value)}
                                            className={errors.shipping_name ? 'border-red-500' : ''}
                                            placeholder="John Doe"
                                        />
                                        {errors.shipping_name && <p className="text-sm text-red-500 mt-1">{errors.shipping_name}</p>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="shipping_address">Address *</Label>
                                        <Input
                                            id="shipping_address"
                                            value={data.shipping_address}
                                            onChange={(e) => setData('shipping_address', e.target.value)}
                                            className={errors.shipping_address ? 'border-red-500' : ''}
                                            placeholder="123 Main Street, Apartment 4B"
                                        />
                                        {errors.shipping_address && <p className="text-sm text-red-500 mt-1">{errors.shipping_address}</p>}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="shipping_city">City *</Label>
                                            <Input
                                                id="shipping_city"
                                                value={data.shipping_city}
                                                onChange={(e) => setData('shipping_city', e.target.value)}
                                                className={errors.shipping_city ? 'border-red-500' : ''}
                                                placeholder="Lagos"
                                            />
                                            {errors.shipping_city && <p className="text-sm text-red-500 mt-1">{errors.shipping_city}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="shipping_state">State *</Label>
                                            <select
                                                id="shipping_state"
                                                value={data.shipping_state}
                                                onChange={(e) => setData('shipping_state', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shipping_state ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select State</option>
                                                {nigerianStates.map((state) => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            {errors.shipping_state && <p className="text-sm text-red-500 mt-1">{errors.shipping_state}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="shipping_zip_code">ZIP Code</Label>
                                            <Input
                                                id="shipping_zip_code"
                                                value={data.shipping_zip_code}
                                                onChange={(e) => setData('shipping_zip_code', e.target.value)}
                                                className={errors.shipping_zip_code ? 'border-red-500' : ''}
                                                placeholder="100001"
                                            />
                                            {errors.shipping_zip_code && <p className="text-sm text-red-500 mt-1">{errors.shipping_zip_code}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Information */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Billing Information
                                </h2>
                                
                                <div className="mb-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.same_as_shipping}
                                            onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Same as shipping address</span>
                                    </label>
                                </div>
                                
                                {!data.same_as_shipping && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="billing_name">Full Name *</Label>
                                            <Input
                                                id="billing_name"
                                                value={data.billing_name}
                                                onChange={(e) => setData('billing_name', e.target.value)}
                                                className={errors.billing_name ? 'border-red-500' : ''}
                                                placeholder="John Doe"
                                            />
                                            {errors.billing_name && <p className="text-sm text-red-500 mt-1">{errors.billing_name}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="billing_address">Address *</Label>
                                            <Input
                                                id="billing_address"
                                                value={data.billing_address}
                                                onChange={(e) => setData('billing_address', e.target.value)}
                                                className={errors.billing_address ? 'border-red-500' : ''}
                                                placeholder="123 Main Street, Apartment 4B"
                                            />
                                            {errors.billing_address && <p className="text-sm text-red-500 mt-1">{errors.billing_address}</p>}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="billing_city">City *</Label>
                                                <Input
                                                    id="billing_city"
                                                    value={data.billing_city}
                                                    onChange={(e) => setData('billing_city', e.target.value)}
                                                    className={errors.billing_city ? 'border-red-500' : ''}
                                                    placeholder="Lagos"
                                                />
                                                {errors.billing_city && <p className="text-sm text-red-500 mt-1">{errors.billing_city}</p>}
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="billing_state">State *</Label>
                                                <select
                                                    id="billing_state"
                                                    value={data.billing_state}
                                                    onChange={(e) => setData('billing_state', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.billing_state ? 'border-red-500' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Select State</option>
                                                    {nigerianStates.map((state) => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                                {errors.billing_state && <p className="text-sm text-red-500 mt-1">{errors.billing_state}</p>}
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="billing_zip_code">ZIP Code</Label>
                                                <Input
                                                    id="billing_zip_code"
                                                    value={data.billing_zip_code}
                                                    onChange={(e) => setData('billing_zip_code', e.target.value)}
                                                    className={errors.billing_zip_code ? 'border-red-500' : ''}
                                                    placeholder="100001"
                                                />
                                                {errors.billing_zip_code && <p className="text-sm text-red-500 mt-1">{errors.billing_zip_code}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-medium text-gray-900 mb-6">Order Notes</h2>
                                <textarea
                                    value={data.order_notes}
                                    onChange={(e) => setData('order_notes', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Any special instructions for your order?"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 text-lg font-medium"
                                size="lg"
                            >
                                {processing ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5 mr-2" />
                                        Complete Order - {formatPrice(cart.total)}
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h2>
                                
                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={getItemImage(item)}
                                                    alt={item.product.images[0]?.alt_text || item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {getItemTitle(item)}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <Separator className="mb-4" />
                                
                                {/* Totals */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(cart.subtotal)}</span>
                                    </div>
                                    
                                    {cart.shipping > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>{formatPrice(cart.shipping)}</span>
                                        </div>
                                    )}
                                    
                                    {cart.tax > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax</span>
                                            <span>{formatPrice(cart.tax)}</span>
                                        </div>
                                    )}
                                    
                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-{formatPrice(cart.discount)}</span>
                                        </div>
                                    )}
                                    
                                    <Separator />
                                    
                                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatPrice(cart.total)}</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center space-x-2 text-blue-800">
                                        <Lock className="w-4 h-4" />
                                        <span className="text-sm font-medium">Secure Checkout</span>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Your payment information is encrypted and secure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CheckoutPage;
