<?php

namespace App\Console\Commands;

use App\Models\Image;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class OptimizeProductImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize 
                            {--force : Force re-optimization of already optimized images}
                            {--only-missing : Only generate missing thumbnails/medium versions}
                            {--image-id= : Optimize a specific image by ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize product images by compressing, resizing, and generating WebP versions';

    protected $manager;
    protected $optimizedCount = 0;
    protected $skippedCount = 0;
    protected $errorCount = 0;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🖼️  Starting image optimization...');
        $this->newLine();

        // Check if GD extension is loaded
        if (!extension_loaded('gd')) {
            $this->error('❌ GD extension is not loaded. Please install php-gd extension.');
            return 1;
        }

        // Initialize Image Manager with GD driver
        $this->manager = new ImageManager(new Driver());

        $query = Image::query();

        // Filter by image ID if specified
        if ($imageId = $this->option('image-id')) {
            $query->where('id', $imageId);
        }

        // Skip already optimized images unless --force is used
        if (!$this->option('force') && !$this->option('only-missing')) {
            $query->where(function ($q) {
                $q->whereNull('is_optimized')
                  ->orWhere('is_optimized', false);
            });
        }

        $images = $query->get();

        if ($images->isEmpty()) {
            $this->info('✅ No images found to optimize.');
            return 0;
        }

        $this->info("📊 Found {$images->count()} images to process");
        $this->newLine();

        $progressBar = $this->output->createProgressBar($images->count());
        $progressBar->start();

        foreach ($images as $image) {
            try {
                $this->processImage($image);
                $this->optimizedCount++;
            } catch (\Exception $e) {
                $this->errorCount++;
                $this->error("\n❌ Error processing image {$image->id}: " . $e->getMessage());
            }
            
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        // Display summary
        $this->displaySummary();

        return 0;
    }

    protected function processImage(Image $image)
    {
        $disk = Storage::disk($image->disk);
        
        if (!$disk->exists($image->path)) {
            $this->skippedCount++;
            throw new \Exception("File not found: {$image->path}");
        }

        $fullPath = $disk->path($image->path);
        $pathInfo = pathinfo($image->path);
        $directory = $pathInfo['dirname'];
        $filename = $pathInfo['filename'];
        $extension = $pathInfo['extension'];

        // Skip if only generating missing versions
        if ($this->option('only-missing')) {
            $this->generateMissingVersions($image, $fullPath, $directory, $filename, $extension);
            return;
        }

        // Load the original image
        $img = $this->manager->read($fullPath);

        // Get original dimensions
        $originalWidth = $img->width();
        $originalHeight = $img->height();

        // Update image dimensions in database
        $image->width = $originalWidth;
        $image->height = $originalHeight;

        // 1. Optimize the original image (if it's too large, resize it)
        $maxOriginalWidth = 2000;
        $maxOriginalHeight = 2000;

        if ($originalWidth > $maxOriginalWidth || $originalHeight > $maxOriginalHeight) {
            $img->scale(width: $maxOriginalWidth, height: $maxOriginalHeight);
            
            // Save optimized version
            if (strtolower($extension) === 'jpg' || strtolower($extension) === 'jpeg') {
                $img->toJpeg(quality: 85)->save($fullPath);
            } elseif (strtolower($extension) === 'png') {
                $img->toPng()->save($fullPath);
            } else {
                $img->save($fullPath);
            }
            
            // Update file size
            $image->size = filesize($fullPath);
        } else {
            // Just compress without resizing
            if (strtolower($extension) === 'jpg' || strtolower($extension) === 'jpeg') {
                $img->toJpeg(quality: 85)->save($fullPath);
                $image->size = filesize($fullPath);
            } elseif (strtolower($extension) === 'png') {
                $img->toPng()->save($fullPath);
                $image->size = filesize($fullPath);
            }
        }

        // 2. Generate thumbnail (300x300)
        $this->generateThumbnail($image, $fullPath, $directory, $filename, $extension);

        // 3. Generate medium size (800x800)
        $this->generateMedium($image, $fullPath, $directory, $filename, $extension);

        // 4. Generate WebP versions
        if (function_exists('imagewebp')) {
            $this->generateWebP($image, $fullPath, $directory, $filename);
        }

        // Mark as optimized
        $image->is_optimized = true;
        $image->metadata = array_merge($image->metadata ?? [], [
            'optimized_at' => now()->toISOString(),
            'original_width' => $originalWidth,
            'original_height' => $originalHeight,
        ]);
        
        $image->save();
    }

    protected function generateMissingVersions(Image $image, string $fullPath, string $directory, string $filename, string $extension)
    {
        $disk = Storage::disk($image->disk);
        
        // Check and generate thumbnail if missing
        $thumbnailPath = $directory . '/thumbnails/' . $filename . '.' . $extension;
        if (!$disk->exists($thumbnailPath)) {
            $this->generateThumbnail($image, $fullPath, $directory, $filename, $extension);
        }
        
        // Check and generate medium if missing
        $mediumPath = $directory . '/medium/' . $filename . '.' . $extension;
        if (!$disk->exists($mediumPath)) {
            $this->generateMedium($image, $fullPath, $directory, $filename, $extension);
        }
        
        // Check and generate WebP if missing
        if (function_exists('imagewebp')) {
            $webpPath = $directory . '/webp/' . $filename . '.webp';
            if (!$disk->exists($webpPath)) {
                $this->generateWebP($image, $fullPath, $directory, $filename);
            }
        }
    }

    protected function generateThumbnail(Image $image, string $fullPath, string $directory, string $filename, string $extension)
    {
        $disk = Storage::disk($image->disk);
        $thumbnailDir = $directory . '/thumbnails';
        
        // Create thumbnail directory if it doesn't exist
        if (!$disk->exists($thumbnailDir)) {
            $disk->makeDirectory($thumbnailDir);
        }

        $thumbnailPath = $thumbnailDir . '/' . $filename . '.' . $extension;
        $thumbnailFullPath = $disk->path($thumbnailPath);

        // Generate thumbnail with 3:4 aspect ratio (300x400) to match product card container
        $thumbnail = $this->manager->read($fullPath);
        $thumbnail->cover(300, 400); // 3:4 aspect ratio

        if (strtolower($extension) === 'jpg' || strtolower($extension) === 'jpeg') {
            $thumbnail->toJpeg(quality: 80)->save($thumbnailFullPath);
        } elseif (strtolower($extension) === 'png') {
            $thumbnail->toPng()->save($thumbnailFullPath);
        } else {
            $thumbnail->save($thumbnailFullPath);
        }
    }

    protected function generateMedium(Image $image, string $fullPath, string $directory, string $filename, string $extension)
    {
        $disk = Storage::disk($image->disk);
        $mediumDir = $directory . '/medium';
        
        // Create medium directory if it doesn't exist
        if (!$disk->exists($mediumDir)) {
            $disk->makeDirectory($mediumDir);
        }

        $mediumPath = $mediumDir . '/' . $filename . '.' . $extension;
        $mediumFullPath = $disk->path($mediumPath);

        // Generate medium size
        $medium = $this->manager->read($fullPath);
        $medium->scale(width: 800, height: 800);

        if (strtolower($extension) === 'jpg' || strtolower($extension) === 'jpeg') {
            $medium->toJpeg(quality: 85)->save($mediumFullPath);
        } elseif (strtolower($extension) === 'png') {
            $medium->toPng()->save($mediumFullPath);
        } else {
            $medium->save($mediumFullPath);
        }
    }

    protected function generateWebP(Image $image, string $fullPath, string $directory, string $filename)
    {
        $disk = Storage::disk($image->disk);
        $webpDir = $directory . '/webp';
        
        // Create webp directory if it doesn't exist
        if (!$disk->exists($webpDir)) {
            $disk->makeDirectory($webpDir);
        }

        // Generate WebP version of original
        $webpPath = $webpDir . '/' . $filename . '.webp';
        $webpFullPath = $disk->path($webpPath);
        
        $webp = $this->manager->read($fullPath);
        $webp->toWebp(quality: 85)->save($webpFullPath);

        // Generate WebP thumbnail
        $webpThumbPath = $webpDir . '/' . $filename . '_thumb.webp';
        $webpThumbFullPath = $disk->path($webpThumbPath);
        
        $webpThumb = $this->manager->read($fullPath);
        $webpThumb->cover(300, 400)->toWebp(quality: 80)->save($webpThumbFullPath);

        // Generate WebP medium
        $webpMediumPath = $webpDir . '/' . $filename . '_medium.webp';
        $webpMediumFullPath = $disk->path($webpMediumPath);
        
        $webpMedium = $this->manager->read($fullPath);
        $webpMedium->scale(width: 800, height: 800)->toWebp(quality: 85)->save($webpMediumFullPath);
    }

    protected function displaySummary()
    {
        $this->info('📊 Optimization Summary:');
        $this->info("   ✅ Optimized: {$this->optimizedCount}");
        
        if ($this->skippedCount > 0) {
            $this->warn("   ⏭️  Skipped: {$this->skippedCount}");
        }
        
        if ($this->errorCount > 0) {
            $this->error("   ❌ Errors: {$this->errorCount}");
        }
        
        $this->newLine();
        
        // Calculate total space saved
        $totalImages = Image::where('is_optimized', true)->count();
        $totalSize = Image::where('is_optimized', true)->sum('size');
        
        $this->info("📈 Total optimized images: {$totalImages}");
        $this->info("💾 Total storage used: " . $this->formatBytes($totalSize));
        $this->newLine();
        
        $this->info('✨ Optimization complete!');
    }

    protected function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}

