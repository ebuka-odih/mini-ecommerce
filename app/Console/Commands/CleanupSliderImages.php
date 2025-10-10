<?php

namespace App\Console\Commands;

use App\Models\Image;
use App\Models\Setting;
use Illuminate\Console\Command;

class CleanupSliderImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'slider:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up orphaned slider image references';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Cleaning up orphaned slider image references...');

        // Get current slider images setting
        $selectedImages = Setting::getValue('homepage_slider_images', []);
        $originalCount = count($selectedImages);

        $this->info("Found {$originalCount} images in slider settings");

        // Get existing image IDs
        $existingImageIds = Image::pluck('id')->toArray();
        $this->info("Found " . count($existingImageIds) . " images in database");

        // Filter out non-existent images
        $cleanedImages = array_values(array_filter($selectedImages, function($id) use ($existingImageIds) {
            return in_array($id, $existingImageIds);
        }));

        $removedCount = $originalCount - count($cleanedImages);

        if ($removedCount > 0) {
            Setting::setValue('homepage_slider_images', json_encode($cleanedImages), 'json', 'frontend', 'Homepage slider images');
            $this->warn("Removed {$removedCount} orphaned image reference(s)");
            $this->info("Slider now has " . count($cleanedImages) . " valid image(s)");
            
            // Show which images were removed
            $removedIds = array_diff($selectedImages, $cleanedImages);
            if (!empty($removedIds)) {
                $this->newLine();
                $this->error('Removed image IDs:');
                foreach ($removedIds as $id) {
                    $this->line("  - {$id}");
                }
            }
        } else {
            $this->info('No orphaned images found. Slider settings are clean!');
        }

        $this->newLine();
        $this->info('✓ Cleanup complete!');

        return Command::SUCCESS;
    }
}

