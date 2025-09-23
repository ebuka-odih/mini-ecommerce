<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Image;
use App\Models\Size;
use App\Models\Color;
use App\Models\ProductVariation;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class NewProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images' => function($q) {
            $q->orderBy('sort_order');
        }]);

        // Search filter
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('sku', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Category filter
        if ($request->filled('category') && $request->category !== 'all') {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $products = $query->with(['variations.size', 'variations.color'])->orderBy('created_at', 'desc')->get();
        
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $sizes = Size::active()->ordered()->get();
        $colors = Color::active()->ordered()->get();

        return Inertia::render('admin/products', [
            'products' => $products,
            'categories' => $categories,
            'sizes' => $sizes,
            'colors' => $colors,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'status' => $request->status,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Log::info('Product creation request received', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|unique:products,sku',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max
            'library_images.*' => 'nullable|exists:images,id', // Library image IDs
            'has_variations' => 'boolean',
            'variations' => 'nullable|array',
            'variations.*.size_id' => 'nullable',
            'variations.*.color_id' => 'nullable',
            'variations.*.price' => 'nullable|numeric|min:0',
            'variations.*.stock_quantity' => 'nullable|integer|min:0',
            'variations.*.sku' => 'nullable|string|unique:product_variations,sku'
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);
        
        // Ensure slug is unique
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Product::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Map stock_quantity to stock for database (keep both fields in sync)
        if (isset($validated['stock_quantity'])) {
            $validated['stock'] = $validated['stock_quantity'];
            // Keep stock_quantity as well for consistency
        }

        // Create product
        \Log::info('Creating product with validated data', $validated);
        $product = Product::create($validated);
        \Log::info('Product created successfully', ['product_id' => $product->id]);

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $imageService = app(ImageService::class);
            
            $imageService->storeMultipleImages(
                $request->file('images'), 
                $product, 
                [
                    'folder' => 'products',
                    'alt_text' => $product->name
                ]
            );
        }

        // Handle library image attachments
        if ($request->has('library_images')) {
            $mediaService = app(\App\Services\MediaLibraryService::class);
            $libraryImageIds = array_filter($request->library_images);
            
            foreach ($libraryImageIds as $index => $imageId) {
                $image = \App\Models\Image::find($imageId);
                if ($image) {
                    $mediaService->attachToModel($image, $product, [
                        'is_featured' => $index === 0, // First image as featured
                        'sort_order' => $index,
                        'context' => 'Product Gallery'
                    ]);
                }
            }
        }

        // Handle product variations
        if ($request->has('has_variations') && $request->has_variations && $request->has('variations')) {
            foreach ($request->variations as $variationData) {
                $sizeId = ($variationData['size_id'] && $variationData['size_id'] !== 'none') ? $variationData['size_id'] : null;
                $colorId = ($variationData['color_id'] && $variationData['color_id'] !== 'none') ? $variationData['color_id'] : null;
                
                // Validate that size and color IDs exist if provided
                if ($sizeId && !Size::where('id', $sizeId)->exists()) {
                    continue; // Skip invalid size
                }
                if ($colorId && !Color::where('id', $colorId)->exists()) {
                    continue; // Skip invalid color
                }
                
                if ($sizeId || $colorId) {
                    ProductVariation::create([
                        'product_id' => $product->id,
                        'size_id' => $sizeId,
                        'color_id' => $colorId,
                        'price' => $variationData['price'] ?? null,
                        'stock_quantity' => $variationData['stock_quantity'] ?? 0,
                        'sku' => $variationData['sku'] ?? null,
                        'is_active' => true,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // Load category
        $product->load(['category']);
        
        // Load variations with relationships
        $product->load([
            'variations.size',
            'variations.color'
        ]);

        // Manually load images due to UUID relationship issues
        $images = Image::where('imageable_type', Product::class)
            ->where('imageable_id', $product->id)
            ->orderBy('sort_order')
            ->get();
        
        // Add images to product object
        $product->setRelation('images', $images);

        return Inertia::render('admin/products/show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['category', 'images', 'variations.size', 'variations.color']);
        
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $sizes = Size::active()->ordered()->get();
        $colors = Color::active()->ordered()->get();

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
            'sizes' => $sizes,
            'colors' => $colors
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max
            'library_images.*' => 'nullable|exists:images,id', // Library image IDs
            'delete_images.*' => 'nullable|string', // Image IDs to delete
            'primary_image_id' => 'nullable|string', // Primary image ID
            'has_variations' => 'boolean',
            'variations' => 'nullable|array',
            'variations.*.size_id' => 'nullable',
            'variations.*.color_id' => 'nullable',
            'variations.*.price' => 'nullable|numeric|min:0',
            'variations.*.stock_quantity' => 'nullable|integer|min:0',
            'variations.*.sku' => 'nullable|string'
        ]);

        // Update slug if name changed
        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
            
            // Ensure slug is unique
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Product::where('slug', $validated['slug'])->where('id', '!=', $product->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Map stock_quantity to stock for database (keep both fields in sync)
        if (isset($validated['stock_quantity'])) {
            $validated['stock'] = $validated['stock_quantity'];
            // Keep stock_quantity as well for consistency
        }

        $product->update($validated);

        // Handle image deletions
        if ($request->has('delete_images')) {
            $imagesToDelete = $request->input('delete_images');
            foreach ($imagesToDelete as $imageId) {
                $image = Image::where('id', $imageId)
                    ->where('imageable_type', Product::class)
                    ->where('imageable_id', $product->id)
                    ->first();
                
                if ($image) {
                    // Delete the file from storage
                    $image->deleteFile();
                    // Delete the database record
                    $image->delete();
                }
            }
        }

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $imageService = app(ImageService::class);
            
            $imageService->storeMultipleImages(
                $request->file('images'), 
                $product, 
                [
                    'folder' => 'products',
                    'alt_text' => $product->name
                ]
            );
        }

        // Handle library images
        if ($request->has('library_images')) {
            $libraryImageIds = $request->input('library_images');
            foreach ($libraryImageIds as $imageId) {
                $image = Image::find($imageId);
                if ($image) {
                    // Attach the image to the product
                    $image->update([
                        'imageable_type' => Product::class,
                        'imageable_id' => $product->id,
                        'is_featured' => false, // Will be set as primary if needed
                    ]);
                }
            }
        }

        // Handle primary image setting
        if ($request->has('primary_image_id') && $request->primary_image_id) {
            // First, remove primary status from all images of this product
            Image::where('imageable_type', Product::class)
                ->where('imageable_id', $product->id)
                ->update(['is_featured' => false]);
            
            // Then set the selected image as primary
            Image::where('id', $request->primary_image_id)
                ->where('imageable_type', Product::class)
                ->where('imageable_id', $product->id)
                ->update(['is_featured' => true]);
        }

        // Handle product variations
        // First, delete existing variations
        $product->variations()->delete();
        
        // Then create new variations if enabled
        if ($request->has('has_variations') && $request->has_variations && $request->has('variations')) {
            foreach ($request->variations as $variationData) {
                $sizeId = ($variationData['size_id'] && $variationData['size_id'] !== 'none') ? $variationData['size_id'] : null;
                $colorId = ($variationData['color_id'] && $variationData['color_id'] !== 'none') ? $variationData['color_id'] : null;
                
                // Validate that size and color IDs exist if provided
                if ($sizeId && !Size::where('id', $sizeId)->exists()) {
                    continue; // Skip invalid size
                }
                if ($colorId && !Color::where('id', $colorId)->exists()) {
                    continue; // Skip invalid color
                }
                
                if ($sizeId || $colorId) {
                    ProductVariation::create([
                        'product_id' => $product->id,
                        'size_id' => $sizeId,
                        'color_id' => $colorId,
                        'price' => $variationData['price'] ?? null,
                        'stock_quantity' => $variationData['stock_quantity'] ?? 0,
                        'sku' => $variationData['sku'] ?? null,
                        'is_active' => true,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully!');
    }

    public function toggleFeatured(Product $product)
    {
        $product->update(['is_featured' => !$product->is_featured]);
        
        // Return JSON response for AJAX requests
        return response()->json([
            'success' => true,
            'is_featured' => $product->is_featured,
            'message' => $product->is_featured ? 'Product marked as featured' : 'Product unmarked as featured'
        ]);
    }
}
