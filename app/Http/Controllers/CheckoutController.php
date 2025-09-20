<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    // Show the checkout form
    public function show(Request $request)
    {
        $cart = Session::get('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $cartTotal = collect($cart)->sum(function($item) {
            return $item['price'] * $item['quantity'];
        });

        // Calculate basic totals (tax and shipping will be calculated in process)
        $subtotal = $cartTotal;
        $tax = 0; // Will be calculated based on location
        $shipping = 0; // Will be calculated based on shipping method
        $total = $subtotal + $tax + $shipping;

        return view('pages.checkout', compact('cart', 'cartTotal', 'subtotal', 'tax', 'shipping', 'total'));
    }

    // Process the checkout form
    public function process(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:30',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
                'country' => 'required|string|max:100',
                'zip' => 'required|string|max:20',
                'payment_method' => 'required|in:paystack',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Checkout validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return back()->withErrors($e->errors())->withInput();
        }

        $cart = Session::get('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Validate stock availability
        foreach ($cart as $productId => $item) {
            $product = Product::find($productId);
            if (!$product) {
                return back()->with('error', 'Product not found.')->withInput();
            }
            
            if ($product->stock < $item['quantity']) {
                return back()->with('error', "Not enough stock for {$product->name}. Only {$product->stock} available.")->withInput();
            }
        }

        try {
            DB::beginTransaction();

            // Calculate totals
            $subtotal = collect($cart)->sum(function($item) {
                return $item['price'] * $item['quantity'];
            });
            
            $tax = 0; // Will be calculated based on location
            $shipping = 0; // Will be calculated based on shipping method
            $discount = 0; // Will be applied if coupon is used
            $total = $subtotal + $tax + $shipping - $discount;

            // Generate order number
            $orderNumber = 'ORD-' . date('Y') . '-' . str_pad(Order::count() + 1, 6, '0', STR_PAD_LEFT);
            
            // Create order
            $order = Order::create([
                'user_id' => auth()->check() ? auth()->id() : null, // null for guest checkout
                'order_number' => $orderNumber,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'currency' => 'NGN', // Nigerian Naira for Paystack
                'shipping_name' => $validated['name'],
                'shipping_email' => $validated['email'],
                'shipping_phone' => $validated['phone'],
                'shipping_address' => $validated['address'],
                'shipping_city' => $validated['city'],
                'shipping_state' => $validated['state'],
                'shipping_country' => $validated['country'],
                'shipping_zip_code' => $validated['zip'],
                'billing_name' => $validated['name'],
                'billing_email' => $validated['email'],
                'billing_phone' => $validated['phone'],
                'billing_address' => $validated['address'],
                'billing_city' => $validated['city'],
                'billing_state' => $validated['state'],
                'billing_country' => $validated['country'],
                'billing_zip_code' => $validated['zip'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'status' => 'pending',
            ]);

            // Create order items and update stock
            foreach ($cart as $productId => $item) {
                $product = Product::find($productId);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'total_price' => $item['price'] * $item['quantity'],
                ]);

                // Update stock
                $product->decrement('stock', $item['quantity']);
            }

            DB::commit();

            // Clear cart
            Session::forget('cart');

            Log::info('Order created successfully', [
                'order_id' => $order->id,
                'total' => $order->total,
                'email' => $order->shipping_email
            ]);

            // Redirect to payment page
            return redirect()->route('payment.show', $order)
                ->with('success', 'Order created successfully! Please complete payment to confirm your order.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
                'cart_data' => $cart,
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            // Always show detailed error information for debugging
            // In production, you may want to change this to only show config('app.debug')
            $showDetailedError = true; // Set to config('app.debug') for production
            
            if ($showDetailedError) {
                $errorMessage = 'Checkout Error: ' . $e->getMessage() . 
                    ' (File: ' . basename($e->getFile()) . ', Line: ' . $e->getLine() . ')';
                
                // Add additional context for common errors
                if (strpos($e->getMessage(), 'SQLSTATE') !== false) {
                    $errorMessage .= ' - This appears to be a database error. Please check your database connection and table structure.';
                } elseif (strpos($e->getMessage(), 'Class') !== false && strpos($e->getMessage(), 'not found') !== false) {
                    $errorMessage .= ' - This appears to be a missing class/service error.';
                } elseif (strpos($e->getMessage(), 'Call to undefined method') !== false) {
                    $errorMessage .= ' - This appears to be a method call error.';
                }
            } else {
                $errorMessage = 'An error occurred while processing your order. Please try again.';
            }
            
            return back()->with('error', $errorMessage)->withInput();
        }
    }
} 