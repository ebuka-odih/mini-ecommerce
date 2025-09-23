import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, Image as ImageIcon, Package, DollarSign, FileText } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface ImportedProductData {
    name: string;
    price: string;
    description: string;
    images: string[];
    source_url: string;
    source_platform: string;
    sku?: string;
    external_id?: string;
    downloaded_images?: any[];
}

interface ImportPageProps {
    categories: Category[];
    previewData?: ImportedProductData;
    errors?: any;
}

const ImportPage: React.FC<ImportPageProps> = ({ categories, previewData: initialPreviewData, errors: pageErrors }) => {
    const [previewData, setPreviewData] = useState<ImportedProductData | null>(initialPreviewData || null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(pageErrors?.message || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        url: '',
        category_id: '',
        name: '',
        price: '',
        description: '',
        stock_quantity: '0',
        is_active: true
    });

    const [previewProcessing, setPreviewProcessing] = useState(false);

    // Handle preview data from server
    useEffect(() => {
        if (initialPreviewData) {
            setPreviewData(initialPreviewData);
            // Auto-fill form with preview data
            setData({
                ...data,
                name: initialPreviewData.name || '',
                price: initialPreviewData.price || '',
                description: initialPreviewData.description || ''
            });
        }
    }, [initialPreviewData]);

    const handlePreview = () => {
        if (!data.url) {
            setPreviewError('Please enter a product URL');
            return;
        }

        setPreviewError(null);
        setPreviewData(null);
        setPreviewProcessing(true);

        // Use the main form data directly
        post('/admin/products/import/preview', {
            data: { url: data.url },
            onSuccess: () => {
                setPreviewProcessing(false);
            },
            onError: (errors) => {
                setPreviewError(errors.message || 'Failed to preview product. Please check the URL and try again.');
                setPreviewProcessing(false);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products/import');
    };

    const handleUrlChange = (url: string) => {
        setData('url', url);
        // Clear preview when URL changes
        setPreviewData(null);
        setPreviewError(null);
    };

    return (
        <AdminLayout>
            <Head title="Import Product" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Import Product</h1>
                    <p className="text-gray-400 mt-2">
                        Import products from external websites like Temu, AliExpress, and Amazon
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Import Form */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <ExternalLink className="w-5 h-5" />
                                Product Import
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Enter a product URL to import product data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-white">Product URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="url"
                                        type="url"
                                        placeholder="https://www.temu.com/..."
                                        value={data.url}
                                        onChange={(e) => handleUrlChange(e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handlePreview}
                                        disabled={previewProcessing || !data.url}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {previewProcessing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Preview'
                                        )}
                                    </Button>
                                </div>
                                {errors.url && <p className="text-red-400 text-sm">{errors.url}</p>}
                            </div>

                            {previewError && (
                                <Alert className="bg-red-900/20 border-red-700">
                                    <AlertDescription className="text-red-300">
                                        {previewError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {previewData && (
                                <Alert className="bg-green-900/20 border-green-700">
                                    <AlertDescription className="text-green-300">
                                        ✅ Successfully extracted product data from {previewData.source_platform}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Preview Card */}
                    {previewData && (
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Preview
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Extracted product information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-blue-600 text-white">
                                        {previewData.source_platform}
                                    </Badge>
                                    {previewData.sku && (
                                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                                            {previewData.sku}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-white">
                                        <Package className="w-4 h-4" />
                                        <span className="font-medium">{previewData.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-green-400">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="font-medium">${previewData.price}</span>
                                    </div>

                                    {previewData.description && (
                                        <div className="flex items-start gap-2 text-gray-300">
                                            <FileText className="w-4 h-4 mt-0.5" />
                                            <span className="text-sm">{previewData.description}</span>
                                        </div>
                                    )}

                                    {previewData.images && previewData.images.length > 0 && (
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <ImageIcon className="w-4 h-4" />
                                            <span className="text-sm">
                                                {previewData.images.length} image(s) found
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Product Form */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Product Details</CardTitle>
                        <CardDescription className="text-gray-400">
                            Review and modify the product information before importing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        required
                                    />
                                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id" className="text-white">Category *</Label>
                                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id} className="text-white">
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-red-400 text-sm">{errors.category_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-white">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        required
                                    />
                                    {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity" className="text-white">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="0"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    {errors.stock_quantity && <p className="text-red-400 text-sm">{errors.stock_quantity}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-white">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                                    placeholder="Product description..."
                                />
                                {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor="is_active" className="text-white">Active</Label>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing || !previewData}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Importing...
                                        </>
                                    ) : (
                                        'Import Product'
                                    )}
                                </Button>
                                
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setPreviewData(null);
                                        setPreviewError(null);
                                    }}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default ImportPage;
