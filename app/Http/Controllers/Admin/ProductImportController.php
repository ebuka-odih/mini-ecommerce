<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductImporterService;
use App\Models\Product;
use App\Models\Category;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProductImportController extends Controller
{
    protected $importerService;

    public function __construct(ProductImporterService $importerService)
    {
        $this->importerService = $importerService;
    }

    /**
     * Show the product import form
     */
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return inertia('admin/products/import', [
            'categories' => $categories
        ]);
    }

    /**
     * Preview product data from URL
     */
    public function preview(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        try {
            $result = $this->importerService->importFromUrl($request->url);
            
            if (!$result['success']) {
                // Get categories for the view
                $categories = Category::where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name']);
                
                return inertia('admin/products/import', [
                    'categories' => $categories,
                    'errors' => ['message' => $result['error']]
                ]);
            }

            // Get categories for the view
            $categories = Category::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']);
            
            return inertia('admin/products/import', [
                'categories' => $categories,
                'previewData' => $result['data']
            ]);

        } catch (\Exception $e) {
            Log::error('Product preview error: ' . $e->getMessage(), ['exception' => $e]);
            
            // Get categories for the view
            $categories = Category::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']);
            
            return inertia('admin/products/import', [
                'categories' => $categories,
                'errors' => ['message' => 'Failed to preview product: ' . $e->getMessage()]
            ]);
        }
    }

    /**
     * Import and create product from URL
     */
    public function import(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
            'is_active' => 'boolean'
        ]);

        try {
            // Get product data from URL
            $result = $this->importerService->importFromUrl($request->url);
            
            if (!$result['success']) {
                return back()->with('error', $result['error']);
            }

            $importData = $result['data'];

            // Create product
            $product = Product::create([
                'name' => $request->name ?: $importData['name'],
                'slug' => $this->generateUniqueSlug($request->name ?: $importData['name']),
                'description' => $request->description ?: $importData['description'],
                'price' => $request->price ?: $importData['price'],
                'stock_quantity' => (int) $request->stock_quantity,
                'category_id' => $request->category_id,
                'is_active' => $request->boolean('is_active', true),
                'sku' => $this->generateUniqueSku($importData['sku'] ?? null),
                'meta_title' => $request->name ?: $importData['name'],
                'meta_description' => $request->description ?: $importData['description'],
                'external_id' => $importData['external_id'] ?? null,
                'source_url' => $importData['source_url'] ?? $request->url,
                'source_platform' => $importData['source_platform'] ?? 'Unknown'
            ]);

            // Attach downloaded images to product
            if (isset($importData['downloaded_images']) && !empty($importData['downloaded_images'])) {
                foreach ($importData['downloaded_images'] as $index => $image) {
                    // Update image to be associated with the product
                    $image->update([
                        'imageable_type' => Product::class,
                        'imageable_id' => $product->id,
                        'sort_order' => $index,
                        'is_featured' => $index === 0 // First image is featured
                    ]);
                }
            }

            return redirect()->route('admin.products.index')
                ->with('success', 'Product imported successfully from ' . ($importData['source_platform'] ?? 'external source'));

        } catch (\Exception $e) {
            Log::error('Product import error: ' . $e->getMessage());
            return back()->with('error', 'Failed to import product: ' . $e->getMessage());
        }
    }

    /**
     * Generate unique slug
     */
    protected function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Generate SKU
     */
    protected function generateSku(): string
    {
        return 'IMP-' . strtoupper(Str::random(8));
    }

    /**
     * Generate a unique SKU for the product
     */
    protected function generateUniqueSku(?string $baseSku = null): string
    {
        if ($baseSku) {
            // Use the base SKU if provided
            $sku = $baseSku;
            $originalSku = $sku;
            $counter = 1;

            while (Product::where('sku', $sku)->exists()) {
                $sku = $originalSku . '-' . $counter;
                $counter++;
            }

            return $sku;
        }

        // Generate a new SKU if none provided
        $sku = 'IMP-' . strtoupper(Str::random(8));
        $counter = 1;

        while (Product::where('sku', $sku)->exists()) {
            $sku = 'IMP-' . strtoupper(Str::random(8));
            $counter++;
        }

        return $sku;
    }
}
