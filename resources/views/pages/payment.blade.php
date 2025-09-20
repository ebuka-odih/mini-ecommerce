@extends('pages.layout.app')

@section('title', 'Payment - Order #' . $order->order_number)

@section('content')
<div class="max-w-4xl mx-auto bg-black rounded-2xl shadow-lg p-8 mt-8 text-white">
    <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Complete Payment</h1>
        <p class="text-gray-400">Order #{{ $order->order_number }}</p>
    </div>

    @if(session('success'))
        <div class="mb-6 p-4 bg-green-900/80 text-green-200 rounded-lg">
            {{ session('success') }}
        </div>
    @endif

    @if(session('error'))
        <div class="mb-6 p-4 bg-red-900/80 text-red-200 rounded-lg">
            {{ session('error') }}
        </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Order Details -->
        <div class="space-y-6">
            <div class="bg-gray-900 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Order Details</h2>
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
                        <span class="text-gray-400">Status:</span>
                        <span class="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-sm">
                            {{ ucfirst($order->status) }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Payment Status:</span>
                        <span class="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-sm">
                            {{ ucfirst($order->payment_status) }}
                        </span>
                    </div>
                </div>
            </div>

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
        </div>

        <!-- Payment Section -->
        <div class="space-y-6">
            <div class="bg-gray-900 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Payment Summary</h2>
                <div class="space-y-3">
                    <div class="flex justify-between text-gray-400">
                        <span>Subtotal:</span>
                        <span>₦{{ number_format($order->subtotal, 2) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-400">
                        <span>Shipping:</span>
                        <span>₦{{ number_format($order->shipping_cost, 2) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-400">
                        <span>Tax:</span>
                        <span>₦{{ number_format($order->tax, 2) }}</span>
                    </div>
                    @if($order->discount > 0)
                        <div class="flex justify-between text-green-400">
                            <span>Discount:</span>
                            <span>-₦{{ number_format($order->discount, 2) }}</span>
                        </div>
                    @endif
                    <div class="border-t border-gray-700 pt-3 flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span class="text-[#65644A]">₦{{ number_format($order->total, 2) }}</span>
                    </div>
                </div>
            </div>

            <div class="bg-gray-900 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Payment Method</h2>
                <div class="space-y-4">
                    <div class="flex items-center space-x-3 p-4 border border-[#65644A] rounded-lg bg-gray-800">
                        <div class="h-8 w-20 bg-white rounded flex items-center justify-center">
                            <span class="text-black font-bold text-xs">PAYSTACK</span>
                        </div>
                        <div>
                            <p class="font-medium">Paystack</p>
                            <p class="text-sm text-gray-400">Card, Bank Transfer, USSD</p>
                        </div>
                    </div>
                    
                    <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                        <div class="flex items-start space-x-3">
                            <svg class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <p class="text-blue-300 font-medium">Secure Payment</p>
                                <p class="text-blue-200 text-sm mt-1">Your payment information is encrypted and secure. We use Paystack's secure payment gateway.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Button -->
            <div class="space-y-4">
                <!-- JavaScript Version -->
                <button id="pay-button" 
                        onclick="console.log('Inline click handler works!')"
                        class="w-full bg-[#65644A] hover:bg-[#65644A]/90 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span>Pay ₦{{ number_format($order->total, 2) }}</span>
                </button>
                
                <!-- Fallback Form Version (if JavaScript fails) -->
                <form id="payment-form" action="{{ route('payment.initialize', $order) }}" method="POST" class="hidden">
                    @csrf
                    <button type="submit" class="w-full bg-[#65644A] hover:bg-[#65644A]/90 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        <span>Pay ₦{{ number_format($order->total, 2) }} (Form)</span>
                    </button>
                </form>
                
                <div id="loading" class="hidden text-center">
                    <div class="inline-flex items-center space-x-2 text-[#65644A]">
                        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Initializing payment...</span>
                    </div>
                </div>

                <div id="error" class="hidden p-4 bg-red-900/80 text-red-200 rounded-lg">
                    <p id="error-message"></p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    console.log('Payment page loaded');
    
    const payButton = document.getElementById('pay-button');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');

    console.log('Pay button found:', payButton);
    console.log('Loading element found:', loading);
    console.log('Error element found:', error);

    if (!payButton) {
        console.error('Pay button not found!');
        // Show fallback form
        document.getElementById('payment-form').classList.remove('hidden');
        return;
    }

    // Test if button is clickable
    console.log('Button disabled:', payButton.disabled);
    console.log('Button style pointer-events:', getComputedStyle(payButton).pointerEvents);
    console.log('Button style cursor:', getComputedStyle(payButton).cursor);

    payButton.addEventListener('click', function(e) {
        console.log('Pay button clicked!');
        e.preventDefault();
        
        // Show loading state
        payButton.classList.add('hidden');
        loading.classList.remove('hidden');
        error.classList.add('hidden');

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        console.log('CSRF Token:', csrfToken);

        // Initialize payment
        fetch('{{ route("payment.initialize", $order) }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || '{{ csrf_token() }}',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);
            
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                // If not JSON, get the text and log it
                return response.text().then(text => {
                    console.error('Non-JSON response received:', text);
                    throw new Error('Server returned non-JSON response: ' + text.substring(0, 200));
                });
            }
        })
        .then(data => {
            console.log('Payment response:', data);
            if (data.success) {
                // Redirect to Paystack payment page
                console.log('Redirecting to:', data.authorization_url);
                // Use window.location.href for redirects, not fetch
                window.location.href = data.authorization_url;
            } else {
                // Show error
                console.error('Payment failed:', data.message);
                errorMessage.textContent = data.message || 'Payment initialization failed. Please try again.';
                error.classList.remove('hidden');
                payButton.classList.remove('hidden');
                loading.classList.add('hidden');
            }
        })
        .catch(err => {
            console.error('Payment error:', err);
            errorMessage.textContent = 'An error occurred. Please try again.';
            error.classList.remove('hidden');
            payButton.classList.remove('hidden');
            loading.classList.add('hidden');
            
            // Show fallback form if JavaScript fails
            document.getElementById('payment-form').classList.remove('hidden');
        });
    });

    console.log('Event listener added to pay button');
});
</script>
@endsection 