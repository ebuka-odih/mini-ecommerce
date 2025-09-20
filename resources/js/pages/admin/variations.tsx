import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Plus, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Palette,
    Ruler,
    Package,
    Eye
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';

interface Size {
    id: number;
    name: string;
    display_name: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Color {
    id: number;
    name: string;
    display_name: string;
    hex_code: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface VariationsPageProps {
    sizes: Size[];
    colors: Color[];
    stats?: {
        total_sizes: number;
        total_colors: number;
        active_sizes: number;
        active_colors: number;
    };
}

export default function Variations({ sizes, colors, stats }: VariationsPageProps) {
    const [isSizeModalOpen, setIsSizeModalOpen] = React.useState(false);
    const [isColorModalOpen, setIsColorModalOpen] = React.useState(false);
    const [editingSize, setEditingSize] = React.useState<Size | null>(null);
    const [editingColor, setEditingColor] = React.useState<Color | null>(null);

    const { data: sizeData, setData: setSizeData, post: postSize, put: putSize, delete: deleteSize, processing: sizeProcessing, errors: sizeErrors } = useForm({
        name: '',
        display_name: '',
        sort_order: 0,
        is_active: true,
    });

    const { data: colorData, setData: setColorData, post: postColor, put: putColor, delete: deleteColor, processing: colorProcessing, errors: colorErrors } = useForm({
        name: '',
        display_name: '',
        hex_code: '#000000',
        sort_order: 0,
        is_active: true,
    });

    const handleSizeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSize) {
            putSize(`/admin/variations/sizes/${editingSize.id}`, {
                onSuccess: () => {
                    setIsSizeModalOpen(false);
                    setEditingSize(null);
                    setSizeData({ name: '', display_name: '', sort_order: 0, is_active: true });
                }
            });
        } else {
            postSize('/admin/variations/sizes', {
                onSuccess: () => {
                    setIsSizeModalOpen(false);
                    setSizeData({ name: '', display_name: '', sort_order: 0, is_active: true });
                }
            });
        }
    };

    const handleColorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingColor) {
            putColor(`/admin/variations/colors/${editingColor.id}`, {
                onSuccess: () => {
                    setIsColorModalOpen(false);
                    setEditingColor(null);
                    setColorData({ name: '', display_name: '', hex_code: '#000000', sort_order: 0, is_active: true });
                }
            });
        } else {
            postColor('/admin/variations/colors', {
                onSuccess: () => {
                    setIsColorModalOpen(false);
                    setColorData({ name: '', display_name: '', hex_code: '#000000', sort_order: 0, is_active: true });
                }
            });
        }
    };

    const handleEditSize = (size: Size) => {
        setEditingSize(size);
        setSizeData({
            name: size.name,
            display_name: size.display_name,
            sort_order: size.sort_order,
            is_active: size.is_active,
        });
        setIsSizeModalOpen(true);
    };

    const handleEditColor = (color: Color) => {
        setEditingColor(color);
        setColorData({
            name: color.name,
            display_name: color.display_name,
            hex_code: color.hex_code,
            sort_order: color.sort_order,
            is_active: color.is_active,
        });
        setIsColorModalOpen(true);
    };

    const handleDeleteSize = (sizeId: number) => {
        if (confirm('Are you sure you want to delete this size?')) {
            deleteSize(`/admin/variations/sizes/${sizeId}`);
        }
    };

    const handleDeleteColor = (colorId: number) => {
        if (confirm('Are you sure you want to delete this color?')) {
            deleteColor(`/admin/variations/colors/${colorId}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Product Variations" />

            <PageHeader
                title="Product Variations"
                description="Manage product sizes and colors"
            />

            <div className="space-y-6">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Ruler className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Total Sizes</p>
                                        <p className="text-2xl font-bold text-white">{stats.total_sizes}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Ruler className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Active Sizes</p>
                                        <p className="text-2xl font-bold text-white">{stats.active_sizes}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Palette className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Total Colors</p>
                                        <p className="text-2xl font-bold text-white">{stats.total_colors}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Palette className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Active Colors</p>
                                        <p className="text-2xl font-bold text-white">{stats.active_colors}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sizes Section */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Ruler className="h-5 w-5" />
                                    Sizes
                                </CardTitle>
                                <p className="text-gray-400 text-sm">Manage product sizes</p>
                            </div>
                            <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
                                <DialogTrigger asChild>
                                    <Button 
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => {
                                            setEditingSize(null);
                                            setSizeData({ name: '', display_name: '', sort_order: 0, is_active: true });
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Size
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">
                                            {editingSize ? 'Edit Size' : 'Add New Size'}
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            {editingSize ? 'Update the size information' : 'Create a new product size'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSizeSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="size_name" className="text-gray-300">Size Name</Label>
                                            <Input
                                                id="size_name"
                                                value={sizeData.name}
                                                onChange={(e) => setSizeData('name', e.target.value)}
                                                className="bg-gray-700 border-gray-600 text-white"
                                                placeholder="e.g., XS, S, M, L"
                                                required
                                            />
                                            {sizeErrors.name && <p className="text-red-400 text-sm">{sizeErrors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="size_display_name" className="text-gray-300">Display Name</Label>
                                            <Input
                                                id="size_display_name"
                                                value={sizeData.display_name}
                                                onChange={(e) => setSizeData('display_name', e.target.value)}
                                                className="bg-gray-700 border-gray-600 text-white"
                                                placeholder="e.g., Extra Small, Small, Medium"
                                                required
                                            />
                                            {sizeErrors.display_name && <p className="text-red-400 text-sm">{sizeErrors.display_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="size_sort_order" className="text-gray-300">Sort Order</Label>
                                            <Input
                                                id="size_sort_order"
                                                type="number"
                                                value={sizeData.sort_order}
                                                onChange={(e) => setSizeData('sort_order', parseInt(e.target.value))}
                                                className="bg-gray-700 border-gray-600 text-white"
                                                placeholder="0"
                                            />
                                            {sizeErrors.sort_order && <p className="text-red-400 text-sm">{sizeErrors.sort_order}</p>}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="size_is_active"
                                                checked={sizeData.is_active}
                                                onChange={(e) => setSizeData('is_active', e.target.checked)}
                                                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                            />
                                            <Label htmlFor="size_is_active" className="text-gray-300">Active</Label>
                                        </div>

                                        <DialogFooter>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={() => setIsSizeModalOpen(false)}
                                                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={sizeProcessing}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {sizeProcessing ? 'Saving...' : (editingSize ? 'Update' : 'Create')}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="rounded-md border border-gray-700 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-700 hover:bg-gray-700/50">
                                            <TableHead className="text-gray-300">Name</TableHead>
                                            <TableHead className="text-gray-300">Display Name</TableHead>
                                            <TableHead className="text-gray-300">Sort Order</TableHead>
                                            <TableHead className="text-gray-300">Status</TableHead>
                                            <TableHead className="text-gray-300 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sizes.map((size) => (
                                            <TableRow key={size.id} className="border-gray-700 hover:bg-gray-700/30">
                                                <TableCell className="text-white font-medium">{size.name}</TableCell>
                                                <TableCell className="text-gray-300">{size.display_name}</TableCell>
                                                <TableCell className="text-gray-300">{size.sort_order}</TableCell>
                                                <TableCell>
                                                    <Badge className={size.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                        {size.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                            <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-gray-700" />
                                                            <DropdownMenuItem 
                                                                onClick={() => handleEditSize(size)}
                                                                className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDeleteSize(size.id)}
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
                        </CardContent>
                    </Card>

                    {/* Colors Section */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Colors
                                </CardTitle>
                                <p className="text-gray-400 text-sm">Manage product colors</p>
                            </div>
                            <Dialog open={isColorModalOpen} onOpenChange={setIsColorModalOpen}>
                                <DialogTrigger asChild>
                                    <Button 
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                        onClick={() => {
                                            setEditingColor(null);
                                            setColorData({ name: '', display_name: '', hex_code: '#000000', sort_order: 0, is_active: true });
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Color
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">
                                            {editingColor ? 'Edit Color' : 'Add New Color'}
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            {editingColor ? 'Update the color information' : 'Create a new product color'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleColorSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="color_name" className="text-gray-300">Color Name</Label>
                                            <Input
                                                id="color_name"
                                                value={colorData.name}
                                                onChange={(e) => setColorData('name', e.target.value)}
                                                className="bg-gray-700 border-gray-600 text-white"
                                                placeholder="e.g., red, blue, green"
                                                required
                                            />
                                            {colorErrors.name && <p className="text-red-400 text-sm">{colorErrors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="color_display_name" className="text-gray-300">Display Name</Label>
                                            <Input
                                                id="color_display_name"
                                                value={colorData.display_name}
                                                onChange={(e) => setColorData('display_name', e.target.value)}
                                                className="bg-gray-700 border-gray-600 text-white"
                                                placeholder="e.g., Red, Blue, Green"
                                                required
                                            />
                                            {colorErrors.display_name && <p className="text-red-400 text-sm">{colorErrors.display_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="color_hex_code" className="text-gray-300">Hex Code</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="color_hex_code"
                                                    type="color"
                                                    value={colorData.hex_code}
                                                    onChange={(e) => setColorData('hex_code', e.target.value)}
                                                    className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                                                />
                                                <Input
                                                    value={colorData.hex_code}
                                                    onChange={(e) => setColorData('hex_code', e.target.value)}
                                                    className="bg-gray-700 border-gray-600 text-white"
                                                    placeholder="#000000"
                                                    required
                                                />
                                            </div>
                                            {colorErrors.hex_code && <p className="text-red-400 text-sm">{colorErrors.hex_code}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="color_sort_order" className="text-gray-300">Sort Order</Label>
                                            <Input
                                                id="color_sort_order"
                                                type="number"
                                                value={colorData.sort_order}
                                                onChange={(e) => setColorData('sort_order', parseInt(e.target.value))}
                                                className="bg-gray-700 border-gray-600 text-white"
                                                placeholder="0"
                                            />
                                            {colorErrors.sort_order && <p className="text-red-400 text-sm">{colorErrors.sort_order}</p>}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="color_is_active"
                                                checked={colorData.is_active}
                                                onChange={(e) => setColorData('is_active', e.target.checked)}
                                                className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                                            />
                                            <Label htmlFor="color_is_active" className="text-gray-300">Active</Label>
                                        </div>

                                        <DialogFooter>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={() => setIsColorModalOpen(false)}
                                                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={colorProcessing}
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                                {colorProcessing ? 'Saving...' : (editingColor ? 'Update' : 'Create')}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="rounded-md border border-gray-700 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-700 hover:bg-gray-700/50">
                                            <TableHead className="text-gray-300">Color</TableHead>
                                            <TableHead className="text-gray-300">Name</TableHead>
                                            <TableHead className="text-gray-300">Display Name</TableHead>
                                            <TableHead className="text-gray-300">Sort Order</TableHead>
                                            <TableHead className="text-gray-300">Status</TableHead>
                                            <TableHead className="text-gray-300 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {colors.map((color) => (
                                            <TableRow key={color.id} className="border-gray-700 hover:bg-gray-700/30">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            className="w-6 h-6 rounded-full border border-gray-400" 
                                                            style={{ backgroundColor: color.hex_code }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white font-medium">{color.name}</TableCell>
                                                <TableCell className="text-gray-300">{color.display_name}</TableCell>
                                                <TableCell className="text-gray-300">{color.sort_order}</TableCell>
                                                <TableCell>
                                                    <Badge className={color.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                        {color.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                                            <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-gray-700" />
                                                            <DropdownMenuItem 
                                                                onClick={() => handleEditColor(color)}
                                                                className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDeleteColor(color.id)}
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
