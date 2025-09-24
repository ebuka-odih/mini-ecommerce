import { Product, ProductVariant, CartItem, ShoppingCart } from '@/types';

/**
 * Fashion Brand Utility Functions
 * These functions help with common e-commerce operations
 */

// Product Utilities
export const formatPrice = (price: number, currency: string = 'NGN'): string => {
    if (currency === 'NGN') {
        // Format Nigerian Naira
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(price);
};

export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const isOnSale = (product: Product): boolean => {
    return product.sale_price !== undefined && product.sale_price !== null && product.sale_price > 0 && product.sale_price < product.price;
};

export const getProductPrice = (product: Product, variant?: ProductVariant): number => {
    const basePrice = isOnSale(product) ? product.sale_price! : product.price;
    const adjustment = variant?.price_adjustment || 0;
    return basePrice + adjustment;
};

export const getProductImages = (product: Product): string[] => {
    if (!product.images || !Array.isArray(product.images)) {
        return [];
    }
    return product.images
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.url);
};

export const getPrimaryImage = (product: Product): string | null => {
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
        return null;
    }
    const primaryImage = product.images.find(img => img.is_primary);
    return primaryImage?.url || product.images[0]?.url || null;
};

// Variation Utilities
export const getVariationsByType = (product: Product, type: 'size' | 'color'): ProductVariant[] => {
    if (!product.variations || !Array.isArray(product.variations)) {
        return [];
    }
    return product.variations.filter(variation => {
        if (type === 'size') return variation.size;
        if (type === 'color') return variation.color;
        return false;
    });
};

export const getAvailableSizes = (product: Product): ProductVariant[] => {
    return getVariationsByType(product, 'size').filter(variation => variation.stock_quantity > 0);
};

export const getAvailableColors = (product: Product): ProductVariant[] => {
    return getVariationsByType(product, 'color').filter(variation => variation.stock_quantity > 0);
};

export const isVariantInStock = (variant: ProductVariant): boolean => {
    return variant.stock_quantity > 0;
};

// Cart Utilities
export const calculateCartSubtotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.total, 0);
};

export const calculateCartTotal = (cart: ShoppingCart): number => {
    return cart.subtotal + cart.tax + cart.shipping;
};

export const getCartItemCount = (cart: ShoppingCart): number => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const findCartItem = (cart: ShoppingCart, productId: string, variantId?: string): CartItem | undefined => {
    return cart.items.find(item =>
        item.product.id === productId &&
        (variantId ? item.variant?.id === variantId : !item.variant)
    );
};

// Search and Filter Utilities
export const filterProductsByCategory = (products: Product[], categoryId: string): Product[] => {
    return products.filter(product => product.category.id === categoryId);
};

export const filterProductsByPriceRange = (products: Product[], minPrice: number, maxPrice: number): Product[] => {
    return products.filter(product => {
        const price = isOnSale(product) ? product.sale_price! : product.price;
        return price >= minPrice && price <= maxPrice;
    });
};

export const searchProducts = (products: Product[], query: string): Product[] => {
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.name.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sorted = [...products];

    switch (sortBy) {
        case 'price_low_high':
            return sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        case 'price_high_low':
            return sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        case 'name_a_z':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name_z_a':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        case 'featured':
            return sorted.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        default:
            return sorted;
    }
};

// URL and SEO Utilities
export const generateProductUrl = (product: Product): string => {
    return `/product/${product.slug}`;
};

export const generateCategoryUrl = (categorySlug: string): string => {
    return `/shop?category=${categorySlug}`;
};

export const generateProductSEOTitle = (product: Product): string => {
    return `${product.name} - ${product.category.name} | GNOSIS`;
};

export const generateProductSEODescription = (product: Product): string => {
    const price = formatPrice(getProductPrice(product));
    return `${product.short_description || product.description.substring(0, 150)} - Starting at ${price}. Shop now at GNOSIS.`;
};

// Validation Utilities
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

export const validatePostalCode = (postalCode: string, country: string = 'US'): boolean => {
    const patterns = {
        US: /^\d{5}(-\d{4})?$/,
        CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
        UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
    };

    const pattern = patterns[country as keyof typeof patterns];
    return pattern ? pattern.test(postalCode) : postalCode.length >= 3;
};

// Date and Time Utilities
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const isNewProduct = (product: Product, daysThreshold: number = 30): boolean => {
    const createdDate = new Date(product.created_at);
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - daysThreshold);
    return createdDate > threshold;
};

// Stock and Inventory Utilities
export const getStockStatus = (product: Product): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (product.stock_quantity === 0) return 'out_of_stock';
    if (product.stock_quantity <= 5) return 'low_stock';
    return 'in_stock';
};

export const getStockMessage = (product: Product): string => {
    const status = getStockStatus(product);
    switch (status) {
        case 'out_of_stock':
            return 'Out of stock';
        case 'low_stock':
            return `Only ${product.stock_quantity} left!`;
        case 'in_stock':
            return 'In stock';
    }
};

// Image Utilities
export const generateImageAlt = (product: Product, imageIndex: number = 0): string => {
    return `${product.name} - Image ${imageIndex + 1}`;
};

export const getOptimizedImageUrl = (imageUrl: string, width: number, height?: number): string => {
    // This would integrate with your image optimization service
    // For now, just return the original URL
    return imageUrl;
};
