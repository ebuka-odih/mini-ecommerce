<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ProductImporterService;
use App\Services\ImageService;

class TestProductImport extends Command
{
    protected $signature = 'test:product-import {url}';
    protected $description = 'Test product import functionality';

    public function handle()
    {
        $url = $this->argument('url');
        
        $this->info("Testing product import for: {$url}");
        
        $imageService = app(ImageService::class);
        $importer = new ProductImporterService($imageService);
        
        $result = $importer->importFromUrl($url);
        
        if ($result['success']) {
            $this->info("Import successful!");
            $this->info("Product Name: " . $result['data']['name']);
            $this->info("Price: " . $result['data']['price']);
            $this->info("Description: " . substr($result['data']['description'], 0, 100) . "...");
            $this->info("Images: " . count($result['data']['images']));
        } else {
            $this->error("Import failed: " . $result['error']);
        }
        
        return 0;
    }
}