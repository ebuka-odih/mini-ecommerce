import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Tag, Package } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';
import { Category } from '@/types/fashion';

interface CategoriesPageProps {
    categories: Category[];
    filters: {
        search?: string;
        status?: string;
    };
}

interface CategoryForm {
    name: string;
    description: string;
    is_active: boolean;
}

export default function CategoriesPage({ categories, filters }: CategoriesPageProps) {
    const [searchQuery, setSearchQuery] = React.useState(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

    // Form for adding new category
    const { data: newCategory, setData: setNewCategory, post, processing: addProcessing, errors: addErrors, reset: resetAdd } = useForm<CategoryForm>({
        name: '',
        description: '',
        is_active: true,
    });

    // Form for editing category
    const { data: editCategory, setData: setEditCategory, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm<CategoryForm>({
        name: '',
        description: '',
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/categories', { 
            ...filters, 
            search: searchQuery || undefined 
        }, { 
            preserveState: true 
        });
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/admin/categories', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetAdd();
                alert('Category created successfully!');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                let errorMessage = 'Error creating category:\n\n';
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
        });
    };

    const handleEditCategory = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingCategory) return;

        put(`/admin/categories/${editingCategory.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingCategory(null);
                resetEdit();
                alert('Category updated successfully!');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                let errorMessage = 'Error updating category:\n\n';
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
        });
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setEditCategory({
            name: category.name || '',
            description: category.description || '',
            is_active: category.is_active ?? true,
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteCategory = (categoryId: string) => {
        if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            router.delete(`/admin/categories/${categoryId}`, {
                onSuccess: () => {
                    alert('Category deleted successfully!');
                },
                onError: () => {
                    alert('Error deleting category. It may be in use by products.');
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Categories - GNOSIS Admin" />

            <PageHeader
                title="Categories"
                description="Manage your product categories and organize your inventory"
            >
                {/* Add Category Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add New Category</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Create a new category to organize your products
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            {/* Category Name */}
                            <div className="space-y-2">
                                <Label htmlFor="add-name" className="text-gray-300">Category Name</Label>
                                <Input
                                    id="add-name"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory('name', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    placeholder="Enter category name"
                                    required
                                />
                                {addErrors.name && <p className="text-red-400 text-sm">{addErrors.name}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="add-description" className="text-gray-300">Description</Label>
                                <Textarea
                                    id="add-description"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory('description', e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                                    placeholder="Category description (optional)"
                                />
                                {addErrors.description && <p className="text-red-400 text-sm">{addErrors.description}</p>}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="add-is_active"
                                    checked={newCategory.is_active}
                                    onChange={(e) => setNewCategory('is_active', e.target.checked)}
                                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor="add-is_active" className="text-gray-300 cursor-pointer">
                                    Active (visible to customers)
                                </Label>
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
                                    {addProcessing ? 'Creating...' : 'Create Category'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {/* Edit Category Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Category</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Update category details
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleEditCategory} className="space-y-4">
                        {/* Category Name */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-gray-300">Category Name</Label>
                            <Input
                                id="edit-name"
                                value={editCategory.name}
                                onChange={(e) => setEditCategory('name', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                placeholder="Enter category name"
                                required
                            />
                            {editErrors.name && <p className="text-red-400 text-sm">{editErrors.name}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-description" className="text-gray-300">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={editCategory.description}
                                onChange={(e) => setEditCategory('description', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                                placeholder="Category description (optional)"
                            />
                            {editErrors.description && <p className="text-red-400 text-sm">{editErrors.description}</p>}
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="edit-is_active"
                                checked={editCategory.is_active}
                                onChange={(e) => setEditCategory('is_active', e.target.checked)}
                                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="edit-is_active" className="text-gray-300 cursor-pointer">
                                Active (visible to customers)
                            </Label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingCategory(null);
                                }}
                                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={editProcessing}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {editProcessing ? 'Updating...' : 'Update Category'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Search & Filters */}
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 sm:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search categories..."
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
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Categories</CardTitle>
                            <CardDescription className="text-gray-400">
                                Manage your product categories ({categories.length} categories)
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    {categories.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <div className="rounded-md border border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-700 hover:bg-gray-700/50">
                                                <TableHead className="text-gray-300">Category</TableHead>
                                                <TableHead className="text-gray-300">Products</TableHead>
                                                <TableHead className="text-gray-300">Status</TableHead>
                                                <TableHead className="text-gray-300">Created</TableHead>
                                                <TableHead className="text-gray-300 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map((category) => (
                                                <TableRow key={category.id} className="border-gray-700 hover:bg-gray-700/30">
                                                    {/* Category Info */}
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                                                <Tag className="h-5 w-5 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-white">{category.name}</p>
                                                                <p className="text-sm text-gray-400 truncate max-w-[200px]">
                                                                    {category.description || 'No description'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Products Count */}
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Package className="h-4 w-4 text-gray-400" />
                                                            <span className="text-white">{category.products_count || 0}</span>
                                                        </div>
                                                    </TableCell>

                                                    {/* Status */}
                                                    <TableCell>
                                                        <Badge className={category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                            {category.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Created Date */}
                                                    <TableCell>
                                                        <p className="text-gray-300">
                                                            {new Date(category.created_at).toLocaleDateString()}
                                                        </p>
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
                                                                <DropdownMenuItem 
                                                                    onClick={() => openEditModal(category)}
                                                                    className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-gray-700" />
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleDeleteCategory(category.id)}
                                                                    className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4 p-4">
                                {categories.map((category) => (
                                    <Card key={category.id} className="bg-gray-700 border-gray-600">
                                        <CardContent className="p-4">
                                            <div className="space-y-4">
                                                {/* Category Header */}
                                                <div className="flex items-start gap-3">
                                                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Tag className="h-6 w-6 text-blue-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-white truncate">{category.name}</h3>
                                                        <p className="text-sm text-gray-400 line-clamp-2">
                                                            {category.description || 'No description'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Category Details */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Products Count */}
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Products</p>
                                                        <div className="flex items-center gap-2">
                                                            <Package className="h-4 w-4 text-gray-400" />
                                                            <span className="text-white font-medium">{category.products_count || 0}</span>
                                                        </div>
                                                    </div>

                                                    {/* Created Date */}
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Created</p>
                                                        <p className="text-white font-medium">
                                                            {new Date(category.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                                                    <Badge className={category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                        {category.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
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
                                                                <DropdownMenuItem 
                                                                    onClick={() => openEditModal(category)}
                                                                    className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-gray-700" />
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleDeleteCategory(category.id)}
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
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12 px-4">
                            <Tag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No categories found</h3>
                            <p className="text-gray-400 mb-6">
                                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first category'}
                            </p>
                            <Button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Category
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Categories</CardTitle>
                        <Tag className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{categories.length}</div>
                        <p className="text-xs text-gray-400">Active categories</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Active Categories</CardTitle>
                        <Tag className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {categories.filter(c => c.is_active).length}
                        </div>
                        <p className="text-xs text-gray-400">Visible to customers</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {categories.reduce((sum, c) => sum + (c.products_count || 0), 0)}
                        </div>
                        <p className="text-xs text-gray-400">Across all categories</p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
