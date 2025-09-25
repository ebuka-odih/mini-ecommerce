<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Models\Setting;
use App\Services\MediaLibraryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaController extends Controller
{
    protected $mediaLibraryService;

    public function __construct(MediaLibraryService $mediaLibraryService)
    {
        $this->mediaLibraryService = $mediaLibraryService;
    }

    /**
     * Display the media library.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'folder', 'tags', 'mime_type', 'unused', 'recent_days', 'sort_by', 'sort_order']);
        $filters['per_page'] = $request->per_page ?? 24;

        $media = $this->mediaLibraryService->getImages($filters);
        $folders = $this->mediaLibraryService->getFolders();
        $tags = $this->mediaLibraryService->getTags();
        $stats = $this->mediaLibraryService->getStatistics();

        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
        ];

        return Inertia::render('admin/media', [
            'media' => $media,
            'folders' => $folders,
            'tags' => $tags,
            'stats' => $stats,
            'filters' => $filters,
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Store new media files.
     */
    public function store(Request $request)
    {
        $request->validate([
            'files.*' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,bmp|max:10240',
            'folder' => 'nullable|string|max:255',
            'tags' => 'nullable|string',
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:500',
        ]);

        $options = [
            'folder' => ($request->folder === 'root' || empty($request->folder)) ? 'media-library' : $request->folder,
            'tags' => $request->tags ?? '',
            'alt_text' => $request->alt_text ?? '',
            'caption' => $request->caption ?? '',
        ];

        if ($request->subfolder) {
            $options['subfolder'] = $request->subfolder;
        }

        // Get files from request - Laravel handles files[] automatically
        $files = $request->file('files');
        
        if (!$files) {
            return redirect()->route('admin.media.index')
                ->with('error', 'No files were uploaded.');
        }
        
        // Ensure files is an array
        if (!is_array($files)) {
            $files = [$files];
        }
        
        $uploadedFiles = $this->mediaLibraryService->storeMultipleImages($files, $options);

        return redirect()->route('admin.media.index')
            ->with('success', count($uploadedFiles) . ' file(s) uploaded successfully!');
    }

    /**
     * Show media file details.
     */
    public function show(Image $medium)
    {
        $medium->load('uploader');
        
        return Inertia::render('admin/media-detail', [
            'media' => $medium,
            'folders' => $this->mediaLibraryService->getFolders(),
            'tags' => $this->mediaLibraryService->getTags(),
        ]);
    }

    /**
     * Update media file metadata.
     */
    public function update(Request $request, Image $medium)
    {
        $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:500',
            'tags' => 'nullable|string',
            'folder' => 'nullable|string|max:255',
        ]);

        $this->mediaLibraryService->updateImageMetadata($medium, $request->only([
            'alt_text', 'caption', 'tags', 'folder'
        ]));

        return redirect()->route('admin.media.show', $medium)
            ->with('success', 'Media file updated successfully!');
    }

    /**
     * Remove media file.
     */
    public function destroy(Image $medium)
    {
        $this->mediaLibraryService->deleteImage($medium);

        return redirect()->route('admin.media.index')
            ->with('success', 'File deleted successfully!');
    }

    /**
     * Bulk delete media files.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:images,id',
        ]);

        $deleted = $this->mediaLibraryService->bulkDelete($request->ids);

        return redirect()->route('admin.media.index')
            ->with('success', "{$deleted} file(s) deleted successfully!");
    }

    /**
     * Move files to folder.
     */
    public function moveToFolder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:images,id',
            'folder' => 'required|string|max:255',
        ]);

        $images = Image::whereIn('id', $request->ids)->get();
        
        foreach ($images as $image) {
            $this->mediaLibraryService->moveToFolder($image, $request->folder);
        }

        return redirect()->route('admin.media.index')
            ->with('success', count($images) . ' file(s) moved successfully!');
    }

    /**
     * Get image picker data (for use in other components).
     */
    public function picker(Request $request)
    {
        $filters = $request->only(['search', 'folder', 'tags', 'mime_type']);
        $filters['per_page'] = $request->per_page ?? 12;

        $media = $this->mediaLibraryService->getImages($filters);
        $folders = $this->mediaLibraryService->getFolders();
        $tags = $this->mediaLibraryService->getTags();

        return response()->json([
            'media' => $media,
            'folders' => $folders,
            'tags' => $tags,
        ]);
    }

    /**
     * Attach image to a model.
     */
    public function attach(Request $request, Image $medium)
    {
        $request->validate([
            'model_type' => 'required|string',
            'model_id' => 'required|string',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'context' => 'nullable|string',
        ]);

        // Get the model
        $modelClass = $request->model_type;
        $model = $modelClass::findOrFail($request->model_id);

        $options = [
            'is_featured' => $request->is_featured ?? false,
            'sort_order' => $request->sort_order ?? 0,
            'context' => $request->context ?? class_basename($modelClass),
        ];

        $this->mediaLibraryService->attachToModel($medium, $model, $options);

        return response()->json([
            'success' => true,
            'message' => 'Image attached successfully!',
        ]);
    }

    /**
     * Detach image from model.
     */
    public function detach(Image $medium)
    {
        $this->mediaLibraryService->detachFromModel($medium);

        return response()->json([
            'success' => true,
            'message' => 'Image detached successfully!',
        ]);
    }

    /**
     * Import images from URLs.
     */
    public function importFromUrls(Request $request)
    {
        $request->validate([
            'urls' => 'required|array|min:1',
            'urls.*' => 'required|url',
            'folder' => 'nullable|string|max:255',
            'tags' => 'nullable|string',
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:500',
        ]);

        $importedCount = 0;
        $errors = [];

        foreach ($request->urls as $url) {
            try {
                // Download and save the image
                $imageData = $this->downloadImageFromUrl($url);
                
                if ($imageData) {
                    $options = [
                        'folder' => $request->folder ?: 'media-library',
                        'tags' => $request->tags ?? '',
                        'alt_text' => $request->alt_text ?? '',
                        'caption' => $request->caption ?? '',
                        'original_url' => $url,
                    ];

                    $this->mediaLibraryService->storeImageFromData($imageData, $options);
                    $importedCount++;
                } else {
                    $errors[] = "Failed to download image from: {$url}";
                }
            } catch (\Exception $e) {
                $errors[] = "Error importing {$url}: " . $e->getMessage();
            }
        }

        if ($importedCount > 0) {
            $message = "Successfully imported {$importedCount} image(s)";
            if (!empty($errors)) {
                $message .= ". " . count($errors) . " failed.";
            }
            
            return redirect()->route('admin.media.index')
                ->with('success', $message)
                ->with('import_errors', $errors);
        } else {
            return redirect()->route('admin.media.index')
                ->with('error', 'Failed to import any images. Please check the URLs and try again.')
                ->with('import_errors', $errors);
        }
    }

    /**
     * Download image from URL.
     */
    private function downloadImageFromUrl(string $url): ?array
    {
        try {
            $context = stream_context_create([
                'http' => [
                    'timeout' => 30,
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ],
            ]);

            $imageData = file_get_contents($url, false, $context);
            
            if ($imageData === false) {
                return null;
            }

            // Get content type
            $headers = get_headers($url, 1);
            $contentType = $headers['Content-Type'] ?? 'image/jpeg';
            
            // Determine file extension
            $extension = 'jpg';
            if (strpos($contentType, 'png') !== false) {
                $extension = 'png';
            } elseif (strpos($contentType, 'gif') !== false) {
                $extension = 'gif';
            } elseif (strpos($contentType, 'webp') !== false) {
                $extension = 'webp';
            }

            return [
                'data' => $imageData,
                'extension' => $extension,
                'content_type' => $contentType,
                'size' => strlen($imageData),
            ];
        } catch (\Exception $e) {
            \Log::error('Error downloading image from URL: ' . $url . ' - ' . $e->getMessage());
            return null;
        }
    }
}