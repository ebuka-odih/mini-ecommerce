import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        stock_quantity: number;
        images: Array<{
            id: number;
            url: string;
            thumbnail_url: string;
            alt_text?: string;
            is_featured: boolean;
        }>;
    };
    variation?: {
        id: number;
        size?: {
            id: number;
            name: string;
            display_name: string;
        };
        color?: {
            id: number;
            name: string;
            display_name: string;
            hex_code: string;
        };
    };
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;
    addToCart: (productId: string, quantity: number, variationId?: number) => Promise<boolean>;
    updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
    removeFromCart: (itemId: string) => Promise<boolean>;
    clearCart: () => Promise<boolean>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const refreshCart = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/cart/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCartItems(data.cart_items || []);
                }
            } else {
                console.error('Cart refresh failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error refreshing cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (productId: string, quantity: number, variationId?: number): Promise<boolean> => {
        try {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                    variation_id: variationId || null,
                }),
            });

            if (response.ok) {
                await refreshCart();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    };

    const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
        try {
            const response = await fetch('/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    item_id: itemId,
                    quantity: quantity,
                }),
            });

            if (response.ok) {
                await refreshCart();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating cart:', error);
            return false;
        }
    };

    const removeFromCart = async (itemId: string): Promise<boolean> => {
        try {
            const response = await fetch('/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    item_id: itemId,
                }),
            });

            if (response.ok) {
                await refreshCart();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return false;
        }
    };

    const clearCart = async (): Promise<boolean> => {
        try {
            const response = await fetch('/cart/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setCartItems([]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    };

    // Load cart on mount - with delay to ensure session is ready
    useEffect(() => {
        const timer = setTimeout(() => {
            refreshCart();
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const value: CartContextType = {
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
