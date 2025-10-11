#!/bin/bash

# Product Images Optimization Script
# This script optimizes product images for faster loading

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Product Images Optimization Script          ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo ""

# Set PHP path for Herd
export PATH="$HOME/Library/Application Support/Herd/bin:$PATH"

# Check if artisan exists
if [ ! -f "artisan" ]; then
    echo -e "${RED}Error: artisan file not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Display menu
echo -e "${GREEN}Choose an option:${NC}"
echo ""
echo "1) Optimize all unoptimized images"
echo "2) Force re-optimize all images"
echo "3) Only generate missing thumbnails/sizes"
echo "4) Optimize a specific image by ID"
echo "5) Show help"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo -e "\n${BLUE}🚀 Starting optimization of unoptimized images...${NC}\n"
        php artisan images:optimize
        ;;
    2)
        echo -e "\n${YELLOW}⚠️  Warning: This will re-process all images, including already optimized ones.${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "\n${BLUE}🚀 Starting force optimization...${NC}\n"
            php artisan images:optimize --force
        else
            echo -e "${YELLOW}Cancelled.${NC}"
        fi
        ;;
    3)
        echo -e "\n${BLUE}🚀 Generating missing thumbnails and sizes...${NC}\n"
        php artisan images:optimize --only-missing
        ;;
    4)
        read -p "Enter image ID: " image_id
        echo -e "\n${BLUE}🚀 Optimizing image with ID: $image_id${NC}\n"
        php artisan images:optimize --image-id="$image_id"
        ;;
    5)
        echo -e "\n${GREEN}Help:${NC}"
        echo ""
        echo "This script optimizes product images by:"
        echo "  • Compressing images (JPEG quality: 85%, PNG optimized)"
        echo "  • Resizing large images (max 2000x2000 for originals)"
        echo "  • Generating thumbnails (300x300)"
        echo "  • Generating medium sizes (800x800)"
        echo "  • Creating WebP versions (85% quality)"
        echo ""
        echo "Options:"
        echo "  1. Optimize unoptimized - Only process images that haven't been optimized"
        echo "  2. Force re-optimize - Re-process all images (WARNING: Time consuming)"
        echo "  3. Generate missing - Only create missing thumbnail/medium versions"
        echo "  4. Specific image - Optimize a single image by its database ID"
        echo ""
        echo "You can also run the artisan command directly:"
        echo "  php artisan images:optimize [options]"
        echo ""
        ;;
    *)
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Done!${NC}"
echo ""

