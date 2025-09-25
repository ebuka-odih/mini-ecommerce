<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Check if coming soon is enabled
        $settings = Setting::getComingSoonSettings();
        
        if ($settings['enabled'] && !session('coming-soon-bypassed')) {
            return Inertia::render('coming-soon', [
                'settings' => $settings
            ]);
        }
        
        // Get the selected frontpage setting
        $frontpage = Setting::getValue('frontpage', 'homepage');
        
        // Route to the appropriate frontpage based on setting
        if ($frontpage === 'homepage-second') {
            return $this->homepageSecond();
        }
        
        // Default homepage
        $products = Product::with('category')->latest()->take(4)->get();
        
        // Load featured products for hero slider
        $featuredProducts = Product::with('category')
        ->where('is_featured', true)
        ->where('is_active', true)
        ->orderBy('created_at', 'desc')
        ->take(6) // Limit to 6 featured products for the slider
        ->get()
        ->map(function ($product) {
            // Manually load images for each product
            $images = \App\Models\Image::where('imageable_type', 'App\Models\Product')
                ->where('imageable_id', $product->id)
                ->orderBy('sort_order')
                ->take(2) // Only get first 2 images
                ->get();
            // Add images as a custom attribute
            $product->images_data = $images;
            return $product;
        });
        
        // Load homepage layouts with their relationships
        $homepageLayouts = \App\Models\HomepageLayout::with(['category'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($layout) {
                // Manually load cover image due to UUID relationship issues
                if ($layout->cover_image_id) {
                    $coverImage = \App\Models\Image::find($layout->cover_image_id);
                    if ($coverImage) {
                        $layout->setRelation('cover_image', $coverImage);
                    }
                }
                
                // Add computed cover image URL
                $layout->cover_image_url_computed = $layout->cover_image_url;
                return $layout;
            });
        
        // Get settings for the homepage
        $settings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/img/paperview.png'),
            'currency' => Setting::getValue('currency', 'NGN'),
            'theme' => Setting::getValue('theme', 'dark'),
        ];

        return Inertia::render('index', [
            'products' => $products,
            'featuredProducts' => $featuredProducts,
            'homepageLayouts' => $homepageLayouts,
            'settings' => $settings
        ]);
    }

    public function show(Product $product)
    {
        $product->load([
            'images' => function($query) {
                $query->orderBy('sort_order');
            }, 
            'category',
            'variations.size',
            'variations.color'
        ]);
        
        // Ensure images have url attribute appended
        $images = $product->getRelation('images');
        if ($images && $images->count() > 0) {
            $images->each(function($image) {
                $image->append(['url', 'thumbnail_url']);
            });
        }
        
        // Get settings for the product page
        $settings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/img/paperview.png'),
            'currency' => Setting::getValue('currency', 'NGN'),
            'theme' => Setting::getValue('theme', 'dark'),
        ];

        return Inertia::render('product', [
            'product' => $product,
            'settings' => $settings
        ]);
    }

    public function getProduct($id)
    {
        $product = Product::with([
            'images' => function($query) {
                $query->orderBy('sort_order');
            }, 
            'category',
            'variations.size',
            'variations.color'
        ])->find($id);
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        
        // Ensure images have url attribute appended
        $images = $product->getRelation('images');
        if ($images && $images->count() > 0) {
            $images->each(function($image) {
                $image->append(['url', 'thumbnail_url']);
            });
        }
        
        return response()->json($product);
    }

    public function shop(Request $request)
    {
        $query = Product::with([
            'images' => function($query) {
                $query->orderBy('sort_order');
            }, 
            'category',
            'variations.size',
            'variations.color'
        ])
        ->where('is_active', true);

        // Category filter
        if ($request->filled('category')) {
            $categories = is_array($request->category) ? $request->category : [$request->category];
            $query->whereHas('category', function($q) use ($categories) {
                $q->whereIn('slug', $categories);
            });
        }

        // Search filter
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhereHas('category', function($categoryQuery) use ($searchTerm) {
                      $categoryQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }


        // Sorting
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'price_low_high':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high_low':
                $query->orderBy('price', 'desc');
                break;
            case 'name_a_z':
                $query->orderBy('name', 'asc');
                break;
            case 'name_z_a':
                $query->orderBy('name', 'desc');
                break;
            case 'featured':
                $query->orderBy('is_featured', 'desc')->orderBy('created_at', 'desc');
                break;
            default: // newest
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(12)->withQueryString();
        
        // Get all categories for filter sidebar
        $categories = \App\Models\Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        // Ensure all product images have url attributes appended
        $products->getCollection()->each(function($product) {
            if ($product->images && $product->images->count() > 0) {
                $product->images->each(function($image) {
                    $image->append(['url', 'thumbnail_url']);
                });
            }
        });

        // Get settings for the shop page
        $settings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/img/paperview.png'),
            'currency' => Setting::getValue('currency', 'NGN'),
            'theme' => Setting::getValue('theme', 'dark'),
        ];

        return Inertia::render('shop', [
            'products' => $products->items(),
            'categories' => $categories,
            'current_filters' => [
                'category' => $request->get('category', []),
                'size' => $request->get('size', []),
            ],
            'current_sort' => $sortBy,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
            'settings' => $settings
        ]);
    }
    
    public function homepageSecond()
    {
        // Get featured products for the black theme homepage
        $featuredProducts = Product::with(['category', 'images'])
            ->where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($product) {
                // Ensure images are properly loaded
                if ($product->getRelation('images') && $product->getRelation('images')->count() > 0) {
                    $product->getRelation('images')->each(function ($image) {
                        $image->url = $image->url;
                        $image->thumbnail_url = $image->thumbnail_url;
                    });
                }
                return $product;
            });

        // Get categories for the black theme homepage
        $categories = \App\Models\Category::with('image')
            ->where('is_active', true)
            ->orderBy('name')
            ->take(6)
            ->get()
            ->map(function ($category) {
                // Ensure image is properly loaded
                if ($category->getRelation('image')) {
                    $image = $category->getRelation('image');
                    $image->url = $image->url;
                    $image->thumbnail_url = $image->thumbnail_url;
                }
                return $category;
            });

        // Get slider images from settings
        $selectedImageIds = Setting::getValue('homepage_slider_images', []);
        
        $sliderImages = [];
        if (!empty($selectedImageIds)) {
            $images = \App\Models\Image::whereIn('id', $selectedImageIds)->get();
            
            // Sort by the order they appear in selectedImageIds array
            $sliderImages = collect($selectedImageIds)
                ->map(function ($id) use ($images) {
                    return $images->firstWhere('id', $id);
                })
                ->filter() // Remove null values
                ->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                        'alt_text' => $image->alt_text ?: $image->original_name,
                        'width' => $image->width,
                        'height' => $image->height,
                    ];
                })
                ->values()
                ->toArray();
        }

        return Inertia::render('homepage-second', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'sliderImages' => $sliderImages
        ]);
    }
    
    public function verifyComingSoonPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string'
        ]);
        
        $settings = Setting::getComingSoonSettings();
        
        if ($settings['enabled'] && $request->password === $settings['password']) {
            // Store in session that user has bypassed coming soon
            session(['coming-soon-bypassed' => true]);
            
            return redirect()->route('index')->with('success', 'Welcome! You now have access to the site.');
        }
        
        return back()->withErrors(['password' => 'Incorrect password. Please try again.']);
    }

    /**
     * Handle email subscription for coming soon
     */
    public function subscribeEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        // Store email in database or send to mailing service
        // For now, we'll just return success
        // You can implement actual email storage here
        
        return back()->with('success', 'Thank you for subscribing! We\'ll notify you when we launch.');
    }
}
