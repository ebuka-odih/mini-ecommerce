import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImagePicker from '@/components/admin/image-picker';
import { X, Star, Upload, Image as ImageIcon } from 'lucide-react';

interface MediaFile {
    id: string;
    filename: string;
    original_name: string;
    url: string;
    thumbnail_url: string;
    formatted_size: string;
    alt_text?: string;
    tags_array?: string[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductFormProps {
    categories: Category[];
    onSubmit: (data: any) => void;
    processing?: boolean;
    errors?: Record<string, string>;
    initialData?: any;
}

const ProductFormWithMediaLibrary: React.FC<ProductFormProps> = ({
    categories,
    onSubmit,
    processing = false,
    errors = {},
    initialData = null,
}) => {
    const [selectedImages, setSelectedImages] = React.useState<MediaFile[]>([]);
    const [primaryImageId, setPrimaryImageId] = React.useState<string | null>(null);

    const { data, setData, post, processing: formProcessing, errors: formErrors } = useForm({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        category_id: initialData?.category_id || '',
        sku: initialData?.sku || '',
        stock: initialData?.stock || '',
        status: initialData?.status || 'active',
        is_featured: initialData?.is_featured || false,
        // Media library integration
        selected_images: [] as string[], // Array of image IDs from media library
        primary_image_id: '',
        // Traditional file upload (as fallback)
        images: [] as File[],
    });

    // Handle image selection from media library
    const handleImageSelection = (images: MediaFile[]) => {
        setSelectedImages(images);
        setData('selected_images', images.map(img => img.id));
        
        // Set first image as primary if none selected
        if (images.length > 0 && !primaryImageId) {
            setPrimaryImageId(images[0].id);
            setData('primary_image_id', images[0].id);
        }
    };

    // Handle primary image selection
    const handleSetPrimaryImage = (imageId: string) => {
        setPrimaryImageId(imageId);
        setData('primary_image_id', imageId);
    };

    // Remove image from selection
    const handleRemoveImage = (imageId: string) => {
        const updatedImages = selectedImages.filter(img => img.id !== imageId);
        setSelectedImages(updatedImages);
        setData('selected_images', updatedImages.map(img => img.id));
        
        // Update primary image if removed
        if (primaryImageId === imageId) {
            const newPrimary = updatedImages.length > 0 ? updatedImages[0].id : '';
            setPrimaryImageId(newPrimary || null);
            setData('primary_image_id', newPrimary);
        }
    };

    // Handle traditional file upload (fallback)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('images', files);
    };

    // Generate SKU
    const generateSKU = () => {
        const timestamp = Date.now().toString().slice(-3);
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        setData('sku', `GN-${randomStr}-${timestamp}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Product Information */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Product Information</CardTitle>
                    <CardDescription className="text-gray-400">
                        Basic details about your product
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {(formErrors.name || errors.name) && (
                                <p className="text-red-400 text-sm">{formErrors.name || errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="text-gray-300">Category</Label>
                            <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
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

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            placeholder="Product description"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-gray-300">Price (₦)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock" className="text-gray-300">Stock Quantity</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                placeholder="0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sku" className="text-gray-300">SKU</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="sku"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    placeholder="GN-XXX-123"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={generateSKU}
                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Generate
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Product Images - Media Library Integration */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Product Images</CardTitle>
                    <CardDescription className="text-gray-400">
                        Select images from your media library or upload new ones
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Media Library Image Picker */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <ImagePicker
                                multiple={true}
                                maxSelection={10}
                                selectedImages={selectedImages}
                                onSelect={handleImageSelection}
                                trigger={
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Select from Library
                                        {selectedImages.length > 0 && (
                                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                                                {selectedImages.length}
                                            </Badge>
                                        )}
                                    </Button>
                                }
                            />
                            
                            <p className="text-sm text-gray-400">
                                or use traditional upload below
                            </p>
                        </div>

                        {/* Selected Images Preview */}
                        {selectedImages.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-300">Selected Images:</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {selectedImages.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <div className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                                                primaryImageId === image.id 
                                                    ? 'border-yellow-500 ring-2 ring-yellow-500/20' 
                                                    : 'border-gray-600'
                                            }`}>
                                                <img
                                                    src={image.thumbnail_url || image.url}
                                                    alt={image.alt_text || image.original_name}
                                                    className="w-full h-full object-cover"
                                                />
                                                
                                                {/* Primary Image Indicator */}
                                                {primaryImageId === image.id && (
                                                    <div className="absolute top-1 left-1">
                                                        <Badge className="bg-yellow-500 text-yellow-900 text-xs px-1 py-0">
                                                            <Star className="h-2 w-2 mr-1" />
                                                            Primary
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                    {primaryImageId !== image.id && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="secondary"
                                                            className="h-6 w-6 p-0 bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                                                            onClick={() => handleSetPrimaryImage(image.id)}
                                                            title="Set as primary"
                                                        >
                                                            <Star className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                                                        onClick={() => handleRemoveImage(image.id)}
                                                        title="Remove image"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            {/* Image Info */}
                                            <div className="mt-1">
                                                <p className="text-xs text-gray-400 truncate">{image.original_name}</p>
                                                <p className="text-xs text-gray-500">{image.formatted_size}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Traditional File Upload (Fallback) */}
                    <div className="border-t border-gray-700 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="images" className="text-gray-300">Upload New Images (Fallback)</Label>
                            <Input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                            <p className="text-xs text-gray-400">
                                Use this if you need to upload new images that aren't in your media library yet
                            </p>
                        </div>
                    </div>

                    {(formErrors.images || errors.images) && (
                        <p className="text-red-400 text-sm">{formErrors.images || errors.images}</p>
                    )}
                </CardContent>
            </Card>

            {/* Product Settings */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-gray-300">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                    <SelectItem value="active" className="text-white hover:bg-gray-600">Active</SelectItem>
                                    <SelectItem value="inactive" className="text-white hover:bg-gray-600">Inactive</SelectItem>
                                    <SelectItem value="draft" className="text-white hover:bg-gray-600">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2 pt-7">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="is_featured" className="text-gray-300 cursor-pointer">
                                Featured Product
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
                <Button 
                    type="button" 
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={processing || formProcessing}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {processing || formProcessing ? 'Saving...' : 'Save Product'}
                </Button>
            </div>
        </form>
    );
};

export default ProductFormWithMediaLibrary;

