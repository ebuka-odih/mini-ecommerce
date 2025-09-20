<?php

namespace App\Services;

use App\Models\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class MediaLibraryService
{
    /**
     * Store image in media library
     */
    public function storeImage(UploadedFile $file, $options = [])
    {
        $defaultOptions = [
            'disk' => 'public',
            'folder' => 'media-library',
            'tags' => '',
            'alt_text' => '',
            'caption' => '',
            'imageable_type' => null,
            'imageable_id' => null,
        ];

        $options = array_merge($defaultOptions, $options);

        // Generate unique filename
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        
        // Create folder path
        $folderPath = $options['folder'];
        if (!empty($options['subfolder'])) {
            $folderPath .= '/' . $options['subfolder'];
        }
        
        // Store the image
        $path = $file->store($folderPath, $options['disk']);
        
        // Get image dimensions
        $dimensions = $this->getImageDimensions($file);
        
        // Extract dominant colors (simplified version)
        $colorPalette = $this->extractColorPalette($file);
        
        // Create image record
        $image = Image::create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'extension' => $file->getClientOriginalExtension(),
            'path' => $path,
            'disk' => $options['disk'],
            'folder' => $folderPath,
            'size' => $file->getSize(),
            'width' => $dimensions['width'] ?? null,
            'height' => $dimensions['height'] ?? null,
            'imageable_type' => $options['imageable_type'],
            'imageable_id' => $options['imageable_id'],
            'alt_text' => $options['alt_text'],
            'caption' => $options['caption'],
            'is_featured' => false,
            'is_optimized' => false,
            'sort_order' => 0,
            'metadata' => [],
            'tags' => $options['tags'],
            'uploaded_at' => now(),
            'uploaded_by' => Auth::id(),
            'color_palette' => $colorPalette,
            'download_count' => 0,
            'last_used_at' => null,
            'usage_context' => null,
        ]);

        // Generate thumbnails
        $this->generateThumbnails($image);

        return $image;
    }

    /**
     * Store multiple images
     */
    public function storeMultipleImages(array $files, $options = [])
    {
        $images = [];
        
        foreach ($files as $file) {
            $images[] = $this->storeImage($file, $options);
        }
        
        return $images;
    }

    /**
     * Get images from media library with filters
     */
    public function getImages($filters = [])
    {
        $query = Image::with('uploader');

        // Apply filters
        if (!empty($filters['folder'])) {
            $query->inFolder($filters['folder']);
        }

        if (!empty($filters['tags'])) {
            $query->withTags($filters['tags']);
        }

        if (!empty($filters['mime_type'])) {
            $query->byMimeType($filters['mime_type']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('original_name', 'LIKE', '%' . $filters['search'] . '%')
                  ->orWhere('alt_text', 'LIKE', '%' . $filters['search'] . '%')
                  ->orWhere('caption', 'LIKE', '%' . $filters['search'] . '%')
                  ->orWhere('tags', 'LIKE', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['unused']) && $filters['unused']) {
            $query->unused();
        }

        if (!empty($filters['recent_days'])) {
            $query->recentlyUploaded($filters['recent_days']);
        }

        // Sort by upload date (newest first) by default
        $sortBy = $filters['sort_by'] ?? 'uploaded_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 24;
        
        return $query->paginate($perPage);
    }

    /**
     * Get folders list
     */
    public function getFolders()
    {
        return Image::select('folder')
            ->whereNotNull('folder')
            ->distinct()
            ->pluck('folder')
            ->filter()
            ->sort()
            ->values();
    }

    /**
     * Get tags list
     */
    public function getTags()
    {
        $allTags = Image::whereNotNull('tags')
            ->where('tags', '!=', '')
            ->pluck('tags')
            ->flatMap(function ($tags) {
                return array_map('trim', explode(',', $tags));
            })
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return $allTags;
    }

    /**
     * Update image metadata
     */
    public function updateImageMetadata(Image $image, $data)
    {
        $image->update([
            'alt_text' => $data['alt_text'] ?? $image->alt_text,
            'caption' => $data['caption'] ?? $image->caption,
            'tags' => $data['tags'] ?? $image->tags,
            'folder' => $data['folder'] ?? $image->folder,
        ]);

        return $image;
    }

    /**
     * Move image to folder
     */
    public function moveToFolder(Image $image, $folder)
    {
        $image->update(['folder' => $folder]);
        return $image;
    }

    /**
     * Attach image to model
     */
    public function attachToModel(Image $image, $model, $options = [])
    {
        $image->update([
            'imageable_type' => get_class($model),
            'imageable_id' => $model->id,
            'is_featured' => $options['is_featured'] ?? false,
            'sort_order' => $options['sort_order'] ?? 0,
        ]);

        // Update usage context
        $context = $options['context'] ?? get_class($model);
        $image->updateUsageContext($context);

        return $image;
    }

    /**
     * Detach image from model (make it available in library)
     */
    public function detachFromModel(Image $image)
    {
        $image->update([
            'imageable_type' => null,
            'imageable_id' => null,
            'is_featured' => false,
            'sort_order' => 0,
        ]);

        return $image;
    }

    /**
     * Delete image from library
     */
    public function deleteImage(Image $image)
    {
        $image->delete();
        return true;
    }

    /**
     * Bulk delete images
     */
    public function bulkDelete(array $imageIds)
    {
        $images = Image::whereIn('id', $imageIds)->get();
        
        foreach ($images as $image) {
            $image->delete();
        }

        return count($images);
    }

    /**
     * Get image dimensions
     */
    private function getImageDimensions(UploadedFile $file)
    {
        try {
            $imageInfo = getimagesize($file->getPathname());
            
            return [
                'width' => $imageInfo[0] ?? null,
                'height' => $imageInfo[1] ?? null,
            ];
        } catch (\Exception $e) {
            return ['width' => null, 'height' => null];
        }
    }

    /**
     * Extract dominant colors from image (simplified)
     */
    private function extractColorPalette(UploadedFile $file)
    {
        try {
            // This is a simplified version
            // In production, you might want to use a proper image processing library
            return [
                'primary' => '#666666',
                'secondary' => '#999999',
                'accent' => '#cccccc'
            ];
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Generate thumbnails for image
     */
    private function generateThumbnails(Image $image)
    {
        try {
            $pathInfo = pathinfo($image->path);
            $directory = $pathInfo['dirname'];
            
            // Create thumbnails directory
            $thumbnailDir = $directory . '/thumbnails';
            if (!Storage::disk($image->disk)->exists($thumbnailDir)) {
                Storage::disk($image->disk)->makeDirectory($thumbnailDir);
            }
            
            // Create medium directory
            $mediumDir = $directory . '/medium';
            if (!Storage::disk($image->disk)->exists($mediumDir)) {
                Storage::disk($image->disk)->makeDirectory($mediumDir);
            }

            // For now, just copy the original file
            // In production, you'd want to use an image processing library like Intervention Image
            $thumbnailPath = $thumbnailDir . '/' . $pathInfo['basename'];
            $mediumPath = $mediumDir . '/' . $pathInfo['basename'];
            
            Storage::disk($image->disk)->copy($image->path, $thumbnailPath);
            Storage::disk($image->disk)->copy($image->path, $mediumPath);
            
        } catch (\Exception $e) {
            // Log error but don't fail the upload
            \Log::warning('Failed to generate thumbnails for image: ' . $image->id, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get media library statistics
     */
    public function getStatistics()
    {
        return [
            'total_images' => Image::count(),
            'total_size' => Image::sum('size'),
            'total_size_formatted' => $this->formatBytes(Image::sum('size')),
            'unused_images' => Image::unused()->count(),
            'recent_uploads' => Image::recentlyUploaded(7)->count(),
            'folders_count' => Image::whereNotNull('folder')->distinct('folder')->count(),
            'most_used_tags' => $this->getMostUsedTags(),
        ];
    }

    /**
     * Get most used tags
     */
    private function getMostUsedTags($limit = 10)
    {
        $allTags = Image::whereNotNull('tags')
            ->where('tags', '!=', '')
            ->pluck('tags')
            ->flatMap(function ($tags) {
                return array_map('trim', explode(',', $tags));
            })
            ->filter();

        return $allTags->countBy()
            ->sortDesc()
            ->take($limit)
            ->toArray();
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}

