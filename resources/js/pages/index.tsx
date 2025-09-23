import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomepageLayout {
    id: string;
    title: string;
    description: string | null;
    grid_position: string;
    category_id: string | null;
    category?: {
        name: string;
        slug: string;
    };
    cover_image?: {
        id: string;
        url: string;
        path: string;
    };
    use_custom_cover: boolean;
    cover_image_url: string | null;
    cover_image_url_computed?: string;
    gradient_from: string | null;
    gradient_to: string | null;
    is_active: boolean;
    sort_order: number;
}

interface FeaturedProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    final_price: number;
    discount_percentage: number;
    is_on_sale: boolean;
    category: {
        name: string;
        slug: string;
    };
    images_data: Array<{
        id: string;
        url: string;
        path: string;
        sort_order: number;
    }>;
}

interface HomePageProps {
    products: any[];
    featuredProducts: FeaturedProduct[];
    homepageLayouts: HomepageLayout[];
}

const Index: React.FC<HomePageProps> = ({ products = [], featuredProducts = [], homepageLayouts = [] }) => {
    // Hero slider state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        if (featuredProducts.length === 0) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => {
                const currentProduct = featuredProducts[currentSlide];
                if (currentProduct && currentProduct.images_data.length > 1) {
                    return (prev + 1) % currentProduct.images_data.length;
                }
                return prev;
            });
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [currentSlide, featuredProducts]);

    // Auto-advance to next product
    useEffect(() => {
        if (featuredProducts.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
            setCurrentImageIndex(0); // Reset to first image when changing products
        }, 6000); // Change product every 6 seconds

        return () => clearInterval(interval);
    }, [featuredProducts]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
        setCurrentImageIndex(0);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
        setCurrentImageIndex(0);
    };

    // Helper function to get layout background
    const getLayoutBackground = (layout: HomepageLayout) => {
        // Priority 1: Cover image if available (use computed URL or relationship)
        const coverImageUrl = layout.cover_image_url_computed || 
                              layout.cover_image_url ||
                              (layout.cover_image ? layout.cover_image.url : null) ||
                              (layout.cover_image ? `/storage/${layout.cover_image.path}` : null);
        
        
        if (coverImageUrl && coverImageUrl !== '/images/default-layout-cover.jpg') {
            return {
                backgroundImage: `url(${coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '400px' // Ensure minimum height for visibility
            };
        }

        // Priority 2: Gradient if no cover image
        if (layout.gradient_from && layout.gradient_to) {
            // Convert Tailwind color names to CSS colors
            const getColorValue = (color: string) => {
                const colorMap: { [key: string]: string } = {
                    'slate-900': '#0f172a',
                    'slate-700': '#334155',
                    'rose-600': '#dc2626',
                    'pink-700': '#be185d'
                };
                return colorMap[color] || '#6b7280';
            };
            
            return {
                background: `linear-gradient(to bottom right, ${getColorValue(layout.gradient_from)}, ${getColorValue(layout.gradient_to)})`
            };
        }

        // Priority 3: Default fallback
        return { backgroundColor: '#4B5563' };
    };

    // Helper function to get gradient class
    const getGradientClass = (layout: HomepageLayout) => {
        // Check if there's a cover image (relationship or URL)
        const hasCoverImage = layout.cover_image || 
                             layout.cover_image_url || 
                             layout.cover_image_url_computed;
        
        if (hasCoverImage) {
            return ''; // No gradient class when image is used
        }
        
        if (layout.gradient_from && layout.gradient_to) {
            return `bg-gradient-to-br from-${layout.gradient_from} to-${layout.gradient_to}`;
        }
        
        return 'bg-gray-600';
    };

    // Get layouts by position
    const getLayoutsByPosition = (position: string) => {
        return homepageLayouts.filter(layout => layout.grid_position === position && layout.is_active);
    };

    // Get specific layout
    const getLayout = (position: string) => {
        return getLayoutsByPosition(position)[0] || null;
    };


    return (
        <MainLayout title="Home - GNOSIS">
            {/* Featured Products Hero Slider */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Hero Slider - Featured Products */}
                    {featuredProducts.length > 0 ? (
                        <div className="relative overflow-hidden rounded-xl fashion-shadow h-[80vh] lg:h-[85vh]">
                            {featuredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`absolute inset-0 transition-opacity duration-1000 ${
                                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    {/* Product Images Slider */}
                                    <div className="relative w-full h-full">
                                        {product.images_data.map((image, imgIndex) => (
                                            <div
                                                key={image.id}
                                                className={`absolute inset-0 transition-opacity duration-500 ${
                                                    imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                                }`}
                                                style={{
                                                    backgroundImage: `url(${image.url || `/storage/${image.path}`})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            />
                                        ))}
                                        
                                        {/* Fallback if no images */}
                                        {product.images_data.length === 0 && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800" />
                                        )}
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>

                                    {/* Product Info */}
                                    <div className="absolute bottom-8 left-8 z-20 text-white">
                                        <div className="mb-2">
                                            <span className="text-sm opacity-80 uppercase tracking-wider">
                                                {product.category.name}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl lg:text-4xl font-light tracking-wider mb-2">
                                            {product.name}
                                        </h2>
                                        <div className="flex items-center gap-3 mb-4">
                                            {product.is_on_sale ? (
                                                <>
                                                    <span className="text-2xl font-semibold">
                                                        ₦{product.final_price.toLocaleString()}
                                                    </span>
                                                    <span className="text-lg line-through opacity-60">
                                                        ₦{product.price.toLocaleString()}
                                                    </span>
                                                    <span className="bg-red-500 text-white px-2 py-1 text-xs rounded">
                                                        -{product.discount_percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-2xl font-semibold">
                                                    ₦{product.price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/products/${product.slug}`}>
                                            <Button 
                                                variant="outline" 
                                                className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                                            >
                                                Show Now
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Image indicators */}
                                    {product.images_data.length > 1 && (
                                        <div className="absolute top-8 right-8 z-20 flex gap-2">
                                            {product.images_data.map((_, imgIndex) => (
                                                <button
                                                    key={imgIndex}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        imgIndex === currentImageIndex 
                                                            ? 'bg-white' 
                                                            : 'bg-white/50 hover:bg-white/75'
                                                    }`}
                                                    onClick={() => setCurrentImageIndex(imgIndex)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Navigation arrows */}
                            {featuredProducts.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            {/* Product indicators */}
                            {featuredProducts.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {featuredProducts.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === currentSlide 
                                                    ? 'bg-white' 
                                                    : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                            onClick={() => {
                                                setCurrentSlide(index);
                                                setCurrentImageIndex(0);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Fallback when no featured products
                        <div className="relative overflow-hidden rounded-xl fashion-shadow h-[80vh] lg:h-[85vh] bg-gradient-to-br from-gray-600 to-gray-800">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                            <div className="absolute bottom-8 left-8 z-20 text-white">
                                <h2 className="text-3xl lg:text-4xl font-light tracking-wider mb-2">
                                    FEATURED PRODUCTS
                                </h2>
                                <p className="text-lg opacity-80 mb-4">Discover our latest collection</p>
                                <Link href="/shop">
                                    <Button 
                                        variant="outline" 
                                        className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        Shop Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Right Side - Dynamic Layouts */}
                    <div className="grid grid-cols-1 gap-4 h-[60vh] lg:h-[65vh]">
                        {/* Main Right Top */}
                        {(() => {
                            const mainRightTopLayout = getLayout('main_right_top');
                            const mainRightTopHref = mainRightTopLayout?.category ? `/shop?category=${mainRightTopLayout.category.slug}` : '/shop';
                            
                            return mainRightTopLayout ? (
                                <Link href={mainRightTopHref} className="block h-full">
                                    <div 
                                        className={`relative overflow-hidden rounded-xl group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow ${getGradientClass(mainRightTopLayout)}`}
                                        style={getLayoutBackground(mainRightTopLayout)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                                        
                                        {/* Overlay for better text readability when image is used */}
                                        {(mainRightTopLayout.cover_image || mainRightTopLayout.cover_image_url || mainRightTopLayout.cover_image_url_computed) && (
                                            <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                                        )}

                                        <div className="absolute bottom-6 left-6 z-20 text-white">
                                            <h3 className="text-xl lg:text-2xl font-light tracking-wider">
                                                {mainRightTopLayout.title}
                                            </h3>
                                            {mainRightTopLayout.description && (
                                                <p className="text-sm opacity-80 mt-1">{mainRightTopLayout.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="h-full rounded-xl bg-gray-300 flex items-center justify-center">
                                    <p className="text-gray-500">No Layout</p>
                                </div>
                            );
                        })()}

                        {/* Main Right Bottom */}
                        {(() => {
                            const mainRightBottomLayout = getLayout('main_right_bottom');
                            const mainRightBottomHref = mainRightBottomLayout?.category ? `/shop?category=${mainRightBottomLayout.category.slug}` : '/shop';
                            
                            return mainRightBottomLayout ? (
                                <Link href={mainRightBottomHref} className="block h-full">
                                    <div 
                                        className={`relative overflow-hidden rounded-xl group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow ${getGradientClass(mainRightBottomLayout)}`}
                                        style={getLayoutBackground(mainRightBottomLayout)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                                        
                                        {/* Overlay for better text readability when image is used */}
                                        {(mainRightBottomLayout.cover_image || mainRightBottomLayout.cover_image_url || mainRightBottomLayout.cover_image_url_computed) && (
                                            <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                                        )}

                                        <div className="absolute bottom-6 left-6 z-20 text-white">
                                            <h3 className="text-xl lg:text-2xl font-light tracking-wider">
                                                {mainRightBottomLayout.title}
                                            </h3>
                                            {mainRightBottomLayout.description && (
                                                <p className="text-sm opacity-80 mt-1">{mainRightBottomLayout.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="h-full rounded-xl bg-gray-300 flex items-center justify-center">
                                    <p className="text-gray-500">No Layout</p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </section>

            {/* Secondary Grid Section - Dynamic Layouts */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[60vh]">
                    {/* Secondary Left */}
                    {(() => {
                        const secondaryLeftLayout = getLayout('secondary_left');
                        const secondaryLeftHref = secondaryLeftLayout?.category ? `/shop?category=${secondaryLeftLayout.category.slug}` : '/shop';
                        
                        return secondaryLeftLayout ? (
                            <Link href={secondaryLeftHref} className="block">
                                <div 
                                    className={`relative overflow-hidden rounded-xl group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow ${getGradientClass(secondaryLeftLayout)}`}
                                    style={getLayoutBackground(secondaryLeftLayout)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                                    
                                    {/* Overlay for better text readability when image is used */}
                                    {(secondaryLeftLayout.cover_image || secondaryLeftLayout.cover_image_url || secondaryLeftLayout.cover_image_url_computed) && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                                    )}

                                    <div className="absolute bottom-6 left-6 z-20 text-white">
                                        <h3 className="text-lg lg:text-xl font-light tracking-wider">
                                            {secondaryLeftLayout.title}
                                        </h3>
                                        {secondaryLeftLayout.description && (
                                            <p className="text-sm opacity-80 mt-1">{secondaryLeftLayout.description}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ) : null;
                    })()}

                    {/* Secondary Center */}
                    {(() => {
                        const secondaryCenterLayout = getLayout('secondary_center');
                        const secondaryCenterHref = secondaryCenterLayout?.category ? `/shop?category=${secondaryCenterLayout.category.slug}` : '/shop';
                        
                        return secondaryCenterLayout ? (
                            <Link href={secondaryCenterHref} className="block">
                                <div 
                                    className={`relative overflow-hidden rounded-xl group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow ${getGradientClass(secondaryCenterLayout)}`}
                                    style={getLayoutBackground(secondaryCenterLayout)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                                    
                                    {/* Overlay for better text readability when image is used */}
                                    {(secondaryCenterLayout.cover_image || secondaryCenterLayout.cover_image_url || secondaryCenterLayout.cover_image_url_computed) && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                                    )}

                                    <div className="absolute bottom-6 left-6 z-20 text-white">
                                        <h3 className="text-lg lg:text-xl font-light tracking-wider">
                                            {secondaryCenterLayout.title}
                                        </h3>
                                        {secondaryCenterLayout.description && (
                                            <p className="text-sm opacity-80 mt-1">{secondaryCenterLayout.description}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ) : null;
                    })()}

                    {/* Secondary Right */}
                    {(() => {
                        const secondaryRightLayout = getLayout('secondary_right');
                        const secondaryRightHref = secondaryRightLayout?.category ? `/shop?category=${secondaryRightLayout.category.slug}` : '/shop';
                        
                        return secondaryRightLayout ? (
                            <Link href={secondaryRightHref} className="block">
                                <div 
                                    className={`relative overflow-hidden rounded-xl group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow ${getGradientClass(secondaryRightLayout)}`}
                                    style={getLayoutBackground(secondaryRightLayout)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                                    
                                    {/* Overlay for better text readability when image is used */}
                                    {(secondaryRightLayout.cover_image || secondaryRightLayout.cover_image_url || secondaryRightLayout.cover_image_url_computed) && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                                    )}

                                    <div className="absolute bottom-6 left-6 z-20 text-white">
                                        <h3 className="text-lg lg:text-xl font-light tracking-wider">
                                            {secondaryRightLayout.title}
                                        </h3>
                                        {secondaryRightLayout.description && (
                                            <p className="text-sm opacity-80 mt-1">{secondaryRightLayout.description}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ) : null;
                    })()}
                </div>
            </section>

            {/* Featured Collections */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-light tracking-wider mb-4">
                            FEATURED COLLECTIONS
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our carefully curated collections designed for the modern lifestyle
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'New Arrivals', count: '24 items' },
                            { name: 'Best Sellers', count: '18 items' },
                            { name: 'Summer Collection', count: '32 items' },
                            { name: 'Accessories', count: '16 items' }
                        ].map((collection) => (
                            <div key={collection.name} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300">
                                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                                <h3 className="font-semibold mb-2">{collection.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{collection.count}</p>
                                <Button variant="outline" size="sm">
                                    Explore
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-black text-white rounded-lg p-8 lg:p-12 text-center">
                        <h2 className="text-2xl lg:text-3xl font-light tracking-wider mb-4">
                            STAY IN THE LOOP
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and fashion updates.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <Button className="bg-white text-black hover:bg-gray-100">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Index;
