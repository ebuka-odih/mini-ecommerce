<?php

namespace App\Services;

use App\Models\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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

    /**
     * Optimize an image after upload
     * Generates thumbnails, medium sizes, and WebP versions
     */
    public function optimizeImage(Image $image)
    {
        try {
            // Check if GD extension is loaded
            if (!extension_loaded('gd')) {
                \Log::warning('GD extension not loaded, skipping image optimization');
                return false;
            }

            $manager = new ImageManager(new Driver());
            $disk = Storage::disk($image->disk);
            
            if (!$disk->exists($image->path)) {
                \Log::error("Image file not found for optimization: {$image->path}");
                return false;
            }

            $fullPath = $disk->path($image->path);
            $pathInfo = pathinfo($image->path);
            $directory = $pathInfo['dirname'];
            $filename = $pathInfo['filename'];
            $extension = $pathInfo['extension'];

            // Load the image to get dimensions
            $img = $manager->read($fullPath);
            $originalWidth = $img->width();
            $originalHeight = $img->height();

            // Update image dimensions
            $image->width = $originalWidth;
            $image->height = $originalHeight;

            // Optimize original if it's too large
            $maxOriginalWidth = 2000;
            $maxOriginalHeight = 2000;

            if ($originalWidth > $maxOriginalWidth || $originalHeight > $maxOriginalHeight) {
                $img->scale(width: $maxOriginalWidth, height: $maxOriginalHeight);
                
                if (strtolower($extension) === 'jpg' || strtolower($extension) === 'jpeg') {
                    $img->toJpeg(quality: 85)->save($fullPath);
                } elseif (strtolower($extension) === 'png') {
                    $img->toPng()->save($fullPath);
                }
                
                $image->size = filesize($fullPath);
            }

            // Generate thumbnail
            $this->generateOptimizedThumbnail($image, $fullPath, $directory, $filename, $extension, $manager);

            // Generate medium size
            $this->generateOptimizedMedium($image, $fullPath, $directory, $filename, $extension, $manager);

            // Generate WebP if supported
            if (function_exists('imagewebp')) {
                $this->generateOptimizedWebP($image, $fullPath, $directory, $filename, $manager);
            }

            // Mark as optimized
            $image->is_optimized = true;
            $image->metadata = array_merge($image->metadata ?? [], [
                'optimized_at' => now()->toISOString(),
                'auto_optimized' => true,
            ]);
            
            $image->save();

            return true;

        } catch (\Exception $e) {
            \Log::error('Image optimization failed: ' . $e->getMessage());
            return false;
        }
    }

    protected function generateOptimizedThumbnail(Image $image, string $fullPath, string $directory, string $filename, string $extension, ImageManager $manager)
    {
        $disk = Storage::disk($image->disk);
        $thumbnailDir = $directory . '/thumbnails';
        
        if (!$disk->exists($thumbnailDir)) {
            $disk->makeDirectory($thumbnailDir);
        }

        $thumbnailPath = $thumbnailDir . '/' . $filename . '.' . $extension;
        $thumbnailFullPath = $disk->path($thumbnailPath);

        $thumbnail = $manager->read($fullPath);
        $thumbnail->cover(300, 400); // 3:4 aspect ratio to match product card container

        if (strtolower($extension) === 'jpg' || strtolower($extension) === 'jpeg') {
            $thumbnail->toJpeg(quality: 80)->save($thumbnailFullPath);
        } elseif (strtolower($extension) === 'png') {
            $thumbnail->toPng()->save($thumbnailFullPath);
        } else {
            $thumbnail->save($thumbnailFullPath);
        }
    }

    protected function generateOptimizedMedium(Image $image, string $fullPath, string $directory, string $filename, string $extension, ImageManager $manager)
    {
        $disk = Storage::disk($image->disk);
        $mediumDir = $directory . '/medium';
        
        if (!$disk->exists($mediumDir)) {
            $disk->makeDirectory($mediumDir);
        }

        $mediumPath = $mediumDir . '/' . $filename . '.' . $extension;
        $mediumFullPath = $disk->path($mediumPath);

        $medium = $manager->read($fullPath);
        $medium->scale(width: 800, height: 800);

        if (strtolower($extension) === 'jpg' || strtolower($extension) === 'jpeg') {
            $medium->toJpeg(quality: 85)->save($mediumFullPath);
        } elseif (strtolower($extension) === 'png') {
            $medium->toPng()->save($mediumFullPath);
        } else {
            $medium->save($mediumFullPath);
        }
    }

    protected function generateOptimizedWebP(Image $image, string $fullPath, string $directory, string $filename, ImageManager $manager)
    {
        $disk = Storage::disk($image->disk);
        $webpDir = $directory . '/webp';
        
        if (!$disk->exists($webpDir)) {
            $disk->makeDirectory($webpDir);
        }

        // Original WebP
        $webpPath = $webpDir . '/' . $filename . '.webp';
        $webpFullPath = $disk->path($webpPath);
        $webp = $manager->read($fullPath);
        $webp->toWebp(quality: 85)->save($webpFullPath);

        // Thumbnail WebP
        $webpThumbPath = $webpDir . '/' . $filename . '_thumb.webp';
        $webpThumbFullPath = $disk->path($webpThumbPath);
        $webpThumb = $manager->read($fullPath);
        $webpThumb->cover(300, 400)->toWebp(quality: 80)->save($webpThumbFullPath);

        // Medium WebP
        $webpMediumPath = $webpDir . '/' . $filename . '_medium.webp';
        $webpMediumFullPath = $disk->path($webpMediumPath);
        $webpMedium = $manager->read($fullPath);
        $webpMedium->scale(width: 800, height: 800)->toWebp(quality: 85)->save($webpMediumFullPath);
    }
} 