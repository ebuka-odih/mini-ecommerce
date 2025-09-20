import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { formatPrice, isOnSale, calculateDiscount, getPrimaryImage, getStockStatus } from '@/lib/fashion-utils';

interface ProductCardProps {
    product: Product;
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isWishlisted, setIsWishlisted] = React.useState(false);
    
    const primaryImage = getPrimaryImage(product);
    const stockStatus = getStockStatus(product);
    const onSale = isOnSale(product);
    const discountPercent = onSale ? calculateDiscount(product.price, product.sale_price!) : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product.id);
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
                    {product.is_featured && (
                        <Badge variant="secondary" className="bg-black text-white">
                            Featured
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
                        disabled={stockStatus === 'out_of_stock'}
                        className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
                        size="sm"
                    >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <div className="mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {product.category.name}
                    </p>
                </div>
                
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
                    {onSale ? (
                        <>
                            <span className="text-lg font-semibold text-gray-900">
                                {formatPrice(product.sale_price!)}
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

                {/* Variants Preview */}
                {product.variants.length > 0 && (
                    <div className="mt-3 flex gap-1">
                        {product.variants
                            .filter(v => v.type === 'color')
                            .slice(0, 4)
                            .map((variant) => (
                                <div
                                    key={variant.id}
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: variant.value.toLowerCase() }}
                                    title={variant.name}
                                />
                            ))}
                        {product.variants.filter(v => v.type === 'color').length > 4 && (
                            <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">+</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
