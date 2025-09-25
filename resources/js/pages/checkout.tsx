import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, Lock } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatPriceWithCurrency } from '@/lib/fashion-utils';

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
    settings?: {
        site_name: string;
        site_logo: string;
        currency: string;
        theme: 'light' | 'dark';
    };
}

interface CheckoutForm {
    // Contact Information
    name: string;
    email: string;
    phone: string;
    
    // Shipping Information
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    
    // Payment
    payment_method: string;
    
    // Order Notes
    order_notes: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, settings }) => {
    const { data, setData, post, processing, errors } = useForm<CheckoutForm>({
        // Contact Information
        name: '',
        email: '',
        phone: '',
        
        // Shipping Information
        address: '',
        city: '',
        state: '',
        country: 'Nigeria',
        zip: '',
        
        // Payment
        payment_method: 'paystack',
        
        // Order Notes
        order_notes: '',
    });


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
        <MainLayout title="Checkout - GNOSIS" settings={settings}>
            <Head title="Checkout" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    {/* Button at the top */}
                    <div className="mb-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/cart">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Cart
                            </Link>
                        </Button>
                    </div>
                    {/* Title below the button - centered */}
                    <h1 className="text-3xl font-light text-gray-900 text-center">Checkout</h1>
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
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                    </div>
                                    
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
                                </div>
                                
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
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

                            {/* Shipping Information */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Shipping Information
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="address">Address *</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className={errors.address ? 'border-red-500' : ''}
                                            placeholder="123 Main Street, Apartment 4B"
                                        />
                                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className={errors.city ? 'border-red-500' : ''}
                                                placeholder="Lagos"
                                            />
                                            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="state">State *</Label>
                                            <select
                                                id="state"
                                                value={data.state}
                                                onChange={(e) => setData('state', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select State</option>
                                                {nigerianStates.map((state) => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="zip">ZIP Code</Label>
                                            <Input
                                                id="zip"
                                                value={data.zip}
                                                onChange={(e) => setData('zip', e.target.value)}
                                                className={errors.zip ? 'border-red-500' : ''}
                                                placeholder="100001"
                                            />
                                            {errors.zip && <p className="text-sm text-red-500 mt-1">{errors.zip}</p>}
                                        </div>
                                    </div>
                                </div>
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
                                className="w-full mt-6 h-14 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                size="lg"
                            >
                                {processing ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5 mr-2" />
                                        Complete Order - {formatPriceWithCurrency(cart.total, settings)}
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
                                                    Qty: {item.quantity} × {formatPriceWithCurrency(item.price, settings)}
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatPriceWithCurrency(item.price * item.quantity, settings)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <Separator className="mb-4" />
                                
                                {/* Totals */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPriceWithCurrency(cart.subtotal, settings)}</span>
                                    </div>
                                    
                                    {cart.shipping > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>{formatPriceWithCurrency(cart.shipping, settings)}</span>
                                        </div>
                                    )}
                                    
                                    {cart.tax > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax</span>
                                            <span>{formatPriceWithCurrency(cart.tax, settings)}</span>
                                        </div>
                                    )}
                                    
                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-{formatPriceWithCurrency(cart.discount, settings)}</span>
                                        </div>
                                    )}
                                    
                                    <Separator />
                                    
                                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatPriceWithCurrency(cart.total, settings)}</span>
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
