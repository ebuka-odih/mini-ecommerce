import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Upload, 
    Search, 
    Filter, 
    Grid3X3, 
    List, 
    Image as ImageIcon, 
    FolderOpen, 
    Tag, 
    Trash2, 
    Edit, 
    Download, 
    Eye,
    Move,
    Calendar,
    FileImage,
    HardDrive,
    Plus,
    X
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';

interface MediaFile {
    id: string;
    filename: string;
    original_name: string;
    mime_type: string;
    extension: string;
    path: string;
    disk: string;
    folder?: string;
    size: number;
    width?: number;
    height?: number;
    formatted_size: string;
    dimensions?: string;
    alt_text?: string;
    caption?: string;
    tags?: string;
    tags_array?: string[];
    uploaded_at: string;
    uploader?: {
        id: string;
        name: string;
    };
    download_count: number;
    last_used_at?: string;
    url: string;
    thumbnail_url: string;
    medium_url: string;
}

interface MediaPageProps {
    media: {
        data: MediaFile[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    folders: string[];
    tags: string[];
    stats: {
        total_images: number;
        total_size: number;
        total_size_formatted: string;
        unused_images: number;
        recent_uploads: number;
        folders_count: number;
        most_used_tags: Record<string, number>;
    };
    filters: {
        search?: string;
        folder?: string;
        tags?: string;
        mime_type?: string;
        unused?: boolean;
        recent_days?: number;
        sort_by?: string;
        sort_order?: string;
        per_page?: number;
    };
}

export default function MediaPage({ media, folders, tags, stats, filters }: MediaPageProps) {
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
    const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState(filters.search || '');

    // Upload form
    const { data: uploadData, setData: setUploadData, post: uploadPost, processing: uploadProcessing, errors: uploadErrors, reset: resetUpload } = useForm({
        files: [] as File[],
        folder: 'root',
        tags: '',
        alt_text: '',
        caption: '',
    });

    // URL import form
    const { data: urlData, setData: setUrlData, post: urlPost, processing: urlProcessing, errors: urlErrors, reset: resetUrl } = useForm({
        urls: [''],
        folder: 'root',
        tags: '',
        alt_text: '',
        caption: '',
    });

    const [uploadMode, setUploadMode] = React.useState<'file' | 'url' | 'paste'>('file');
    const [pastePreviews, setPastePreviews] = React.useState<string[]>([]);
    const [pasteFiles, setPasteFiles] = React.useState<File[]>([]);

    // Handle file upload
    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        uploadData.files.forEach(file => {
            formData.append('files[]', file);
        });
        formData.append('folder', uploadData.folder === 'root' ? '' : uploadData.folder);
        formData.append('tags', uploadData.tags);
        formData.append('alt_text', uploadData.alt_text);
        formData.append('caption', uploadData.caption);

        uploadPost('/admin/media', {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                resetUpload();
                alert('Files uploaded successfully!');
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
                alert('Error uploading files. Please try again.');
            },
        });
    };

    // Handle file selection for upload
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadData('files', files);
    };

    // Handle URL import
    const handleUrlImport = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validUrls = urlData.urls.filter(url => url.trim() !== '');
        if (validUrls.length === 0) {
            alert('Please enter at least one valid URL');
            return;
        }

        urlPost('/admin/media/import-urls', {
            data: {
                urls: validUrls,
                folder: urlData.folder === 'root' ? '' : urlData.folder,
                tags: urlData.tags,
                alt_text: urlData.alt_text,
                caption: urlData.caption,
            },
            onSuccess: () => {
                setIsUploadModalOpen(false);
                resetUrl();
                alert(`${validUrls.length} image(s) imported successfully!`);
            },
            onError: (errors) => {
                console.error('URL import errors:', errors);
                alert('Error importing images. Please check the URLs and try again.');
            },
        });
    };

    // Handle URL input changes
    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...urlData.urls];
        newUrls[index] = value;
        setUrlData('urls', newUrls);
    };

    // Add new URL input
    const addUrlInput = () => {
        setUrlData('urls', [...urlData.urls, '']);
    };

    // Remove URL input
    const removeUrlInput = (index: number) => {
        if (urlData.urls.length > 1) {
            const newUrls = urlData.urls.filter((_, i) => i !== index);
            setUrlData('urls', newUrls);
        }
    };

    // Handle paste events
    const handlePaste = async (e: React.ClipboardEvent) => {
        e.preventDefault();
        const items = e.clipboardData.items;
        const newFiles: File[] = [];
        const newPreviews: string[] = [];
        
        console.log('Paste event triggered', { itemsCount: items.length });
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            console.log(`Item ${i}:`, item.type, item.kind);
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (file) {
                    console.log('Found image file:', file.name, file.type, file.size);
                    newFiles.push(file);
                    
                    // Create preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        newPreviews.push(e.target?.result as string);
                        console.log('Preview created, total previews:', newPreviews.length, 'total files:', newFiles.length);
                        if (newPreviews.length === newFiles.length) {
                            console.log('Setting paste files and previews');
                            setPasteFiles(prev => [...prev, ...newFiles]);
                            setPastePreviews(prev => [...prev, ...newPreviews]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
        
        console.log('Paste processing complete', { newFilesCount: newFiles.length });
    };

    // Handle paste upload
    const handlePasteUpload = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Paste upload triggered', { pasteFilesCount: pasteFiles.length, pasteFiles });
        
        if (pasteFiles.length === 0) {
            alert('No images to upload. Please paste images first.');
            return;
        }

        const formData = new FormData();
        pasteFiles.forEach((file, index) => {
            console.log(`Adding file ${index}:`, file.name, file.type, file.size);
            formData.append('files[]', file);
        });
        formData.append('folder', uploadData.folder === 'root' ? '' : uploadData.folder);
        formData.append('tags', uploadData.tags);
        formData.append('alt_text', uploadData.alt_text);
        formData.append('caption', uploadData.caption);

        console.log('FormData contents:', Array.from(formData.entries()));

        uploadPost('/admin/media', {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                resetUpload();
                setPasteFiles([]);
                setPastePreviews([]);
                alert(`${pasteFiles.length} image(s) uploaded successfully!`);
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
                alert('Error uploading images. Please try again.');
            },
        });
    };

    // Clear paste data
    const clearPasteData = () => {
        setPasteFiles([]);
        setPastePreviews([]);
    };

    // Remove individual pasted image
    const removePastedImage = (index: number) => {
        setPasteFiles(prev => prev.filter((_, i) => i !== index));
        setPastePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/media', { 
            ...filters, 
            search: searchQuery || undefined 
        }, { 
            preserveState: true 
        });
    };

    // Real-time search
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get('/admin/media', { 
                    ...filters, 
                    search: searchQuery || undefined 
                }, { 
                    preserveState: true,
                    only: ['media', 'stats']
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handle filter changes
    const handleFilterChange = (key: string, value: any) => {
        router.get('/admin/media', { 
            ...filters, 
            [key]: value === 'all' ? undefined : value 
        }, { 
            preserveState: true 
        });
    };

    // Handle file selection
    const toggleFileSelection = (fileId: string) => {
        setSelectedFiles(prev => 
            prev.includes(fileId) 
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedFiles.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
            router.post('/admin/media/bulk-delete', { ids: selectedFiles }, {
                onSuccess: () => {
                    setSelectedFiles([]);
                    alert('Files deleted successfully!');
                },
            });
        }
    };

    // Handle individual file delete
    const handleDelete = (fileId: string) => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(`/admin/media/${fileId}`, {
                onSuccess: () => {
                    alert('File deleted successfully!');
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Head title="Media Library - GNOSIS Admin" />

            <PageHeader
                title="Media Library"
                description={`Manage your media files (${stats.total_images} files, ${stats.total_size_formatted})`}
            >
                {/* Upload Modal */}
                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Files
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white">Upload Media Files</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Upload images to your media library
                            </DialogDescription>
                        </DialogHeader>
                        
                        {/* Upload Mode Toggle */}
                        <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                    uploadMode === 'file'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                File Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('url')}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                    uploadMode === 'url'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                Import from URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('paste')}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                    uploadMode === 'paste'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                Paste Image
                            </button>
                        </div>

                        {uploadMode === 'file' ? (
                            <form onSubmit={handleUpload} className="space-y-4">
                            {/* File Input */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Files</Label>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="bg-gray-700 border-gray-600 text-white"
                                    required
                                />
                                {uploadData.files.length > 0 && (
                                    <p className="text-sm text-gray-400">
                                        {uploadData.files.length} file(s) selected
                                    </p>
                                )}
                            </div>

                            {/* Folder */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Folder (Optional)</Label>
                                <Select value={uploadData.folder} onValueChange={(value) => setUploadData('folder', value)}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select or create folder" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600">
                                        <SelectItem key="file-root" value="root" className="text-white hover:bg-gray-600">Root Folder</SelectItem>
                                        {folders.map((folder) => (
                                            <SelectItem key={folder} value={folder} className="text-white hover:bg-gray-600">
                                                {folder}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    value={uploadData.folder}
                                    onChange={(e) => setUploadData('folder', e.target.value)}
                                    placeholder="Or type new folder name"
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Tags (Optional)</Label>
                                <Input
                                    value={uploadData.tags}
                                    onChange={(e) => setUploadData('tags', e.target.value)}
                                    placeholder="e.g., product, banner, logo"
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                                <p className="text-xs text-gray-400">Separate tags with commas</p>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={uploadProcessing || uploadData.files.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {uploadProcessing ? 'Uploading...' : 'Upload Files'}
                                </Button>
                            </div>
                        </form>
                        ) : uploadMode === 'url' ? (
                            <form onSubmit={handleUrlImport} className="space-y-4">
                                {/* URL Inputs */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Image URLs</Label>
                                    {urlData.urls.map((url, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                type="url"
                                                value={url}
                                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                                required={index === 0}
                                            />
                                            {urlData.urls.length > 1 && (
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

                                {/* Folder */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Folder (Optional)</Label>
                                    <Select value={urlData.folder} onValueChange={(value) => setUrlData('folder', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select or create folder" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            <SelectItem key="url-root" value="root" className="text-white hover:bg-gray-600">Root Folder</SelectItem>
                                            {folders.map((folder) => (
                                                <SelectItem key={folder} value={folder} className="text-white hover:bg-gray-600">
                                                    {folder}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        value={urlData.folder}
                                        onChange={(e) => setUrlData('folder', e.target.value)}
                                        placeholder="Or type new folder name"
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Tags (Optional)</Label>
                                    <Input
                                        value={urlData.tags}
                                        onChange={(e) => setUrlData('tags', e.target.value)}
                                        placeholder="e.g., product, banner, logo"
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                    <p className="text-xs text-gray-400">Separate tags with commas</p>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={urlProcessing || urlData.urls.filter(url => url.trim() !== '').length === 0}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {urlProcessing ? 'Importing...' : 'Import Images'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handlePasteUpload} className="space-y-4">
                                {/* Paste Image Area */}
                                <div 
                                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors min-h-[200px] flex flex-col items-center justify-center"
                                    onPaste={handlePaste}
                                    tabIndex={0}
                                >
                                    {pastePreviews.length > 0 ? (
                                        <div className="space-y-4 w-full">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {pastePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview}
                                                            alt={`Pasted image ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded border border-gray-600"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePastedImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-green-400">✓ {pastePreviews.length} image(s) ready to upload</p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={clearPasteData}
                                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Clear All
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-4xl text-gray-400">📋</div>
                                            <p className="text-sm text-gray-300">Paste images here</p>
                                            <p className="text-xs text-gray-500">
                                                Take screenshots (Ctrl+Shift+S) or copy images, then paste (Ctrl+V)
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                You can paste multiple images at once
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Folder */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Folder (Optional)</Label>
                                    <Select value={uploadData.folder} onValueChange={(value) => setUploadData('folder', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select or create folder" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            <SelectItem key="paste-root" value="root" className="text-white hover:bg-gray-600">Root Folder</SelectItem>
                                            {folders.map((folder) => (
                                                <SelectItem key={folder} value={folder} className="text-white hover:bg-gray-600">
                                                    {folder}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        value={uploadData.folder}
                                        onChange={(e) => setUploadData('folder', e.target.value)}
                                        placeholder="Or type new folder name"
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Tags (Optional)</Label>
                                    <Input
                                        value={uploadData.tags}
                                        onChange={(e) => setUploadData('tags', e.target.value)}
                                        placeholder="e.g., product, banner, logo"
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                    <p className="text-xs text-gray-400">Separate tags with commas</p>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={pasteFiles.length === 0}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Upload {pasteFiles.length} Image{pasteFiles.length !== 1 ? 's' : ''}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <FileImage className="h-8 w-8 text-blue-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Total Files</p>
                                <p className="text-2xl font-bold text-white">{stats.total_images}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <HardDrive className="h-8 w-8 text-green-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Storage Used</p>
                                <p className="text-2xl font-bold text-white">{stats.total_size_formatted}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <FolderOpen className="h-8 w-8 text-yellow-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Folders</p>
                                <p className="text-2xl font-bold text-white">{stats.folders_count}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Calendar className="h-8 w-8 text-purple-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Recent (7 days)</p>
                                <p className="text-2xl font-bold text-white">{stats.recent_uploads}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Controls */}
            <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search files..."
                                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </form>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Folder Filter */}
                            <Select value={filters.folder || 'all'} onValueChange={(value) => handleFilterChange('folder', value)}>
                                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Folders</SelectItem>
                                    {folders.map((folder) => (
                                        <SelectItem key={folder} value={folder} className="text-white hover:bg-gray-600">
                                            {folder}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Type Filter */}
                            <Select value={filters.mime_type || 'all'} onValueChange={(value) => handleFilterChange('mime_type', value)}>
                                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Types</SelectItem>
                                    <SelectItem value="image" className="text-white hover:bg-gray-600">Images</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View Mode Toggle */}
                            <div className="flex border border-gray-600 rounded-md">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className={viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedFiles.length > 0 && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400">
                                {selectedFiles.length} file(s) selected
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBulkDelete}
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedFiles([])}
                                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                                Clear Selection
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Media Grid/List */}
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                    {media.data.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                /* Grid View */
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {media.data.map((file) => (
                                        <div key={file.id} className="relative group">
                                            <div 
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                                                    selectedFiles.includes(file.id) 
                                                        ? 'border-blue-500 ring-2 ring-blue-500/20' 
                                                        : 'border-gray-600 hover:border-gray-500'
                                                }`}
                                                onClick={() => toggleFileSelection(file.id)}
                                            >
                                                <img
                                                    src={file.thumbnail_url || file.url}
                                                    alt={file.alt_text || file.original_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.log('Image failed to load:', file.original_name, 'URL:', file.url);
                                                        const currentTarget = e.currentTarget;
                                                        const fallback = currentTarget.nextElementSibling as HTMLElement;
                                                        currentTarget.style.display = 'none';
                                                        if (fallback) {
                                                            fallback.classList.remove('hidden');
                                                        }
                                                    }}
                                                />
                                                <div className="hidden absolute inset-0 bg-gray-600 flex items-center justify-center">
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                    <span className="absolute bottom-1 text-xs text-gray-300">Failed to load</span>
                                                </div>
                                                
                                                {/* Selection Indicator */}
                                                {selectedFiles.includes(file.id) && (
                                                    <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                                    </div>
                                                )}

                                                {/* File Info Overlay */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                                    <p className="text-white text-xs font-medium truncate">{file.original_name}</p>
                                                    <p className="text-gray-300 text-xs">{file.formatted_size}</p>
                                                    {file.dimensions && (
                                                        <p className="text-gray-300 text-xs">{file.dimensions}</p>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 bg-white/90 hover:bg-white text-gray-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log('Opening image:', file.original_name, 'URL:', file.url);
                                                            window.open(file.url, '_blank');
                                                        }}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 bg-red-500/90 hover:bg-red-500 text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(file.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* File Tags */}
                                            {file.tags_array && file.tags_array.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {file.tags_array.slice(0, 2).map((tag, index) => (
                                                        <Badge key={index} className="bg-blue-100 text-blue-800 text-xs px-1 py-0">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {file.tags_array.length > 2 && (
                                                        <Badge className="bg-gray-100 text-gray-600 text-xs px-1 py-0">
                                                            +{file.tags_array.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* List View */
                                <div className="space-y-2">
                                    {media.data.map((file) => (
                                        <div 
                                            key={file.id} 
                                            className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                                                selectedFiles.includes(file.id) 
                                                    ? 'border-blue-500 bg-blue-500/10' 
                                                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                                            }`}
                                            onClick={() => toggleFileSelection(file.id)}
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                                                <img
                                                    src={file.thumbnail_url || file.url}
                                                    alt={file.alt_text || file.original_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.log('List view image failed to load:', file.original_name, 'URL:', file.url);
                                                        const currentTarget = e.currentTarget;
                                                        const fallback = currentTarget.nextElementSibling as HTMLElement;
                                                        currentTarget.style.display = 'none';
                                                        if (fallback) {
                                                            fallback.classList.remove('hidden');
                                                        }
                                                    }}
                                                />
                                                <div className="hidden w-full h-full bg-gray-600 flex items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            </div>

                                            {/* File Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white truncate">{file.original_name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                                    <span>{file.formatted_size}</span>
                                                    {file.dimensions && <span>{file.dimensions}</span>}
                                                    <span>{formatDate(file.uploaded_at)}</span>
                                                    {file.uploader && <span>by {file.uploader.name}</span>}
                                                </div>
                                                {file.tags_array && file.tags_array.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {file.tags_array.map((tag, index) => (
                                                            <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(file.url, '_blank');
                                                    }}
                                                    className="text-gray-300 hover:text-white hover:bg-gray-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(file.id);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {media.last_page > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                                    <div className="text-sm text-gray-400">
                                        Showing {media.from} to {media.to} of {media.total} files
                                    </div>
                                    <div className="flex gap-2">
                                        {media.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get('/admin/media', { ...filters, page: media.current_page - 1 })}
                                                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                            >
                                                Previous
                                            </Button>
                                        )}
                                        {media.current_page < media.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get('/admin/media', { ...filters, page: media.current_page + 1 })}
                                                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12">
                            <ImageIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No media files found</h3>
                            <p className="text-gray-400 mb-6">
                                {filters.search || filters.folder || filters.tags 
                                    ? 'Try adjusting your search or filters'
                                    : 'Upload your first media files to get started'
                                }
                            </p>
                            <Button 
                                onClick={() => setIsUploadModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Files
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}