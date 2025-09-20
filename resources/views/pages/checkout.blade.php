@extends('pages.layout.app')

@section('title', 'Checkout')

<style>
    /* AGGRESSIVE CSS TO FORCE DARK INPUTS - MAXIMUM SPECIFICITY */
    
    /* Target every possible input selector with maximum specificity */
    .checkout-form input[type=text], 
    .checkout-form input:where(:not([type])), 
    .checkout-form input[type=email], 
    .checkout-form input[type=url], 
    .checkout-form input[type=password], 
    .checkout-form input[type=number], 
    .checkout-form input[type=date], 
    .checkout-form input[type=datetime-local], 
    .checkout-form input[type=month], 
    .checkout-form input[type=search], 
    .checkout-form input[type=tel], 
    .checkout-form input[type=time], 
    .checkout-form input[type=week], 
    .checkout-form input[multiple], 
    .checkout-form textarea, 
    .checkout-form select,
    div.checkout-form input[type=text], 
    div.checkout-form input:where(:not([type])), 
    div.checkout-form input[type=email], 
    div.checkout-form input[type=url], 
    div.checkout-form input[type=password], 
    div.checkout-form input[type=number], 
    div.checkout-form input[type=date], 
    div.checkout-form input[type=datetime-local], 
    div.checkout-form input[type=month], 
    div.checkout-form input[type=search], 
    div.checkout-form input[type=tel], 
    div.checkout-form input[type=time], 
    div.checkout-form input[type=week], 
    div.checkout-form input[multiple], 
    div.checkout-form textarea, 
    div.checkout-form select {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #374151 !important;
        border: 1px solid #d1d5db !important;
        border-color: #d1d5db !important;
        border-radius: 6px !important;
        padding: 8px 12px !important;
        font-size: 16px !important;
        line-height: 24px !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
    }
    
    /* Even more specific selectors for stubborn inputs */
    form.checkout-form input,
    form.checkout-form select,
    form.checkout-form textarea,
    [class*="checkout-form"] input,
    [class*="checkout-form"] select,
    [class*="checkout-form"] textarea {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #374151 !important;
        border: 1px solid #d1d5db !important;
    }
    
    /* Placeholder text */
    .checkout-form input::placeholder,
    .checkout-form textarea::placeholder,
    div.checkout-form input::placeholder,
    div.checkout-form textarea::placeholder,
    form.checkout-form input::placeholder,
    form.checkout-form textarea::placeholder {
        color: #6b7280 !important;
        opacity: 1 !important;
    }
    
    /* Focus states with high specificity */
    .checkout-form input:focus,
    .checkout-form select:focus,
    .checkout-form textarea:focus,
    div.checkout-form input:focus,
    div.checkout-form select:focus,
    div.checkout-form textarea:focus,
    form.checkout-form input:focus,
    form.checkout-form select:focus,
    form.checkout-form textarea:focus {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #374151 !important;
        border-color: #65644A !important;
        box-shadow: 0 0 0 2px rgba(101, 100, 74, 0.3) !important;
        outline: none !important;
    }
    
    /* Select dropdown options */
    .checkout-form select option,
    div.checkout-form select option,
    form.checkout-form select option {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #374151 !important;
    }
    
    /* Webkit autofill with maximum specificity */
    .checkout-form input:-webkit-autofill,
    .checkout-form input:-webkit-autofill:hover,
    .checkout-form input:-webkit-autofill:focus,
    div.checkout-form input:-webkit-autofill,
    div.checkout-form input:-webkit-autofill:hover,
    div.checkout-form input:-webkit-autofill:focus,
    form.checkout-form input:-webkit-autofill,
    form.checkout-form input:-webkit-autofill:hover,
    form.checkout-form input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
        -webkit-text-fill-color: #374151 !important;
        border: 1px solid #d1d5db !important;
        transition: background-color 5000s ease-in-out 0s !important;
    }
    
    /* Nuclear option - target ANY input on the page */
    * input[type="text"],
    * input[type="email"], 
    * input[type="tel"],
    * input[type="password"],
    * select,
    * textarea {
        background: #ffffff !important;
        color: #374151 !important;
        border: 1px solid #d1d5db !important;
    }

    /* OVERRIDE COMPILED CSS - MAXIMUM SPECIFICITY WITH INLINE STYLES */
    
    html body div.max-w-4xl form.checkout-form [type=text], 
    html body div.max-w-4xl form.checkout-form input:where(:not([type])), 
    html body div.max-w-4xl form.checkout-form [type=email], 
    html body div.max-w-4xl form.checkout-form [type=url], 
    html body div.max-w-4xl form.checkout-form [type=password], 
    html body div.max-w-4xl form.checkout-form [type=number], 
    html body div.max-w-4xl form.checkout-form [type=date], 
    html body div.max-w-4xl form.checkout-form [type=datetime-local], 
    html body div.max-w-4xl form.checkout-form [type=month], 
    html body div.max-w-4xl form.checkout-form [type=search], 
    html body div.max-w-4xl form.checkout-form [type=tel], 
    html body div.max-w-4xl form.checkout-form [type=time], 
    html body div.max-w-4xl form.checkout-form [type=week], 
    html body div.max-w-4xl form.checkout-form [multiple], 
    html body div.max-w-4xl form.checkout-form textarea, 
    html body div.max-w-4xl form.checkout-form select {
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        background-color: #ffffff !important;
        background: #ffffff !important;
        color: #374151 !important;
        border-color: #d1d5db !important;
        border: 1px solid #d1d5db !important;
        border-width: 1px !important;
        border-radius: 6px !important;
        padding: 0.5rem 0.75rem !important;
        font-size: 1rem !important;
        line-height: 1.5rem !important;
        --tw-shadow: 0 0 #0000 !important;
    }
    
    /* FOCUS STATES WITH ULTRA HIGH SPECIFICITY */
    html body div.max-w-4xl form.checkout-form [type=text]:focus, 
    html body div.max-w-4xl form.checkout-form input:where(:not([type])):focus, 
    html body div.max-w-4xl form.checkout-form [type=email]:focus, 
    html body div.max-w-4xl form.checkout-form [type=url]:focus, 
    html body div.max-w-4xl form.checkout-form [type=password]:focus, 
    html body div.max-w-4xl form.checkout-form [type=number]:focus, 
    html body div.max-w-4xl form.checkout-form [type=date]:focus, 
    html body div.max-w-4xl form.checkout-form [type=datetime-local]:focus, 
    html body div.max-w-4xl form.checkout-form [type=month]:focus, 
    html body div.max-w-4xl form.checkout-form [type=search]:focus, 
    html body div.max-w-4xl form.checkout-form [type=tel]:focus, 
    html body div.max-w-4xl form.checkout-form [type=time]:focus, 
    html body div.max-w-4xl form.checkout-form [type=week]:focus, 
    html body div.max-w-4xl form.checkout-form [multiple]:focus, 
    html body div.max-w-4xl form.checkout-form textarea:focus, 
    html body div.max-w-4xl form.checkout-form select:focus {
        background-color: #ffffff !important;
        background: #ffffff !important;
        color: #374151 !important;
        border-color: #65644A !important;
        border: 1px solid #65644A !important;
        box-shadow: 0 0 0 2px rgba(101, 100, 74, 0.3) !important;
        outline: none !important;
         }
    
    /* Custom radio button styling for payment method */
    .checkout-form input[type="radio"]:checked {
        background-color: #2563eb !important;
        background: #2563eb !important;
        border-color: #2563eb !important;
        color: #ffffff !important;
    }
    
    .checkout-form input[type="radio"]:checked::before {
        background-color: #ffffff !important;
    }
    
    /* Force blue background for checked radio buttons */
    input[type="radio"]:checked {
        background-color: #2563eb !important;
        background: #2563eb !important;
        border-color: #2563eb !important;
        accent-color: #2563eb !important;
    }
</style>

<script>
    // JAVASCRIPT BACKUP TO FORCE INPUT STYLING AFTER PAGE LOAD
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Forcing input styles with JavaScript...');
        
        // Function to apply light styling to inputs
        function forceInputStyling() {
            const inputs = document.querySelectorAll('input, select, textarea');
            console.log('Found inputs:', inputs.length);
            
            inputs.forEach(function(input) {
                // Skip radio buttons for special handling
                if (input.type === 'radio') {
                    // Handle radio button styling
                    if (input.checked) {
                        input.style.setProperty('background-color', '#2563eb', 'important');
                        input.style.setProperty('background', '#2563eb', 'important');
                        input.style.setProperty('border-color', '#2563eb', 'important');
                        input.style.setProperty('accent-color', '#2563eb', 'important');
                    } else {
                        input.style.setProperty('background-color', '#ffffff', 'important');
                        input.style.setProperty('background', '#ffffff', 'important');
                        input.style.setProperty('border-color', '#d1d5db', 'important');
                    }
                    
                    // Add change event listener for radio buttons
                    input.addEventListener('change', function() {
                        if (this.checked) {
                            this.style.setProperty('background-color', '#2563eb', 'important');
                            this.style.setProperty('background', '#2563eb', 'important');
                            this.style.setProperty('border-color', '#2563eb', 'important');
                            this.style.setProperty('accent-color', '#2563eb', 'important');
                        } else {
                            this.style.setProperty('background-color', '#ffffff', 'important');
                            this.style.setProperty('background', '#ffffff', 'important');
                            this.style.setProperty('border-color', '#d1d5db', 'important');
                        }
                    });
                    return;
                }
                
                // Force light background and dark text for other inputs
                input.style.setProperty('background-color', '#ffffff', 'important');
                input.style.setProperty('background', '#ffffff', 'important');
                input.style.setProperty('color', '#374151', 'important');
                input.style.setProperty('border', '1px solid #d1d5db', 'important');
                input.style.setProperty('border-color', '#d1d5db', 'important');
                input.style.setProperty('border-radius', '6px', 'important');
                input.style.setProperty('padding', '0.5rem 0.75rem', 'important');
                
                // Add focus event listener
                input.addEventListener('focus', function() {
                    this.style.setProperty('background-color', '#ffffff', 'important');
                    this.style.setProperty('background', '#ffffff', 'important');
                    this.style.setProperty('color', '#374151', 'important');
                    this.style.setProperty('border-color', '#65644A', 'important');
                    this.style.setProperty('box-shadow', '0 0 0 2px rgba(101, 100, 74, 0.3)', 'important');
                });
                
                // Add blur event to maintain styling
                input.addEventListener('blur', function() {
                    this.style.setProperty('background-color', '#ffffff', 'important');
                    this.style.setProperty('background', '#ffffff', 'important');
                    this.style.setProperty('color', '#374151', 'important');
                    this.style.setProperty('border-color', '#d1d5db', 'important');
                });
            });
        }
        
        // Apply styles immediately
        forceInputStyling();
        
        // Re-apply after a short delay (in case of dynamic content)
        setTimeout(forceInputStyling, 100);
        setTimeout(forceInputStyling, 500);
        setTimeout(forceInputStyling, 1000);
        
        // Watch for new inputs being added dynamically
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            const newInputs = node.querySelectorAll ? node.querySelectorAll('input, select, textarea') : [];
                            if (newInputs.length > 0) {
                                console.log('New inputs detected, applying styles...');
                                setTimeout(forceInputStyling, 50);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
</script>

@section('content')
<div class="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-4 sm:p-8 mt-8 text-gray-900">
    <h1 class="text-3xl font-bold mb-6">Checkout</h1>

    <!-- Success/Error Messages -->
    @if(session('success'))
        <div class="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {{ session('success') }}
        </div>
    @endif

    @if(session('error'))
        <div class="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {{ session('error') }}
        </div>
    @endif

    <x-splade-form action="{{ route('checkout.process') }}" method="POST" class="space-y-6 checkout-form">
        
        <!-- Customer Information -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 class="text-xl font-semibold mb-4">Customer Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block mb-1 font-semibold">Full Name *</label>
                    <x-splade-input name="name" :value="old('name')" required 
                                   class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none" />
                    @error('name')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label class="block mb-1 font-semibold">Email Address *</label>
                    <x-splade-input type="email" name="email" :value="old('email')" required 
                                   class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none" />
                    @error('email')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label class="block mb-1 font-semibold">Phone Number</label>
                    <x-splade-input name="phone" :value="old('phone')" 
                                   class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none" />
                    @error('phone')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>
        </div>

        <!-- Shipping Address -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 class="text-xl font-semibold mb-4">Shipping Address</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <label class="block mb-1 font-semibold">Street Address *</label>
                    <x-splade-input name="address" :value="old('address')" required 
                                   class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none" />
                    @error('address')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label class="block mb-1 font-semibold">City *</label>
                    <x-splade-input name="city" :value="old('city')" required 
                                   class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none" />
                    @error('city')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label class="block mb-1 font-semibold">State/Province *</label>
                    <x-splade-input name="state" :value="old('state')" required 
                                   class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none" />
                    @error('state')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label class="block mb-1 font-semibold">Country *</label>
                    <x-splade-select name="country" :value="old('country')" required 
                                    class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none">
                        <option value="">Select Country</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                    </x-splade-select>
                    @error('country')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label class="block mb-1 font-semibold">ZIP/Postal Code *</label>
                    <x-splade-input name="zip" :value="old('zip')" required 
                                   class="w-full px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-[#65644A] focus:border-[#65644A] focus:outline-none" />
                    @error('zip')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 class="text-xl font-semibold mb-4">Payment Method</h2>
            <div class="space-y-3">
                <label class="flex items-center space-x-3 cursor-pointer">
                    <x-splade-input type="radio" name="payment_method" value="paystack" :checked="old('payment_method', 'paystack') === 'paystack'"
                                   class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 checked:bg-blue-600 checked:border-blue-600" />
                    <div class="flex items-center space-x-2">
                        <div class="h-6 w-16 bg-white rounded flex items-center justify-center">
                            <span class="text-black font-bold text-xs">PAYSTACK</span>
                        </div>
                        <span class="font-medium">Paystack (Card, Bank Transfer, USSD)</span>
                    </div>
                </label>
                @error('payment_method')
                    <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
            @if($cart && count($cart) > 0)
                <div class="space-y-3 mb-4">
                    @foreach($cart as $item)
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 gap-2">
                            <a href="{{ route('product.show', $item['slug']) }}" class="flex items-center space-x-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                                <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}" class="w-12 h-12 object-cover rounded flex-shrink-0">
                                <div class="min-w-0 flex-1">
                                    <p class="font-medium truncate hover:text-[#65644A] transition-colors">{{ $item['name'] }}</p>
                                    <p class="text-sm text-gray-600">Qty: {{ $item['quantity'] }}</p>
                                </div>
                            </a>
                            <div class="flex-shrink-0 text-right">
                                <span class="text-[#65644A] font-bold text-sm sm:text-base">₦{{ number_format($item['price'] * $item['quantity'], 2) }}</span>
                            </div>
                        </div>
                    @endforeach
                </div>
                
                <div class="space-y-2 border-t border-gray-300 pt-4">
                    <div class="flex flex-col sm:flex-row sm:justify-between text-gray-600 gap-1">
                        <span class="text-sm sm:text-base">Subtotal ({{ count($cart) }} items):</span>
                        <span class="text-sm sm:text-base font-medium">₦{{ number_format($subtotal, 2) }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between text-gray-600 gap-1">
                        <span class="text-sm sm:text-base">Shipping:</span>
                        <span class="text-sm sm:text-base font-medium">₦{{ number_format($shipping, 2) }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between text-gray-600 gap-1">
                        <span class="text-sm sm:text-base">Tax:</span>
                        <span class="text-sm sm:text-base font-medium">₦{{ number_format($tax, 2) }}</span>
                    </div>
                    <div class="border-t border-gray-300 pt-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span class="text-lg font-semibold text-gray-900">Total:</span>
                        <span class="text-lg font-semibold text-[#65644A]">₦{{ number_format($total, 2) }}</span>
                    </div>
                </div>
            @else
                <p class="text-gray-600">Your cart is empty.</p>
            @endif
        </div>

        <x-splade-submit class="w-full bg-[#65644A] hover:bg-[#65644A]/90 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg">
            Proceed to Payment
        </x-splade-submit>
    </x-splade-form>
</div>
@endsection 