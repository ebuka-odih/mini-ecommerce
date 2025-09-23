<?php

namespace App\Services;

use App\Models\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    public function storeImage(UploadedFile $file, $imageable, $options = [])
    {
        $defaultOptions = [
            'disk' => 'public',
            'folder' => 'files',
            'is_featured' => false,
            'alt_text' => null,
            'caption' => null,
            'sort_order' => 0,
            'metadata' => [],
        ];

        $options = array_merge($defaultOptions, $options);

        // Generate unique filename
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        
        // Store the image using Laravel 12's image store function
        $path = $file->store($options['folder'], $options['disk']);
        
        // Create image record
        $image = Image::create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'extension' => $file->getClientOriginalExtension(),
            'path' => $path,
            'disk' => $options['disk'],
            'size' => $file->getSize(),
            'imageable_type' => get_class($imageable),
            'imageable_id' => $imageable->id,
            'alt_text' => $options['alt_text'],
            'caption' => $options['caption'],
            'is_featured' => $options['is_featured'],
            'sort_order' => $options['sort_order'],
            'metadata' => $options['metadata'],
        ]);

        return $image;
    }

    /**
     * Save imported image from external source
     */
    public function saveImportedImage(array $imageData, $imageable = null, $options = [])
    {
        $defaultOptions = [
            'disk' => 'public',
            'folder' => 'imported-products',
            'is_featured' => false,
            'alt_text' => null,
            'caption' => null,
            'sort_order' => 0,
            'metadata' => [],
        ];

        $options = array_merge($defaultOptions, $options);

        try {
            // Store the image content
            $path = $options['folder'] . '/' . $imageData['filename'];
            Storage::disk($options['disk'])->put($path, $imageData['content']);
            
            // Create image record
            $image = Image::create([
                'filename' => $imageData['filename'],
                'original_name' => $imageData['original_name'],
                'mime_type' => $imageData['mime_type'],
                'extension' => $imageData['extension'],
                'path' => $path,
                'disk' => $options['disk'],
                'size' => $imageData['size'],
                'imageable_type' => $imageable ? get_class($imageable) : null,
                'imageable_id' => $imageable ? $imageable->id : null,
                'alt_text' => $options['alt_text'],
                'caption' => $options['caption'],
                'is_featured' => $options['is_featured'],
                'sort_order' => $options['sort_order'],
                'metadata' => array_merge($options['metadata'], [
                    'imported' => true,
                    'imported_at' => now()->toISOString()
                ]),
            ]);

            return $image;

        } catch (\Exception $e) {
            \Log::error('Failed to save imported image: ' . $e->getMessage());
            return null;
        }
    }

    public function storeMultipleImages(array $files, $imageable, $options = [])
    {
        $images = [];
        
        foreach ($files as $index => $file) {
            $imageOptions = $options;
            $imageOptions['sort_order'] = $index;
            
            // Set first image as featured if no featured image exists
            if ($index === 0 && !isset($options['is_featured'])) {
                $imageOptions['is_featured'] = true;
            }
            
            $images[] = $this->storeImage($file, $imageable, $imageOptions);
        }
        
        return $images;
    }

    public function updateFeaturedImage(UploadedFile $file, $imageable, $options = [])
    {
        // Remove existing featured image
        $imageable->featuredImage()->update(['is_featured' => false]);
        
        // Store new featured image
        $options['is_featured'] = true;
        return $this->storeImage($file, $imageable, $options);
    }

    public function deleteImage(Image $image)
    {
        $image->delete();
    }

    public function deleteImagesByImageable($imageable)
    {
        $images = $imageable->images;
        
        foreach ($images as $image) {
            $this->deleteImage($image);
        }
    }

    public function reorderImages($imageable, array $imageIds)
    {
        foreach ($imageIds as $index => $imageId) {
            Image::where('id', $imageId)
                ->where('imageable_type', get_class($imageable))
                ->where('imageable_id', $imageable->id)
                ->update(['sort_order' => $index]);
        }
    }

    public function setFeaturedImage($imageable, $imageId)
    {
        // Remove existing featured image
        $imageable->featuredImage()->update(['is_featured' => false]);
        
        // Set new featured image
        Image::where('id', $imageId)
            ->where('imageable_type', get_class($imageable))
            ->where('imageable_id', $imageable->id)
            ->update(['is_featured' => true]);
    }

    public function generateThumbnail(Image $image, $width = 300, $height = 300)
    {
        $pathInfo = pathinfo($image->path);
        $thumbnailPath = $pathInfo['dirname'] . '/thumbnails/' . $pathInfo['basename'];
        
        // Create thumbnail directory if it doesn't exist
        $thumbnailDir = dirname($thumbnailPath);
        if (!Storage::disk($image->disk)->exists($thumbnailDir)) {
            Storage::disk($image->disk)->makeDirectory($thumbnailDir);
        }
        
        // Generate thumbnail using Laravel's image intervention
        $fullPath = Storage::disk($image->disk)->path($image->path);
        $thumbnailFullPath = Storage::disk($image->disk)->path($thumbnailPath);
        
        // You can use Intervention Image here if installed
        // For now, we'll just copy the original
        Storage::disk($image->disk)->copy($image->path, $thumbnailPath);
        
        return $thumbnailPath;
    }

    public function generateMediumImage(Image $image, $width = 800, $height = 800)
    {
        $pathInfo = pathinfo($image->path);
        $mediumPath = $pathInfo['dirname'] . '/medium/' . $pathInfo['basename'];
        
        // Create medium directory if it doesn't exist
        $mediumDir = dirname($mediumPath);
        if (!Storage::disk($image->disk)->exists($mediumDir)) {
            Storage::disk($image->disk)->makeDirectory($mediumDir);
        }
        
        // Generate medium image using Laravel's image intervention
        $fullPath = Storage::disk($image->disk)->path($image->path);
        $mediumFullPath = Storage::disk($image->disk)->path($mediumPath);
        
        // You can use Intervention Image here if installed
        // For now, we'll just copy the original
        Storage::disk($image->disk)->copy($image->path, $mediumPath);
        
        return $mediumPath;
    }
} 