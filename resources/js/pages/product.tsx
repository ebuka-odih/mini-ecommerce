import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Heart, Share2, Minus, Plus, ShoppingCart, Star, Truck, Shield, RotateCcw, X, ZoomIn } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toast';
import { useCart } from '@/contexts/cart-context';
import { formatPriceWithCurrency, isOnSale, calculateDiscount, getStockStatus } from '@/lib/fashion-utils';

interface ProductImage {
    id: number;
    path: string;
    url: string;
    thumbnail_url: string;
    alt_text?: string;
    is_featured: boolean;
}

interface ProductVariation {
    id: number;
    size_id?: number;
    color_id?: number;
    price?: number;
    stock_quantity: number;
    sku?: string;
    size?: {
        id: number;
        name: string;
        display_name: string;
    };
    color?: {
        id: number;
        name: string;
        display_name: string;
        hex_code: string;
    };
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    price: number;
    sale_price?: number;
    stock_quantity: number;
    sku: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    images: ProductImage[];
    variations: ProductVariation[];
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface ProductPageProps {
    product: Product;
    settings?: {
        site_name: string;
        site_logo: string;
        currency: string;
        theme: 'light' | 'dark';
    };
}

const ProductPage: React.FC<ProductPageProps> = ({ product, settings }) => {
    const [selectedImage, setSelectedImage] = React.useState<ProductImage | null>(null);
    const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
    const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
    const [quantity, setQuantity] = React.useState(1);
    const [isWishlisted, setIsWishlisted] = React.useState(false);
    const [isAddingToCart, setIsAddingToCart] = React.useState(false);
    const [cartStatus, setCartStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
    const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
    const { addToast } = useToast();
    const { addToCart } = useCart();

    // Check if dark theme is active
    const isDarkTheme = settings?.theme === 'dark';


    // Set default selected image
    React.useEffect(() => {
        if (product.images && product.images.length > 0 && !selectedImage) {
            const featuredImage = product.images.find(img => img.is_featured) || product.images[0];
            console.log('Setting selected image:', featuredImage);
            setSelectedImage(featuredImage);
        }
    }, [product.images, selectedImage]);

    // Debug selectedImage changes
    React.useEffect(() => {
        console.log('Selected image changed:', selectedImage);
    }, [selectedImage]);

    // Keyboard navigation for image modal
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isImageModalOpen || !selectedImage) return;

            switch (event.key) {
                case 'Escape':
                    setIsImageModalOpen(false);
                    break;
                case 'ArrowLeft':
                    if (product.images.length > 1) {
                        const currentIndex = product.images.findIndex(img => img.id === selectedImage.id);
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : product.images.length - 1;
                        setSelectedImage(product.images[prevIndex]);
                    }
                    break;
                case 'ArrowRight':
                    if (product.images.length > 1) {
                        const currentIndex = product.images.findIndex(img => img.id === selectedImage.id);
                        const nextIndex = currentIndex < product.images.length - 1 ? currentIndex + 1 : 0;
                        setSelectedImage(product.images[nextIndex]);
                    }
                    break;
            }
        };

        if (isImageModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isImageModalOpen, selectedImage, product.images]);

    // Get available sizes and colors
    const availableSizes = React.useMemo(() => {
        const sizes = new Set();
        product.variations.forEach(variation => {
            if (variation.size) {
                sizes.add(JSON.stringify({
                    id: variation.size.id,
                    name: variation.size.name,
                    display_name: variation.size.display_name
                }));
            }
        });
        return Array.from(sizes).map(size => JSON.parse(size as string));
    }, [product.variations]);

    const availableColors = React.useMemo(() => {
        const colors = new Set();
        product.variations.forEach(variation => {
            if (variation.color) {
                colors.add(JSON.stringify({
                    id: variation.color.id,
                    name: variation.color.name,
                    display_name: variation.color.display_name,
                    hex_code: variation.color.hex_code
                }));
            }
        });
        return Array.from(colors).map(color => JSON.parse(color as string));
    }, [product.variations]);

    // Get current variation based on selections
    const currentVariation = React.useMemo(() => {
        return product.variations.find(variation => {
            const sizeMatch = !selectedSize || variation.size?.id.toString() === selectedSize;
            const colorMatch = !selectedColor || variation.color?.id.toString() === selectedColor;
            return sizeMatch && colorMatch;
        });
    }, [product.variations, selectedSize, selectedColor]);

    // Get current price
    const currentPrice = currentVariation?.price || product.price;
    const currentStock = currentVariation?.stock_quantity || product.stock_quantity;

    const onSale = isOnSale({ ...product, sale_price: product.sale_price });
    const discountPercent = onSale ? calculateDiscount(product.price, product.sale_price!) : 0;
    const stockStatus = getStockStatus(currentStock);

    const handleAddToCart = async () => {
        if (currentStock <= 0) {
            addToast({
                title: 'Out of Stock',
                description: 'This product is currently out of stock.',
                type: 'error',
                duration: 3000
            });
            return;
        }

        if (isAddingToCart) return; // Prevent multiple clicks

        setIsAddingToCart(true);
        setCartStatus('idle');

        try {
            const success = await addToCart(product.id, quantity, currentVariation?.id);
            
            if (success) {
                setCartStatus('success');
                addToast({
                    title: 'Added to Cart',
                    description: `${product.name} has been added to your cart.`,
                    type: 'success',
                    duration: 3000
                });
                // Reset success state after 2 seconds
                setTimeout(() => setCartStatus('idle'), 2000);
            } else {
                setCartStatus('error');
                addToast({
                    title: 'Error',
                    description: 'Failed to add product to cart.',
                    type: 'error',
                    duration: 5000
                });
                // Reset error state after 3 seconds
                setTimeout(() => setCartStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            setCartStatus('error');
            addToast({
                title: 'Error',
                description: 'Failed to add product to cart. Please try again.',
                type: 'error',
                duration: 5000
            });
            // Reset error state after 3 seconds
            setTimeout(() => setCartStatus('idle'), 3000);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        addToast({
            title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
            description: isWishlisted ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist.`,
            type: 'success',
            duration: 3000
        });
    };

    const handleShare = async () => {
        const productUrl = window.location.href;
        const shareText = `Check out ${product.name} - ${formatPriceWithCurrency(product.price, settings)}`;
        
        if (navigator.share) {
            // Use native Web Share API if available
            try {
                await navigator.share({
                    title: product.name,
                    text: shareText,
                    url: productUrl,
                });
                addToast({
                    title: 'Shared!',
                    description: `${product.name} has been shared successfully.`,
                    type: 'success',
                    duration: 3000
                });
            } catch (error) {
                // User cancelled or error occurred
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareText}\n${productUrl}`);
                addToast({
                    title: 'Link Copied!',
                    description: 'Product link has been copied to clipboard.',
                    type: 'success',
                    duration: 3000
                });
            } catch (error) {
                // Fallback: Show URL in alert
                alert(`${shareText}\n${productUrl}`);
            }
        }
    };

    const incrementQuantity = () => {
        if (quantity < currentStock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <MainLayout title={`${product.name} - GNOSIS`} settings={settings}>
            <Head title={product.name} />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className={`flex items-center space-x-2 text-sm mb-6 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Link href="/" className={isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}>Home</Link>
                    <span>/</span>
                    <Link href="/shop" className={isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}>Shop</Link>
                    <span>/</span>
                    <Link href={`/shop?category=${product.category.slug}`} className={isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}>
                        {product.category.name}
                    </Link>
                    <span>/</span>
                    <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 relative group cursor-pointer">
                            {selectedImage ? (
                                <img
                                    src={selectedImage.url || `/storage/${selectedImage.path}`}
                                    alt={selectedImage.alt_text || product.name}
                                    className="w-full h-full object-cover"
                                    onClick={() => setIsImageModalOpen(true)}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto">
                                {product.images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImage?.id === image.id 
                                                ? 'border-gray-900' 
                                                : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <img
                                            src={image.thumbnail_url || image.url || `/storage/${image.path}`}
                                            alt={image.alt_text || product.name}
                                            className="w-full h-full object-cover"
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4">
                        {/* Category Badge */}
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                <Link href={`/shop?category=${product.category.slug}`}>
                                    {product.category.name}
                                </Link>
                            </Badge>
                            <Badge className={stockStatus.color}>
                                {stockStatus.label}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className={`text-3xl lg:text-4xl font-light tracking-wide ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="space-y-2">
                            {onSale ? (
                                <div className="flex items-center space-x-3">
                                    <span className={`text-3xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                        {formatPriceWithCurrency(product.sale_price!, settings)}
                                    </span>
                                    <span className={`text-xl line-through ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {formatPriceWithCurrency(product.price, settings)}
                                    </span>
                                    <Badge className="bg-red-100 text-red-800">
                                        -{discountPercent}%
                                    </Badge>
                                </div>
                            ) : (
                                <span className={`text-3xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                    {formatPriceWithCurrency(product.price, settings)}
                                </span>
                            )}
                        </div>


                        {/* Size and Color Selection */}
                        {(availableSizes.length > 0 || availableColors.length > 0) && (
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-4">
                                    {/* Size Selection */}
                                    {availableSizes.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-700'}`}>Size:</span>
                                            <div className="flex gap-1">
                                                {availableSizes.map((size) => (
                                                    <button
                                                        key={size.id}
                                                        onClick={() => setSelectedSize(size.id.toString())}
                                                        className={`px-3 py-1 border rounded text-xs font-medium transition-colors ${
                                                            selectedSize === size.id.toString()
                                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        {size.display_name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Selection */}
                                    {availableColors.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-700'}`}>Color:</span>
                                            <div className="flex gap-1">
                                                {availableColors.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        onClick={() => setSelectedColor(color.id.toString())}
                                                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                                                            selectedColor === color.id.toString()
                                                                ? 'border-gray-900 scale-110'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                        style={{ backgroundColor: color.hex_code }}
                                                        title={color.display_name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-700'}`}>Quantity:</span>
                                <span className={`text-xs font-medium ${
                                    currentStock <= 3 
                                        ? 'text-red-500' 
                                        : isDarkTheme ? 'text-green-400' : 'text-green-600'
                                }`}>
                                    {currentStock <= 3 ? 'Low Stock' : 'In Stock'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className={`w-8 h-8 rounded border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isDarkTheme 
                                            ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-white' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className={`w-12 text-center font-medium text-sm ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
                                <button
                                    onClick={incrementQuantity}
                                    disabled={quantity >= currentStock}
                                    className={`w-8 h-8 rounded border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isDarkTheme 
                                            ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-white' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-4">
                            <Button
                                onClick={handleAddToCart}
                                disabled={currentStock <= 0 || isAddingToCart}
                                className={`w-full h-12 text-base font-medium rounded-lg transition-all duration-200 ${
                                    cartStatus === 'success' 
                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                        : cartStatus === 'error' 
                                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                                        : currentStock <= 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-black hover:bg-gray-800 text-white'
                                }`}
                                size="lg"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Adding...
                                    </>
                                ) : cartStatus === 'success' ? (
                                    <>
                                        <div className="w-4 h-4 mr-2">✓</div>
                                        Added!
                                    </>
                                ) : cartStatus === 'error' ? (
                                    <>
                                        <div className="w-4 h-4 mr-2">✗</div>
                                        Try Again
                                    </>
                                ) : currentStock <= 0 ? (
                                    'Out of Stock'
                                ) : (
                                    'Add to Cart'
                                )}
                            </Button>

                            {/* Buy Now and Share Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Buy Now Button */}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // First add to cart, then redirect to checkout
                                        handleAddToCart();
                                        setTimeout(() => {
                                            router.visit('/checkout');
                                        }, 1000);
                                    }}
                                    disabled={currentStock <= 0 || isAddingToCart}
                                    className={`flex-1 h-12 text-lg font-semibold rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                        isDarkTheme 
                                            ? 'border-gray-400 text-white hover:bg-gray-400 hover:text-black' 
                                            : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    Buy Now
                                </Button>

                                {/* Share Button */}
                                <Button 
                                    variant="outline" 
                                    onClick={handleShare}
                                    className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 ${
                                        isDarkTheme 
                                            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800 text-white' 
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
                                    }`}
                                >
                                    <Share2 className={`w-4 h-4 mr-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} />
                                    Share Product
                                </Button>
                            </div>
                        </div>

                        {/* Product Details */}
                        {product.description && (
                            <div className="pt-6 border-t">
                                <h2 className={`text-2xl font-light mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Product Details</h2>
                                <div 
                                    className={`prose max-w-none ${isDarkTheme ? 'prose-invert' : 'prose-gray'}`}
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}

                        {/* Features */}
                        <div className={`space-y-4 pt-6 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className={`flex items-center space-x-3 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                <Truck className="w-5 h-5" />
                                <span>Free shipping on orders over {formatPriceWithCurrency(50000, settings)}</span>
                            </div>
                            <div className={`flex items-center space-x-3 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                <Shield className="w-5 h-5" />
                                <span>30-day return policy</span>
                            </div>
                            <div className={`flex items-center space-x-3 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                <RotateCcw className="w-5 h-5" />
                                <span>Easy returns and exchanges</span>
                            </div>
                        </div>

                        {/* Product Description */}
                        {product.short_description && (
                            <div className={`pt-6 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                                <h3 className={`text-lg font-medium mb-3 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                    Product Description
                                </h3>
                                <p className={`leading-relaxed ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {product.short_description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Image Modal */}
            {isImageModalOpen && selectedImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200 backdrop-blur-sm"
                            title="Close (Esc)"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>

                        {/* Image Counter */}
                        {product.images.length > 1 && (
                            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                                {product.images.findIndex(img => img.id === selectedImage.id) + 1} / {product.images.length}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="relative max-w-full max-h-full">
                            <img
                                src={selectedImage.url || `/storage/${selectedImage.path}`}
                                alt={selectedImage.alt_text || product.name}
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Navigation for multiple images */}
                        {product.images.length > 1 && (
                            <>
                                {/* Previous Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const currentIndex = product.images.findIndex(img => img.id === selectedImage.id);
                                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : product.images.length - 1;
                                        setSelectedImage(product.images[prevIndex]);
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200 backdrop-blur-sm"
                                    title="Previous image (←)"
                                >
                                    <ArrowLeft className="h-6 w-6 text-white" />
                                </button>

                                {/* Next Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const currentIndex = product.images.findIndex(img => img.id === selectedImage.id);
                                        const nextIndex = currentIndex < product.images.length - 1 ? currentIndex + 1 : 0;
                                        setSelectedImage(product.images[nextIndex]);
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200 backdrop-blur-sm"
                                    title="Next image (→)"
                                >
                                    <ArrowLeft className="h-6 w-6 text-white rotate-180" />
                                </button>
                            </>
                        )}

                        {/* Thumbnail Navigation */}
                        {product.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3">
                                {product.images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(image);
                                        }}
                                        className={`w-12 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                                            selectedImage.id === image.id 
                                                ? 'border-white border-2' 
                                                : 'border-transparent hover:border-white hover:border-opacity-50'
                                        }`}
                                        title={`View image ${product.images.findIndex(img => img.id === image.id) + 1}`}
                                    >
                                        <img
                                            src={image.thumbnail_url || image.url || `/storage/${image.path}`}
                                            alt={image.alt_text || product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default ProductPage;
