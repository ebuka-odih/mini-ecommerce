import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowRight, ShoppingBag, ShoppingCart, Menu, X, Loader2, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast';
import { formatPriceWithCurrency } from '@/lib/fashion-utils';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  image: string;
  images?: Array<{
    url: string;
    thumbnail_url: string;
  }>;
  category: {
    name: string;
  };
  is_featured: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: {
    url: string;
    thumbnail_url: string;
  };
}

interface SliderImage {
  id: number;
  url: string;
  alt_text: string;
  width: number;
  height: number;
}

interface BlackThemeProps {
  featuredProducts: Product[];
  categories: Category[];
  sliderImages?: SliderImage[];
  settings?: {
    site_name: string;
    site_logo: string;
    currency: string;
    theme: string;
  };
}

// Cart Sidebar Component
const CartSidebar: React.FC<{ settings?: { currency: string } }> = ({ settings }) => {
  const { cartItems, cartCount, cartTotal, isLoading, updateQuantity, removeFromCart, clearCart, addToCart } = useCart();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return formatPriceWithCurrency(amount, settings);
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      setIsUpdating(itemId);
      await updateQuantity(itemId, newQuantity);
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId);
    await removeFromCart(itemId);
    setIsUpdating(null);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const getProductImage = (item: any) => {
    if (item.product?.images?.length > 0) {
      const featuredImage = item.product.images.find((img: any) => img.is_featured) || item.product.images[0];
      return featuredImage.url || featuredImage.thumbnail_url || `/storage/${featuredImage.path}`;
    }
    return '/images/placeholder-product.jpg';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-white hover:text-gray-300 transition-colors overflow-visible">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center min-w-[20px] shadow-lg border-2 border-white z-10">
              {cartCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 bg-white border-l">
        <SheetHeader>
          <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <div className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="text-sm text-gray-500">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      <img 
                        src={getProductImage(item)} 
                        alt={item.product?.name || 'Product'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.product?.name || 'Product'}</h3>
                      <p className="text-xs text-gray-500">SKU: {item.product?.sku}</p>
                      <p className="font-semibold text-sm mt-1">{formatCurrency(item.price)}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdating === item.id}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {isUpdating === item.id ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating === item.id}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some items to get started</p>
                <Button asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default function BlackTheme({ featuredProducts, categories, sliderImages = [], settings }: BlackThemeProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { cartCount, addToCart } = useCart();
  const { addToast } = useToast();

  // Function to handle adding dummy products to cart
  const handleAddDummyToCart = async (productName: string, price: number, category: string) => {
    try {
      const dummyProduct = {
        id: Math.random() * 1000000, // Generate random ID for dummy products
        name: productName,
        price: price,
        image: '/images/placeholder-product.jpg',
        category: { name: category },
        slug: productName.toLowerCase().replace(/\s+/g, '-')
      };

      await addToCart(dummyProduct.id, 1);
      addToast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
        type: "success",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      addToast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        type: "error",
      });
    }
  };

  // Create hero images from slider settings or fallback to featured products
  const heroImages = sliderImages.length > 0 
    ? sliderImages.map(img => img.url)
    : featuredProducts.length > 0 
      ? featuredProducts.slice(0, 3).map(product => {
          // Get the first image from the product's images array
          const firstImage = product.images && product.images.length > 0 
            ? product.images[0].url || product.images[0].thumbnail_url
            : null;
          const imageUrl = firstImage || '/images/placeholder-product.jpg';
          console.log('Hero image for product:', product.name, 'URL:', imageUrl);
          return imageUrl;
        })
      : [
          '/images/placeholder-product.jpg',
          '/images/placeholder-product.jpg', 
          '/images/placeholder-product.jpg'
        ];

  // Debug logging
  useEffect(() => {
    console.log('Hero images loaded:', heroImages);
    console.log('Current image index:', currentImageIndex);
    console.log('Featured products:', featuredProducts);
    console.log('Slider images from settings:', sliderImages);
  }, [heroImages, currentImageIndex, featuredProducts, sliderImages]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Auto-play functionality
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/img/paperview.png" 
                alt="Gnosis Logo" 
                className="h-24 md:h-28 w-auto"
                onError={(e) => {
                  console.log('Logo failed to load, using fallback');
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center hidden">
                <span className="text-black font-bold text-sm">G</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-gray-300 transition-colors">
                Home
              </Link>
              <Link href="/shop" className="text-white hover:text-gray-300 transition-colors">
                Shop
              </Link>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <CartSidebar settings={settings} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-black">
                    {cartCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen Width */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={heroImages[currentImageIndex]} 
            alt="Store Interior"
            className="w-full h-full object-cover opacity-60 transition-opacity duration-500"
            onError={(e) => {
              console.log('Image failed to load:', heroImages[currentImageIndex]);
              e.currentTarget.src = '/images/placeholder-product.jpg';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', heroImages[currentImageIndex]);
            }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            PAPERVIEW
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-16 max-w-xl mx-auto leading-relaxed">
            Premium fashion pieces for the modern lifestyle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 text-base font-semibold rounded-none border-2 border-white transition-all duration-200"
            >
              <Link href="/shop">
                Explore Collections
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Dots indicator */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}