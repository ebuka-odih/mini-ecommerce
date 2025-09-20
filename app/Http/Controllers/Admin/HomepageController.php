<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageLayout;
use App\Models\Category;
use App\Models\Image;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageController extends Controller
{
    /**
     * Display the homepage layout management.
     */
    public function index()
    {
        $layouts = HomepageLayout::with(['category', 'coverImage'])
            ->orderBy('sort_order')
            ->orderBy('grid_position')
            ->get();

        $categories = Category::where('is_active', true)
            ->with('image')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        // Define available grid positions
        $gridPositions = [
            'hero' => 'Hero Section (Large Left)',
            'main_right_top' => 'Main Right Top',
            'main_right_bottom' => 'Main Right Bottom',
            'secondary_left' => 'Secondary Left',
            'secondary_center' => 'Secondary Center',
            'secondary_right' => 'Secondary Right',
        ];

        // Define available gradients
        $gradients = [
            'slate' => ['from' => 'slate-900', 'to' => 'slate-700', 'label' => 'Dark Slate'],
            'blue' => ['from' => 'blue-600', 'to' => 'blue-800', 'label' => 'Blue Ocean'],
            'purple' => ['from' => 'purple-600', 'to' => 'purple-800', 'label' => 'Purple'],
            'rose' => ['from' => 'rose-600', 'to' => 'pink-700', 'label' => 'Rose Pink'],
            'emerald' => ['from' => 'emerald-600', 'to' => 'teal-700', 'label' => 'Emerald'],
            'orange' => ['from' => 'orange-600', 'to' => 'red-700', 'label' => 'Orange Red'],
            'indigo' => ['from' => 'indigo-600', 'to' => 'purple-700', 'label' => 'Indigo'],
        ];

        // Define layout types
        $layoutTypes = [
            'grid' => 'Grid Layout (Single Image)',
            'slider' => 'Slider Layout (Multiple Images)',
        ];

        return Inertia::render('admin/homepage-layout', [
            'layouts' => $layouts,
            'categories' => $categories,
            'gridPositions' => $gridPositions,
            'gradients' => $gradients,
            'layoutTypes' => $layoutTypes,
        ]);
    }

    /**
     * Store a new homepage layout.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grid_position' => 'required|string|in:hero,main_right_top,main_right_bottom,secondary_left,secondary_center,secondary_right',
            'section_name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'use_custom_cover' => 'boolean',
            'cover_image_id' => 'nullable|exists:images,id',
            'layout_type' => 'required|string|in:grid,slider',
            'slider_speed' => 'integer|min:1000|max:10000',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'gradient_from' => 'nullable|string|max:50',
            'gradient_to' => 'nullable|string|max:50',
            'text_color' => 'string|in:white,black,gray',
            'custom_link' => 'nullable|url',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle "none" category selection
        if ($validated['category_id'] === 'none') {
            $validated['category_id'] = null;
        }

        // Set default slider speed if not provided
        if ($validated['layout_type'] === 'slider' && !isset($validated['slider_speed'])) {
            $validated['slider_speed'] = 5000;
        }

        // Deactivate existing layout for this position if new one is active
        if ($validated['is_active']) {
            HomepageLayout::where('grid_position', $validated['grid_position'])
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        HomepageLayout::create($validated);

        return redirect()->route('admin.homepage.index')
            ->with('success', 'Homepage layout created successfully!');
    }

    /**
     * Update an existing homepage layout.
     */
    public function update(Request $request, HomepageLayout $layout)
    {
        $validated = $request->validate([
            'grid_position' => 'required|string|in:hero,main_right_top,main_right_bottom,secondary_left,secondary_center,secondary_right',
            'section_name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'use_custom_cover' => 'boolean',
            'cover_image_id' => 'nullable|exists:images,id',
            'layout_type' => 'required|string|in:grid,slider',
            'slider_speed' => 'integer|min:1000|max:10000',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'gradient_from' => 'nullable|string|max:50',
            'gradient_to' => 'nullable|string|max:50',
            'text_color' => 'string|in:white,black,gray',
            'custom_link' => 'nullable|url',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle "none" category selection
        if ($validated['category_id'] === 'none') {
            $validated['category_id'] = null;
        }

        // Set default slider speed if not provided
        if ($validated['layout_type'] === 'slider' && !isset($validated['slider_speed'])) {
            $validated['slider_speed'] = 5000;
        }

        // Deactivate existing layout for this position if updating to active
        if ($validated['is_active'] && $validated['grid_position'] !== $layout->grid_position) {
            HomepageLayout::where('grid_position', $validated['grid_position'])
                ->where('is_active', true)
                ->where('id', '!=', $layout->id)
                ->update(['is_active' => false]);
        }

        $layout->update($validated);

        return redirect()->route('admin.homepage.index')
            ->with('success', 'Homepage layout updated successfully!');
    }

    /**
     * Delete a homepage layout.
     */
    public function destroy(HomepageLayout $layout)
    {
        $layout->delete();

        return redirect()->route('admin.homepage.index')
            ->with('success', 'Homepage layout deleted successfully!');
    }

    /**
     * Toggle layout status.
     */
    public function toggle(HomepageLayout $layout)
    {
        if (!$layout->is_active) {
            // Deactivate other layouts for this position
            HomepageLayout::where('grid_position', $layout->grid_position)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $layout->update(['is_active' => !$layout->is_active]);

        return redirect()->route('admin.homepage.index')
            ->with('success', 'Layout status updated successfully!');
    }

    /**
     * Preview homepage with current layouts.
     */
    public function preview()
    {
        $layouts = HomepageLayout::with('category')
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->groupBy('grid_position');

        return Inertia::render('admin/homepage-preview', [
            'layouts' => $layouts
        ]);
    }
}
