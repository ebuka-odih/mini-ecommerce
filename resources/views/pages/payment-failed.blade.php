@extends('pages.layout.app')

@section('title', 'Payment Failed')

@section('content')
<div class="max-w-2xl mx-auto bg-black rounded-2xl shadow-lg p-8 mt-8 text-white">
    <div class="text-center mb-8">
        <div class="w-20 h-20 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </div>
        <h1 class="text-3xl font-bold mb-2 text-red-400">Payment Failed</h1>
        <p class="text-gray-400">We couldn't process your payment</p>
    </div>

    @if(session('error'))
        <div class="mb-6 p-4 bg-red-900/80 text-red-200 rounded-lg">
            {{ session('error') }}
        </div>
    @endif

    @if($order)
        <div class="space-y-6">
            <!-- Order Information -->
            <div class="bg-gray-900 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Order Information</h2>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Order Number:</span>
                        <span class="font-medium">{{ $order->order_number }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Total Amount:</span>
                        <span class="text-[#65644A] font-bold">₦{{ number_format($order->total, 2) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Payment Status:</span>
                        <span class="px-2 py-1 bg-red-900/50 text-red-300 rounded text-sm">
                            Failed
                        </span>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- Common Issues -->
    <div class="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-yellow-300">Common Payment Issues</h2>
        <div class="space-y-3">
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                    <p class="font-medium text-yellow-200">Insufficient Funds</p>
                    <p class="text-yellow-100 text-sm">Make sure your account has sufficient funds for the transaction</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                    <p class="font-medium text-yellow-200">Card Declined</p>
                    <p class="text-yellow-100 text-sm">Your bank may have declined the transaction for security reasons</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                    <p class="font-medium text-yellow-200">Network Issues</p>
                    <p class="text-yellow-100 text-sm">Temporary network issues may have caused the payment to fail</p>
                </div>
            </div>
        </div>
    </div>

    <!-- What You Can Do -->
    <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-300">What You Can Do</h2>
        <div class="space-y-3">
            <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="text-white text-sm font-bold">1</span>
                </div>
                <div>
                    <p class="font-medium text-blue-200">Try Again</p>
                    <p class="text-blue-100 text-sm">You can attempt the payment again with the same or a different payment method</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="text-white text-sm font-bold">2</span>
                </div>
                <div>
                    <p class="font-medium text-blue-200">Contact Your Bank</p>
                    <p class="text-blue-100 text-sm">If the issue persists, contact your bank to ensure there are no restrictions</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="text-white text-sm font-bold">3</span>
                </div>
                <div>
                    <p class="font-medium text-blue-200">Contact Support</p>
                    <p class="text-blue-100 text-sm">If you need assistance, our support team is here to help</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-4">
        @if($order)
            <a href="{{ route('payment.show', $order) }}" 
               class="w-full bg-[#65644A] hover:bg-[#65644A]/90 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center block">
                Try Payment Again
            </a>
        @endif
        
        <a href="{{ route('cart.index') }}" 
           class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center block">
            Return to Cart
        </a>
        
        <a href="{{ route('index') }}" 
           class="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center block">
            Continue Shopping
        </a>
    </div>

    <!-- Contact Information -->
    <div class="text-center text-gray-400 text-sm mt-6">
        <p>Need help? Contact our support team</p>
        <p>Email: <a href="mailto:support@paperviewonline.com" class="text-[#65644A] hover:underline">support@paperviewonline.com</a></p>
        <p>Phone: <a href="tel:+2341234567890" class="text-[#65644A] hover:underline">+234 123 456 7890</a></p>
    </div>
</div>
@endsection 