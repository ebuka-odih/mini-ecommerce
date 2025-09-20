@extends('pages.layout.app')

@section('content')
<div style="background: white; min-height: 100vh;">
    <!-- Banner Section -->
    <div class="banner-section" style="position: relative; width: 100%; height: 60vh; background-image: url('/media/11.jpeg'); background-size: cover; background-position: center; background-repeat: no-repeat; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3);"></div>
        <div style="position: relative; z-index: 2; text-align: center;">
            <h1 class="banner-title" style="color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 48px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 16px;">
                Collection
            </h1>
            <p class="banner-subtitle" style="color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 300; letter-spacing: 0.1em;">
                Discover our latest pieces
            </p>
        </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar" style="background: white; border-bottom: 1px solid #e5e5e5; padding: 20px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div class="filter-container" style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 20px;">
                <!-- Category Filter -->
                <div class="relative inline-block text-left">
                    <div>
                        <button type="button" id="categoryDropdown" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black uppercase tracking-wide hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Category
                            <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Dropdown Menu -->
                    <div id="categoryMenu" class="hidden absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div class="py-1">
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All Categories</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Shirt</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Jacket</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Jeans</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Shorts</a>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    </div>

    <!-- Products Grid -->
    <div class="products-container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
        @if($products->count() > 0)
            <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
                @foreach($products as $product)
                    <div class="product-card" style="background: white; border: 1px solid #f0f0f0; transition: all 0.3s ease; cursor: pointer; overflow: hidden;">
                        <!-- Product Image -->
                        <div class="product-image" style="position: relative; width: 100%; height: 350px; overflow: hidden;">
                            <a href="{{ route('product.show', $product->slug) }}" style="display: block; width: 100%; height: 100%; text-decoration: none;">
                                @if($product->featuredImageUrl)
                                    <img src="{{ $product->featuredImageUrl }}" 
                                         alt="{{ $product->name }}" 
                                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                                @else
                                    <div style="width: 100%; height: 100%; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                                        <span style="color: #999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px;">
                                            No Image
                                        </span>
                                    </div>
                                @endif
                            </a>
                            
                            <!-- Wishlist Icon -->
                            <div class="wishlist-icon" style="position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 10;">
                                <svg style="width: 16px; height: 16px; fill: none; stroke: black; stroke-width: 2;" viewBox="0 0 24 24">
                                    <path d="M20.84 4.61A5.5 5.5 0 0 0 12 5.67L10.94 4.61A5.5 5.5 0 0 0 3.16 12.39L12 21.23L20.84 12.39A5.5 5.5 0 0 0 20.84 4.61Z"/>
                                </svg>
                            </div>
                        </div>

                        <!-- Product Info -->
                        <div class="product-info" style="padding: 20px;">
                            <h3 class="product-title" style="color: black; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0.05em; line-height: 1.4; margin-bottom: 8px; text-transform: uppercase;">
                                {{ $product->name }}
                            </h3>
                            
                            <div class="product-price" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <span style="color: black; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 500;">
                                    ₦{{ number_format($product->final_price, 2) }}
                                </span>
                                
                                @if($product->isOnSale)
                                    <span style="color: #999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; text-decoration: line-through;">
                                        ₦{{ number_format($product->price, 2) }}
                                    </span>
                                @endif
                            </div>

                            <!-- Shop This Link -->
                            <a href="{{ route('product.show', $product->slug) }}" 
                               class="shop-link"
                               style="color: black; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: underline; display: inline-block; transition: color 0.3s ease;">
                                Shop This
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <!-- No Products Message -->
            <div style="text-align: center; padding: 80px 20px;">
                <h2 style="color: black; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 300; letter-spacing: 0.1em; margin-bottom: 16px;">
                    No Products Available
                </h2>
                <p style="color: #666; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 300;">
                    Check back soon for our latest collection.
                </p>
            </div>
        @endif
    </div>
</div>

<style>
    /* Mobile Responsive */
    @media (max-width: 768px) {
        .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
        }
        
        .product-card {
            border: none !important;
            border-bottom: 1px solid #f0f0f0 !important;
            border-radius: 0 !important;
        }
        
        .product-image {
            height: 250px !important;
        }
        
        .product-info {
            padding: 15px !important;
        }
        
        .product-title {
            font-size: 12px !important;
            margin-bottom: 6px !important;
        }
        
        .product-price {
            font-size: 14px !important;
            margin-bottom: 12px !important;
        }
        
        .shop-link {
            font-size: 11px !important;
        }
        
        .banner-section {
            height: 40vh !important;
        }
        
        .banner-title {
            font-size: 32px !important;
        }
        
        .banner-subtitle {
            font-size: 16px !important;
        }
        
        .filter-bar {
            padding: 15px 0 !important;
        }
        
        .filter-container {
            padding: 0 15px !important;
            gap: 15px !important;
        }
        
        .filter-item {
            font-size: 12px !important;
        }
        
        .products-container {
            padding: 20px 15px !important;
        }
    }
    
    /* Hover Effects */
    .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    
    .product-card:hover .product-image img {
        transform: scale(1.05);
    }
    
    .wishlist-icon:hover {
        background: rgba(255,255,255,1) !important;
        transform: scale(1.1);
    }
    
    .shop-link:hover {
        color: #65644A !important;
    }
    
    /* Dropdown Styles */
    .category-dropdown {
        position: relative;
        display: inline-block;
    }
    
    .category-trigger {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    .category-trigger:hover {
        background-color: #f8f8f8;
    }
    
    .category-trigger span {
        color: black;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    
    .dropdown-arrow {
        width: 12px;
        height: 12px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        transition: transform 0.3s ease;
    }
    
    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        min-width: 250px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        margin-top: 4px;
        display: none;
        padding: 0;
    }
    
    .dropdown-menu.show {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
        display: block !important;
    }
    
    .dropdown-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        color: black;
        text-align: left;
        display: block;
        width: 100%;
        box-sizing: border-box;
        line-height: 1.4;
    }
    
    .dropdown-item:last-child {
        border-bottom: none;
    }
    
    .dropdown-item:hover {
        background-color: #f8f8f8;
    }
    
    .dropdown-arrow.rotated {
        transform: rotate(180deg);
    }
    
    /* Prevent external scripts from modifying SVG elements */
    svg[data-no-translate],
    svg[data-ignore] {
        pointer-events: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
    }
    
    svg[data-no-translate] path,
    svg[data-ignore] path {
        pointer-events: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing dropdown...');
        
        // Prevent SVG parsing errors
        try {
            // Category dropdown functionality
            const categoryDropdown = document.getElementById('categoryDropdown');
            const categoryMenu = document.getElementById('categoryMenu');
            const dropdownArrow = categoryDropdown.querySelector('svg');
            
            console.log('Elements found:', {
                categoryDropdown: !!categoryDropdown,
                categoryMenu: !!categoryMenu,
                dropdownArrow: !!dropdownArrow
            });
            
            if (categoryDropdown && categoryMenu && dropdownArrow) {
                // Ensure dropdown starts hidden
                categoryMenu.classList.add('hidden');
                
                categoryDropdown.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Category dropdown clicked');
                    
                    const isVisible = !categoryMenu.classList.contains('hidden');
                    console.log('Dropdown currently visible:', isVisible);
                    
                    // Toggle dropdown visibility
                    if (isVisible) {
                        categoryMenu.classList.add('hidden');
                        dropdownArrow.classList.remove('rotate-180');
                    } else {
                        categoryMenu.classList.remove('hidden');
                        dropdownArrow.classList.add('rotate-180');
                    }
                    
                    console.log('Dropdown visibility after toggle:', !categoryMenu.classList.contains('hidden'));
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (!categoryDropdown.contains(e.target)) {
                        categoryMenu.classList.add('hidden');
                        dropdownArrow.classList.remove('rotate-180');
                    }
                });
                
                // Handle dropdown item clicks
                const dropdownItems = categoryMenu.querySelectorAll('a');
                dropdownItems.forEach(item => {
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const selectedCategory = this.textContent.trim();
                        console.log('Selected category:', selectedCategory);
                        
                        // Here you can add logic to filter products by category
                        // For now, we'll just close the dropdown
                        categoryMenu.classList.add('hidden');
                        dropdownArrow.classList.remove('rotate-180');
                    });
                });
                
                console.log('Dropdown event listeners attached successfully');
            } else {
                console.error('Required dropdown elements not found');
            }
        } catch (error) {
            console.error('Error initializing dropdown:', error);
        }
        
        // Prevent external scripts from interfering with SVG elements
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(svg => {
            svg.setAttribute('data-no-translate', 'true');
            svg.setAttribute('data-ignore', 'true');
            svg.style.pointerEvents = 'none';
            
            // Protect SVG paths from external scripts
            const paths = svg.querySelectorAll('path');
            paths.forEach(path => {
                path.setAttribute('data-no-translate', 'true');
                path.setAttribute('data-ignore', 'true');
            });
        });
        
        // Disable external translation scripts for SVG elements
        if (window.jQuery) {
            jQuery('svg').attr('data-no-translate', 'true');
            jQuery('svg path').attr('data-no-translate', 'true');
        }
        
        // Override any external SVG processing
        const originalAppend = Element.prototype.appendChild;
        Element.prototype.appendChild = function(child) {
            if (child.tagName === 'SVG' || child.querySelector && child.querySelector('svg')) {
                child.setAttribute('data-no-translate', 'true');
                child.setAttribute('data-ignore', 'true');
            }
            return originalAppend.call(this, child);
        };
    });
</script>
@endsection
