@extends('pages.layout.app')

@section('title', 'Shopping Cart')

@section('content')
<div class="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-8 mt-8 text-gray-900">
    <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>

    @if(session('cart_message'))
        <div class="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            {{ session('cart_message') }}
        </div>
    @endif

    @if(session('cart_error'))
        <div class="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {{ session('cart_error') }}
        </div>
    @endif

    @if($cart && count($cart) > 0)
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <h2 class="text-xl font-semibold mb-4">Cart Items ({{ $cartCount }})</h2>
                    <div class="space-y-4">
                        @foreach($cart as $productId => $item)
                            <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <!-- Product Image and Details -->
                                <div class="flex items-center space-x-4 min-w-0 flex-1">
                                    <div class="flex-shrink-0">
                                        <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}" 
                                             class="w-16 h-16 object-cover rounded">
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <h3 class="font-semibold text-gray-900 truncate">{{ $item['name'] }}</h3>
                                        <p class="text-[#65644A] font-bold">₦{{ number_format($item['price'], 2) }}</p>
                                    </div>
                                </div>

                                <!-- Controls and Total Row -->
                                <div class="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                                    <!-- Quantity Controls -->
                                    <div class="flex items-center space-x-2">
                                        <form action="{{ route('cart.update') }}" method="POST" class="inline">
                                            @csrf
                                            <input type="hidden" name="product_id" value="{{ $productId }}" />
                                            <input type="hidden" name="action" value="decrease" />
                                            <button type="submit" 
                                                    class="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                                                </svg>
                                            </button>
                                        </form>
                                        
                                        <span class="w-12 text-center font-semibold text-gray-900">{{ $item['quantity'] }}</span>
                                        
                                        <form action="{{ route('cart.update') }}" method="POST" class="inline">
                                            @csrf
                                            <input type="hidden" name="product_id" value="{{ $productId }}" />
                                            <input type="hidden" name="action" value="increase" />
                                            <button type="submit" 
                                                    class="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                                </svg>
                                            </button>
                                        </form>
                                    </div>

                                    <!-- Item Total and Remove Button -->
                                    <div class="flex items-center justify-between sm:justify-end gap-4">
                                        <!-- Item Total -->
                                        <div class="text-right">
                                            <p class="text-lg font-semibold text-gray-900">₦{{ number_format($item['price'] * $item['quantity'], 2) }}</p>
                                        </div>

                                        <!-- Remove Button -->
                                        <div class="flex-shrink-0">
                                            <form action="{{ route('cart.remove') }}" method="POST" class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <input type="hidden" name="product_id" value="{{ $productId }}" />
                                                <button type="submit" class="text-red-600 hover:text-red-700 transition-colors">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-lg p-6 sticky top-8 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-gray-900">Cart Summary</h2>
                        <form action="{{ route('cart.clear') }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 hover:text-red-700 transition-colors text-sm">
                                Clear Cart
                            </button>
                        </form>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between text-gray-600">
                            <span>Subtotal ({{ $cartCount }} items):</span>
                            <span>₦{{ $cartTotal }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div class="flex justify-between text-gray-600">
                            <span>Tax:</span>
                            <span>₦0.00</span>
                        </div>
                        <div class="border-t border-gray-300 pt-3 flex justify-between text-lg font-semibold text-gray-900">
                            <span>Total:</span>
                            <span class="text-[#65644A]">₦{{ $cartTotal }}</span>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <a href="{{ route('checkout.show') }}" 
                           class="w-full bg-[#65644A] hover:bg-[#65644A]/90 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center block">
                            Proceed to Checkout
                        </a>
                        
                        <a href="https://wa.me/2348083209099?text={{ urlencode('Hi! I would like to checkout my order from Marodesign Clothing. Here are my items:' . PHP_EOL . PHP_EOL . collect($cart)->map(function($item) { return '• ' . $item['name'] . ' (Qty: ' . $item['quantity'] . ') - ₦' . number_format($item['price'] * $item['quantity'], 2); })->join(PHP_EOL) . PHP_EOL . PHP_EOL . 'Total: ₦' . $cartTotal) }}" 
                           target="_blank"
                           class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center block flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            Checkout on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    @else
        <div class="text-center py-12">
            <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
            </div>
            <h2 class="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p class="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <a href="{{ route('index') }}" 
               class="inline-block bg-[#65644A] hover:bg-[#65644A]/90 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Start Shopping
            </a>
        </div>
    @endif
</div>
@endsection 