<?php

namespace Database\Seeders;

use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaLibrarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user for attribution
        $adminUser = User::where('email', 'admin@gnosisbrand.com')->first();
        $uploadedBy = $adminUser ? $adminUser->id : null;

        // Sample media library images
        $sampleImages = [
            [
                'filename' => 'product-placeholder-1.jpg',
                'original_name' => 'Fashion Model 1.jpg',
                'folder' => 'products',
                'tags' => 'fashion, model, clothing',
                'alt_text' => 'Fashion model wearing casual clothing',
                'caption' => 'Stylish casual wear for modern lifestyle',
                'width' => 800,
                'height' => 1200,
            ],
            [
                'filename' => 'product-placeholder-2.jpg',
                'original_name' => 'Summer Collection.jpg',
                'folder' => 'products',
                'tags' => 'summer, collection, bright',
                'alt_text' => 'Summer fashion collection showcase',
                'caption' => 'Bright and colorful summer fashion',
                'width' => 1000,
                'height' => 800,
            ],
            [
                'filename' => 'banner-hero.jpg',
                'original_name' => 'Hero Banner.jpg',
                'folder' => 'banners',
                'tags' => 'banner, hero, homepage',
                'alt_text' => 'Main hero banner for homepage',
                'caption' => 'Stunning hero banner showcasing brand identity',
                'width' => 1920,
                'height' => 800,
            ],
            [
                'filename' => 'category-accessories.jpg',
                'original_name' => 'Accessories Category.jpg',
                'folder' => 'categories',
                'tags' => 'accessories, category, jewelry',
                'alt_text' => 'Fashion accessories collection',
                'caption' => 'Premium accessories for every occasion',
                'width' => 600,
                'height' => 600,
            ],
            [
                'filename' => 'category-footwear.jpg',
                'original_name' => 'Footwear Collection.jpg',
                'folder' => 'categories',
                'tags' => 'footwear, shoes, category',
                'alt_text' => 'Stylish footwear collection',
                'caption' => 'Step up your style with our footwear',
                'width' => 600,
                'height' => 600,
            ],
            [
                'filename' => 'logo-variants.png',
                'original_name' => 'GNOSIS Logo Variants.png',
                'folder' => 'branding',
                'tags' => 'logo, branding, gnosis',
                'alt_text' => 'GNOSIS brand logo variations',
                'caption' => 'Official GNOSIS brand logos in different formats',
                'width' => 1000,
                'height' => 400,
            ],
            [
                'filename' => 'social-media-post.jpg',
                'original_name' => 'Social Media Template.jpg',
                'folder' => 'marketing',
                'tags' => 'social, marketing, template',
                'alt_text' => 'Social media post template',
                'caption' => 'Engaging social media content template',
                'width' => 1080,
                'height' => 1080,
            ],
            [
                'filename' => 'product-detail-1.jpg',
                'original_name' => 'Product Detail Shot.jpg',
                'folder' => 'products',
                'tags' => 'product, detail, close-up',
                'alt_text' => 'Detailed product photography',
                'caption' => 'High-quality product detail shot',
                'width' => 800,
                'height' => 800,
            ],
            [
                'filename' => 'lifestyle-1.jpg',
                'original_name' => 'Lifestyle Photography.jpg',
                'folder' => 'lifestyle',
                'tags' => 'lifestyle, fashion, casual',
                'alt_text' => 'Lifestyle fashion photography',
                'caption' => 'Fashion in everyday life',
                'width' => 1200,
                'height' => 800,
            ],
            [
                'filename' => 'newsletter-header.jpg',
                'original_name' => 'Newsletter Header.jpg',
                'folder' => 'marketing',
                'tags' => 'newsletter, email, header',
                'alt_text' => 'Email newsletter header image',
                'caption' => 'Professional newsletter header design',
                'width' => 800,
                'height' => 200,
            ],
        ];

        foreach ($sampleImages as $index => $imageData) {
            // Create a fake file path (in production, you'd have actual files)
            $path = 'media-library/' . $imageData['folder'] . '/' . $imageData['filename'];
            
            // Calculate file size based on dimensions (rough estimate)
            $estimatedSize = ($imageData['width'] * $imageData['height'] * 3) / 10; // Rough JPEG estimate
            
            Image::create([
                'filename' => $imageData['filename'],
                'original_name' => $imageData['original_name'],
                'mime_type' => 'image/jpeg',
                'extension' => pathinfo($imageData['filename'], PATHINFO_EXTENSION),
                'path' => $path,
                'disk' => 'public',
                'folder' => 'media-library/' . $imageData['folder'],
                'size' => $estimatedSize,
                'width' => $imageData['width'],
                'height' => $imageData['height'],
                // Leave imageable fields empty for media library items
                'alt_text' => $imageData['alt_text'],
                'caption' => $imageData['caption'],
                'is_featured' => false,
                'is_optimized' => true,
                'sort_order' => $index,
                'metadata' => [
                    'camera' => 'Canon EOS R5',
                    'lens' => '50mm f/1.8',
                    'settings' => 'f/2.8, 1/200s, ISO 400'
                ],
                'tags' => $imageData['tags'],
                'uploaded_at' => now()->subDays(rand(1, 30)),
                'uploaded_by' => $uploadedBy,
                'color_palette' => [
                    'primary' => '#' . str_pad(dechex(rand(0, 16777215)), 6, '0', STR_PAD_LEFT),
                    'secondary' => '#' . str_pad(dechex(rand(0, 16777215)), 6, '0', STR_PAD_LEFT),
                    'accent' => '#' . str_pad(dechex(rand(0, 16777215)), 6, '0', STR_PAD_LEFT),
                ],
                'download_count' => rand(0, 50),
                'last_used_at' => rand(0, 1) ? now()->subDays(rand(1, 7)) : null,
                'usage_context' => json_encode([
                    rand(0, 1) ? 'Product' : 'Category',
                    rand(0, 1) ? 'Homepage' : 'Marketing',
                ]),
            ]);
        }

        // Create some additional random images for bulk testing
        for ($i = 0; $i < 20; $i++) {
            $folders = ['products', 'categories', 'banners', 'marketing', 'lifestyle', 'branding'];
            $folder = $folders[array_rand($folders)];
            
            $tags = [
                'products' => ['fashion', 'clothing', 'style', 'trendy'],
                'categories' => ['category', 'collection', 'showcase'],
                'banners' => ['banner', 'promotion', 'sale', 'featured'],
                'marketing' => ['marketing', 'social', 'campaign', 'promo'],
                'lifestyle' => ['lifestyle', 'casual', 'everyday', 'natural'],
                'branding' => ['brand', 'logo', 'identity', 'corporate'],
            ];
            
            $selectedTags = array_rand(array_flip($tags[$folder]), rand(2, 3));
            
            Image::create([
                'filename' => 'sample-' . ($i + 1) . '.jpg',
                'original_name' => 'Sample Image ' . ($i + 1) . '.jpg',
                'mime_type' => 'image/jpeg',
                'extension' => 'jpg',
                'path' => 'media-library/' . $folder . '/sample-' . ($i + 1) . '.jpg',
                'disk' => 'public',
                'folder' => 'media-library/' . $folder,
                'size' => rand(50000, 500000), // 50KB to 500KB
                'width' => rand(400, 1200),
                'height' => rand(400, 1200),
                // Leave imageable fields empty for media library items
                'alt_text' => 'Sample image for ' . $folder,
                'caption' => 'Generated sample image for testing purposes',
                'is_featured' => false,
                'is_optimized' => rand(0, 1),
                'sort_order' => $i,
                'metadata' => [
                    'generated' => true,
                    'purpose' => 'testing'
                ],
                'tags' => implode(', ', $selectedTags),
                'uploaded_at' => now()->subDays(rand(1, 60)),
                'uploaded_by' => $uploadedBy,
                'color_palette' => [
                    'primary' => '#' . str_pad(dechex(rand(0, 16777215)), 6, '0', STR_PAD_LEFT),
                    'secondary' => '#' . str_pad(dechex(rand(0, 16777215)), 6, '0', STR_PAD_LEFT),
                ],
                'download_count' => rand(0, 25),
                'last_used_at' => rand(0, 1) ? now()->subDays(rand(1, 30)) : null,
                'usage_context' => null,
            ]);
        }

        $this->command->info('Created ' . (count($sampleImages) + 20) . ' sample media library images');
    }
}