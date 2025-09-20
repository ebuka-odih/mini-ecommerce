<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Size;
use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VariationController extends Controller
{
    /**
     * Display the variations management page.
     */
    public function index()
    {
        $sizes = Size::orderBy('sort_order')->get();
        $colors = Color::orderBy('sort_order')->get();

        $stats = [
            'total_sizes' => Size::count(),
            'active_sizes' => Size::where('is_active', true)->count(),
            'total_colors' => Color::count(),
            'active_colors' => Color::where('is_active', true)->count(),
        ];

        return Inertia::render('admin/variations', [
            'sizes' => $sizes,
            'colors' => $colors,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created size.
     */
    public function storeSize(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:sizes,name',
            'display_name' => 'required|string|max:255',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        Size::create($validated);

        return redirect()->route('admin.variations.index')
            ->with('success', 'Size created successfully!');
    }

    /**
     * Update the specified size.
     */
    public function updateSize(Request $request, Size $size)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('sizes')->ignore($size->id)],
            'display_name' => 'required|string|max:255',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $size->update($validated);

        return redirect()->route('admin.variations.index')
            ->with('success', 'Size updated successfully!');
    }

    /**
     * Remove the specified size.
     */
    public function destroySize(Size $size)
    {
        // Check if size is used in any product variations
        if ($size->productVariations()->exists()) {
            return redirect()->route('admin.variations.index')
                ->with('error', 'Cannot delete size. It is being used in product variations.');
        }

        $size->delete();

        return redirect()->route('admin.variations.index')
            ->with('success', 'Size deleted successfully!');
    }

    /**
     * Store a newly created color.
     */
    public function storeColor(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:colors,name',
            'display_name' => 'required|string|max:255',
            'hex_code' => 'required|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        Color::create($validated);

        return redirect()->route('admin.variations.index')
            ->with('success', 'Color created successfully!');
    }

    /**
     * Update the specified color.
     */
    public function updateColor(Request $request, Color $color)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('colors')->ignore($color->id)],
            'display_name' => 'required|string|max:255',
            'hex_code' => 'required|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $color->update($validated);

        return redirect()->route('admin.variations.index')
            ->with('success', 'Color updated successfully!');
    }

    /**
     * Remove the specified color.
     */
    public function destroyColor(Color $color)
    {
        // Check if color is used in any product variations
        if ($color->productVariations()->exists()) {
            return redirect()->route('admin.variations.index')
                ->with('error', 'Cannot delete color. It is being used in product variations.');
        }

        $color->delete();

        return redirect()->route('admin.variations.index')
            ->with('success', 'Color deleted successfully!');
    }
}
