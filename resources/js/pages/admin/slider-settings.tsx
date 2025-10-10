import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Image as ImageIcon, Check, X, Eye } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';

interface MediaImage {
  id: string;
  url: string;
  thumbnail_url: string;
  original_name: string;
  alt_text: string;
  width: number;
  height: number;
  size: string;
  uploaded_at: string;
}

interface SliderSettingsPageProps {
  images: MediaImage[];
  selectedImages: string[];
  flash?: {
    success?: string;
    error?: string;
  };
  site_settings?: {
    site_name: string;
    site_logo: string;
  };
}

export default function SliderSettingsPage({ images, selectedImages, flash, site_settings }: SliderSettingsPageProps) {
  const [showSuccess, setShowSuccess] = useState(!!flash?.success);
  const [showError, setShowError] = useState(!!flash?.error);
  const [previewImage, setPreviewImage] = useState<MediaImage | null>(null);

  const { data, setData, put, processing, errors } = useForm({
    selectedImages: selectedImages,
  });

  const handleImageToggle = (imageId: string) => {
    const currentSelected = data.selectedImages;
    const isSelected = currentSelected.includes(imageId);
    
    console.log('Toggling image:', imageId, 'Currently selected:', currentSelected, 'Is selected:', isSelected);
    
    if (isSelected) {
      const newSelected = currentSelected.filter(id => id !== imageId);
      console.log('Removing image, new selection:', newSelected);
      setData('selectedImages', newSelected);
    } else {
      const newSelected = [...currentSelected, imageId];
      console.log('Adding image, new selection:', newSelected);
      setData('selectedImages', newSelected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', data.selectedImages);
    put(route('admin.slider-settings.update'), {
      onSuccess: (page) => {
        console.log('Form submission successful:', page);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      },
      onError: (errors) => {
        console.log('Form submission error:', errors);
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      },
    });
  };

  const selectedImagesData = images.filter(img => data.selectedImages.includes(img.id));

  return (
    <AdminLayout title="Slider Settings" site_settings={site_settings}>
      <Head title="Homepage Slider Settings" />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Homepage Slider Settings</h1>
          <p className="text-gray-400 mt-2">
            Select images from your media library to display in the homepage slider
          </p>
        </div>

        {/* Flash Messages */}
        {showSuccess && flash?.success && (
          <Alert className="bg-green-900/20 border-green-500 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{flash.success}</AlertDescription>
          </Alert>
        )}

        {showError && flash?.error && (
          <Alert className="bg-red-900/20 border-red-500 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{flash.error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Images Summary */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Selected Images ({selectedImagesData.length})
              </CardTitle>
              <CardDescription className="text-gray-400">
                Images will be displayed in the slider in the order they appear below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedImagesData.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    {selectedImagesData.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                          <img
                            src={image.thumbnail_url}
                            alt={image.alt_text || image.original_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-600 text-white text-xs">
                            Selected
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleImageToggle(image.id)}
                            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Save Button */}
                  <div className="flex justify-end border-t border-gray-700 pt-4">
                    <Button
                      type="submit"
                      disabled={processing}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {processing ? 'Saving...' : 'Save Slider Settings'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No images selected for the slider</p>
                  <p className="text-sm mt-1">Select images from the media library below</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media Library */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Media Library</CardTitle>
              <CardDescription className="text-gray-400">
                Click on images to add them to the slider. Selected images will be highlighted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((image) => {
                    const isSelected = data.selectedImages.includes(image.id);
                    return (
                      <div
                        key={image.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                          isSelected 
                            ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800' 
                            : 'hover:ring-2 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-gray-800'
                        }`}
                        onClick={() => handleImageToggle(image.id)}
                      >
                        <div className="aspect-square bg-gray-700">
                          <img
                            src={image.thumbnail_url}
                            alt={image.alt_text || image.original_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Selection indicator */}
                        <div className={`absolute top-2 right-2 transition-all ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          {isSelected ? (
                            <Badge className="bg-blue-600 text-white text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Selected
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-600 text-white text-xs">
                              Click to select
                            </Badge>
                          )}
                        </div>

                        {/* Image info overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="truncate font-medium">{image.original_name}</div>
                          <div className="text-gray-300">{image.width} × {image.height}</div>
                          <div className="text-gray-300">{image.size}</div>
                        </div>

                        {/* Preview button */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(image);
                            }}
                            className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-1 h-6 w-6"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No images in media library</p>
                  <p className="text-sm mt-2">Upload some images to the media library first</p>
                </div>
              )}
            </CardContent>
          </Card>

        </form>

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-white font-medium">{previewImage.original_name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewImage(null)}
                  className="text-gray-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <img
                  src={previewImage.url}
                  alt={previewImage.alt_text || previewImage.original_name}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p><strong>Dimensions:</strong> {previewImage.width} × {previewImage.height}</p>
                  <p><strong>Size:</strong> {previewImage.size}</p>
                  <p><strong>Uploaded:</strong> {previewImage.uploaded_at}</p>
                  {previewImage.alt_text && <p><strong>Alt Text:</strong> {previewImage.alt_text}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
