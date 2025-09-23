<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use App\Models\Image;
use App\Services\ImageService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use DOMDocument;
use DOMXPath;

class ProductImporterService
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Import product from URL
     */
    public function importFromUrl(string $url, array $options = []): array
    {
        try {
            // Extract domain and determine scraper
            $domain = parse_url($url, PHP_URL_HOST);
            $scraper = $this->getScraper($domain);
            
            if (!$scraper) {
                return [
                    'success' => false,
                    'error' => 'Unsupported website. Currently supported: Temu, AliExpress, Amazon'
                ];
            }

            // Fetch and parse the page
            $html = $this->fetchPage($url);
            if (!$html) {
                return [
                    'success' => false,
                    'error' => 'Failed to fetch the product page'
                ];
            }

            // Extract product data
            $productData = $scraper->extractProductData($html, $url);
            
            if (!$productData) {
                return [
                    'success' => false,
                    'error' => 'Failed to extract product data from the page'
                ];
            }

            // Download and save images
            if (isset($productData['images']) && !empty($productData['images'])) {
                $productData['downloaded_images'] = $this->downloadImages($productData['images']);
            }

            return [
                'success' => true,
                'data' => $productData
            ];

        } catch (\Exception $e) {
            Log::error('Product import error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Import failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get appropriate scraper for domain
     */
    protected function getScraper(string $domain): ?object
    {
        $domain = strtolower($domain);
        
        if (str_contains($domain, 'temu.com')) {
            return new TemuScraper();
        } elseif (str_contains($domain, 'aliexpress.com')) {
            return new AliExpressScraper();
        } elseif (str_contains($domain, 'amazon.com')) {
            return new AmazonScraper();
        }
        
        return null;
    }

    /**
     * Fetch page content
     */
    protected function fetchPage(string $url): ?string
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language' => 'en-US,en;q=0.5',
                'Accept-Encoding' => 'gzip, deflate',
                'Connection' => 'keep-alive',
                'Upgrade-Insecure-Requests' => '1',
            ])->timeout(30)->get($url);

            if ($response->successful()) {
                return $response->body();
            }
        } catch (\Exception $e) {
            Log::error('Failed to fetch page: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Download images from URLs
     */
    protected function downloadImages(array $imageUrls): array
    {
        $downloadedImages = [];
        
        foreach ($imageUrls as $index => $imageUrl) {
            try {
                // Clean and validate URL
                $imageUrl = $this->cleanImageUrl($imageUrl);
                if (!$imageUrl) continue;

                // Download image
                $response = Http::timeout(30)->get($imageUrl);
                if (!$response->successful()) continue;

                // Generate filename
                $extension = $this->getImageExtension($imageUrl, $response->header('Content-Type'));
                $filename = 'imported_' . time() . '_' . $index . '.' . $extension;

                // Save image using ImageService
                $imageData = [
                    'filename' => $filename,
                    'original_name' => basename(parse_url($imageUrl, PHP_URL_PATH)),
                    'mime_type' => $response->header('Content-Type'),
                    'extension' => $extension,
                    'size' => strlen($response->body()),
                    'content' => $response->body()
                ];

                $savedImage = $this->imageService->saveImportedImage($imageData);
                if ($savedImage) {
                    $downloadedImages[] = $savedImage;
                }

            } catch (\Exception $e) {
                Log::error('Failed to download image: ' . $e->getMessage());
                continue;
            }
        }

        return $downloadedImages;
    }

    /**
     * Clean and validate image URL
     */
    protected function cleanImageUrl(string $url): ?string
    {
        // Handle relative URLs
        if (str_starts_with($url, '//')) {
            $url = 'https:' . $url;
        } elseif (str_starts_with($url, '/')) {
            $url = 'https://www.temu.com' . $url;
        }

        // Validate URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        return $url;
    }

    /**
     * Get image extension from URL or content type
     */
    protected function getImageExtension(string $url, ?string $contentType): string
    {
        // Try to get from URL first
        $path = parse_url($url, PHP_URL_PATH);
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        
        if ($extension && in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            return strtolower($extension);
        }

        // Fallback to content type
        if ($contentType) {
            $mimeToExt = [
                'image/jpeg' => 'jpg',
                'image/jpg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
                'image/gif' => 'gif'
            ];
            
            return $mimeToExt[$contentType] ?? 'jpg';
        }

        return 'jpg';
    }
}

/**
 * Temu Product Scraper
 */
class TemuScraper
{
    public function extractProductData(string $html, string $url): ?array
    {
        try {
            $dom = new DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new DOMXPath($dom);

            // Extract product name - try more comprehensive selectors for Temu
            $name = $this->extractText($xpath, [
                '//h1[@data-testid="product-title"]',
                '//h1[contains(@class, "product-title")]',
                '//h1[contains(@class, "title")]',
                '//h1[contains(@class, "product-name")]',
                '//h1[contains(@class, "goods-title")]',
                '//div[contains(@class, "product-title")]//h1',
                '//div[contains(@class, "goods-title")]//h1',
                '//div[contains(@class, "title")]//h1',
                '//h2[contains(@class, "title")]',
                '//h3[contains(@class, "title")]',
                '//span[contains(@class, "title")]',
                '//div[contains(@class, "product-name")]',
                '//div[contains(@class, "goods-name")]',
                '//title'
            ]);

            // Extract price with better selectors
            $price = $this->extractPrice($xpath, [
                '//span[contains(@class, "price")]',
                '//div[contains(@class, "price")]',
                '//span[contains(@class, "current-price")]',
                '//span[contains(@class, "sale-price")]',
                '//span[contains(@class, "goods-price")]',
                '//div[contains(@class, "current-price")]',
                '//div[contains(@class, "sale-price")]',
                '//div[contains(@class, "goods-price")]',
                '//span[contains(text(), "$")]',
                '//span[contains(text(), "₦")]',
                '//span[contains(text(), "€")]',
                '//span[contains(text(), "£")]'
            ]);

            // Extract description - try multiple sources with better selectors
            $description = $this->extractText($xpath, [
                '//div[contains(@class, "product-description")]',
                '//div[contains(@class, "description")]',
                '//div[contains(@class, "goods-description")]',
                '//div[contains(@class, "product-detail")]',
                '//div[contains(@class, "detail")]',
                '//div[contains(@class, "info")]',
                '//div[contains(@class, "product-info")]',
                '//div[contains(@class, "goods-info")]',
                '//div[contains(@class, "specification")]',
                '//div[contains(@class, "spec")]',
                '//meta[@name="description"]/@content',
                '//meta[@property="og:description"]/@content',
                '//p[contains(@class, "description")]',
                '//span[contains(@class, "description")]'
            ]);

            // If no description found, generate one from the title
            if ((empty($description) || trim($description) === '') && !empty($name)) {
                $description = $this->generateDescriptionFromTitle($name);
            }

            // Extract images
            $images = $this->extractImages($xpath, $url);

            // Extract additional data from URL parameters
            $urlData = $this->extractFromUrl($url);

            // If no name found, try to extract from URL
            if (empty($name)) {
                $name = $this->extractNameFromUrl($url);
            }

            // Use actual product name if found, otherwise generate standardized name
            $finalName = !empty($name) ? $name : $this->generateTemuProductName($urlData);

            // Debug logging
            Log::info('Temu product extraction results', [
                'extracted_name' => $name,
                'final_name' => $finalName,
                'price' => $price,
                'description' => $description,
                'images_count' => count($images),
                'url_data' => $urlData
            ]);

            return [
                'name' => $finalName,
                'price' => $price ?: '0.00',
                'description' => $description ?: '',
                'images' => $images,
                'source_url' => $url,
                'source_platform' => 'Temu',
                'sku' => $urlData['sku'] ?? null,
                'external_id' => $urlData['product_id'] ?? null
            ];

        } catch (\Exception $e) {
            Log::error('Temu scraping error: ' . $e->getMessage());
            return null;
        }
    }

    protected function extractText(DOMXPath $xpath, array $selectors): ?string
    {
        foreach ($selectors as $selector) {
            $nodes = $xpath->query($selector);
            if ($nodes->length > 0) {
                $text = trim($nodes->item(0)->textContent);
                if (!empty($text)) {
                    return $text;
                }
            }
        }
        return null;
    }

    protected function extractPrice(DOMXPath $xpath, array $selectors): ?string
    {
        foreach ($selectors as $selector) {
            $nodes = $xpath->query($selector);
            if ($nodes->length > 0) {
                $text = trim($nodes->item(0)->textContent);
                // Extract price using regex - handle multiple currencies
                if (preg_match('/[\$₦€£]?(\d+[.,]?\d*)/', $text, $matches)) {
                    // Clean up the price (remove commas, handle decimal points)
                    $price = str_replace(',', '', $matches[1]);
                    return $price;
                }
            }
        }
        return null;
    }

    protected function extractImages(DOMXPath $xpath, string $baseUrl): array
    {
        $images = [];
        
        // Try different image selectors for more comprehensive image extraction
        $selectors = [
            '//img[contains(@class, "product-image")]/@src',
            '//img[contains(@class, "gallery-image")]/@src',
            '//img[contains(@class, "swiper-slide")]/@src',
            '//img[contains(@class, "image")]/@src',
            '//img[contains(@data-src, "product")]/@data-src',
            '//img[contains(@data-src, "img")]/@data-src',
            '//img[contains(@src, "product")]/@src',
            '//img[contains(@src, "img.kwcdn.com")]/@src',
            '//img[contains(@src, "temu")]/@src',
            '//img/@src[contains(., "jpg")]',
            '//img/@src[contains(., "jpeg")]',
            '//img/@src[contains(., "png")]',
            '//img/@src[contains(., "webp")]'
        ];

        foreach ($selectors as $selector) {
            $nodes = $xpath->query($selector);
            foreach ($nodes as $node) {
                $src = $node->textContent;
                if ($src && !in_array($src, $images)) {
                    // Clean and validate the image URL
                    $cleanSrc = $this->cleanImageUrl($src);
                    if ($cleanSrc) {
                        $images[] = $cleanSrc;
                    }
                }
            }
        }

        // Also try to extract from URL parameters (Temu specific)
        $urlImages = $this->extractImagesFromUrl($baseUrl);
        $images = array_merge($images, $urlImages);

        // Remove duplicates and limit to first 5 images
        $images = array_unique($images);
        return array_slice($images, 0, 5);
    }

    protected function extractFromUrl(string $url): array
    {
        $data = [];
        
        // Extract product ID from URL
        if (preg_match('/-g-(\d+)\.html/', $url, $matches)) {
            $data['product_id'] = $matches[1];
        }

        // Extract SKU from URL
        if (preg_match('/spec_id=(\d+)/', $url, $matches)) {
            $data['sku'] = 'TEMU-' . $matches[1] . '-' . substr(md5($url), 0, 6);
        }

        return $data;
    }

    protected function extractImagesFromUrl(string $url): array
    {
        $images = [];
        
        // Extract top_gallery_url parameter
        if (preg_match('/top_gallery_url=([^&]+)/', $url, $matches)) {
            $imageUrl = urldecode($matches[1]);
            $images[] = $imageUrl;
        }

        return $images;
    }

    protected function extractNameFromUrl(string $url): string
    {
        // Extract product name from URL path
        $path = parse_url($url, PHP_URL_PATH);
        
        // Remove file extension and decode
        $path = preg_replace('/\.html$/', '', $path);
        $path = urldecode($path);
        
        // Extract the product name part (usually after the last slash)
        $parts = explode('/', $path);
        $productPart = end($parts);
        
        // Clean up the product name
        $productPart = preg_replace('/-g-\d+$/', '', $productPart); // Remove product ID
        $productPart = str_replace('-', ' ', $productPart); // Replace dashes with spaces
        $productPart = ucwords($productPart); // Capitalize words
        
        return trim($productPart);
    }

    public function generateDescriptionFromTitle(string $title): string
    {
        // Clean and extract meaningful product information
        $cleanTitle = $this->cleanProductTitle($title);
        $productInfo = $this->extractProductInfo($cleanTitle);
        
        // Generate a natural, marketing-friendly description
        $description = $this->buildProductDescription($productInfo);
        
        return $description;
    }

    protected function cleanProductTitle(string $title): string
    {
        // Remove technical specifications and measurements
        $cleanTitle = $title;
        
        // Remove common technical terms and measurements
        $patterns = [
            '/\b\d+\s*(g|kg|cm|mm|inch|inches|oz|lbs?)\b/i', // measurements
            '/\b\d+%\s*(polyester|cotton|wool|nylon|spandex|elastane)\b/i', // material percentages
            '/\b(100%|50%|30%|20%|10%)\s*(polyester|cotton|wool|nylon|spandex|elastane)\b/i',
            '/\b(non\s*stretch|stretch|regular\s*season|regular\s*length)\b/i',
            '/\b(with\s*split\s*detail|split\s*detail|drawstring|elastic)\b/i',
            '/\b(1pc|2pc|3pc|4pc|5pc)\b/i', // piece counts
            '/\b(solid\s*color|solid\s*colour)\b/i',
            '/\b(waist\s*with|with\s*waist)\b/i',
            '/\b(regular\s*fit|loose\s*fit|tight\s*fit)\b/i',
            '/\b(casual|formal|business)\s*(wear|attire)\b/i',
        ];
        
        foreach ($patterns as $pattern) {
            $cleanTitle = preg_replace($pattern, '', $cleanTitle);
        }
        
        // Clean up extra spaces and dashes
        $cleanTitle = preg_replace('/\s+/', ' ', $cleanTitle);
        $cleanTitle = preg_replace('/\s*-\s*/', ' ', $cleanTitle);
        $cleanTitle = trim($cleanTitle);
        
        return $cleanTitle;
    }

    protected function extractProductInfo(string $cleanTitle): array
    {
        $info = [
            'type' => 'clothing',
            'style' => 'casual',
            'material' => null,
            'color' => null,
            'features' => []
        ];
        
        // Determine product type
        if (stripos($cleanTitle, 'pants') !== false || stripos($cleanTitle, 'trousers') !== false) {
            $info['type'] = 'pants';
        } elseif (stripos($cleanTitle, 'shirt') !== false || stripos($cleanTitle, 'top') !== false) {
            $info['type'] = 'shirt';
        } elseif (stripos($cleanTitle, 'dress') !== false) {
            $info['type'] = 'dress';
        } elseif (stripos($cleanTitle, 'shoes') !== false || stripos($cleanTitle, 'sneakers') !== false) {
            $info['type'] = 'shoes';
        } elseif (stripos($cleanTitle, 'jacket') !== false || stripos($cleanTitle, 'coat') !== false) {
            $info['type'] = 'jacket';
        }
        
        // Determine style
        if (stripos($cleanTitle, 'formal') !== false || stripos($cleanTitle, 'business') !== false) {
            $info['style'] = 'formal';
        } elseif (stripos($cleanTitle, 'casual') !== false) {
            $info['style'] = 'casual';
        } elseif (stripos($cleanTitle, 'sport') !== false || stripos($cleanTitle, 'athletic') !== false) {
            $info['style'] = 'sport';
        }
        
        // Extract material
        if (stripos($cleanTitle, 'cotton') !== false) {
            $info['material'] = 'cotton';
        } elseif (stripos($cleanTitle, 'polyester') !== false) {
            $info['material'] = 'polyester';
        } elseif (stripos($cleanTitle, 'denim') !== false) {
            $info['material'] = 'denim';
        } elseif (stripos($cleanTitle, 'wool') !== false) {
            $info['material'] = 'wool';
        }
        
        // Extract color
        $colors = ['black', 'white', 'blue', 'red', 'green', 'brown', 'gray', 'grey', 'navy', 'beige', 'khaki'];
        foreach ($colors as $color) {
            if (stripos($cleanTitle, $color) !== false) {
                $info['color'] = $color;
                break;
            }
        }
        
        // Extract features
        if (stripos($cleanTitle, 'pocket') !== false) {
            $info['features'][] = 'pockets';
        }
        if (stripos($cleanTitle, 'loose') !== false) {
            $info['features'][] = 'loose fit';
        }
        if (stripos($cleanTitle, 'straight') !== false) {
            $info['features'][] = 'straight cut';
        }
        
        return $info;
    }

    protected function buildProductDescription(array $productInfo): string
    {
        $description = '';
        
        // Start with product type and style
        $type = $productInfo['type'];
        $style = $productInfo['style'];
        
        if ($type === 'pants') {
            $description = "Stylish {$style} pants";
        } elseif ($type === 'shirt') {
            $description = "Comfortable {$style} shirt";
        } elseif ($type === 'dress') {
            $description = "Elegant {$style} dress";
        } elseif ($type === 'shoes') {
            $description = "Quality {$style} shoes";
        } elseif ($type === 'jacket') {
            $description = "Versatile {$style} jacket";
        } else {
            $description = "Quality {$style} clothing";
        }
        
        // Add material if known
        if ($productInfo['material']) {
            $description .= " made from premium {$productInfo['material']}";
        }
        
        // Add color if known
        if ($productInfo['color']) {
            $description .= " in {$productInfo['color']}";
        }
        
        $description .= ". ";
        
        // Add features
        if (!empty($productInfo['features'])) {
            $features = implode(', ', $productInfo['features']);
            $description .= "Features {$features}. ";
        }
        
        // Add style-appropriate benefits
        if ($style === 'casual') {
            $description .= "Perfect for everyday wear and relaxed occasions. ";
        } elseif ($style === 'formal') {
            $description .= "Ideal for business meetings and formal events. ";
        } elseif ($style === 'sport') {
            $description .= "Designed for active lifestyles and athletic activities. ";
        }
        
        // Add universal benefits
        $description .= "Comfortable fit, quality construction, and easy care make this a versatile addition to your wardrobe.";
        
        return $description;
    }

    protected function generateTemuProductName(array $urlData): string
    {
        // Extract numbers from spec_id or product_id
        $numbers = '';
        if (isset($urlData['sku']) && preg_match('/TEMU-(\d+)/', $urlData['sku'], $matches)) {
            $numbers = substr($matches[1], 0, 3); // Take first 3 digits
        } elseif (isset($urlData['product_id'])) {
            $numbers = substr($urlData['product_id'], 0, 3); // Take first 3 digits
        } else {
            $numbers = str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT); // Random 3 digits
        }

        // Generate 3 random capital letters
        $letters = '';
        for ($i = 0; $i < 3; $i++) {
            $letters .= chr(rand(65, 90)); // A-Z
        }

        return "temu-{$numbers}-{$letters}";
    }

}

/**
 * AliExpress Product Scraper
 */
class AliExpressScraper
{
    public function extractProductData(string $html, string $url): ?array
    {
        // Implementation for AliExpress scraping
        // Similar structure to TemuScraper
        return null;
    }
}

/**
 * Amazon Product Scraper
 */
class AmazonScraper
{
    public function extractProductData(string $html, string $url): ?array
    {
        // Implementation for Amazon scraping
        // Similar structure to TemuScraper
        return null;
    }
}
