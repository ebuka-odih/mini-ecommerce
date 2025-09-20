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
            return view('pages.coming-soon', compact('settings'));
        }
        
        // Normal index page
        $products = Product::with('category')->latest()->take(4)->get();
        return Inertia::render('index', [
            'products' => $products
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['images' => function($query) {
            $query->orderBy('sort_order');
        }, 'category']);
        
        return view('pages.product-show', compact('product'));
    }

    public function shop(Request $request)
    {
        $query = Product::with(['images' => function($query) {
            $query->orderBy('sort_order');
        }, 'category'])
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

        // Price range filter
        if ($request->filled('price')) {
            $priceRanges = is_array($request->price) ? $request->price : [$request->price];
            $query->where(function($q) use ($priceRanges) {
                foreach ($priceRanges as $range) {
                    [$min, $max] = explode('-', $range);
                    $q->orWhereBetween('price', [(float)$min, (float)$max]);
                }
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

        return Inertia::render('shop', [
            'products' => $products->items(),
            'categories' => $categories,
            'current_filters' => [
                'category' => $request->get('category', []),
                'price' => $request->get('price', []),
                'size' => $request->get('size', []),
            ],
            'current_sort' => $sortBy,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
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
}
