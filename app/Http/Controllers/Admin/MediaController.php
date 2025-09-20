<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Image;
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

        return Inertia::render('admin/media', [
            'media' => $media,
            'folders' => $folders,
            'tags' => $tags,
            'stats' => $stats,
            'filters' => $filters,
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

        $uploadedFiles = $this->mediaLibraryService->storeMultipleImages($request->file('files'), $options);

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
}