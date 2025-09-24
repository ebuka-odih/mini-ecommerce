import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { formatPrice, isOnSale, calculateDiscount, getPrimaryImage, getStockStatus } from '@/lib/fashion-utils';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast';

interface ProductCardProps {
    product: Product;
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isWishlisted, setIsWishlisted] = React.useState(false);
    const [isAddingToCart, setIsAddingToCart] = React.useState(false);
    const [cartStatus, setCartStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
    const { addToCart } = useCart();
    const { addToast } = useToast();
    
    const primaryImage = getPrimaryImage(product);
    const stockStatus = getStockStatus(product);
    const onSale = isOnSale(product);
    const discountPercent = onSale ? calculateDiscount(product.price, product.sale_price!) : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (isAddingToCart) return; // Prevent multiple clicks
        
        setIsAddingToCart(true);
        setCartStatus('idle');
        
        try {
            const success = await addToCart(product.id, 1);
            
            if (success) {
                console.log('Product added to cart successfully');
                setCartStatus('success');
                addToast({
                    title: 'Added to Cart!',
                    description: `${product.name} has been added to your cart.`,
                    type: 'success',
                    duration: 3000,
                });
                
                // Reset status after 2 seconds
                setTimeout(() => {
                    setCartStatus('idle');
                }, 2000);
            } else {
                console.error('Failed to add to cart');
                setCartStatus('error');
                addToast({
                    title: 'Failed to Add to Cart',
                    description: 'There was an error adding the product to your cart. Please try again.',
                    type: 'error',
                    duration: 4000,
                });
                
                // Reset status after 3 seconds
                setTimeout(() => {
                    setCartStatus('idle');
                }, 3000);
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            setCartStatus('error');
            addToast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                type: 'error',
                duration: 4000,
            });
            
            // Reset status after 3 seconds
            setTimeout(() => {
                setCartStatus('idle');
            }, 3000);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
        // TODO: Implement wishlist functionality
    };

    return (
        <div 
            className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                {primaryImage ? (
                    <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2 opacity-50"></div>
                            <p className="text-sm">Product Image</p>
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {onSale && (
                        <Badge variant="destructive" className="bg-red-500 text-white">
                            -{discountPercent}%
                        </Badge>
                    )}
                    {stockStatus === 'low_stock' && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                            Low Stock
                        </Badge>
                    )}
                    {stockStatus === 'out_of_stock' && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            Out of Stock
                        </Badge>
                    )}
                </div>

                {/* Quick Actions */}
                <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                        onClick={handleToggleWishlist}
                    >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </Button>
                    <Link href={`/product/${product.slug}`}>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                        >
                            <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                    </Link>
                </div>

                {/* Quick Add to Cart */}
                <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                    <Button
                        onClick={handleAddToCart}
                        disabled={stockStatus === 'out_of_stock' || isAddingToCart}
                        className={`w-full text-white disabled:bg-gray-300 ${
                            cartStatus === 'success' ? 'bg-green-600' : 
                            cartStatus === 'error' ? 'bg-red-600' : 
                            'bg-black hover:bg-gray-800'
                        }`}
                        size="sm"
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
                                Error
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                {stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <Link href={`/product/${product.slug}`} className="group">
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                </Link>

                {product.short_description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {product.short_description}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    {onSale && product.sale_price ? (
                        <>
                            <span className="text-lg font-semibold text-gray-900">
                                {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductCard;
