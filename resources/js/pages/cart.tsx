import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toast';
import { formatPriceWithCurrency } from '@/lib/fashion-utils';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        stock_quantity: number;
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

interface Cart {
    items: CartItem[];
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
}

interface CartPageProps {
    cart: Cart;
    settings?: {
        site_name: string;
        site_logo: string;
        currency: string;
        theme: 'light' | 'dark';
    };
}

const CartPage: React.FC<CartPageProps> = ({ cart, settings }) => {
    const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
    const [isRemoving, setIsRemoving] = React.useState<string | null>(null);
    const { addToast } = useToast();

    // Check if dark theme is active
    const isDarkTheme = settings?.theme === 'dark';

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setIsUpdating(itemId);

        try {
            const response = await fetch('/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    item_id: itemId,
                    quantity: newQuantity,
                }),
            });

            if (response.ok) {
                // Refresh the page to show updated cart
                router.reload({ only: ['cart'] });
            } else {
                const error = await response.json();
                addToast({
                    title: 'Error',
                    description: error.message || 'Failed to update quantity.',
                    type: 'error',
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Update quantity error:', error);
            addToast({
                title: 'Error',
                description: 'Failed to update quantity. Please try again.',
                type: 'error',
                duration: 5000
            });
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        setIsRemoving(itemId);

        try {
            const response = await fetch('/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    item_id: itemId,
                }),
            });

            if (response.ok) {
                addToast({
                    title: 'Item Removed',
                    description: 'Item has been removed from your cart.',
                    type: 'success',
                    duration: 3000
                });
                // Refresh the page to show updated cart
                router.reload({ only: ['cart'] });
            } else {
                const error = await response.json();
                addToast({
                    title: 'Error',
                    description: error.message || 'Failed to remove item.',
                    type: 'error',
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Remove item error:', error);
            addToast({
                title: 'Error',
                description: 'Failed to remove item. Please try again.',
                type: 'error',
                duration: 5000
            });
        } finally {
            setIsRemoving(null);
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Are you sure you want to clear your cart?')) return;

        try {
            const response = await fetch('/cart/clear', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                addToast({
                    title: 'Cart Cleared',
                    description: 'Your cart has been cleared.',
                    type: 'success',
                    duration: 3000
                });
                // Refresh the page to show empty cart
                router.reload({ only: ['cart'] });
            } else {
                addToast({
                    title: 'Error',
                    description: 'Failed to clear cart.',
                    type: 'error',
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Clear cart error:', error);
            addToast({
                title: 'Error',
                description: 'Failed to clear cart. Please try again.',
                type: 'error',
                duration: 5000
            });
        }
    };

    const getItemImage = (item: CartItem) => {
        if (item.product.images && item.product.images.length > 0) {
            const featuredImage = item.product.images.find(img => img.is_featured);
            const firstImage = item.product.images[0];
            const image = featuredImage || firstImage;
            
            if (image) {
                return image.url || image.thumbnail_url || `/storage/${image.path}`;
            }
        }
        return '/images/placeholder-product.jpg';
    };

    const getItemTitle = (item: CartItem) => {
        let title = item.product.name;
        if (item.variation?.size || item.variation?.color) {
            const parts = [];
            if (item.variation.size) parts.push(item.variation.size.display_name);
            if (item.variation.color) parts.push(item.variation.color.display_name);
            title += ` (${parts.join(', ')})`;
        }
        return title;
    };

    if (cart.items.length === 0) {
        return (
            <MainLayout title="Shopping Cart - GNOSIS" settings={settings}>
                <Head title="Shopping Cart" />
                
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <ShoppingBag className={`w-16 h-16 mx-auto mb-6 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`} />
                        <h1 className={`text-2xl font-light mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h1>
                        <p className={`mb-8 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/shop">
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Shopping Cart - GNOSIS" settings={settings}>
            <Head title="Shopping Cart" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    {/* Title at the top */}
                    <div className="mb-6">
                        <h1 className={`text-3xl font-light ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
                        </h1>
                    </div>
                    {/* Buttons below the title */}
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/shop">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Continue Shopping
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleClearCart}>
                            Clear Cart
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.items.map((item) => (
                            <div key={item.id} className={`flex items-start space-x-4 p-6 border rounded-xl shadow-sm ${
                                isDarkTheme 
                                    ? 'border-gray-700 bg-gray-800' 
                                    : 'border-gray-200 bg-white'
                            }`}>
                                {/* Product Image */}
                                <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                                    <div className={`w-20 h-20 rounded-lg overflow-hidden ${
                                        isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                        <img
                                            src={getItemImage(item)}
                                            alt={item.product.images[0]?.alt_text || item.product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                                            }}
                                        />
                                    </div>
                                </Link>

                                {/* Product Info - Full width */}
                                <div className="flex-1 min-w-0">
                                    <Link href={`/product/${item.product.slug}`}>
                                        <h3 className={`font-medium transition-colors text-lg leading-tight mb-3 ${
                                            isDarkTheme 
                                                ? 'text-white hover:text-gray-300' 
                                                : 'text-gray-900 hover:text-gray-600'
                                        }`}>
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    
                                    {/* Product Variations */}
                                    {item.variation && (item.variation.size || item.variation.color) && (
                                        <div className="flex items-center gap-4 mb-3">
                                            {item.variation.size && (
                                                <div className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    <span className="font-medium">Size: </span>
                                                    <span>{item.variation.size.display_name}</span>
                                                </div>
                                            )}
                                            {item.variation.color && (
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        <span className="font-medium">Color: </span>
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            className="w-4 h-4 rounded-full border border-gray-400"
                                                            style={{ backgroundColor: item.variation.color.hex_code }}
                                                            title={item.variation.color.display_name}
                                                        />
                                                        <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {item.variation.color.display_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Price and Stock Badge Row */}
                                    <div className="flex items-center space-x-4 mb-3">
                                        <span className={`text-lg font-semibold ${
                                            isDarkTheme ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {formatPriceWithCurrency(item.price, settings)}
                                        </span>
                                        <Badge className={item.product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {item.product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </div>
                                    
                                    {/* Quantity Controls and Delete Button Row */}
                                    <div className="flex items-center justify-between">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || isUpdating === item.id}
                                                className={`w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    isDarkTheme 
                                                        ? 'border-gray-600 hover:bg-gray-700 text-white' 
                                                        : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className={`w-8 text-center font-medium ${
                                                isDarkTheme ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {isUpdating === item.id ? '...' : item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock_quantity || isUpdating === item.id}
                                                className={`w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    isDarkTheme 
                                                        ? 'border-gray-600 hover:bg-gray-700 text-white' 
                                                        : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={isRemoving === item.id}
                                            className={`p-2 transition-colors disabled:opacity-50 ${
                                                isDarkTheme 
                                                    ? 'text-gray-400 hover:text-red-400' 
                                                    : 'text-gray-400 hover:text-red-600'
                                            }`}
                                        >
                                            {isRemoving === item.id ? (
                                                <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
                                            ) : (
                                                <Trash2 className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className={`border-2 rounded-xl p-6 shadow-lg ${
                                isDarkTheme 
                                    ? 'bg-gray-800 border-gray-700' 
                                    : 'bg-white border-gray-200'
                            }`}>
                                <h2 className={`text-xl font-semibold mb-6 ${
                                    isDarkTheme ? 'text-white' : 'text-gray-900'
                                }`}>Order Summary</h2>
                                
                                <div className="space-y-4">
                                    <div className={`flex justify-between ${
                                        isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        <span>Subtotal</span>
                                        <span>{formatPriceWithCurrency(cart.subtotal, settings)}</span>
                                    </div>
                                    
                                    {cart.shipping > 0 && (
                                        <div className={`flex justify-between ${
                                            isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            <span>Shipping</span>
                                            <span>{formatPriceWithCurrency(cart.shipping, settings)}</span>
                                        </div>
                                    )}
                                    
                                    {cart.tax > 0 && (
                                        <div className={`flex justify-between ${
                                            isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
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
                                    
                                    <Separator className={isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} />
                                    
                                    <div className={`flex justify-between text-xl font-bold p-3 rounded-lg ${
                                        isDarkTheme 
                                            ? 'text-white bg-gray-700' 
                                            : 'text-gray-900 bg-gray-50'
                                    }`}>
                                        <span>Total</span>
                                        <span>{formatPriceWithCurrency(cart.total, settings)}</span>
                                    </div>
                                </div>

                                <Button 
                                    asChild 
                                    className="w-full mt-6 h-14 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                                    size="lg"
                                >
                                    <Link href="/checkout">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Proceed to Checkout
                                    </Link>
                                </Button>

                                <p className={`text-xs text-center mt-4 ${
                                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Secure checkout powered by Paystack
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CartPage;
