import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
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

    const isDarkTheme = settings?.theme === 'dark';
    const siteName = settings?.site_name || 'GNOSIS';


    return (
        <MainLayout title={`Shop - ${siteName}`} settings={settings}>
            <Head title="Shop" />
            
            {/* Hero Section - Hidden for now */}
            {/* <section className={`${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className={`text-4xl lg:text-5xl font-light tracking-wider mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            SHOP COLLECTION
                        </h1>
                        <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                            Discover our carefully curated collection of premium fashion pieces
                        </p>
                    </div>
                </div>
            </section> */}



            {/* Main Content */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {/* Product Grid */}
                    <div className="w-full">

                            {/* Products Grid */}
                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
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
                                        Check back later for new products
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
                    </div>
                </div>
            </section>

        </MainLayout>
    );
};

export default Shop;
