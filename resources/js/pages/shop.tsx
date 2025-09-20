import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Grid3X3, List, SlidersHorizontal, Search, X } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShopPageProps } from '@/types';

const Shop: React.FC<ShopPageProps> = ({ 
    products = [], 
    categories = [], 
    filters = [], 
    sort_options = [],
    current_filters = {},
    current_sort = 'newest',
    pagination
}) => {
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const handleSortChange = (value: string) => {
        router.get('/shop', { 
            ...current_filters, 
            sort: value,
            search: searchQuery || undefined 
        }, { 
            preserveState: true, 
            preserveScroll: true 
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/shop', { 
            ...current_filters, 
            search: searchQuery || undefined,
            sort: current_sort 
        }, { 
            preserveState: true 
        });
    };

    const handleFilterChange = (filterType: string, value: string) => {
        const currentValues = current_filters[filterType] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        router.get('/shop', {
            ...current_filters,
            [filterType]: newValues.length > 0 ? newValues : undefined,
            sort: current_sort,
            search: searchQuery || undefined
        }, { 
            preserveState: true, 
            preserveScroll: true 
        });
    };

    const clearFilters = () => {
        router.get('/shop', { 
            search: searchQuery || undefined 
        });
    };

    const activeFilterCount = Object.values(current_filters).flat().length;

    return (
        <MainLayout title="Shop - GNOSIS">
            <Head title="Shop" />
            
            {/* Hero Section */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-light tracking-wider mb-4">
                            SHOP COLLECTION
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our carefully curated collection of premium fashion pieces
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters & Controls */}
            <section className="border-b bg-white sticky top-16 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left Side - Search & Filters */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Filter Button */}
                            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="lg:hidden">
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                        {activeFilterCount > 0 && (
                                            <Badge className="ml-2 bg-black text-white">
                                                {activeFilterCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 bg-white">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    {/* Mobile filters content will go here */}
                                    <div className="mt-6">
                                        <p className="text-gray-500">Filter options coming soon...</p>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1 lg:flex-none">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-full lg:w-64"
                                    />
                                </div>
                            </form>

                            {/* Active Filters */}
                            {activeFilterCount > 0 && (
                                <div className="hidden lg:flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Filters:</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Clear All
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Sort & View */}
                        <div className="flex items-center gap-4">
                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                                <Select value={current_sort} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="featured">Featured</SelectItem>
                                        <SelectItem value="price_low_high">Price: Low to High</SelectItem>
                                        <SelectItem value="price_high_low">Price: High to Low</SelectItem>
                                        <SelectItem value="name_a_z">Name: A to Z</SelectItem>
                                        <SelectItem value="name_z_a">Name: Z to A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* View Mode */}
                            <div className="flex items-center bg-gray-100 rounded-md p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="p-2"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="p-2"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex gap-8">
                        {/* Desktop Sidebar Filters */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-lg">Filters</h3>
                                    {activeFilterCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>

                                {/* Categories Filter */}
                                <div className="mb-8">
                                    <h4 className="font-medium mb-4">Categories</h4>
                                    <div className="space-y-3">
                                        {categories.map((category) => (
                                            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={current_filters.category?.includes(category.slug) || false}
                                                    onChange={() => handleFilterChange('category', category.slug)}
                                                    className="rounded border-gray-300 text-black focus:ring-black"
                                                />
                                                <span className="text-sm text-gray-700 hover:text-black">
                                                    {category.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Price Range Filter */}
                                <div className="mb-8">
                                    <h4 className="font-medium mb-4">Price Range</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Under $50', value: '0-50' },
                                            { label: '$50 - $100', value: '50-100' },
                                            { label: '$100 - $200', value: '100-200' },
                                            { label: '$200 - $500', value: '200-500' },
                                            { label: 'Over $500', value: '500-999999' },
                                        ].map((range) => (
                                            <label key={range.value} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={current_filters.price?.includes(range.value) || false}
                                                    onChange={() => handleFilterChange('price', range.value)}
                                                    className="rounded border-gray-300 text-black focus:ring-black"
                                                />
                                                <span className="text-sm text-gray-700 hover:text-black">
                                                    {range.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Size Filter */}
                                <div className="mb-8">
                                    <h4 className="font-medium mb-4">Size</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                            <Button
                                                key={size}
                                                variant={current_filters.size?.includes(size) ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handleFilterChange('size', size)}
                                                className="h-8 text-xs"
                                            >
                                                {size}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <main className="flex-1">
                            {/* Results Info */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-gray-600">
                                    Showing {products.length} products
                                    {Object.keys(current_filters).length > 0 && ' (filtered)'}
                                </p>
                            </div>

                            {/* Products Grid */}
                            {products.length > 0 ? (
                                <div className={
                                    viewMode === 'grid' 
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                        : 'flex flex-col gap-4'
                                }>
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            className={viewMode === 'list' ? 'flex flex-row' : ''}
                                        />
                                    ))}
                                </div>
                            ) : (
                                /* Empty State */
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Search className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Try adjusting your search or filter criteria
                                    </p>
                                    <Button onClick={clearFilters} variant="outline">
                                        Clear all filters
                                    </Button>
                                </div>
                            )}

                            {/* Pagination Placeholder */}
                            {pagination && pagination.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" disabled={pagination.current_page === 1}>
                                            Previous
                                        </Button>
                                        <span className="px-4 py-2 text-sm text-gray-600">
                                            Page {pagination.current_page} of {pagination.last_page}
                                        </span>
                                        <Button variant="outline" size="sm" disabled={pagination.current_page === pagination.last_page}>
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </section>

            {/* Category Showcase Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-light tracking-wider mb-4">
                            SHOP BY CATEGORY
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore our collections designed for every style and occasion
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Sunglasses', slug: 'sunglasses', color: 'from-slate-800 to-slate-600' },
                            { name: 'Shorts', slug: 'shorts', color: 'from-blue-600 to-indigo-700' },
                            { name: 'Casual Wear', slug: 'casual', color: 'from-amber-600 to-orange-700' },
                            { name: 'Dresses', slug: 'dresses', color: 'from-rose-600 to-pink-700' }
                        ].map((category) => (
                            <Link
                                key={category.slug}
                                href={`/shop?category=${category.slug}`}
                                className="group"
                            >
                                <div className={`relative h-64 rounded-xl bg-gradient-to-br ${category.color} overflow-hidden transition-all duration-500 hover:scale-[1.02] fashion-shadow`}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                                    
                                    {/* Category placeholder */}
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center text-white/80 z-20 relative">
                                            <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                            </div>
                                            <p className="text-sm font-light tracking-wider opacity-80">
                                                {category.name.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 left-6 z-30 text-white">
                                        <h3 className="text-lg font-light tracking-wider">
                                            {category.name.toUpperCase()}
                                        </h3>
                                        <p className="text-sm opacity-80 mt-1">Shop Collection</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Shop;
