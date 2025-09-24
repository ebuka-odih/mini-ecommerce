<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        // Debug the incoming request
        \Log::info('Add to cart request', [
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'all_data' => $request->all()
        ]);

        $request->validate([
            'product_id' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if product exists manually
        $product = Product::find($request->product_id);
        if (!$product) {
            \Log::error('Product not found', ['product_id' => $request->product_id]);
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.'
                ], 404);
            }
            return back()->with('cart_error', 'Product not found.');
        }
        
        // Check if product is in stock
        if ($product->stock < $request->quantity) {
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough stock available. Only ' . $product->stock . ' items left.'
                ], 400);
            }
            return back()->with('cart_error', 'Not enough stock available. Only ' . $product->stock . ' items left.');
        }

        $cart = Session::get('cart', []);
        $productId = $request->product_id;

        // If product already exists in cart, update quantity
        if (isset($cart[$productId])) {
            $newQuantity = $cart[$productId]['quantity'] + $request->quantity;
            
            // Check if new total quantity exceeds stock
            if ($newQuantity > $product->stock) {
                if ($request->ajax()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot add more items. Only ' . $product->stock . ' items available in total.'
                    ], 400);
                }
                return back()->with('cart_error', 'Cannot add more items. Only ' . $product->stock . ' items available in total.');
            }
            
            $cart[$productId]['quantity'] = $newQuantity;
        } else {
            // Add new product to cart
            $cart[$productId] = [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->sale_price ?? $product->price,
                'quantity' => $request->quantity,
                'image' => $product->images()->first()?->url ?? asset('assets/images/product/placeholder.svg'),
                'stock' => $product->stock,
            ];
        }

        Session::put('cart', $cart);

        \Log::info('Product added to cart successfully', [
            'product_id' => $product->id,
            'product_name' => $product->name,
            'quantity' => $request->quantity,
            'cart_count' => $this->getCartCount()
        ]);

        // Check if it's an AJAX request
        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $product->name . ' added to cart successfully!',
                'cart_count' => $this->getCartCount()
            ]);
        }

        return back()->with('cart_message', $product->name . ' added to cart successfully!');
    }

    public function updateQuantity(Request $request)
    {
        $request->validate([
            'item_id' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Session::get('cart', []);
        $productId = $request->item_id;

        if (!isset($cart[$productId])) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found in cart.'
            ], 404);
        }

        $product = Product::find($productId);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        // Check if new quantity exceeds stock
        if ($request->quantity > $product->stock_quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update quantity. Only ' . $product->stock_quantity . ' items available.'
            ], 400);
        }

        $cart[$productId]['quantity'] = $request->quantity;
        Session::put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Quantity updated successfully!'
        ]);
    }

    public function removeFromCart(Request $request)
    {
        $request->validate([
            'item_id' => 'required|string',
        ]);

        $cart = Session::get('cart', []);
        $productId = $request->item_id;

        if (!isset($cart[$productId])) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found in cart.'
            ], 404);
        }

        $productName = $cart[$productId]['name'];
        unset($cart[$productId]);
        Session::put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => $productName . ' removed from cart successfully!'
        ]);
    }

    public function view()
    {
        $cart = Session::get('cart', []);
        
        // Transform cart data to match React component expectations
        $cartItems = [];
        $subtotal = 0;
        
        foreach ($cart as $productId => $item) {
            $product = Product::with(['images', 'variations.size', 'variations.color'])->find($productId);
            if ($product) {
                $cartItems[] = [
                    'id' => $productId,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'sku' => $product->sku,
                        'stock_quantity' => $product->stock_quantity,
                        'images' => (($images = $product->getRelation('images')) && $images->count() > 0) ? $images->map(function($image) {
                            $image->append(['url', 'thumbnail_url']);
                            return [
                                'id' => $image->id,
                                'url' => $image->url,
                                'thumbnail_url' => $image->thumbnail_url,
                                'alt_text' => $image->alt_text,
                                'is_featured' => $image->is_featured,
                            ];
                        }) : [],
                    ],
                    // Add variation data if needed
                    'variation' => null, // TODO: Implement variation support
                ];
                $subtotal += $item['price'] * $item['quantity'];
            }
        }
        
        $cartData = [
            'items' => $cartItems,
            'subtotal' => $subtotal,
            'tax' => 0, // TODO: Calculate tax
            'shipping' => 0, // TODO: Calculate shipping
            'discount' => 0, // TODO: Apply discounts
            'total' => $subtotal,
        ];
        
        return \Inertia\Inertia::render('cart', [
            'cart' => $cartData
        ]);
    }

    public function getCart()
    {
        $cart = Session::get('cart', []);
        
        return response()->json([
            'success' => true,
            'cart' => $cart,
            'cart_count' => $this->getCartCount(),
            'cart_total' => $this->getCartTotal(),
        ]);
    }

    public function getCartData()
    {
        try {
            $cart = Session::get('cart', []);
            
            $cartItems = [];
            $subtotal = 0;
            
            foreach ($cart as $productId => $item) {
                try {
                    $product = Product::with(['images', 'variations.size', 'variations.color'])->find($productId);
                    if ($product) {
                        $cartItems[] = [
                            'id' => $productId,
                            'product_id' => $product->id,
                            'quantity' => $item['quantity'],
                            'price' => $item['price'],
                            'product' => [
                                'id' => $product->id,
                                'name' => $product->name,
                                'slug' => $product->slug,
                                'sku' => $product->sku,
                                'stock_quantity' => $product->stock_quantity,
                        'images' => (($images = $product->getRelation('images')) && $images->count() > 0) ? $images->map(function($image) {
                            $image->append(['url', 'thumbnail_url']);
                            return [
                                'id' => $image->id,
                                'url' => $image->url,
                                'thumbnail_url' => $image->thumbnail_url,
                                'alt_text' => $image->alt_text,
                                'is_featured' => $image->is_featured,
                            ];
                        })->toArray() : [],
                            ],
                            'variation' => null, // TODO: Implement variation support
                        ];
                        $subtotal += $item['price'] * $item['quantity'];
                    }
                } catch (\Exception $e) {
                    \Log::error('Error processing cart item: ' . $productId, [
                        'error' => $e->getMessage(),
                        'item' => $item
                    ]);
                    // Continue with other items
                }
            }
            
            return response()->json([
                'success' => true,
                'cart_items' => $cartItems,
                'cart_count' => $this->getCartCount(),
                'cart_total' => $subtotal,
                'subtotal' => $subtotal,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getCartData: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to load cart data',
                'cart_items' => [],
                'cart_count' => 0,
                'cart_total' => 0,
                'subtotal' => 0,
            ], 500);
        }
    }

    public function clearCart()
    {
        Session::forget('cart');
        
        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully!'
        ]);
    }

    private function getCartCount()
    {
        $cart = Session::get('cart', []);
        return array_sum(array_column($cart, 'quantity'));
    }

    private function getCartTotal()
    {
        $cart = Session::get('cart', []);
        $total = 0;
        
        foreach ($cart as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        
        return number_format($total, 2);
    }

    public function sidebar(Request $request)
    {
        if (!$request->header('X-Splade-Modal')) {
            return redirect('/');
        }
        $cart = Session::get('cart', []);
        $cartCount = $this->getCartCount();
        $cartTotal = $this->getCartTotal();
        
        // Debug the cart data being passed to the view
        \Log::info('Cart sidebar data', [
            'cart' => $cart,
            'cart_count' => $cartCount,
            'cart_total' => $cartTotal
        ]);
        
        return view('pages.cart-sidebar', compact('cart', 'cartCount', 'cartTotal'));
    }
} 