import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Play, ShoppingBag, Eye, ShoppingCart, Heart } from 'lucide-react';
import { formatPriceWithCurrency } from '@/lib/fashion-utils';

interface BannerSlide {
    id: string;
    title: string;
    subtitle?: string;
    image_url: string;
    alt_text?: string;
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
    
    // Product slider state
    const [currentProductSlide, setCurrentProductSlide] = useState(0);
    
    // Product card interaction state
    const [showProductActions, setShowProductActions] = useState<string | null>(null);
    
    // Favorite products state
    const [favoriteProducts, setFavoriteProducts] = useState<Set<string>>(new Set());
    
    // Cart state
    const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
    const [showCartFeedback, setShowCartFeedback] = useState<string | null>(null);

    // Auto-advance banner slider
    useEffect(() => {
        if (!bannerSlides || bannerSlides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [bannerSlides]);

    // Auto-advance product slider (slower than banner)
    useEffect(() => {
        if (!products || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentProductSlide((prev) => (prev + 1) % products.length);
        }, 8000); // Change slide every 8 seconds (slower than banner)

        return () => clearInterval(interval);
    }, [products]);

    // Load favorites and cart from localStorage on component mount
    useEffect(() => {
        const savedFavorites = localStorage.getItem('favoriteProducts');
        if (savedFavorites) {
            try {
                const favoritesArray = JSON.parse(savedFavorites);
                setFavoriteProducts(new Set(favoritesArray));
            } catch (error) {
                console.error('Error loading favorites from localStorage:', error);
            }
        }

        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                setCartItems(cartData);
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Toggle favorite status
    const toggleFavorite = (productId: string) => {
        setFavoriteProducts(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            
            // Save to localStorage
            localStorage.setItem('favoriteProducts', JSON.stringify(Array.from(newFavorites)));
            return newFavorites;
        });
    };

    // Add product to cart
    const addToCart = (productId: string, productName: string) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            newCart[productId] = (newCart[productId] || 0) + 1;
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });

        // Show feedback
        setShowCartFeedback(productName);
        setTimeout(() => {
            setShowCartFeedback(null);
        }, 3000);

        // Close the actions panel
        setShowProductActions(null);
    };

    const nextBannerSlide = () => {
        if (!bannerSlides || bannerSlides.length === 0) return;
        setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length);
    };

    const prevBannerSlide = () => {
        if (!bannerSlides || bannerSlides.length === 0) return;
        setCurrentBannerSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    };

    // Get active banner slides
    const activeBannerSlides = bannerSlides ? bannerSlides.filter(slide => slide.is_active) : [];

    return (
        <div className="overscroll-none">
            <MainLayout title={`${settings?.site_name || 'GNOSIS'} - Home`} settings={settings}>
            
            {/* Cart Feedback Notification */}
            {showCartFeedback && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{showCartFeedback} added to cart!</span>
                </div>
            )}
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
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                                    style={{
                                        backgroundImage: `url(${slide.image_url})`,
                                    }}
                                    role="img"
                                    aria-label={slide.alt_text || slide.title}
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40" />
                                
                                {/* Content */}
                                <div className="relative z-10 h-full flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h1 className="text-5xl lg:text-7xl font-light tracking-wider mb-6">
                                            {slide.title}
                                        </h1>
                                        {slide.subtitle && (
                                            <h2 className="text-2xl lg:text-3xl font-light mb-8 text-gray-200 text-center">
                                                {slide.subtitle}
                                            </h2>
                                        )}
                                        <div className="flex justify-center">
                                            <Link href={slide.button_link}>
                                                <Button 
                                                    size="lg"
                                                    className="bg-white text-black hover:bg-gray-100 transition-all duration-300 px-8 py-4 text-lg"
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


                        {/* Slide indicators */}
                        {activeBannerSlides.length > 1 && (
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                                {activeBannerSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                                            index === currentBannerSlide 
                                                ? 'bg-white border-white' 
                                                : 'bg-transparent border-white/50 hover:border-white/75'
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
                            <h1 className="text-5xl lg:text-7xl font-light tracking-wider mb-6">
                                ELEVATE YOUR STYLE
                            </h1>
                            <h2 className="text-2xl lg:text-3xl font-light mb-8 text-gray-200">
                                Premium Fashion Collection
                            </h2>
                            <Link href="/shop">
                                <Button 
                                    size="lg"
                                    className="bg-white text-black hover:bg-gray-100 transition-all duration-300 px-8 py-4 text-lg"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="mt-8 text-sm text-gray-300">
                                <p>Configure slider images in admin panel for a personalized experience</p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Video Preview Section */}
            <section className="relative h-[80vh] w-full overflow-hidden">
                {/* Background Video */}
                <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/media/v1.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-widest mb-4 uppercase">
                            MDC DESIGNER
                        </h1>
                        <p className="text-xl lg:text-2xl font-light mb-8 uppercase">
                            BORN TO STAND OUT
                        </p>
                    </div>
                </div>
                
                {/* Volume Control */}
                <button
                    onClick={() => {
                        const video = document.querySelector('video');
                        if (video) {
                            video.muted = !video.muted;
                        }
                    }}
                    className="absolute bottom-8 right-8 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/20"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343L4.93 4.93A1 1 0 003.515 6.343V17.657a1 1 0 001.414 1.414l1.414-1.414M8 12h4l4-4v8l-4-4H8v-4z" />
                    </svg>
                </button>
            </section>

            {/* Featured Products Slider */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl lg:text-4xl font-light tracking-wider mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            CURATED COLLECTION
                        </h2>
                        <p className={`text-lg max-w-2xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                            Discover our carefully curated selection of premium products
                        </p>
                    </div>

                    {products && products.length > 0 ? (
                        <div className="relative max-w-4xl mx-auto">
                            {/* Product Navigation Arrows */}
                            {products.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentProductSlide((prev) => (prev - 1 + products.length) % products.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-600 p-2 rounded-full transition-all duration-300 border border-gray-300"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentProductSlide((prev) => (prev + 1) % products.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-600 p-2 rounded-full transition-all duration-300 border border-gray-300"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </>
                            )}

                            <div className="overflow-hidden">
                                <div 
                                    className="flex transition-transform duration-1000 ease-in-out"
                                    style={{ transform: `translateX(-${currentProductSlide * 100}%)` }}
                                >
                                    {products.slice(0, 8).map((product) => (
                                        <div key={product.id} className="w-full flex-shrink-0 px-4">
                                            <div className="group">
                                                <div className={`rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
                                                    {/* Product Image - Click to view product details */}
                                                    <Link href={`/product/${product.slug}`} className="block">
                                                        <div className="aspect-square relative overflow-hidden">
                                                            {product.images_data && Array.isArray(product.images_data) && product.images_data.length > 0 ? (
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

                                                            {/* Favorite Heart Icon */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleFavorite(product.id);
                                                                }}
                                                                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full transition-all duration-300 shadow-sm"
                                                            >
                                                                <Heart 
                                                                    className={`h-4 w-4 transition-all duration-300 ${
                                                                        favoriteProducts.has(product.id) 
                                                                            ? 'fill-red-500 text-red-500' 
                                                                            : 'text-gray-600'
                                                                    }`} 
                                                                />
                                                            </button>
                                                        </div>
                                                    </Link>

                                                    {/* Product Info - Click to show actions */}
                                                    <div 
                                                        className="p-4 cursor-pointer"
                                                        onClick={() => setShowProductActions(
                                                            showProductActions === product.id ? null : product.id
                                                        )}
                                                    >
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

                                                        {/* Action Icons - Show when card footer is clicked */}
                                                        {showProductActions === product.id && (
                                                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                                <button 
                                                                    onClick={() => addToCart(product.id, product.name)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                                                >
                                                                    <ShoppingCart className="h-4 w-4" />
                                                                    {cartItems[product.id] ? `Add to Cart (${cartItems[product.id]})` : 'Add to Cart'}
                                                                </button>
                                                                <Link href={`/product/${product.slug}`}>
                                                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                                        <Eye className="h-4 w-4" />
                                                                        View Details
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product slider indicators */}
                            {products.length > 1 && (
                                <div className="flex justify-center mt-8 gap-2">
                                    {products.slice(0, 8).map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === currentProductSlide 
                                                    ? 'bg-gray-600' 
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                            onClick={() => setCurrentProductSlide(index)}
                                        />
                                    ))}
                                </div>
                            )}
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

        </MainLayout>
        </div>
    );
};

export default HomePage3;
