import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Grid3X3, List } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ShopPageProps } from '@/types';

const Shop: React.FC<ShopPageProps> = ({ 
    products = [], 
    categories = [], 
    filters = [], 
    sort_options = [],
    current_filters = {},
    current_sort = 'newest',
    pagination,
    settings
}) => {
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

    const isDarkTheme = settings?.theme === 'dark';
    const siteName = settings?.site_name || 'GNOSIS';

    return (
        <MainLayout title={`Shop - ${siteName}`} settings={settings}>
            <Head title="Shop" />

            {/* Mobile Compact Controls */}
            <section className={`border-b ${isDarkTheme ? 'bg-black border-gray-800' : 'bg-white'} sticky top-16 z-40 lg:hidden`}>
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
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

            {/* Desktop Controls */}
            <section className={`border-b ${isDarkTheme ? 'bg-black border-gray-800' : 'bg-white'} sticky top-16 z-40 hidden lg:block`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-row items-center justify-end gap-4">
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

            {/* Main Content */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {/* Product Grid */}
                    <main className="w-full">
                            {/* Results Info */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-gray-600">
                                    Showing {products.length} products
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
                                            settings={settings}
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
                                        Try adjusting your search criteria
                                    </p>
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
            </section>

        </MainLayout>
    );
};

export default Shop;
