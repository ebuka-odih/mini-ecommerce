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
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isSortOpen, setIsSortOpen] = React.useState(false);

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
        setIsSearchOpen(false); // Close mobile search modal
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

            {/* Mobile Compact Controls */}
            <section className="border-b bg-white sticky top-16 z-40 lg:hidden">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* Mobile Filter Button */}
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    {activeFilterCount > 0 && (
                                        <Badge className="bg-black text-white text-xs">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 bg-white border-0 shadow-lg">
                                <SheetHeader className="pb-2">
                                    <SheetTitle className="text-lg font-semibold text-gray-900">Filters</SheetTitle>
                                </SheetHeader>
                                {/* Mobile filters content will go here */}
                                <div className="mt-4">
                                    <p className="text-gray-500 text-sm">Filter options coming soon...</p>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Mobile Search Icon */}
                        <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="h-auto bg-white border-0 shadow-lg">
                                <SheetHeader className="pb-2">
                                    <SheetTitle className="text-lg font-semibold text-gray-900">Search Products</SheetTitle>
                                </SheetHeader>
                                <form onSubmit={handleSearch} className="mt-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            type="search"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 w-full h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button 
                                            type="submit" 
                                            className="flex-1 h-10 bg-black hover:bg-gray-800 text-white rounded-lg font-medium"
                                        >
                                            Search
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setIsSearchOpen(false)}
                                            className="px-6 h-10 border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg font-medium"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </SheetContent>
                        </Sheet>

                        {/* Mobile Sort Icon */}
                        <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <span className="text-sm">Sort</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="h-auto bg-white border-0 shadow-lg">
                                <SheetHeader className="pb-2">
                                    <SheetTitle className="text-lg font-semibold text-gray-900">Sort Products</SheetTitle>
                                </SheetHeader>
                                <div className="mt-2 space-y-1">
                                    <Button
                                        variant={current_sort === 'newest' ? 'default' : 'ghost'}
                                        className={`w-full justify-start h-10 rounded-lg font-medium ${
                                            current_sort === 'newest' 
                                                ? 'bg-black hover:bg-gray-800 text-white' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                        onClick={() => {
                                            handleSortChange('newest');
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Newest
                                    </Button>
                                    <Button
                                        variant={current_sort === 'featured' ? 'default' : 'ghost'}
                                        className={`w-full justify-start h-10 rounded-lg font-medium ${
                                            current_sort === 'featured' 
                                                ? 'bg-black hover:bg-gray-800 text-white' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                        onClick={() => {
                                            handleSortChange('featured');
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Featured
                                    </Button>
                                    <Button
                                        variant={current_sort === 'price_low_high' ? 'default' : 'ghost'}
                                        className={`w-full justify-start h-10 rounded-lg font-medium ${
                                            current_sort === 'price_low_high' 
                                                ? 'bg-black hover:bg-gray-800 text-white' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                        onClick={() => {
                                            handleSortChange('price_low_high');
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Price: Low to High
                                    </Button>
                                    <Button
                                        variant={current_sort === 'price_high_low' ? 'default' : 'ghost'}
                                        className={`w-full justify-start h-10 rounded-lg font-medium ${
                                            current_sort === 'price_high_low' 
                                                ? 'bg-black hover:bg-gray-800 text-white' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                        onClick={() => {
                                            handleSortChange('price_high_low');
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Price: High to Low
                                    </Button>
                                    <Button
                                        variant={current_sort === 'name_a_z' ? 'default' : 'ghost'}
                                        className={`w-full justify-start h-10 rounded-lg font-medium ${
                                            current_sort === 'name_a_z' 
                                                ? 'bg-black hover:bg-gray-800 text-white' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                        onClick={() => {
                                            handleSortChange('name_a_z');
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Name: A to Z
                                    </Button>
                                    <Button
                                        variant={current_sort === 'name_z_a' ? 'default' : 'ghost'}
                                        className={`w-full justify-start h-10 rounded-lg font-medium ${
                                            current_sort === 'name_z_a' 
                                                ? 'bg-black hover:bg-gray-800 text-white' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                        onClick={() => {
                                            handleSortChange('name_z_a');
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Name: Z to A
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

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
            </section>

            {/* Desktop Filters & Controls */}
            <section className="border-b bg-white sticky top-16 z-40 hidden lg:block">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-row items-center justify-between gap-4">
                        {/* Left Side - Search & Filters */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-none">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                            </form>

                            {/* Active Filters */}
                            {activeFilterCount > 0 && (
                                <div className="flex items-center gap-2">
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
                                <span className="text-sm text-gray-600">Sort by:</span>
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
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
