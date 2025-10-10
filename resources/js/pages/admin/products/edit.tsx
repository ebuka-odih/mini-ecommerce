import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, ArrowLeft, ImageIcon } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';
import { Product, Category } from '@/types/fashion';
import ImagePicker from '@/components/admin/image-picker';

interface Size {
    id: number;
    name: string;
    display_name: string;
}

interface Color {
    id: number;
    name: string;
    display_name: string;
    hex_code: string;
}

interface ProductVariation {
    id: number;
    size_id?: number;
    color_id?: number;
    price?: number;
    stock_quantity: number;
    sku?: string;
    size?: Size;
    color?: Color;
}

interface MediaFile {
    id: string;
    filename: string;
    original_name: string;
    mime_type: string;
    path: string;
    size: number;
    formatted_size: string;
    alt_text?: string;
    tags_array?: string[];
    url: string;
    thumbnail_url: string;
}

interface EditProductProps {
    product: Product;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}

interface ProductForm {
    name: string;
    description: string;
    short_description: string;
    price: string;
    sale_price: string;
    cost_price: string;
    sku: string;
    stock_quantity: string;
    category_id: string;
    is_active: boolean;
    is_featured: boolean;
    has_variations: boolean;
}

export default function EditProduct({ product, categories, sizes, colors }: EditProductProps) {
    const { data, setData, put, processing, errors } = useForm<ProductForm>({
        name: product.name || '',
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price?.toString() || '',
        sale_price: product.sale_price?.toString() || '',
        cost_price: product.cost_price?.toString() || '',
        sku: product.sku || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        category_id: product.category_id?.toString() || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        has_variations: product.variations && product.variations.length > 0,
    });

    const [variations, setVariations] = React.useState<ProductVariation[]>(
        product.variations || []
    );

    const [productImages, setProductImages] = React.useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = React.useState<string[]>([]);
    const [selectedLibraryImages, setSelectedLibraryImages] = React.useState<MediaFile[]>([]);
    const [primaryImageId, setPrimaryImageId] = React.useState<string | null>(
        product.images?.find(img => img.is_featured)?.id.toString() || null
    );

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setProductImages(prevImages => [...prevImages, ...files]);

        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageId: string) => {
        setImagesToDelete(prev => [...prev, imageId]);
        // If removing the primary image, clear the primary selection
        if (primaryImageId === imageId) {
            setPrimaryImageId(null);
        }
    };

    const setPrimaryImage = (imageId: string) => {
        setPrimaryImageId(imageId);
    };

    // Library image management functions
    const removeLibraryImage = (imageId: string) => {
        setSelectedLibraryImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleLibraryImageSelection = (images: MediaFile[]) => {
        setSelectedLibraryImages(images);
    };

    // Variation management functions
    const addVariation = () => {
        setVariations(prev => [...prev, {
            id: Date.now(), // Temporary ID for new variations
            size_id: undefined,
            color_id: undefined,
            price: undefined,
            stock_quantity: 0,
            sku: '',
        }]);
    };

    const removeVariation = (index: number) => {
        setVariations(prev => prev.filter((_, i) => i !== index));
    };

    const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
        setVariations(prev => prev.map((variation, i) => 
            i === index ? { ...variation, [field]: value } : variation
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Add product data
        Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, value.toString());
            }
        });

        // Add new images
        productImages.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        // Add images to delete
        imagesToDelete.forEach((imageId, index) => {
            formData.append(`delete_images[${index}]`, imageId);
        });

        // Add selected library images
        selectedLibraryImages.forEach((image, index) => {
            formData.append(`library_images[${index}]`, image.id);
        });

        // Add primary image ID
        if (primaryImageId) {
            formData.append('primary_image_id', primaryImageId);
        }

        // Add variations data
        if (data.has_variations && variations.length > 0) {
            variations.forEach((variation, index) => {
                if (variation.size_id) formData.append(`variations[${index}][size_id]`, variation.size_id.toString());
                if (variation.color_id) formData.append(`variations[${index}][color_id]`, variation.color_id.toString());
                if (variation.price) formData.append(`variations[${index}][price]`, variation.price.toString());
                formData.append(`variations[${index}][stock_quantity]`, variation.stock_quantity.toString());
                if (variation.sku) formData.append(`variations[${index}][sku]`, variation.sku);
            });
        }

        // Add method override for Laravel
        formData.append('_method', 'PUT');

        // Debug form data
        console.log('Form data being sent:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        router.post(`/admin/products/${product.id}`, formData, {
            onSuccess: () => {
                console.log('Product updated successfully!');
                router.get('/admin/products');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                
                // Create a detailed error message
                let errorMessage = 'Error updating product:\n\n';
                Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach(message => {
                            errorMessage += `• ${field}: ${message}\n`;
                        });
                    } else {
                        errorMessage += `• ${field}: ${messages}\n`;
                    }
                });
                
                alert(errorMessage);
            },
            onStart: () => {
                console.log('Updating product...');
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Product - ${product.name}`} />

            <PageHeader
                title={`Edit Product`}
                description={`Update details for "${product.name}"`}
            />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => router.get('/admin/products')}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Button>

                {/* Edit Form */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Product Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Product Name, SKU, and Price Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Product Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-300">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="Enter product name"
                                        required
                                    />
                                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                                </div>

                                {/* SKU */}
                                <div className="space-y-2">
                                    <Label htmlFor="sku" className="text-gray-300">SKU</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            placeholder="Product SKU"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const timestamp = Date.now().toString().slice(-3);
                                                const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
                                                setData('sku', `GN-${randomStr}-${timestamp}`);
                                            }}
                                            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 whitespace-nowrap"
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                    {errors.sku && <p className="text-red-400 text-sm">{errors.sku}</p>}
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-gray-300">Price (₦)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="0"
                                        required
                                    />
                                    {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}
                                </div>
                            </div>

                            {/* Sale Price and Cost Price Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Sale Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="sale_price" className="text-gray-300">Sale Price (₦)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        step="0.01"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="Optional sale price in Naira"
                                    />
                                    {errors.sale_price && <p className="text-red-400 text-sm">{errors.sale_price}</p>}
                                </div>

                                {/* Cost Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="cost_price" className="text-gray-300">Cost Price (₦)</Label>
                                    <Input
                                        id="cost_price"
                                        type="number"
                                        step="0.01"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="Purchase/market price (optional)"
                                    />
                                    {errors.cost_price && <p className="text-red-400 text-sm">{errors.cost_price}</p>}
                                </div>
                            </div>

                            {/* Stock Quantity and Category Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Stock Quantity */}
                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity" className="text-gray-300">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="0"
                                        required
                                    />
                                    {errors.stock_quantity && <p className="text-red-400 text-sm">{errors.stock_quantity}</p>}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category_id" className="text-gray-300">Category</Label>
                                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()} className="text-white hover:bg-gray-600">
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-red-400 text-sm">{errors.category_id}</p>}
                                </div>
                            </div>

                            {/* Short Description */}
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="short_description" className="text-gray-300">Short Description</Label>
                                <Input
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    placeholder="Brief product description"
                                />
                                {errors.short_description && <p className="text-red-400 text-sm">{errors.short_description}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="description" className="text-gray-300">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                                    placeholder="Detailed product description (optional)"
                                />
                                {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                            </div>

                            {/* Existing Images */}
                            {product.images && product.images.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-gray-300">Current Images</Label>
                                    <p className="text-xs text-gray-400">Click on an image to set it as the primary image</p>
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                        {product.images
                                            .filter(image => !imagesToDelete.includes(image.id.toString()))
                                            .map((image, index) => (
                                                <div key={image.id} className="relative group">
                                                    <img
                                                        src={image.url || `/storage/${image.path}`}
                                                        alt={image.alt_text || `Product image ${index + 1}`}
                                                        className={`w-full h-16 object-cover rounded border cursor-pointer transition-all ${
                                                            primaryImageId === image.id.toString() 
                                                                ? 'border-blue-500 border-2' 
                                                                : 'border-gray-600 hover:border-blue-400'
                                                        }`}
                                                        onClick={() => setPrimaryImage(image.id.toString())}
                                                        title="Click to set as primary image"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-80 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 border-0"
                                                        onClick={() => removeExistingImage(image.id.toString())}
                                                    >
                                                        <X className="h-2 w-2 text-white" />
                                                    </Button>
                                                    {primaryImageId === image.id.toString() && (
                                                        <Badge className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 py-0">
                                                            Primary
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                    {imagesToDelete.length > 0 && (
                                        <p className="text-sm text-red-400">
                                            {imagesToDelete.length} image{imagesToDelete.length > 1 ? 's' : ''} will be deleted when you save
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Media Library Selection */}
                            <div className="space-y-3">
                                <Label className="text-gray-300">Product Images</Label>
                                
                                {/* Media Library Selection */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <ImagePicker
                                            multiple={true}
                                            maxSelection={10}
                                            selectedImages={selectedLibraryImages}
                                            onSelect={handleLibraryImageSelection}
                                            trigger={
                                                <Button 
                                                    type="button"
                                                    variant="outline" 
                                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                                >
                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                    Select from Library
                                                    {selectedLibraryImages.length > 0 && (
                                                        <Badge className="ml-2 bg-blue-100 text-blue-800">
                                                            {selectedLibraryImages.length}
                                                        </Badge>
                                                    )}
                                                </Button>
                                            }
                                        />
                                        <span className="text-sm text-gray-400">or upload new images below</span>
                                    </div>

                                    {/* Selected Library Images Preview */}
                                    {selectedLibraryImages.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="text-gray-300 text-sm">Selected from Library:</Label>
                                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                                {selectedLibraryImages.map((image) => (
                                                    <div key={image.id} className="relative group">
                                                        <img
                                                            src={image.thumbnail_url || image.url}
                                                            alt={image.alt_text || image.original_name}
                                                            className="w-full h-16 object-cover rounded border border-gray-600"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-600 hover:bg-red-700 border-0 text-white"
                                                            onClick={() => removeLibraryImage(image.id)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                                                            {image.original_name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add New Images */}
                            <div className="space-y-3">
                                <Label className="text-gray-300">Add New Images</Label>
                                
                                {/* Image Upload Area */}
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                                    <input
                                        type="file"
                                        id="images"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <label htmlFor="images" className="cursor-pointer">
                                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                        <p className="text-sm text-gray-300">Click to upload new images</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                    </label>
                                </div>

                                {/* New Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`New preview ${index + 1}`}
                                                    className="w-full h-16 object-cover rounded border border-gray-600"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-80 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 border-0"
                                                    onClick={() => removeNewImage(index)}
                                                >
                                                    <X className="h-2 w-2 text-white" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-300">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-300">Featured</span>
                                </label>
                            </div>

                            {/* Variations Section */}
                            <div className="space-y-4 pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="has_variations"
                                        checked={data.has_variations}
                                        onChange={(e) => setData('has_variations', e.target.checked)}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="has_variations" className="text-gray-300">Enable Product Variations</Label>
                                </div>

                                {data.has_variations && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-white font-medium">Product Variations</h4>
                                            <Button
                                                type="button"
                                                onClick={addVariation}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                size="sm"
                                            >
                                                Add Variation
                                            </Button>
                                        </div>

                                        {variations.length > 0 && (
                                            <div className="space-y-3">
                                                {variations.map((variation, index) => (
                                                    <div key={variation.id || index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h5 className="text-white font-medium">Variation {index + 1}</h5>
                                                            <Button
                                                                type="button"
                                                                onClick={() => removeVariation(index)}
                                                                variant="destructive"
                                                                size="sm"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            {/* Size Selection */}
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-300">Size</Label>
                                                                <Select
                                                                    value={variation.size_id?.toString() || "none"}
                                                                    onValueChange={(value) => updateVariation(index, 'size_id', value === 'none' ? undefined : parseInt(value))}
                                                                >
                                                                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                                                        <SelectValue placeholder="Select size" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-gray-700 border-gray-600">
                                                                        <SelectItem value="none" className="text-white hover:bg-gray-600">No Size</SelectItem>
                                                                        {sizes.map((size) => (
                                                                            <SelectItem 
                                                                                key={size.id} 
                                                                                value={size.id.toString()}
                                                                                className="text-white hover:bg-gray-600"
                                                                            >
                                                                                {size.display_name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            {/* Color Selection */}
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-300">Color</Label>
                                                                <Select
                                                                    value={variation.color_id?.toString() || "none"}
                                                                    onValueChange={(value) => updateVariation(index, 'color_id', value === 'none' ? undefined : parseInt(value))}
                                                                >
                                                                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                                                        <SelectValue placeholder="Select color" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-gray-700 border-gray-600">
                                                                        <SelectItem value="none" className="text-white hover:bg-gray-600">No Color</SelectItem>
                                                                        {colors.map((color) => (
                                                                            <SelectItem 
                                                                                key={color.id} 
                                                                                value={color.id.toString()}
                                                                                className="text-white hover:bg-gray-600"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <div 
                                                                                        className="w-4 h-4 rounded-full border border-gray-400" 
                                                                                        style={{ backgroundColor: color.hex_code }}
                                                                                    />
                                                                                    {color.display_name}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            {/* Price Override */}
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-300">Price Override</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    value={variation.price || ''}
                                                                    onChange={(e) => updateVariation(index, 'price', e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                    placeholder="Override price"
                                                                    className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                                                                />
                                                            </div>

                                                            {/* Stock Quantity */}
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-300">Stock</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    value={variation.stock_quantity}
                                                                    onChange={(e) => updateVariation(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                                                                    className="bg-gray-600 border-gray-500 text-white"
                                                                />
                                                            </div>

                                                            {/* SKU */}
                                                            <div className="space-y-2 md:col-span-2 lg:col-span-4">
                                                                <Label className="text-gray-300">SKU (Optional)</Label>
                                                                <Input
                                                                    value={variation.sku || ''}
                                                                    onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                                                                    placeholder="Unique SKU for this variation"
                                                                    className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => router.get('/admin/products')}
                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {processing ? 'Updating...' : 'Update Product'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
