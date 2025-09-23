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
import { Plus, Edit, Trash2, Eye, Grid3X3, Palette, Link as LinkIcon, ToggleLeft, ToggleRight, ImageIcon } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';
import ImagePicker from '@/components/admin/image-picker';
import { Category } from '@/types/fashion';

interface HomepageLayout {
    id: string;
    grid_position: string;
    section_name: string;
    category_id?: string;
    category?: Category;
    cover_image_id?: string;
    cover_image?: any;
    use_custom_cover: boolean;
    layout_type: string;
    slider_speed?: number;
    title: string;
    subtitle?: string;
    description?: string;
    gradient_from?: string;
    gradient_to?: string;
    text_color: string;
    custom_link?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface HomepageLayoutPageProps {
    layouts: HomepageLayout[];
    categories: Category[];
    gridPositions: Record<string, string>;
    gradients: Record<string, { from: string; to: string; label: string }>;
    layoutTypes: Record<string, string>;
}

interface LayoutForm {
    grid_position: string;
    section_name: string;
    category_id: string;
    use_custom_cover: boolean;
    cover_image_id: string;
    layout_type: string;
    slider_speed: number;
    title: string;
    subtitle: string;
    description: string;
    gradient_from: string;
    gradient_to: string;
    text_color: string;
    custom_link: string;
    is_active: boolean;
    sort_order: string;
}

export default function HomepageLayoutPage({ layouts, categories, gridPositions, gradients, layoutTypes }: HomepageLayoutPageProps) {
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [editingLayout, setEditingLayout] = React.useState<HomepageLayout | null>(null);
    
    // State for selected cover images
    const [selectedCoverImage, setSelectedCoverImage] = React.useState<any>(null);
    const [selectedEditCoverImage, setSelectedEditCoverImage] = React.useState<any>(null);

    // Form for adding new layout
    const { data: newLayout, setData: setNewLayout, post, processing: addProcessing, errors: addErrors, reset: resetAdd } = useForm<LayoutForm>({
        grid_position: '',
        section_name: '',
        category_id: 'none',
        use_custom_cover: false,
        cover_image_id: '',
        layout_type: 'grid',
        slider_speed: 5000,
        title: '',
        subtitle: '',
        description: '',
        gradient_from: 'slate-900',
        gradient_to: 'slate-700',
        text_color: 'white',
        custom_link: '',
        is_active: true,
        sort_order: '0',
    });

    // Form for editing layout
    const { data: editLayout, setData: setEditLayout, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm<LayoutForm>({
        grid_position: '',
        section_name: '',
        category_id: '',
        use_custom_cover: false,
        cover_image_id: '',
        layout_type: 'grid',
        slider_speed: 5000,
        title: '',
        subtitle: '',
        description: '',
        gradient_from: '',
        gradient_to: '',
        text_color: 'white',
        custom_link: '',
        is_active: true,
        sort_order: '0',
    });

    const handleAddLayout = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/admin/homepage-layout', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setSelectedCoverImage(null);
                resetAdd();
                // Reload the page to refresh layout data
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                alert('Error creating layout. Please check the form.');
            },
        });
    };

    const handleEditLayout = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingLayout) return;

        put(`/admin/homepage-layout/${editingLayout.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingLayout(null);
                setSelectedEditCoverImage(null);
                resetEdit();
                // Reload the page to refresh layout data with updated cover images
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                alert('Error updating layout. Please check the form.');
            },
        });
    };

    const openEditModal = (layout: HomepageLayout) => {
        setEditingLayout(layout);
        setEditLayout({
            grid_position: layout.grid_position,
            section_name: layout.section_name,
            category_id: layout.category_id || 'none',
            use_custom_cover: layout.use_custom_cover || false,
            cover_image_id: layout.cover_image_id || '',
            layout_type: layout.layout_type || 'grid',
            slider_speed: layout.slider_speed || 5000,
            title: layout.title,
            subtitle: layout.subtitle || '',
            description: layout.description || '',
            gradient_from: layout.gradient_from || 'slate-900',
            gradient_to: layout.gradient_to || 'slate-700',
            text_color: layout.text_color,
            custom_link: layout.custom_link || '',
            is_active: layout.is_active,
            sort_order: layout.sort_order.toString(),
        });
        
        // Set the selected cover image for edit form
        if (layout.cover_image) {
            setSelectedEditCoverImage(layout.cover_image);
        } else {
            setSelectedEditCoverImage(null);
        }
        
        setIsEditModalOpen(true);
    };

    const handleToggleLayout = (layoutId: string) => {
        router.post(`/admin/homepage-layout/${layoutId}/toggle`, {}, {
            onSuccess: () => {
                // Success feedback handled by backend redirect
            },
        });
    };

    // Handle cover image selection for add form
    const handleCoverImageSelection = (image: any) => {
        setSelectedCoverImage(image);
        setNewLayout('cover_image_id', image.id);
    };

    // Handle cover image selection for edit form
    const handleEditCoverImageSelection = (image: any) => {
        setSelectedEditCoverImage(image);
        setEditLayout('cover_image_id', image.id);
    };

    // Remove selected cover image from add form
    const removeCoverImage = () => {
        setSelectedCoverImage(null);
        setNewLayout('cover_image_id', '');
    };

    // Remove selected cover image from edit form
    const removeEditCoverImage = () => {
        setSelectedEditCoverImage(null);
        setEditLayout('cover_image_id', '');
    };

    const handleDeleteLayout = (layoutId: string) => {
        if (confirm('Are you sure you want to delete this layout? This will affect your homepage.')) {
            router.delete(`/admin/homepage-layout/${layoutId}`, {
                onSuccess: () => {
                    // Reload the page to refresh layout data
                    window.location.reload();
                },
            });
        }
    };

    const getPositionBadgeColor = (position: string) => {
        switch (position) {
            case 'hero': return 'bg-purple-100 text-purple-800';
            case 'main_right_top': return 'bg-blue-100 text-blue-800';
            case 'main_right_bottom': return 'bg-green-100 text-green-800';
            case 'secondary_left': return 'bg-orange-100 text-orange-800';
            case 'secondary_center': return 'bg-red-100 text-red-800';
            case 'secondary_right': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getGradientPreview = (from?: string, to?: string) => {
        if (!from || !to) return 'bg-gray-600';
        return `bg-gradient-to-br from-${from} to-${to}`;
    };

    const getLayoutBackground = (layout: HomepageLayout) => {
        // Priority 1: Always try to show cover image if available (regardless of use_custom_cover setting)
        if (layout.cover_image) {
            return {
                backgroundImage: `url(${layout.cover_image.url || `/storage/${layout.cover_image.path}`})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        }

        // Priority 2: Fallback to gradient if no cover image
        if (layout.gradient_from && layout.gradient_to) {
            return {
                background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`
            };
        }

        // Priority 3: Default fallback
        return { backgroundColor: '#4B5563' };
    };

    const getLayoutBackgroundClass = (layout: HomepageLayout) => {
        // Priority 1: If cover image exists, return empty class (background will be set via inline style)
        if (layout.cover_image) {
            return '';
        }

        // Priority 2: Use gradient class if no cover image
        if (layout.gradient_from && layout.gradient_to) {
            return `bg-gradient-to-br from-${layout.gradient_from} to-${layout.gradient_to}`;
        }

        // Priority 3: Default gray background
        return 'bg-gray-600';
    };

    return (
        <AdminLayout>
            <Head title="Homepage Layout - GNOSIS Admin" />

            <PageHeader
                title="Homepage Layout"
                description="Manage your homepage grid sections and category placements"
            >
                {/* Add Layout Modal */}
                            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                                setIsAddModalOpen(open);
                                if (!open) {
                                    setSelectedCoverImage(null);
                                }
                            }}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Layout
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add Homepage Layout</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Create a new grid section for your homepage
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleAddLayout} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Grid Position */}
                                <div className="space-y-2">
                                    <Label htmlFor="add-grid_position" className="text-gray-300">Grid Position</Label>
                                    <Select value={newLayout.grid_position} onValueChange={(value) => setNewLayout('grid_position', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            {Object.entries(gridPositions).map(([value, label]) => (
                                                <SelectItem key={value} value={value} className="text-white hover:bg-gray-600">
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {addErrors.grid_position && <p className="text-red-400 text-sm">{addErrors.grid_position}</p>}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="add-category_id" className="text-gray-300">Category</Label>
                                    <Select value={newLayout.category_id} onValueChange={(value) => setNewLayout('category_id', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            <SelectItem value="none" className="text-white hover:bg-gray-600">No Category</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id} className="text-white hover:bg-gray-600">
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Layout Type */}
                            <div className="space-y-2">
                                <Label htmlFor="add-layout_type" className="text-gray-300">Layout Type</Label>
                                <Select value={newLayout.layout_type} onValueChange={(value) => setNewLayout('layout_type', value)}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Select layout type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600">
                                        {Object.entries(layoutTypes).map(([key, label]) => (
                                            <SelectItem key={key} value={key} className="text-white hover:bg-gray-600">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Custom Cover Image */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="add-use_custom_cover"
                                        checked={newLayout.use_custom_cover}
                                        onChange={(e) => setNewLayout('use_custom_cover', e.target.checked)}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="add-use_custom_cover" className="text-gray-300">Use custom cover image</Label>
                                </div>
                                {newLayout.use_custom_cover && (
                                    <div className="space-y-3">
                                        <ImagePicker
                                            onSelect={handleCoverImageSelection}
                                            selectedImages={selectedCoverImage ? [selectedCoverImage] : []}
                                            maxSelection={1}
                                            title="Select Cover Image"
                                        />
                                        
                                        {selectedCoverImage && (
                                            <div className="p-3 bg-gray-700 rounded border border-gray-600">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={selectedCoverImage.url || (selectedCoverImage.path ? `/storage/${selectedCoverImage.path}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yNCAyMEMyNS42NTY5IDIwIDI3IDIxLjM0MzEgMjcgMjNDMjcgMjQuNjU2OSAyNS42NTY5IDI2IDI0IDI2QzIyLjM0MzEgMjYgMjEgMjQuNjU2OSAyMSAyM0MyMSAyMS4zNDMxIDIyLjM0MzEgMjAgMjQgMjBaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=')}
                                                            alt={selectedCoverImage.original_name || 'Selected image'}
                                                            className="w-12 h-12 object-cover rounded border border-gray-500"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yNCAyMEMyNS42NTY5IDIwIDI3IDIxLjM0MzEgMjcgMjNDMjcgMjQuNjU2OSAyNS42NTY5IDI2IDI0IDI2QzIyLjM0MzEgMjYgMjEgMjQuNjU2OSAyMSAyM0MyMSAyMS4zNDMxIDIyLjM0MzEgMjAgMjQgMjBaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{selectedCoverImage.original_name}</p>
                                                            <p className="text-gray-400 text-xs">{selectedCoverImage.formatted_size}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={removeCoverImage}
                                                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        
                                    </div>
                                )}
                                {!newLayout.use_custom_cover && newLayout.category_id !== 'none' && (
                                    <div className="p-4 bg-gray-100 rounded border">
                                        <p className="text-sm text-gray-600">Will use category image as cover</p>
                                    </div>
                                )}
                            </div>

                            {/* Slider Speed (only for slider layout) */}
                            {newLayout.layout_type === 'slider' && (
                                <div className="space-y-2">
                                    <Label htmlFor="add-slider_speed" className="text-gray-300">Slider Speed (ms)</Label>
                                    <Input
                                        id="add-slider_speed"
                                        type="number"
                                        value={newLayout.slider_speed}
                                        onChange={(e) => setNewLayout('slider_speed', parseInt(e.target.value))}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="5000"
                                        min="1000"
                                        max="10000"
                                    />
                                    <p className="text-xs text-gray-400">Time between slides in milliseconds</p>
                                </div>
                            )}

                            {/* Section Name */}
                            <div className="space-y-2">
                                <Label htmlFor="add-section_name" className="text-gray-300">Section Name</Label>
                                <Input
                                    id="add-section_name"
                                    value={newLayout.section_name}
                                    onChange={(e) => setNewLayout('section_name', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    placeholder="e.g., Summer Collection"
                                    required
                                />
                                {addErrors.section_name && <p className="text-red-400 text-sm">{addErrors.section_name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="add-title" className="text-gray-300">Title</Label>
                                    <Input
                                        id="add-title"
                                        value={newLayout.title}
                                        onChange={(e) => setNewLayout('title', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="SUMMER BOY"
                                        required
                                    />
                                    {addErrors.title && <p className="text-red-400 text-sm">{addErrors.title}</p>}
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-2">
                                    <Label htmlFor="add-subtitle" className="text-gray-300">Subtitle</Label>
                                    <Input
                                        id="add-subtitle"
                                        value={newLayout.subtitle}
                                        onChange={(e) => setNewLayout('subtitle', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="Casual Collection"
                                    />
                                </div>
                            </div>

                            {/* Gradient Colors */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Background Gradient</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {Object.entries(gradients).map(([key, gradient]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => {
                                                setNewLayout('gradient_from', gradient.from);
                                                setNewLayout('gradient_to', gradient.to);
                                            }}
                                            className={`h-12 rounded-lg bg-gradient-to-br from-${gradient.from} to-${gradient.to} border-2 transition-all ${
                                                newLayout.gradient_from === gradient.from && newLayout.gradient_to === gradient.to
                                                    ? 'border-blue-400 scale-105'
                                                    : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                            title={gradient.label}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400">
                                    Selected: from-{newLayout.gradient_from} to-{newLayout.gradient_to}
                                </p>
                            </div>

                            {/* Custom Link */}
                            <div className="space-y-2">
                                <Label htmlFor="add-custom_link" className="text-gray-300">Custom Link (Optional)</Label>
                                <Input
                                    id="add-custom_link"
                                    value={newLayout.custom_link}
                                    onChange={(e) => setNewLayout('custom_link', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    placeholder="https://example.com or leave empty for category link"
                                />
                                <p className="text-xs text-gray-400">
                                    Leave empty to use category link automatically
                                </p>
                            </div>

                            {/* Settings */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="add-is_active"
                                        checked={newLayout.is_active}
                                        onChange={(e) => setNewLayout('is_active', e.target.checked)}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="add-is_active" className="text-gray-300 cursor-pointer">Active</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-sort_order" className="text-gray-300">Sort Order</Label>
                                    <Input
                                        id="add-sort_order"
                                        type="number"
                                        value={newLayout.sort_order}
                                        onChange={(e) => setNewLayout('sort_order', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="0"
                                    />
                                </div>
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
                                    disabled={addProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {addProcessing ? 'Creating...' : 'Create Layout'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {/* Homepage Grid Preview */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Homepage Grid Layout</CardTitle>
                            <CardDescription className="text-gray-400">
                                Visual representation of your homepage sections
                            </CardDescription>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => window.open('/', '_blank')}
                            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview Homepage
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    {/* Grid Layout Preview */}
                    <div className="space-y-6">
                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px]">
                            {/* Hero Section (Left) */}
                            <div className="relative">
                                <div className="absolute top-2 left-2 z-10">
                                    <Badge className="bg-purple-100 text-purple-800 text-xs">Hero</Badge>
                                </div>
                                {(() => {
                                    const heroLayout = layouts.find(l => l.grid_position === 'hero' && l.is_active);
                                    return heroLayout ? (
                                        <div 
                                            className={`w-full h-full rounded-lg ${getLayoutBackgroundClass(heroLayout)} flex items-center justify-center text-white relative`}
                                            style={getLayoutBackground(heroLayout)}
                                        >
                                            {/* Overlay for better text readability when image is used */}
                                            {heroLayout.cover_image && (
                                                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                                            )}
                                            <div className="text-center relative z-10">
                                                <h3 className="font-bold text-lg">
                                                    {heroLayout.title}
                                                </h3>
                                                <p className="text-sm opacity-80">
                                                    {heroLayout.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                                            <p className="text-gray-400 text-center">
                                                No Hero Layout<br />
                                                <span className="text-xs">Click + to add</span>
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Right Side Grid */}
                            <div className="grid grid-rows-2 gap-4">
                                {/* Top Right */}
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-10">
                                        <Badge className="bg-blue-100 text-blue-800 text-xs">Main Right Top</Badge>
                                    </div>
                                    {(() => {
                                        const layout = layouts.find(l => l.grid_position === 'main_right_top' && l.is_active);
                                        return layout ? (
                                            <div 
                                                className={`w-full h-full rounded-lg ${getLayoutBackgroundClass(layout)} flex items-center justify-center text-white relative`}
                                                style={getLayoutBackground(layout)}
                                            >
                                                {/* Overlay for better text readability when image is used */}
                                                {layout.cover_image && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                                                )}
                                                <div className="text-center relative z-10">
                                                    <h4 className="font-medium">
                                                        {layout.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                                                <p className="text-gray-400 text-xs text-center">No Layout</p>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Bottom Right */}
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-10">
                                        <Badge className="bg-green-100 text-green-800 text-xs">Main Right Bottom</Badge>
                                    </div>
                                    {(() => {
                                        const layout = layouts.find(l => l.grid_position === 'main_right_bottom' && l.is_active);
                                        return layout ? (
                                            <div 
                                                className={`w-full h-full rounded-lg ${getLayoutBackgroundClass(layout)} flex items-center justify-center text-white relative`}
                                                style={getLayoutBackground(layout)}
                                            >
                                                {/* Overlay for better text readability when image is used */}
                                                {layout.cover_image && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                                                )}
                                                <div className="text-center relative z-10">
                                                    <h4 className="font-medium">
                                                        {layout.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                                                <p className="text-gray-400 text-xs text-center">No Layout</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Secondary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[200px]">
                            {['secondary_left', 'secondary_center', 'secondary_right'].map((position, index) => {
                                const layout = layouts.find(l => l.grid_position === position && l.is_active);
                                const badges = ['Secondary Left', 'Secondary Center', 'Secondary Right'];
                                const colors = ['bg-orange-100 text-orange-800', 'bg-red-100 text-red-800', 'bg-indigo-100 text-indigo-800'];
                                
                                return (
                                    <div key={position} className="relative">
                                        <div className="absolute top-2 left-2 z-10">
                                            <Badge className={`${colors[index]} text-xs`}>{badges[index]}</Badge>
                                        </div>
                                        {layout ? (
                                            <div 
                                                className={`w-full h-full rounded-lg ${getLayoutBackgroundClass(layout)} flex items-center justify-center text-white relative`}
                                                style={getLayoutBackground(layout)}
                                            >
                                                {/* Overlay for better text readability when image is used */}
                                                {layout.cover_image && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                                                )}
                                                <div className="text-center relative z-10">
                                                    <h4 className="font-medium">{layout.title}</h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                                                <p className="text-gray-400 text-xs text-center">No Layout</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Layouts Management */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Layout Sections</CardTitle>
                            <CardDescription className="text-gray-400">
                                Manage individual grid sections ({layouts.length} layouts)
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    {layouts.length > 0 ? (
                        <div className="space-y-4">
                            {layouts.map((layout) => (
                                <Card key={layout.id} className="bg-gray-700 border-gray-600">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Grid Preview */}
                                                <div 
                                                    className={`w-16 h-16 rounded-lg ${getLayoutBackgroundClass(layout)} flex items-center justify-center text-white text-xs font-medium relative`}
                                                    style={getLayoutBackground(layout)}
                                                >
                                                    {/* Overlay for better icon visibility when image is used */}
                                                    {layout.cover_image && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                                                    )}
                                                    <Grid3X3 className="h-6 w-6 relative z-10" />
                                                </div>

                                                {/* Layout Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-medium text-white">{layout.title}</h3>
                                                        <Badge className={getPositionBadgeColor(layout.grid_position)}>
                                                            {gridPositions[layout.grid_position]}
                                                        </Badge>
                                                        {layout.is_active ? (
                                                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                                                        ) : (
                                                            <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                        <span>Section: {layout.section_name}</span>
                                                        {layout.category && (
                                                            <span>Category: {layout.category.name}</span>
                                                        )}
                                                        <span>Order: {layout.sort_order}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleLayout(layout.id)}
                                                    className="text-gray-300 hover:text-white hover:bg-gray-600"
                                                >
                                                    {layout.is_active ? (
                                                        <ToggleRight className="h-4 w-4 text-green-400" />
                                                    ) : (
                                                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditModal(layout)}
                                                    className="text-gray-300 hover:text-white hover:bg-gray-600"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteLayout(layout.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12 px-4">
                            <Grid3X3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No layouts configured</h3>
                            <p className="text-gray-400 mb-6">
                                Create your first homepage layout to get started
                            </p>
                            <Button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Layout
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Layout Modal */}
            {editingLayout && (
                <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                    setIsEditModalOpen(open);
                    if (!open) {
                        setSelectedEditCoverImage(null);
                    }
                }}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white">Edit Homepage Layout</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Update the grid section configuration
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleEditLayout} className="space-y-4">
                            {/* Same form fields as add modal but with editLayout data */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Grid Position */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Grid Position</Label>
                                    <Select value={editLayout.grid_position} onValueChange={(value) => setEditLayout('grid_position', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            {Object.entries(gridPositions).map(([value, label]) => (
                                                <SelectItem key={value} value={value} className="text-white hover:bg-gray-600">
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Category</Label>
                                    <Select value={editLayout.category_id} onValueChange={(value) => setEditLayout('category_id', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            <SelectItem value="none" className="text-white hover:bg-gray-600">No Category</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id} className="text-white hover:bg-gray-600">
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Layout Type */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Layout Type</Label>
                                <Select value={editLayout.layout_type} onValueChange={(value) => setEditLayout('layout_type', value)}>
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600">
                                        {Object.entries(layoutTypes).map(([key, label]) => (
                                            <SelectItem key={key} value={key} className="text-white hover:bg-gray-600">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Custom Cover Image */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={editLayout.use_custom_cover}
                                        onChange={(e) => setEditLayout('use_custom_cover', e.target.checked)}
                                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label className="text-gray-300">Use custom cover image</Label>
                                </div>
                                {editLayout.use_custom_cover && (
                                    <div className="space-y-3">
                                        <ImagePicker
                                            onSelect={handleEditCoverImageSelection}
                                            selectedImages={selectedEditCoverImage ? [selectedEditCoverImage] : []}
                                            maxSelection={1}
                                            title="Select Cover Image"
                                        />
                                        
                                        {selectedEditCoverImage && (
                                            <div className="p-3 bg-gray-700 rounded border border-gray-600">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={selectedEditCoverImage.url || (selectedEditCoverImage.path ? `/storage/${selectedEditCoverImage.path}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yNCAyMEMyNS42NTY5IDIwIDI3IDIxLjM0MzEgMjcgMjNDMjcgMjQuNjU2OSAyNS42NTY5IDI2IDI0IDI2QzIyLjM0MzEgMjYgMjEgMjQuNjU2OSAyMSAyM0MyMSAyMS4zNDMxIDIyLjM0MzEgMjAgMjQgMjBaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=')}
                                                            alt={selectedEditCoverImage.original_name || 'Selected image'}
                                                            className="w-12 h-12 object-cover rounded border border-gray-500"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yNCAyMEMyNS42NTY5IDIwIDI3IDIxLjM0MzEgMjcgMjNDMjcgMjQuNjU2OSAyNS42NTY5IDI2IDI0IDI2QzIyLjM0MzEgMjYgMjEgMjQuNjU2OSAyMSAyM0MyMSAyMS4zNDMxIDIyLjM0MzEgMjAgMjQgMjBaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{selectedEditCoverImage.original_name}</p>
                                                            <p className="text-gray-400 text-xs">{selectedEditCoverImage.formatted_size}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={removeEditCoverImage}
                                                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {!editLayout.use_custom_cover && editLayout.category_id !== 'none' && (
                                    <div className="p-4 bg-gray-100 rounded border">
                                        <p className="text-sm text-gray-600">Will use category image as cover</p>
                                    </div>
                                )}
                            </div>

                            {/* Slider Speed (only for slider layout) */}
                            {editLayout.layout_type === 'slider' && (
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Slider Speed (ms)</Label>
                                    <Input
                                        type="number"
                                        value={editLayout.slider_speed}
                                        onChange={(e) => setEditLayout('slider_speed', parseInt(e.target.value))}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        placeholder="5000"
                                        min="1000"
                                        max="10000"
                                    />
                                    <p className="text-xs text-gray-400">Time between slides in milliseconds</p>
                                </div>
                            )}

                            {/* Title and Subtitle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Title</Label>
                                    <Input
                                        value={editLayout.title}
                                        onChange={(e) => setEditLayout('title', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Subtitle</Label>
                                    <Input
                                        value={editLayout.subtitle}
                                        onChange={(e) => setEditLayout('subtitle', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={editProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {editProcessing ? 'Updating...' : 'Update Layout'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AdminLayout>
    );
}
