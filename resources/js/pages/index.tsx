import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { HomePageProps } from '@/types';

const Index: React.FC<HomePageProps> = ({ products = [] }) => {
    return (
        <MainLayout title="Home - GNOSIS">
            {/* Hero Grid Section */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Side - Large Image */}
                    <Link href="/shop?category=sunglasses" className="block">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 group cursor-pointer transition-all duration-500 hover:scale-[1.02] fashion-shadow h-[80vh] lg:h-[85vh]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                            
                            {/* Placeholder for large image */}
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
                                <div className="text-center text-white/70 z-20 relative">
                                    <div className="w-32 h-32 bg-white/10 rounded-full mx-auto mb-6 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 rounded-full"></div>
                                    </div>
                                    <p className="text-lg font-light tracking-wider">RECTANGULAR SUNGLASSES</p>
                                    <p className="text-sm opacity-60 mt-1">Hero Collection</p>
                                </div>
                            </div>

                            {/* Overlay Content */}
                            <div className="absolute bottom-8 left-8 z-20 text-white">
                                <h2 className="text-3xl lg:text-4xl font-light tracking-wider mb-2">
                                    RECTANGULAR SUNGLASSES
                                </h2>
                                <Button 
                                    variant="outline" 
                                    className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Right Side - Grid of smaller sections */}
                    <div className="grid grid-cols-1 gap-4 h-[60vh] lg:h-[65vh]">
                        {/* Top Right - Bermuda Shorts */}
                        <Link href="/shop?category=shorts" className="block h-full">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                                
                                {/* Placeholder for Bermuda shorts image */}
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center">
                                    <div className="text-center text-white/80 z-20 relative">
                                        <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                            <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                                        </div>
                                        <p className="text-sm font-light tracking-wider">BERMUDA SHORTS</p>
                                        <p className="text-xs opacity-60 mt-1">Summer Collection</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 z-30 text-white">
                                    <h3 className="text-xl lg:text-2xl font-light tracking-wider">
                                        BERMUDA SHORTS
                                    </h3>
                                </div>
                            </div>
                        </Link>

                        {/* Bottom Right - Summer Boy */}
                        <Link href="/shop?category=casual" className="block h-full">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                                
                                {/* Placeholder for Summer Boy image */}
                                <div className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center">
                                    <div className="text-center text-white/80 z-20 relative">
                                        <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                            <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                                        </div>
                                        <p className="text-sm font-light tracking-wider">SUMMER BOY</p>
                                        <p className="text-xs opacity-60 mt-1">Casual Collection</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 z-30 text-white">
                                    <h3 className="text-xl lg:text-2xl font-light tracking-wider">
                                        SUMMER BOY
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Secondary Grid Section */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[60vh]">
                    {/* Summer Dress */}
                    <Link href="/shop?category=dresses" className="block">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                            
                            <div className="w-full h-full bg-gradient-to-br from-rose-500 via-pink-500 to-pink-600 flex items-center justify-center">
                                <div className="text-center text-white/80 z-20 relative">
                                    <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                                    </div>
                                    <p className="text-sm font-light tracking-wider">SUMMER DRESS</p>
                                    <p className="text-xs opacity-60 mt-1">Dress Collection</p>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 z-30 text-white">
                                <h3 className="text-lg lg:text-xl font-light tracking-wider">
                                    SUMMER DRESS
                                </h3>
                            </div>
                        </div>
                    </Link>

                    {/* Casual Wear */}
                    <Link href="/shop?category=casual" className="block">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                            
                            <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 flex items-center justify-center">
                                <div className="text-center text-white/80 z-20 relative">
                                    <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                                    </div>
                                    <p className="text-sm font-light tracking-wider">CASUAL WEAR</p>
                                    <p className="text-xs opacity-60 mt-1">Everyday Style</p>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 z-30 text-white">
                                <h3 className="text-lg lg:text-xl font-light tracking-wider">
                                    CASUAL WEAR
                                </h3>
                            </div>
                        </div>
                    </Link>

                    {/* Accessories */}
                    <Link href="/shop?category=accessories" className="block">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] fashion-shadow">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                            
                            <div className="w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-purple-600 flex items-center justify-center">
                                <div className="text-center text-white/80 z-20 relative">
                                    <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                                    </div>
                                    <p className="text-sm font-light tracking-wider">ACCESSORIES</p>
                                    <p className="text-xs opacity-60 mt-1">Complete the Look</p>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 z-30 text-white">
                                <h3 className="text-lg lg:text-xl font-light tracking-wider">
                                    ACCESSORIES
                                </h3>
                            </div>
                        </div>
                    </Link>
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
