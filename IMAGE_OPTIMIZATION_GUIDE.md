# Product Images Optimization Guide

## 🖼️ Overview

This guide explains how to optimize product images to improve site loading speed, particularly on the shop page and product detail pages.

## 🎯 What Does Image Optimization Do?

The optimization script performs the following:

1. **Compresses Original Images**
   - JPEG: 85% quality (reduces file size while maintaining quality)
   - PNG: Optimized compression
   - Resizes oversized images to max 2000x2000px

2. **Generates Multiple Sizes**
   - **Thumbnail**: 300x300px (used in product cards, image galleries)
   - **Medium**: 800x800px (used in product detail pages)
   - **Original**: Optimized version of the full-size image

3. **Creates WebP Versions**
   - Modern image format with better compression
   - ~30% smaller file size than JPEG/PNG
   - Supported by all modern browsers

4. **Updates Database**
   - Marks images as optimized
   - Stores image dimensions (width, height)
   - Records optimization timestamp

## 🚀 Quick Start

### Option 1: Using the Interactive Script (Recommended)

```bash
./optimize-images.sh
```

This will show you an interactive menu with options:
- Optimize all unoptimized images
- Force re-optimize all images
- Generate missing thumbnails/sizes only
- Optimize a specific image by ID
- Show help

### Option 2: Using Artisan Commands

```bash
# Optimize all unoptimized images
php artisan images:optimize

# Force re-optimization of all images (including already optimized ones)
php artisan images:optimize --force

# Only generate missing thumbnails/medium versions
php artisan images:optimize --only-missing

# Optimize a specific image by ID
php artisan images:optimize --image-id=123
```

## 📊 Example Output

```
🖼️  Starting image optimization...

📊 Found 45 images to process

============================================================ 100%

📊 Optimization Summary:
   ✅ Optimized: 45
   ⏭️  Skipped: 0
   ❌ Errors: 0

📈 Total optimized images: 45
💾 Total storage used: 12.5 MB

✨ Optimization complete!
```

## 🔧 Technical Details

### Image Sizes Generated

| Size | Dimensions | Quality | Usage |
|------|-----------|---------|-------|
| Original | Max 2000x2000 | JPEG: 85% | Product detail page (full view) |
| Medium | Max 800x800 | JPEG: 85% | Product detail page (main image) |
| Thumbnail | 300x400 (3:4 ratio) | JPEG: 80% | Shop page, product cards |
| WebP (Original) | Max 2000x2000 | 85% | Modern browsers |
| WebP (Medium) | Max 800x800 | 85% | Modern browsers |
| WebP (Thumbnail) | 300x400 (3:4 ratio) | 80% | Modern browsers |

### Directory Structure

After optimization, your image directory will look like:

```
storage/app/public/
├── products/
│   ├── image1.jpg                    # Original (optimized)
│   ├── image2.jpg
│   ├── thumbnails/
│   │   ├── image1.jpg                # 300x400 (3:4 ratio)
│   │   └── image2.jpg
│   ├── medium/
│   │   ├── image1.jpg                # 800x800
│   │   └── image2.jpg
│   └── webp/
│       ├── image1.webp               # WebP original
│       ├── image1_thumb.webp         # WebP thumbnail
│       ├── image1_medium.webp        # WebP medium
│       ├── image2.webp
│       ├── image2_thumb.webp
│       └── image2_medium.webp
└── imported-products/
    └── (same structure as above)
```

## 🔄 Automatic Optimization for New Uploads

New images uploaded through the admin panel will automatically be optimized. The optimization happens in the background using Laravel's queue system.

To enable automatic optimization:

1. Make sure your queue worker is running:
   ```bash
   php artisan queue:work
   ```

2. Or use Laravel Herd's built-in queue management

## 💡 Best Practices

### Before Uploading
- Use JPEG for photos and product images
- Use PNG only for images that need transparency
- Try to upload images that are at least 1200x1200px
- Avoid uploading images larger than 5MB

### After Uploading
- Run the optimization script to process existing images
- Check the shop page and product detail pages for loading speed
- Monitor storage space usage

### For Best Performance
- Run optimization during off-peak hours for large batches
- Use `--only-missing` option if you just want to generate thumbnails
- Keep the queue worker running for automatic processing

## 🐛 Troubleshooting

### "GD extension is not loaded"
Install the GD extension for PHP:
```bash
# This is usually included with PHP, but if missing:
brew install php-gd  # macOS with Homebrew
```

### "File not found" errors
- Check that the images exist in `storage/app/public/`
- Run `php artisan storage:link` to ensure storage is linked
- Verify file permissions: `chmod -R 755 storage/`

### Images not appearing on frontend
- Clear browser cache
- Check that `APP_URL` in `.env` is correct
- Run `php artisan config:clear` and `php artisan cache:clear`

### Optimization is slow
This is normal for large images. Optimization speed depends on:
- Number of images
- Image file sizes
- Server resources
- Whether WebP generation is enabled

**Tips for faster processing:**
- Process images in smaller batches using `--image-id`
- Use `--only-missing` if you already have optimized originals
- Consider increasing PHP's `memory_limit` and `max_execution_time`

## 📈 Performance Impact

### Before Optimization
- Product card images: ~500KB - 2MB each
- Detail page images: ~1MB - 5MB each
- Shop page load time: 5-10 seconds (with 20 products)

### After Optimization
- Product card images: ~50KB - 150KB (thumbnails)
- Detail page images: ~100KB - 300KB (medium)
- Shop page load time: 1-2 seconds (with 20 products)

**Expected savings: 70-90% reduction in image file sizes**

## 🔐 Database Schema

The `images` table includes these relevant columns:

```php
- is_optimized: boolean (true when optimized)
- width: integer (image width in pixels)
- height: integer (image height in pixels)
- size: integer (file size in bytes)
- metadata: json (stores optimization info)
```

## 📝 Notes

- Optimization is non-destructive: Original images are preserved
- You can re-run optimization at any time with `--force`
- WebP versions are generated automatically if your server supports it
- The script updates image dimensions in the database
- Already optimized images are skipped unless `--force` is used

## 🆘 Need Help?

If you encounter any issues:

1. Check the Laravel log files: `storage/logs/laravel.log`
2. Run with verbose output: `php artisan images:optimize -v`
3. Test with a single image first: `php artisan images:optimize --image-id=1`
4. Ensure GD extension is installed: `php -m | grep -i gd`

## 📚 Related Files

- Optimization Command: `app/Console/Commands/OptimizeProductImages.php`
- Image Model: `app/Models/Image.php`
- Image Service: `app/Services/ImageService.php`
- Shell Script: `optimize-images.sh`

