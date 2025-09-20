@extends('pages.layout.app')

@section('title', 'Payment Successful - Order #' . $order->order_number)

@section('content')
<div class="max-w-2xl mx-auto bg-black rounded-2xl shadow-lg p-8 mt-8 text-white">
    <div class="text-center mb-8">
        <div class="w-20 h-20 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <h1 class="text-3xl font-bold mb-2 text-green-400">Payment Successful!</h1>
        <p class="text-gray-400">Your order has been confirmed</p>
    </div>

    @if(session('success'))
        <div class="mb-6 p-4 bg-green-900/80 text-green-200 rounded-lg">
            {{ session('success') }}
        </div>
    @endif

    <div class="space-y-6">
        <!-- Order Summary -->
        <div class="bg-gray-900 rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-gray-400">Order Number:</span>
                    <span class="font-medium">{{ $order->order_number }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Date:</span>
                    <span>{{ $order->created_at->format('M d, Y') }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Total Amount:</span>
                    <span class="text-[#65644A] font-bold">₦{{ number_format($order->total, 2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Payment Status:</span>
                    <span class="px-2 py-1 bg-green-900/50 text-green-300 rounded text-sm">
                        Paid
                    </span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Order Status:</span>
                    <span class="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm">
                        {{ ucfirst($order->status) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Shipping Information -->
        <div class="bg-gray-900 rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
            <div class="space-y-2">
                <p class="font-medium">{{ $order->shipping_name }}</p>
                <p class="text-gray-400">{{ $order->shipping_email }}</p>
                @if($order->shipping_phone)
                    <p class="text-gray-400">{{ $order->shipping_phone }}</p>
                @endif
                <p class="text-gray-400">{{ $order->shipping_address }}</p>
                <p class="text-gray-400">{{ $order->shipping_city }}, {{ $order->shipping_state }}</p>
                <p class="text-gray-400">{{ $order->shipping_country }} {{ $order->shipping_zip_code }}</p>
            </div>
        </div>

        <!-- Order Items -->
        <div class="bg-gray-900 rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Order Items</h2>
            <div class="space-y-3">
                @foreach($order->orderItems as $item)
                    <div class="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium">{{ $item->product_name }}</p>
                                <p class="text-sm text-gray-400">Qty: {{ $item->quantity }}</p>
                            </div>
                        </div>
                        <span class="text-[#65644A] font-bold">₦{{ number_format($item->total_price, 2) }}</span>
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4 text-blue-300">What's Next?</h2>
            <div class="space-y-3">
                <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                        <p class="font-medium text-blue-200">Order Confirmation Email</p>
                        <p class="text-blue-100 text-sm">We've sent a confirmation email to {{ $order->shipping_email }}</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                        <p class="font-medium text-blue-200">Order Processing</p>
                        <p class="text-blue-100 text-sm">We'll start processing your order and prepare it for shipping</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                        <p class="font-medium text-blue-200">Shipping Updates</p>
                        <p class="text-blue-100 text-sm">You'll receive updates about your order status and tracking information</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
            <a href="{{ route('index') }}" 
               class="flex-1 bg-[#65644A] hover:bg-[#65644A]/90 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center">
                Continue Shopping
            </a>
            <button onclick="window.print()" 
                    class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Print Receipt
            </button>
        </div>

        <!-- Contact Information -->
        <div class="text-center text-gray-400 text-sm">
            <p>Have questions about your order?</p>
            <p>Contact us at <a href="mailto:support@paperviewonline.com" class="text-[#65644A] hover:underline">support@paperviewonline.com</a></p>
        </div>
    </div>
</div>
@endsection 