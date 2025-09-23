import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
    ArrowLeft, 
    Edit, 
    Package, 
    Tag, 
    DollarSign, 
    TrendingUp,
    Image as ImageIcon,
    Eye,
    ShoppingCart,
    Star,
    Calendar,
    Hash,
    Palette,
    Ruler,
    Layers,
    X
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: number;
    sale_price?: number;
    sku: string;
    stock: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    images?: Array<{
        id: number;
        path: string;
        alt_text?: string;
        is_featured: boolean;
        url: string;
        thumbnail_url: string;
    }>;
    variations?: Array<{
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
    }>;
}

interface ProductShowProps {
    product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [selectedImageAlt, setSelectedImageAlt] = React.useState<string>('');



    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (stock < 10) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    const handleImageClick = (imageUrl: string, altText: string) => {
        setSelectedImage(imageUrl);
        setSelectedImageAlt(altText);
    };

    const stockInfo = getStockStatus(product.stock_quantity);

    return (
        <AdminLayout>
            <Head title={`Product - ${product.name}`} />

            <PageHeader
                title={`Product Details`}
                description={`Viewing "${product.name}"`}
            />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Button>

                {/* Product Header */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-white text-2xl">{product.name}</CardTitle>
                                    {product.is_featured && (
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                            <Star className="mr-1 h-3 w-3" />
                                            Featured
                                        </Badge>
                                    )}
                                    <Badge className={stockInfo.color}>
                                        {stockInfo.status}
                                    </Badge>
                                </div>
                                {product.short_description && (
                                    <p className="text-gray-400 text-lg">{product.short_description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Product
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Images - Simple */}
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Product Images
                            </h3>
                            
                            {product.images && product.images.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Primary Image - Simple */}
                                    <div>
                                        <h4 className="text-gray-300 font-medium mb-2">Primary Image</h4>
                                        <img
                                            src={(() => {
                                                const primaryImage = product.images.find(img => img.is_featured) || product.images[0];
                                                return primaryImage?.url || `/storage/${primaryImage?.path}`;
                                            })()}
                                            alt={product.images.find(img => img.is_featured)?.alt_text || product.name}
                                            className="w-full max-w-md h-auto border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500"
                                            onClick={() => {
                                                const primaryImage = product.images.find(img => img.is_featured) || product.images[0];
                                                const imageUrl = primaryImage?.url || `/storage/${primaryImage?.path}`;
                                                const altText = primaryImage?.alt_text || product.name;
                                                handleImageClick(imageUrl, altText);
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>

                                    {/* Additional Images - Simple */}
                                    {product.images.length > 1 && (
                                        <div>
                                            <h4 className="text-gray-300 font-medium mb-2">Additional Images</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {product.images.filter(img => !img.is_featured).map((image, index) => (
                                                    <img
                                                        key={image.id}
                                                        src={image.url || `/storage/${image.path}`}
                                                        alt={image.alt_text || `Product image ${index + 2}`}
                                                        className="w-24 h-24 object-cover border border-gray-600 rounded cursor-pointer hover:border-blue-500"
                                                        onClick={() => handleImageClick(image.url || `/storage/${image.path}`, image.alt_text || `Product image ${index + 2}`)}
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-gray-400">No images available</p>
                                </div>
                            )}
                        </div>

                        {/* Product Description */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {product.description ? (
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {product.description}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No description available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Product Variations */}
                        {product.variations && product.variations.length > 0 && (
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Layers className="h-5 w-5" />
                                        Product Variations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {product.variations.map((variation) => (
                                            <div key={variation.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    {/* Size */}
                                                    <div className="flex items-center gap-2">
                                                        <Ruler className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-300">Size:</span>
                                                        <span className="text-white font-medium">
                                                            {variation.size?.display_name || 'No Size'}
                                                        </span>
                                                    </div>

                                                    {/* Color */}
                                                    <div className="flex items-center gap-2">
                                                        <Palette className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-300">Color:</span>
                                                        <div className="flex items-center gap-2">
                                                            {variation.color && (
                                                                <div 
                                                                    className="w-4 h-4 rounded-full border border-gray-400" 
                                                                    style={{ backgroundColor: variation.color.hex_code }}
                                                                />
                                                            )}
                                                            <span className="text-white font-medium">
                                                                {variation.color?.display_name || 'No Color'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-300">Price:</span>
                                                        <span className="text-white font-medium">
                                                            {variation.price ? formatCurrency(variation.price) : formatCurrency(product.price)}
                                                        </span>
                                                    </div>

                                                    {/* Stock */}
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-300">Stock:</span>
                                                        <Badge className={getStockStatus(variation.stock_quantity).color}>
                                                            {variation.stock_quantity}
                                                        </Badge>
                                                    </div>

                                                    {/* SKU */}
                                                    {variation.sku && (
                                                        <div className="md:col-span-4 flex items-center gap-2">
                                                            <Hash className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-300">SKU:</span>
                                                            <span className="text-white font-mono bg-gray-600 px-2 py-1 rounded text-sm">
                                                                {variation.sku}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Product Info */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Product Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* SKU */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        SKU
                                    </span>
                                    <span className="text-white font-mono bg-gray-600 px-2 py-1 rounded text-sm">
                                        {product.sku}
                                    </span>
                                </div>

                                <Separator className="bg-gray-600" />

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Price
                                    </span>
                                    <span className="text-white font-semibold text-lg">
                                        {formatCurrency(product.price)}
                                    </span>
                                </div>

                                {product.sale_price && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Sale Price</span>
                                        <span className="text-green-400 font-semibold text-lg">
                                            {formatCurrency(product.sale_price)}
                                        </span>
                                    </div>
                                )}

                                <Separator className="bg-gray-600" />

                                {/* Stock */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Stock
                                    </span>
                                    <Badge className={stockInfo.color}>
                                        {product.stock_quantity} units
                                    </Badge>
                                </div>

                                <Separator className="bg-gray-600" />

                                {/* Category */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        Category
                                    </span>
                                    {product.category ? (
                                        <Link 
                                            href={`/admin/categories`}
                                            className="text-blue-400 hover:text-blue-300 font-medium"
                                        >
                                            {product.category.name}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">No category</span>
                                    )}
                                </div>

                                <Separator className="bg-gray-600" />

                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Status</span>
                                    <Badge className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Stats */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Product Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Variations Count */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Layers className="h-4 w-4" />
                                        Variations
                                    </span>
                                    <span className="text-white font-semibold">
                                        {product.variations?.length || 0}
                                    </span>
                                </div>

                                <Separator className="bg-gray-600" />

                                {/* Images Count */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Images
                                    </span>
                                    <span className="text-white font-semibold">
                                        {product.images?.length || 0}
                                    </span>
                                </div>

                                <Separator className="bg-gray-600" />

                                {/* Created Date */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Created
                                    </span>
                                    <span className="text-white text-sm">
                                        {formatDate(product.created_at)}
                                    </span>
                                </div>

                                <Separator className="bg-gray-600" />

                                {/* Last Updated */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Updated
                                    </span>
                                    <span className="text-white text-sm">
                                        {formatDate(product.updated_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Product
                                    </Link>
                                </Button>
                                
                                <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <Link href={`/product/${product.slug}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View on Site
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-800 border-gray-700 p-0">
                    {selectedImage && (
                        <div className="relative">
                            <img
                                src={selectedImage}
                                alt={selectedImageAlt}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                            <div className="absolute top-4 right-4">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setSelectedImage(null)}
                                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white border-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
                                <p className="text-sm">{selectedImageAlt}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
