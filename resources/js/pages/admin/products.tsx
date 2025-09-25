import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Eye,
    Package,
    Tag,
    DollarSign,
    Image as ImageIcon,
    Upload,
    X,
    ExternalLink,
    Star
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';
import ImagePicker from '@/components/admin/image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Product, Category } from '@/types';

interface Size {
    id: number;
    name: string;
    display_name: string;
    sort_order: number;
    is_active: boolean;
}

interface Color {
    id: number;
    name: string;
    display_name: string;
    hex_code: string;
    sort_order: number;
    is_active: boolean;
}

interface ProductVariation {
    id: number;
    product_id: number;
    size_id?: number;
    color_id?: number;
    size?: Size;
    color?: Color;
    price?: number;
    stock_quantity: number;
    sku?: string;
    is_active: boolean;
    display_name: string;
    effective_price: number;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price?: number;
    stock: number;
    stock_quantity: number;
    sku: string;
    category_id: number;
    category: Category;
    is_featured: boolean;
    is_active: boolean;
    images: Image[];
    variations: ProductVariation[];
    created_at: string;
    updated_at: string;
}

interface ProductsPageProps {
    products: Product[];
    categories: Category[];
    sizes: Size[];
    colors: Color[];
    filters?: {
        search?: string;
        category?: string;
        status?: string;
    };
}

const ProductsPage: React.FC<ProductsPageProps> = ({ 
    products = [], 
    categories = [],
    sizes = [],
    colors = [],
    filters = {}
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState(filters.search || '');
    const [newProduct, setNewProduct] = React.useState({
        name: '',
        description: '',
        short_description: '',
        price: '',
        sale_price: '',
        sku: '',
        stock_quantity: '',
        category_id: '',
        is_active: true,
        is_featured: false,
        has_variations: false,
    });
    const [variations, setVariations] = React.useState<ProductVariation[]>([]);
    const [productImages, setProductImages] = React.useState<File[]>([]);
    const { addToast } = useToast();
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [selectedLibraryImages, setSelectedLibraryImages] = React.useState<any[]>([]);
    const [imageUploadMode, setImageUploadMode] = React.useState<'file' | 'url'>('file');
    const [imageUrls, setImageUrls] = React.useState<string[]>(['']);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/products', { 
            ...filters, 
            search: searchQuery || undefined 
        }, { 
            preserveState: true 
        });
    };

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

    const removeImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeLibraryImage = (imageId: string) => {
        setSelectedLibraryImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleLibraryImageSelection = (images: any[]) => {
        setSelectedLibraryImages(images);
    };

    // Handle URL input changes
    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    // Add new URL input
    const addUrlInput = () => {
        setImageUrls([...imageUrls, '']);
    };

    // Remove URL input
    const removeUrlInput = (index: number) => {
        if (imageUrls.length > 1) {
            const newUrls = imageUrls.filter((_, i) => i !== index);
            setImageUrls(newUrls);
        }
    };

    // Import images from URLs
    const importImagesFromUrls = async () => {
        const validUrls = imageUrls.filter(url => url.trim() !== '');
        if (validUrls.length === 0) {
            alert('Please enter at least one valid URL');
            return;
        }

        try {
            // Import images to media library first
            const response = await fetch('/admin/media/import-urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    urls: validUrls,
                    folder: 'products',
                    tags: 'product,imported',
                }),
            });

            if (response.ok) {
                // Get the imported images and add them to selected library images
                const result = await response.json();
                alert(`${validUrls.length} image(s) imported successfully!`);
                
                // Clear URL inputs
                setImageUrls(['']);
                setImageUploadMode('file');
                
                // Refresh the page to show new images in media library
                window.location.reload();
            } else {
                alert('Error importing images. Please check the URLs and try again.');
            }
        } catch (error) {
            console.error('Error importing images:', error);
            alert('Error importing images. Please try again.');
        }
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Add product data
        Object.entries(newProduct).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, value.toString());
            }
        });

        // Add new uploaded images
        productImages.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        // Add selected library images
        selectedLibraryImages.forEach((image, index) => {
            formData.append(`library_images[${index}]`, image.id);
        });

        // Add variations if enabled
        if (newProduct.has_variations && variations.length > 0) {
            variations.forEach((variation, index) => {
                if (variation.size_id || variation.color_id) {
                    formData.append(`variations[${index}][size_id]`, variation.size_id?.toString() || '');
                    formData.append(`variations[${index}][color_id]`, variation.color_id?.toString() || '');
                    formData.append(`variations[${index}][price]`, variation.price?.toString() || '');
                    formData.append(`variations[${index}][stock_quantity]`, variation.stock_quantity.toString());
                    formData.append(`variations[${index}][sku]`, variation.sku || '');
                }
            });
        }

        // Debug form data
        console.log('Form data being sent:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        router.post('/admin/products', formData, {
            onSuccess: (page) => {
                console.log('Product created successfully!', page);
                setIsAddModalOpen(false);
                setNewProduct({
                    name: '',
                    description: '',
                    short_description: '',
                    price: '',
                    sale_price: '',
                    sku: '',
                    stock_quantity: '',
                    category_id: '',
                    is_active: true,
                    is_featured: false,
                });
                setProductImages([]);
                setImagePreviews([]);
                setSelectedLibraryImages([]);
                setVariations([]);
                // Flash message will be shown automatically by the layout
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                
                // Create a detailed error message
                let errorMessage = 'Error creating product:\n\n';
                Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach(message => {
                            errorMessage += `• ${field}: ${message}\n`;
                        });
                    } else {
                        errorMessage += `• ${field}: ${messages}\n`;
                    }
                });
                
                // Error message will be handled by the flash message system
                console.error(errorMessage);
            },
            onStart: () => {
                console.log('Creating product...');
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    const handleDeleteProduct = (productId: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${productId}`);
        }
    };

    const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/admin/products/${productId}/toggle-featured`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const result = await response.json();
                
                // Show success toast
                addToast({
                    title: result.is_featured ? 'Product Featured' : 'Product Unfeatured',
                    description: result.message,
                    type: 'success',
                    duration: 3000
                });
                
                // Refresh the page to show updated data
                router.reload();
            } else {
                addToast({
                    title: 'Error',
                    description: 'Failed to update featured status',
                    type: 'error',
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Error toggling featured status:', error);
            addToast({
                title: 'Error',
                description: 'Error updating featured status',
                type: 'error',
                duration: 5000
            });
        }
    };

    const addVariation = () => {
        setVariations(prev => [...prev, {
            id: Date.now(), // Temporary ID
            product_id: 0,
            size_id: undefined,
            color_id: undefined,
            price: undefined,
            stock_quantity: 0,
            sku: '',
            is_active: true,
            display_name: '',
            effective_price: 0
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

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (quantity <= 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout title="Products - GNOSIS Admin">
            <Head title="Products" />
            
            <PageHeader 
                title="Products" 
                description="Manage your product inventory and catalog"
            >
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-3">
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add New Product</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Create a new product for your GNOSIS collection
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Product Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-300">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                {/* SKU */}
                                <div className="space-y-2">
                                    <Label htmlFor="sku" className="text-gray-300">SKU</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="sku"
                                            value={newProduct.sku}
                                            onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            placeholder="Product SKU"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const timestamp = Date.now().toString().slice(-3); // Last 3 digits
                                                const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random chars
                                                setNewProduct({...newProduct, sku: `GN-${randomStr}-${timestamp}`});
                                            }}
                                            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 whitespace-nowrap"
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-gray-300">Price (₦)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="0"
                                        required
                                    />
                                </div>

                                {/* Sale Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="sale_price" className="text-gray-300">Sale Price (₦)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        step="0.01"
                                        value={newProduct.sale_price}
                                        onChange={(e) => setNewProduct({...newProduct, sale_price: e.target.value})}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="Optional sale price in Naira"
                                    />
                                </div>

                                {/* Stock Quantity */}
                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity" className="text-gray-300">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        value={newProduct.stock_quantity}
                                        onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="0"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-gray-300">Category</Label>
                                    <Select 
                                        value={newProduct.category_id} 
                                        onValueChange={(value) => setNewProduct({...newProduct, category_id: value})}
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id} className="text-white hover:bg-gray-600">
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Short Description */}
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="short_description" className="text-gray-300">Short Description</Label>
                                <Input
                                    id="short_description"
                                    value={newProduct.short_description}
                                    onChange={(e) => setNewProduct({...newProduct, short_description: e.target.value})}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    placeholder="Brief product description"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="description" className="text-gray-300">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                                    placeholder="Detailed product description (optional)"
                                />
                            </div>

                            {/* Product Images */}
                            <div className="space-y-3 md:col-span-3">
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
                                                            size="sm"
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

                                {/* Image Upload Mode Toggle */}
                                <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setImageUploadMode('file')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                            imageUploadMode === 'file'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        File Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageUploadMode('url')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                            imageUploadMode === 'url'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        Import from URL
                                    </button>
                                </div>

                                {imageUploadMode === 'file' ? (
                                    /* Traditional Image Upload Area */
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
                                            <p className="text-sm text-gray-300">Upload New Images</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                        </label>
                                    </div>
                                ) : (
                                    /* URL Import Area */
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">Image URLs</Label>
                                            {imageUrls.map((url, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        type="url"
                                                        value={url}
                                                        onChange={(e) => handleUrlChange(index, e.target.value)}
                                                        placeholder="https://example.com/image.jpg"
                                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                                        required={index === 0}
                                                    />
                                                    {imageUrls.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeUrlInput(index)}
                                                            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 px-3"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addUrlInput}
                                                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Another URL
                                            </Button>
                                            <p className="text-xs text-gray-400">
                                                Enter image URLs from Temu, AliExpress, or other sources
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={importImagesFromUrls}
                                            disabled={imageUrls.filter(url => url.trim() !== '').length === 0}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Import Images from URLs
                                        </Button>
                                    </div>
                                )}

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-16 object-cover rounded border border-gray-600"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-80 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 border-0"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-2 w-2 text-white" />
                                                </Button>
                                                {index === 0 && (
                                                    <Badge className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 py-0">
                                                        1st
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Variations Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newProduct.has_variations}
                                        onChange={(e) => setNewProduct({...newProduct, has_variations: e.target.checked})}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-300 font-medium">This product has size/color variations</span>
                                </div>

                                {newProduct.has_variations && (
                                    <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-gray-300 font-medium">Product Variations</h4>
                                            <Button 
                                                type="button"
                                                onClick={addVariation}
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Variation
                                            </Button>
                                        </div>

                                        {variations.map((variation, index) => (
                                            <div key={variation.id} className="border border-gray-600 rounded-lg p-4 mb-4 bg-gray-600">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h5 className="text-gray-200 font-medium">Variation {index + 1}</h5>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeVariation(index)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {/* Size Selection */}
                                                    <div>
                                                        <Label htmlFor={`variation-${index}-size`} className="text-gray-300">Size</Label>
                                                        <Select
                                                            value={variation.size_id?.toString() || ""}
                                                            onValueChange={(value) => updateVariation(index, 'size_id', value ? parseInt(value) : undefined)}
                                                        >
                                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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
                                                                        {size.display_name} ({size.name})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Color Selection */}
                                                    <div>
                                                        <Label htmlFor={`variation-${index}-color`} className="text-gray-300">Color</Label>
                                                        <Select
                                                            value={variation.color_id?.toString() || ""}
                                                            onValueChange={(value) => updateVariation(index, 'color_id', value ? parseInt(value) : undefined)}
                                                        >
                                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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
                                                                                className="w-4 h-4 rounded-full border border-gray-500"
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
                                                    <div>
                                                        <Label htmlFor={`variation-${index}-price`} className="text-gray-300">Price Override (Optional)</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="Leave empty to use base price"
                                                            value={variation.price || ''}
                                                            onChange={(e) => updateVariation(index, 'price', e.target.value ? parseFloat(e.target.value) : undefined)}
                                                            className="bg-gray-700 border-gray-600 text-white"
                                                        />
                                                    </div>

                                                    {/* Stock Quantity */}
                                                    <div>
                                                        <Label htmlFor={`variation-${index}-stock`} className="text-gray-300">Stock Quantity</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={variation.stock_quantity}
                                                            onChange={(e) => updateVariation(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                                                            className="bg-gray-700 border-gray-600 text-white"
                                                        />
                                                    </div>

                                                    {/* SKU */}
                                                    <div>
                                                        <Label htmlFor={`variation-${index}-sku`} className="text-gray-300">SKU (Optional)</Label>
                                                        <Input
                                                            placeholder="Auto-generated if empty"
                                                            value={variation.sku || ''}
                                                            onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                                                            className="bg-gray-700 border-gray-600 text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {variations.length === 0 && (
                                            <div className="text-center py-8 text-gray-400">
                                                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                                <p>No variations added yet. Click "Add Variation" to create size/color combinations.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-6 md:col-span-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newProduct.is_active}
                                        onChange={(e) => setNewProduct({...newProduct, is_active: e.target.checked})}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-300">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newProduct.is_featured}
                                        onChange={(e) => setNewProduct({...newProduct, is_featured: e.target.checked})}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-300">Featured</span>
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Create Product
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                    </Dialog>
                    
                    <Link href="/admin/products/import">
                        <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Import from URL
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{products.length}</div>
                        <p className="text-xs text-gray-400">Active products in catalog</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Low Stock</CardTitle>
                        <Tag className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {products.filter(p => p.stock_quantity <= 5).length}
                        </div>
                        <p className="text-xs text-gray-400">Products need restocking</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Stock</CardTitle>
                        <Package className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0)}
                        </div>
                        <p className="text-xs text-gray-400">Items in inventory</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {products.length > 0 
                                ? formatPrice(products
                                    .filter(p => p.stock_quantity > 0)
                                    .reduce((sum, p) => sum + parseFloat(p.price), 0))
                                : '₦0'
                            }
                        </div>
                        <p className="text-xs text-gray-400">Sum of products with stock</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 sm:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>
                        </form>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 justify-center">
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                            <Select value={filters.category} onValueChange={(value) => router.get('/admin/products', { ...filters, category: value })}>
                                <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.slug} className="text-white hover:bg-gray-600">
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Products</CardTitle>
                            <CardDescription className="text-gray-400">
                                Manage your product inventory ({products.length} products)
                            </CardDescription>
                        </div>
                        <Link href="/admin/products/import">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Import
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    {products.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <div className="rounded-md border border-gray-700 overflow-hidden">
                                    <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 hover:bg-gray-700/50">
                                        <TableHead className="text-gray-300">Product</TableHead>
                                        <TableHead className="text-gray-300">Category</TableHead>
                                        <TableHead className="text-gray-300">Price</TableHead>
                                        <TableHead className="text-gray-300">Stock</TableHead>
                                        <TableHead className="text-gray-300">Variations</TableHead>
                                        <TableHead className="text-gray-300">Featured</TableHead>
                                        <TableHead className="text-gray-300">Status</TableHead>
                                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => {
                                        const stockStatus = getStockStatus(product.stock_quantity);
                                        return (
                                            <TableRow key={product.id} className="border-gray-700 hover:bg-gray-700/30">
                                                {/* Product Info */}
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                                            {product.images && product.images.length > 0 ? (
                                                                (() => {
                                                                    const primaryImage = product.images.find(img => img.is_featured) || product.images[0];
                                                                    return (
                                                                        <img 
                                                                            src={primaryImage.url || `/storage/${primaryImage.path}`} 
                                                                            alt={product.name}
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                                            }}
                                                                        />
                                                                    );
                                                                })()
                                                            ) : (
                                                                <ImageIcon className="h-5 w-5 text-gray-500" />
                                                            )}
                                                            {product.images && product.images.length > 0 && (
                                                                <ImageIcon className="h-5 w-5 text-gray-500 hidden" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">{product.name}</p>
                                                            <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Category */}
                                                <TableCell>
                                                    <Badge className="bg-blue-100 text-blue-800">
                                                        {product.category.name}
                                                    </Badge>
                                                </TableCell>

                                                {/* Price */}
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="text-white font-medium">
                                                            {formatPrice(product.price)}
                                                        </p>
                                                        {product.sale_price && (
                                                            <p className="text-xs text-green-400">
                                                                Sale: {formatPrice(product.sale_price)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Stock */}
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Badge className={stockStatus.color}>
                                                            {stockStatus.label} ({product.stock_quantity})
                                                        </Badge>
                                                    </div>
                                                </TableCell>

                                                {/* Variations */}
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {product.variations && product.variations.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                <Badge className="bg-blue-100 text-blue-800">
                                                                    {product.variations.length} variation{product.variations.length !== 1 ? 's' : ''}
                                                                </Badge>
                                                                {product.variations.slice(0, 2).map((variation, index) => (
                                                                    <Badge key={index} className="bg-gray-100 text-gray-800 text-xs">
                                                                        {variation.size?.name || 'No Size'}/{variation.color?.name || 'No Color'}
                                                                    </Badge>
                                                                ))}
                                                                {product.variations.length > 2 && (
                                                                    <Badge className="bg-gray-100 text-gray-800 text-xs">
                                                                        +{product.variations.length - 2} more
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">No variations</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Featured Toggle */}
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                            product.is_featured 
                                                                ? 'bg-blue-600' 
                                                                : 'bg-gray-600'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                product.is_featured ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                        />
                                                    </button>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Badge className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                            {product.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        {product.is_featured && (
                                                            <Badge className="bg-purple-100 text-purple-800 block w-fit">
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                            <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-gray-700" />
                                                            <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                                                                <Link href={`/admin/products/${product.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                                                className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                            >
                                                                <Star className={`mr-2 h-4 w-4 ${product.is_featured ? 'text-yellow-400' : 'text-gray-400'}`} />
                                                                {product.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-gray-700" />
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                                className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4 p-4">
                                {products.map((product) => {
                                    const stockStatus = getStockStatus(product.stock_quantity);
                                    return (
                                        <Card key={product.id} className="bg-gray-700 border-gray-600">
                                            <CardContent className="p-4">
                                                <div className="space-y-4">
                                                    {/* Product Header */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            {product.images && product.images.length > 0 ? (
                                                                (() => {
                                                                    const primaryImage = product.images.find(img => img.is_featured) || product.images[0];
                                                                    return (
                                                                        <img 
                                                                            src={primaryImage.url || `/storage/${primaryImage.path}`} 
                                                                            alt={product.name}
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                                            }}
                                                                        />
                                                                    );
                                                                })()
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-gray-500" />
                                                            )}
                                                            {product.images && product.images.length > 0 && (
                                                                <ImageIcon className="h-6 w-6 text-gray-500 hidden" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-white truncate">{product.name}</h3>
                                                            <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                                                            <Badge className="bg-blue-100 text-blue-800 mt-1">
                                                                {product.category.name}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {/* Price */}
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Price</p>
                                                            <p className="text-white font-medium">
                                                                {formatPrice(product.price)}
                                                            </p>
                                                            {product.sale_price && (
                                                                <p className="text-xs text-green-400">
                                                                    Sale: {formatPrice(product.sale_price)}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Stock */}
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Stock</p>
                                                            <Badge className={stockStatus.color + " text-xs"}>
                                                                {stockStatus.label} ({product.stock_quantity})
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Status & Actions */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                                {product.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-gray-400">Featured:</span>
                                                                <button
                                                                    onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                                        product.is_featured 
                                                                            ? 'bg-blue-600' 
                                                                            : 'bg-gray-600'
                                                                    }`}
                                                                >
                                                                    <span
                                                                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                                                            product.is_featured ? 'translate-x-5' : 'translate-x-1'
                                                                        }`}
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-600 h-8 w-8 p-0">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                                    <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                                    <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                                                                        <Link href={`/admin/products/${product.id}`}>
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            View
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                                                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <Star className={`mr-2 h-4 w-4 ${product.is_featured ? 'text-yellow-400' : 'text-gray-400'}`} />
                                                                        {product.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                        className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12 px-4">
                            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
                            <p className="text-gray-400 mb-6">
                                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first product'}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Product
                                </Button>
                                <Link href="/admin/products/import">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Import from URL
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

        </AdminLayout>
    );
};

export default ProductsPage;
