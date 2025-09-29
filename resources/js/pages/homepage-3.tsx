import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Play, ShoppingBag } from 'lucide-react';
import { formatPriceWithCurrency } from '@/lib/fashion-utils';

interface BannerSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image_url: string;
    button_text: string;
    button_link: string;
    is_active: boolean;
}

interface Product {
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

interface HomePage3Props {
    products: Product[];
    bannerSlides: BannerSlide[];
    settings?: {
        site_name: string;
        site_logo: string;
        currency: string;
        theme: 'light' | 'dark';
    };
}

const HomePage3: React.FC<HomePage3Props> = ({ products = [], bannerSlides = [], settings }) => {
    const isDarkTheme = settings?.theme === 'dark';
    
    // Banner slider state
    const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // Auto-advance banner slider
    useEffect(() => {
        if (bannerSlides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [bannerSlides]);

    const nextBannerSlide = () => {
        setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length);
    };

    const prevBannerSlide = () => {
        setCurrentBannerSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    };

    // Get active banner slides
    const activeBannerSlides = bannerSlides.filter(slide => slide.is_active);

    return (
        <MainLayout title={`${settings?.site_name || 'GNOSIS'} - Home`} settings={settings}>
            {/* Banner Slider Section */}
            <section className="relative h-screen w-full overflow-hidden">
                {activeBannerSlides.length > 0 ? (
                    <>
                        {activeBannerSlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    index === currentBannerSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${slide.image_url})`,
                                    }}
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                                
                                {/* Content */}
                                <div className="relative z-10 h-full flex items-center">
                                    <div className="container mx-auto px-4">
                                        <div className="max-w-2xl text-white">
                                            <h1 className="text-4xl lg:text-6xl font-light tracking-wider mb-4">
                                                {slide.title}
                                            </h1>
                                            <h2 className="text-xl lg:text-2xl font-light mb-6 text-gray-200">
                                                {slide.subtitle}
                                            </h2>
                                            <p className="text-lg mb-8 text-gray-300 max-w-xl">
                                                {slide.description}
                                            </p>
                                            <Link href={slide.button_link}>
                                                <Button 
                                                    size="lg"
                                                    className="bg-white text-black hover:bg-gray-100 transition-all duration-300"
                                                >
                                                    {slide.button_text}
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Navigation arrows */}
                        {activeBannerSlides.length > 1 && (
                            <>
                                <button
                                    onClick={prevBannerSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextBannerSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}

                        {/* Slide indicators */}
                        {activeBannerSlides.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                {activeBannerSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === currentBannerSlide 
                                                ? 'bg-white' 
                                                : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                        onClick={() => setCurrentBannerSlide(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    // Fallback when no banner slides
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-4xl lg:text-6xl font-light tracking-wider mb-4">
                                Welcome to {settings?.site_name || 'GNOSIS'}
                            </h1>
                            <p className="text-xl mb-8">Discover our amazing collection</p>
                            <Link href="/shop">
                                <Button 
                                    size="lg"
                                    className="bg-white text-black hover:bg-gray-100 transition-all duration-300"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </section>

            {/* Video Preview Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl lg:text-4xl font-light tracking-wider mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            DISCOVER OUR STORY
                        </h2>
                        <p className={`text-lg max-w-2xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                            Watch our latest video to see the craftsmanship and passion behind our products
                        </p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            {isVideoPlaying ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                        <p>Loading video...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={() => setIsVideoPlaying(true)}
                                        className="bg-white/90 hover:bg-white text-black rounded-full p-6 transition-all duration-300 hover:scale-110"
                                    >
                                        <Play className="h-12 w-12 ml-1" />
                                    </button>
                                </div>
                            )}
                            
                            {/* Video placeholder - you can replace with actual video */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Play className="h-8 w-8" />
                                    </div>
                                    <p className="text-lg">Video Preview</p>
                                    <p className="text-sm text-gray-300 mt-2">Click to play</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl lg:text-4xl font-light tracking-wider mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            FEATURED PRODUCTS
                        </h2>
                        <p className={`text-lg max-w-2xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                            Discover our carefully curated selection of premium products
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.slice(0, 8).map((product) => (
                                <div key={product.id} className="group">
                                    <Link href="/shop" className="block">
                                        <div className={`rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
                                            {/* Product Image */}
                                            <div className="aspect-square relative overflow-hidden">
                                                {product.images_data && product.images_data.length > 0 ? (
                                                    <img
                                                        src={product.images_data[0].url || `/storage/${product.images_data[0].path}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}
                                                
                                                {/* Sale badge */}
                                                {product.is_on_sale && (
                                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs rounded">
                                                        -{product.discount_percentage}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                <h3 className={`font-medium mb-2 line-clamp-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                                    {product.name}
                                                </h3>
                                                <p className={`text-sm mb-3 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {product.category.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {product.is_on_sale ? (
                                                        <>
                                                            <span className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                                                {formatPriceWithCurrency(product.final_price, settings)}
                                                            </span>
                                                            <span className={`text-sm line-through ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                {formatPriceWithCurrency(product.price, settings)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                                            {formatPriceWithCurrency(product.price, settings)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className={`text-xl font-medium mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                No products available
                            </h3>
                            <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                                Check back later for our latest products
                            </p>
                        </div>
                    )}

                    {/* View All Products Button */}
                    <div className="text-center mt-12">
                        <Link href="/shop">
                            <Button 
                                size="lg"
                                className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
                            >
                                View All Products
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-black">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <h2 className="text-2xl lg:text-3xl font-light tracking-wider mb-4">
                            STAY IN THE LOOP
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and updates.
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

export default HomePage3;
