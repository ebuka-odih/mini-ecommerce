<div style="height: 100%; background: white; color: black; display: flex; flex-direction: column;" id="cart-sidebar">
    <!-- Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px; border-bottom: 1px solid #f0f0f0;">
        <h2 style="font-size: 20px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Shopping Cart</h2>
        <button onclick="window.closeSlideover()" style="color: #666; background: none; border: none; cursor: pointer; transition: color 0.3s ease;">
            <svg style="width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>

    <!-- Flash Messages -->
    @if(session('cart_message'))
        <div style="padding: 16px; margin: 16px; background: #f0f9ff; border: 1px solid #0ea5e9; color: #0c4a6e; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            {{ session('cart_message') }}
        </div>
    @endif
    
    @if(session('cart_error'))
        <div style="padding: 16px; margin: 16px; background: #fef2f2; border: 1px solid #ef4444; color: #991b1b; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            {{ session('cart_error') }}
        </div>
    @endif

    <!-- Cart Items -->
    <div style="flex: 1; overflow-y: auto; padding: 24px;">
        @if($cart && count($cart) > 0)
            <div style="display: flex; flex-direction: column; gap: 16px;">
                @foreach($cart as $productId => $item)
                    <div style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; background: white;">
                        <!-- Product Image -->
                        <div style="flex-shrink: 0;">
                            <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}" 
                                 style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px;">
                        </div>

                        <!-- Product Details -->
                        <div style="flex: 1; min-width: 0;">
                            <h3 style="font-weight: 500; color: black; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $item['name'] }}</h3>
                            <p style="color: #65644A; font-weight: 600; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">₦{{ number_format($item['price'], 2) }}</p>
                        </div>

                        <!-- Quantity Controls -->
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <form action="{{ route('cart.update') }}" method="POST" style="display: inline; margin: 0;" class="cart-form">
                                @csrf
                                <input type="hidden" name="product_id" value="{{ $productId }}" />
                                <input type="hidden" name="action" value="decrease" />
                                <button type="submit" style="width: 24px; height: 24px; background: #f3f4f6; border: 1px solid #e5e7eb; color: black; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; cursor: pointer;">
                                    <svg style="width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"></path>
                                    </svg>
                                </button>
                            </form>
                            
                            <span style="width: 32px; text-align: center; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">{{ $item['quantity'] }}</span>
                            
                            <form action="{{ route('cart.update') }}" method="POST" style="display: inline; margin: 0;" class="cart-form">
                                @csrf
                                <input type="hidden" name="product_id" value="{{ $productId }}" />
                                <input type="hidden" name="action" value="increase" />
                                <button type="submit" style="width: 24px; height: 24px; background: #f3f4f6; border: 1px solid #e5e7eb; color: black; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; cursor: pointer;">
                                    <svg style="width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <!-- Item Total -->
                        <div style="text-align: right;">
                            <p style="font-weight: 600; color: black; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">₦{{ number_format($item['price'] * $item['quantity'], 2) }}</p>
                        </div>

                        <!-- Remove Button -->
                        <div style="flex-shrink: 0;">
                            <form action="{{ route('cart.remove') }}" method="POST" style="display: inline; margin: 0;" class="cart-form">
                                @csrf
                                <input type="hidden" name="product_id" value="{{ $productId }}" />
                                <button type="submit" style="color: #ef4444; background: none; border: none; cursor: pointer; transition: color 0.3s ease;">
                                    <svg style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div style="text-align: center; padding: 32px 0;">
                <div style="width: 64px; height: 64px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                    <svg style="width: 32px; height: 32px; color: #9ca3af; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                </div>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Your cart is empty</h3>
                <p style="color: #6b7280; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Add some items to get started</p>
            </div>
        @endif
    </div>

    <!-- Cart Summary -->
    @if($cart && count($cart) > 0)
        <div style="border-top: 1px solid #f0f0f0; padding: 24px; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 16px; font-weight: 600; color: black; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Subtotal:</span>
                <span style="font-size: 18px; font-weight: 700; color: black; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">₦{{ number_format($subtotal, 2) }}</span>
            </div>

            <a href="{{ route('checkout') }}" style="display: block; width: 100%; background: #65644A; color: white; text-align: center; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; transition: background-color 0.3s ease;">
                    Proceed to Checkout
                </a>
                
            <a href="{{ route('index') }}" style="display: block; width: 100%; background: white; color: #65644A; text-align: center; padding: 12px; border: 1px solid #65644A; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 12px; transition: all 0.3s ease;">
                Continue Shopping
                </a>
        </div>
    @endif
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle cart form submissions
    const cartForms = document.querySelectorAll('.cart-form');
    
    cartForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const url = form.action;
            const method = form.method;
            
            // Show loading state on the button
            const submitButton = form.querySelector('button[type="submit"]');
            const originalContent = submitButton.innerHTML;
            submitButton.innerHTML = '<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
            submitButton.disabled = true;
            
            fetch(url, {
                method: method,
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json, text/html, */*'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success - refresh the cart sidebar content
                    return fetch('{{ route("cart.sidebar") }}', {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'text/html, */*'
                        }
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(response => response.text())
            .then(html => {
                // Update the cart sidebar content
                const cartSidebar = document.getElementById('cart-sidebar');
                if (cartSidebar) {
                    cartSidebar.innerHTML = html;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Show error message
                const cartSidebar = document.getElementById('cart-sidebar');
                if (cartSidebar) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'p-4 m-4 bg-red-900/80 text-red-200 rounded';
                    errorDiv.textContent = 'Error updating cart. Please try again.';
                    cartSidebar.insertBefore(errorDiv, cartSidebar.firstChild);
                    
                    // Remove error message after 3 seconds
                    setTimeout(() => {
                        if (errorDiv.parentNode) {
                            errorDiv.remove();
                        }
                    }, 3000);
                }
            })
            .finally(() => {
                // Restore button state
                submitButton.innerHTML = originalContent;
                submitButton.disabled = false;
            });
        });
    });
});
</script>
 