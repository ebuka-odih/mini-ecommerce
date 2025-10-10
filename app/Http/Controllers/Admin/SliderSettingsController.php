<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class SliderSettingsController extends Controller
{
    /**
     * Display the slider settings page
     */
    public function index()
    {
        // Get all images from media library
        $images = Image::with('uploader')
            ->orderBy('uploaded_at', 'desc')
            ->get()
            ->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->url,
                    'thumbnail_url' => $image->thumbnail_url,
                    'original_name' => $image->original_name,
                    'alt_text' => $image->alt_text,
                    'width' => $image->width,
                    'height' => $image->height,
                    'size' => $image->size ? $image->formatted_size : 'Unknown',
                    'uploaded_at' => $image->uploaded_at ? $image->uploaded_at->format('M d, Y') : 'Unknown',
                ];
            });

        // Get current slider images setting
        $selectedImages = Setting::getValue('homepage_slider_images', []);
        
        // Clean up orphaned image references (images that no longer exist in database)
        $existingImageIds = Image::pluck('id')->toArray();
        $originalSelectedCount = count($selectedImages);
        $selectedImages = array_values(array_filter($selectedImages, function($id) use ($existingImageIds) {
            return in_array($id, $existingImageIds);
        }));
        
        // If we removed any orphaned images, update the setting
        if (count($selectedImages) !== $originalSelectedCount) {
            Log::warning('Cleaned up orphaned slider images', [
                'original_count' => $originalSelectedCount,
                'cleaned_count' => count($selectedImages),
                'removed_count' => $originalSelectedCount - count($selectedImages)
            ]);
            Setting::setValue('homepage_slider_images', json_encode($selectedImages), 'json', 'frontend', 'Homepage slider images');
        }
        
        Log::info('Slider settings page loaded', [
            'selectedImages' => $selectedImages,
            'count' => count($selectedImages),
            'images_count' => count($images)
        ]);

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
        ];

        return Inertia::render('admin/slider-settings', [
            'images' => $images,
            'selectedImages' => $selectedImages,
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Update slider settings
     */
    public function update(Request $request)
    {
        Log::info('Slider settings update request received', [
            'all_request_data' => $request->all(),
            'selectedImages_raw' => $request->input('selectedImages'),
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type')
        ]);

        // Debug: Check what IDs exist in the database
        $allImageIds = Image::pluck('id')->toArray();
        Log::info('Database image IDs', [
            'count' => count($allImageIds),
            'sample_ids' => array_slice($allImageIds, 0, 5),
            'all_ids' => $allImageIds
        ]);

        Log::info('About to validate request data', [
            'selectedImages' => $request->selectedImages,
            'selectedImages_count' => count($request->selectedImages ?? []),
            'selectedImages_types' => array_map('gettype', $request->selectedImages ?? [])
        ]);

        // Debug: Check each selected image
        if (!empty($request->selectedImages)) {
            foreach ($request->selectedImages as $index => $imageId) {
                $exists = Image::where('id', $imageId)->exists();
                Log::info("Checking image {$index}", [
                    'id' => $imageId,
                    'type' => gettype($imageId),
                    'exists_in_db' => $exists,
                    'id_length' => strlen($imageId)
                ]);
            }
        }

        try {
            $request->validate([
                'selectedImages' => 'array',
                'selectedImages.*' => 'string|exists:images,id',
            ]);
            Log::info('Validation passed successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'database_ids_sample' => array_slice($allImageIds, 0, 5)
            ]);
            throw $e;
        }

        try {
            Log::info('Slider settings update request', [
                'selectedImages' => $request->selectedImages,
                'count' => count($request->selectedImages)
            ]);

            // Update the slider images setting
            Setting::setValue('homepage_slider_images', json_encode($request->selectedImages), 'json', 'frontend', 'Homepage slider images');

            // Update last_used_at for selected images
            if (!empty($request->selectedImages)) {
                Image::whereIn('id', $request->selectedImages)->update([
                    'last_used_at' => now(),
                    'usage_context' => 'homepage_slider'
                ]);
            }

            Log::info('Slider settings updated successfully', [
                'saved_images' => $request->selectedImages
            ]);

            return redirect()->back()->with('success', 'Slider images updated successfully!');
        } catch (\Exception $e) {
            Log::error('Slider settings update failed', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return redirect()->back()->with('error', 'Failed to update slider images. Please try again.');
        }
    }

    /**
     * Get slider images for frontend
     */
    public function getSliderImages()
    {
        $selectedImageIds = Setting::getValue('homepage_slider_images', []);

        if (empty($selectedImageIds)) {
            return response()->json(['images' => []]);
        }

        $dbImages = Image::whereIn('id', $selectedImageIds)->get();
        
        // Sort by the order they appear in selectedImageIds array
        $images = collect($selectedImageIds)
            ->map(function ($id) use ($dbImages) {
                return $dbImages->firstWhere('id', $id);
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
            ->values();

        return response()->json(['images' => $images]);
    }
}
