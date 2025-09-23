<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $products = Product::with(['category', 'images' => function($query) {
            $query->orderBy('sort_order');
        }])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $categories = Category::where('is_active', true)->get();

        return view('admin.product.index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->get();
        return view('admin.product.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'stock' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'sku' => 'nullable|string|unique:products,sku',
            'barcode' => 'nullable|string|unique:products,barcode',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $data = $request->except(['images']);
        $data['slug'] = Str::slug($request->name);

        // Create the product
        $product = Product::create($data);

        // Handle multiple images upload
        if ($request->hasFile('images')) {
            $this->imageService->storeMultipleImages(
                $request->file('images'),
                $product,
                [
                    'alt_text' => $product->name,
                ]
            );
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->get();
        $product->load(['images' => function($query) {
            $query->orderBy('sort_order');
        }]);

        return view('admin.product.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $data = $request->except(['images']);
        $data['slug'] = Str::slug($request->name);

        // Update the product
        $product->update($data);

        // Handle additional images upload
        if ($request->hasFile('images')) {
            $this->imageService->storeMultipleImages(
                $request->file('images'),
                $product,
                [
                    'alt_text' => $product->name,
                ]
            );
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete associated images
        $this->imageService->deleteImagesByImageable($product);

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function toggleStatus(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);

        $status = $product->is_active ? 'activated' : 'deactivated';
        return redirect()->route('admin.products.index')
            ->with('success', "Product {$status} successfully.");
    }

    public function toggleFeatured(Product $product)
    {
        $product->update(['is_featured' => !$product->is_featured]);

        $status = $product->is_featured ? 'featured' : 'unfeatured';
        return redirect()->route('admin.products.index')
            ->with('success', "Product {$status} successfully.");
    }

    public function deleteImage(Request $request, Product $product)
    {
        \Log::info('Delete image request received', [
            'product_id' => $product->id,
            'image_id' => $request->image_id,
            'request_data' => $request->all()
        ]);

        $request->validate([
            'image_id' => 'required|exists:images,id'
        ]);

        $image = $product->images()->findOrFail($request->image_id);
        
        if (!$image) {
            \Log::error('Image not found', ['image_id' => $request->image_id]);
            return response()->json(['success' => false, 'message' => 'Image not found'], 404);
        }
        
        \Log::info('Deleting image', ['image_id' => $image->id, 'path' => $image->path]);
        
        $this->imageService->deleteImage($image);

        \Log::info('Image deleted successfully', ['image_id' => $image->id]);

        return response()->json(['success' => true, 'message' => 'Image deleted successfully']);
    }

    public function setFeaturedImage(Request $request, Product $product)
    {
        $request->validate([
            'image_id' => 'required|exists:images,id'
        ]);

        $this->imageService->setFeaturedImage($product, $request->image_id);

        return response()->json(['success' => true]);
    }

    public function reorderImages(Request $request, Product $product)
    {
        $request->validate([
            'image_ids' => 'required|array',
            'image_ids.*' => 'exists:images,id'
        ]);

        $this->imageService->reorderImages($product, $request->image_ids);

        return response()->json(['success' => true]);
    }

}
