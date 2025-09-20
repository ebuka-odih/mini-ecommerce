# 📸 GNOSIS Media Library System

A comprehensive image storage and management system for your GNOSIS fashion brand admin panel.

## 🌟 **Features Overview**

### **📂 Centralized Storage**
- **Local Storage**: All images stored locally with organized folder structure
- **Reusable Assets**: Upload once, use everywhere across your admin
- **Smart Organization**: Folder-based organization (products, categories, banners, etc.)
- **Tagging System**: Tag images for easy searching and filtering

### **🔍 Advanced Search & Filtering**
- **Real-time Search**: Search by filename, alt text, caption, or tags
- **Folder Filtering**: Filter by specific folders
- **Type Filtering**: Filter by image types
- **Date Filtering**: Find recent uploads
- **Usage Filtering**: Find unused images

### **🎨 Rich Metadata**
- **Image Dimensions**: Automatic width/height detection
- **File Size**: Smart file size calculation and formatting
- **Color Palette**: Dominant color extraction
- **Usage Tracking**: Track download count and last usage
- **User Attribution**: Track who uploaded each image

## 🚀 **How to Use**

### **1. Accessing Media Library**
```
Admin Panel → Media (sidebar)
URL: /admin/media
```

### **2. Uploading Images**
1. Click "Upload Files" button
2. Select multiple images
3. Choose folder (optional)
4. Add tags (optional)
5. Add alt text and caption (optional)
6. Click "Upload Files"

### **3. Using Image Picker in Forms**
The `ImagePicker` component can be integrated into any form:

```tsx
import ImagePicker from '@/components/admin/image-picker';

// In your component
<ImagePicker
    multiple={true}
    maxSelection={10}
    selectedImages={selectedImages}
    onSelect={handleImageSelection}
    trigger={
        <Button>Select Images</Button>
    }
/>
```

### **4. Organizing Images**
- **Folders**: Use folders like `products`, `categories`, `banners`, `marketing`
- **Tags**: Add descriptive tags like `summer`, `casual`, `featured`
- **Alt Text**: Add descriptive alt text for accessibility
- **Captions**: Add captions for context

## 🛠️ **Technical Implementation**

### **Backend Services**

#### **MediaLibraryService**
```php
// Store image in media library
$mediaService = app(MediaLibraryService::class);
$image = $mediaService->storeImage($file, [
    'folder' => 'products',
    'tags' => 'summer, casual',
    'alt_text' => 'Summer casual wear',
]);

// Get images with filters
$images = $mediaService->getImages([
    'folder' => 'products',
    'tags' => 'summer',
    'search' => 'casual',
]);
```

#### **Enhanced Image Model**
```php
// New fields added
- folder: string (organization)
- tags: string (comma-separated)
- uploaded_at: timestamp
- uploaded_by: user_id
- width/height: integers
- color_palette: json
- download_count: integer
- last_used_at: timestamp
- usage_context: json
```

### **Frontend Components**

#### **Media Library Page**
- Grid/List view toggle
- Real-time search
- Advanced filtering
- Bulk operations
- Responsive design

#### **Image Picker Component**
- Modal-based selection
- Multiple selection support
- Search and filter
- Preview selected images
- Integration ready

## 📁 **Folder Structure**

### **Recommended Folders**
```
media-library/
├── products/          # Product images
├── categories/        # Category thumbnails
├── banners/          # Homepage banners
├── marketing/        # Marketing materials
├── lifestyle/        # Lifestyle photography
├── branding/         # Logos and brand assets
└── social/           # Social media content
```

## 🎯 **Usage Examples**

### **1. Product Creation with Media Library**
```tsx
// Use the enhanced product form
import ProductFormWithMediaLibrary from '@/components/admin/product-form-with-media-library';

<ProductFormWithMediaLibrary
    categories={categories}
    onSubmit={handleSubmit}
/>
```

### **2. Bulk Image Management**
```tsx
// Select multiple images for bulk operations
const [selectedFiles, setSelectedFiles] = useState([]);

// Bulk delete
const handleBulkDelete = () => {
    router.post('/admin/media/bulk-delete', { ids: selectedFiles });
};

// Move to folder
const handleMoveToFolder = (folder) => {
    router.post('/admin/media/move-to-folder', { 
        ids: selectedFiles, 
        folder 
    });
};
```

### **3. Attach Library Images to Models**
```php
// Attach image from library to product
$mediaService->attachToModel($image, $product, [
    'is_featured' => true,
    'sort_order' => 0,
    'context' => 'Product Gallery'
]);

// Detach and make available in library
$mediaService->detachFromModel($image);
```

## 📊 **Statistics & Analytics**

The media library provides comprehensive statistics:

```php
$stats = $mediaService->getStatistics();
// Returns:
[
    'total_images' => 150,
    'total_size' => 52428800,
    'total_size_formatted' => '50 MB',
    'unused_images' => 25,
    'recent_uploads' => 12,
    'folders_count' => 6,
    'most_used_tags' => ['fashion' => 45, 'summer' => 32]
]
```

## 🔧 **API Endpoints**

### **Media Management**
```
GET    /admin/media                    # List all media
POST   /admin/media                    # Upload new files
GET    /admin/media/{id}               # View media details
PUT    /admin/media/{id}               # Update metadata
DELETE /admin/media/{id}               # Delete media

POST   /admin/media/bulk-delete        # Bulk delete
POST   /admin/media/move-to-folder     # Move files
GET    /admin/media-picker             # Picker API
POST   /admin/media/{id}/attach        # Attach to model
POST   /admin/media/{id}/detach        # Detach from model
```

## 🎨 **Customization**

### **Adding Custom Folders**
```php
// In your controller or service
$customFolders = ['campaigns', 'events', 'lookbooks'];
```

### **Custom Image Processing**
```php
// Extend MediaLibraryService for custom processing
class CustomMediaService extends MediaLibraryService
{
    protected function generateThumbnails(Image $image)
    {
        // Add custom thumbnail generation
        // Use Intervention Image or similar
    }
}
```

## 🚨 **Best Practices**

### **Organization**
1. **Use consistent folder names**: `products`, `categories`, `banners`
2. **Tag systematically**: Use consistent tag naming
3. **Add descriptive alt text**: For accessibility and SEO
4. **Regular cleanup**: Remove unused images periodically

### **Performance**
1. **Optimize images before upload**: Compress large files
2. **Use appropriate sizes**: Don't upload unnecessarily large images
3. **Leverage thumbnails**: Use thumbnail URLs for previews
4. **Monitor storage**: Keep track of total storage usage

### **Security**
1. **Validate file types**: Only allow safe image formats
2. **Scan uploads**: Consider malware scanning for production
3. **User permissions**: Control who can upload/delete
4. **Backup regularly**: Backup your media library

## 🔄 **Integration with Existing Features**

### **Product Management**
- Products can now use library images or upload new ones
- Primary image selection from library
- Bulk image attachment/detachment

### **Homepage Layouts**
- Homepage sections can use library images
- Easy image swapping for seasonal campaigns

### **Marketing Campaigns**
- Reuse images across different campaigns
- Track image usage and performance

---

## 🎉 **Ready to Use!**

Your GNOSIS Media Library is now fully functional and ready to streamline your image management workflow. The system provides:

✅ **Centralized Storage** - One place for all your images  
✅ **Smart Organization** - Folders, tags, and metadata  
✅ **Reusable Assets** - Upload once, use everywhere  
✅ **Professional UI** - Beautiful, responsive interface  
✅ **Developer Friendly** - Easy integration and customization  

Start uploading your fashion images and enjoy the streamlined workflow! 📸✨

