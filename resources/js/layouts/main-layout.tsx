import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ShoppingBag, Menu, X, Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NavigationItem } from '@/types';
import { useCart } from '@/contexts/cart-context';

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    settings?: {
        site_name: string;
        site_logo: string;
        currency: string;
        theme: 'light' | 'dark';
    };
}

// Cart Sidebar Component
const CartSidebar: React.FC = () => {
    const { cartItems, cartCount, cartTotal, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();
    const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            await removeFromCart(itemId);
        } else {
            setIsUpdating(itemId);
            await updateQuantity(itemId, newQuantity);
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        setIsUpdating(itemId);
        await removeFromCart(itemId);
        setIsUpdating(null);
    };

    const handleClearCart = async () => {
        await clearCart();
    };

    const getProductImage = (item: any) => {
        if (item.product?.images?.length > 0) {
            const featuredImage = item.product.images.find((img: any) => img.is_featured) || item.product.images[0];
            return featuredImage.url || featuredImage.thumbnail_url || `/storage/${featuredImage.path}`;
        }
        return '/images/placeholder-product.jpg';
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 transition-colors overflow-visible">
                    <ShoppingBag className="h-6 w-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center min-w-[20px] shadow-lg border-2 border-white z-10">
                            {cartCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96 bg-white border-l">
                <SheetHeader>
                    <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-lg font-semibold">Shopping Cart</h2>
                        <div className="flex items-center gap-2">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span className="text-sm text-gray-500">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cartItems.length > 0 ? (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                            <img 
                                                src={getProductImage(item)} 
                                                alt={item.product?.name || 'Product'} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm truncate">{item.product?.name || 'Product'}</h3>
                                            <p className="text-xs text-gray-500">SKU: {item.product?.sku}</p>
                                            <p className="font-semibold text-sm mt-1">{formatCurrency(item.price)}</p>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={isUpdating === item.id}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    {isUpdating === item.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Minus className="h-3 w-3" />
                                                    )}
                                                </Button>
                                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={isUpdating === item.id}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    {isUpdating === item.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Plus className="h-3 w-3" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={isUpdating === item.id}
                                                    className="h-6 w-6 p-0 ml-auto text-red-500 hover:text-red-700"
                                                >
                                                    {isUpdating === item.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3 w-3" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 mb-6">Add some items to get started</p>
                                <Button asChild>
                                    <Link href="/shop">Continue Shopping</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-lg font-bold">{formatCurrency(cartTotal)}</span>
                            </div>
                            <div className="space-y-3">
                                <Button 
                                    className="w-full" 
                                    size="lg"
                                    onClick={() => router.visit('/checkout')}
                                >
                                    Checkout
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/cart">View Cart</Link>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="w-full text-red-600 hover:text-red-700"
                                    onClick={handleClearCart}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'GNOSISBRAND', settings }) => {
    const isDarkTheme = settings?.theme === 'dark';
    const siteName = settings?.site_name || 'GNOSIS';
    const siteLogo = settings?.site_logo || '/img/paperview.png';
    const currency = settings?.currency || 'NGN';

    const navigationItems: NavigationItem[] = [
        { name: 'HOME', href: '/' },
        { name: 'SHOP', href: '/shop' },
    ];

    return (
        <>
            <Head title={title} />
            <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white'}`}>
                {/* Header */}
                <header className={`sticky top-0 z-50 w-full border-b ${isDarkTheme ? 'bg-black/95 border-gray-800' : 'bg-white/95'} backdrop-blur supports-[backdrop-filter]:${isDarkTheme ? 'bg-black/60' : 'bg-white/60'}`}>
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between">
                            {/* Mobile Menu */}
                            <div className="flex items-center lg:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-md">
                                            <Menu className="h-6 w-6 text-gray-700" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80 bg-white border-r">
                                        <SheetHeader>
                                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                        </SheetHeader>
                                        <div className="flex flex-col h-full">
                                            {/* Mobile Menu Header */}
                                            <div className="flex items-center justify-between p-6 border-b">
                                                <img 
                                                    src={siteLogo} 
                                                    alt={siteName} 
                                                    className="h-8 w-auto"
                                                />
                                            </div>
                                            
                                            {/* Navigation Items */}
                                            <nav className="flex-1 px-6 py-8">
                                                <div className="flex flex-col space-y-6">
                                            {navigationItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                            className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors py-2 border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span>{item.name}</span>
                                                                {item.hasDropdown && (
                                                                    <span className="text-gray-400">→</span>
                                                                )}
                                                            </div>
                                                </Link>
                                            ))}
                                                </div>
                                            </nav>
                                            
                                            {/* Mobile Menu Footer */}
                                            <div className="p-6 border-t bg-gray-50">
                                                <div className="flex flex-col space-y-3">
                                                    <Link href="/contact" className="text-sm text-gray-600 hover:text-black">
                                                        Contact Us
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center space-x-8">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group"
                                    >
                                        {item.name}
                                        {item.hasDropdown && (
                                            <span className="ml-1 text-xs">▼</span>
                                        )}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ))}
                            </nav>

                            {/* Logo */}
                            <div className="flex-1 lg:flex-none lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
                                <Link href="/" className="flex items-center">
                                    <img 
                                        src={siteLogo} 
                                        alt={siteName} 
                                        className="h-10 lg:h-12 w-auto"
                                    />
                                </Link>
                            </div>

                            {/* Desktop Navigation (Right) */}
                            

                            {/* Right Actions */}
                            <div className="flex items-center gap-1">
                                {/* Cart */}
                                <CartSidebar />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Footer */}
                <footer className={`${isDarkTheme ? 'bg-gray-900 border-gray-800' : 'bg-gray-50'} border-t`}>
                    <div className="container mx-auto px-4 py-8">
                        <div className={`text-center text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            <p>&copy; 2025 {siteName}. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default MainLayout;
