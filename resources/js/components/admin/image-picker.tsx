import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Upload, 
    Search, 
    Image as ImageIcon, 
    FolderOpen, 
    X,
    Check,
    Plus
} from 'lucide-react';

interface MediaFile {
    id: string;
    filename: string;
    original_name: string;
    mime_type: string;
    path: string;
    size: number;
    formatted_size: string;
    alt_text?: string;
    tags_array?: string[];
    url: string;
    thumbnail_url: string;
}

interface ImagePickerProps {
    onSelect: (images: MediaFile[]) => void;
    multiple?: boolean;
    selectedImages?: MediaFile[];
    trigger?: React.ReactNode;
    className?: string;
    maxSelection?: number;
}

interface ImagePickerModalProps extends ImagePickerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    multiple = false,
    selectedImages = [],
    maxSelection = 10,
}) => {
    const [mediaFiles, setMediaFiles] = React.useState<MediaFile[]>([]);
    const [folders, setFolders] = React.useState<string[]>([]);
    const [tags, setTags] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedFolder, setSelectedFolder] = React.useState('all');
    const [selectedTag, setSelectedTag] = React.useState('all');
    const [tempSelectedImages, setTempSelectedImages] = React.useState<MediaFile[]>(selectedImages);

    // Fetch media files
    const fetchMedia = React.useCallback(async (filters = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                per_page: '12',
                ...filters,
            });
            
            const response = await fetch(`/admin/media-picker?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setMediaFiles(data.media.data || []);
                setFolders(data.folders || []);
                setTags(data.tags || []);
            }
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load media when modal opens
    React.useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen, fetchMedia]);

    // Handle search and filters
    React.useEffect(() => {
        if (isOpen) {
            const filters: Record<string, string> = {};
            
            if (searchQuery) filters.search = searchQuery;
            if (selectedFolder !== 'all') filters.folder = selectedFolder;
            if (selectedTag !== 'all') filters.tags = selectedTag;
            
            const timeoutId = setTimeout(() => {
                fetchMedia(filters);
            }, 300);
            
            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery, selectedFolder, selectedTag, isOpen, fetchMedia]);

    const handleImageToggle = (image: MediaFile) => {
        if (multiple) {
            const isSelected = tempSelectedImages.some(img => img.id === image.id);
            if (isSelected) {
                setTempSelectedImages(prev => prev.filter(img => img.id !== image.id));
            } else {
                if (tempSelectedImages.length < maxSelection) {
                    setTempSelectedImages(prev => [...prev, image]);
                }
            }
        } else {
            setTempSelectedImages([image]);
        }
    };

    const handleConfirmSelection = () => {
        onSelect(tempSelectedImages);
        onClose();
    };

    const handleCancel = () => {
        setTempSelectedImages(selectedImages);
        onClose();
    };

    return (
        <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
                <DialogTitle className="text-white">
                    Select Image{multiple ? 's' : ''}
                    {multiple && (
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            ({tempSelectedImages.length}/{maxSelection} selected)
                        </span>
                    )}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                    Choose from your media library or upload new files
                </DialogDescription>
            </DialogHeader>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 py-4 border-b border-gray-700">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search images..."
                            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                    </div>
                </div>
                
                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all" className="text-white hover:bg-gray-600">All Folders</SelectItem>
                        {folders.map((folder) => (
                            <SelectItem key={folder} value={folder} className="text-white hover:bg-gray-600">
                                {folder}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all" className="text-white hover:bg-gray-600">All Tags</SelectItem>
                        {tags.map((tag) => (
                            <SelectItem key={tag} value={tag} className="text-white hover:bg-gray-600">
                                {tag}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto max-h-96">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : mediaFiles.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaFiles.map((image) => {
                            const isSelected = tempSelectedImages.some(img => img.id === image.id);
                            return (
                                <div
                                    key={image.id}
                                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                        isSelected 
                                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                                            : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                    onClick={() => handleImageToggle(image)}
                                >
                                    <img
                                        src={image.thumbnail_url || image.url}
                                        alt={image.alt_text || image.original_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <div className="hidden absolute inset-0 bg-gray-600 flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>

                                    {/* Selection Indicator */}
                                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected 
                                            ? 'bg-blue-500 border-blue-500' 
                                            : 'bg-black/50 border-white/50'
                                    }`}>
                                        {isSelected && <Check className="h-3 w-3 text-white" />}
                                    </div>

                                    {/* File Info */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                        <p className="text-white text-xs font-medium truncate">{image.original_name}</p>
                                        <p className="text-gray-300 text-xs">{image.formatted_size}</p>
                                    </div>

                                    {/* Tags */}
                                    {image.tags_array && image.tags_array.length > 0 && (
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0">
                                                {image.tags_array[0]}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">
                            {searchQuery || selectedFolder !== 'all' || selectedTag !== 'all'
                                ? 'No images found matching your criteria'
                                : 'No images in your library yet'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Selected Images Preview */}
            {tempSelectedImages.length > 0 && (
                <div className="border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400 mb-2">Selected:</p>
                    <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                        {tempSelectedImages.map((image) => (
                            <div key={image.id} className="relative">
                                <img
                                    src={image.thumbnail_url || image.url}
                                    alt={image.original_name}
                                    className="w-12 h-12 object-cover rounded border border-gray-600"
                                />
                                <button
                                    onClick={() => handleImageToggle(image)}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-2 w-2 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <Button
                    variant="outline"
                    onClick={() => {
                        // TODO: Open upload modal or redirect to media library
                        window.open('/admin/media', '_blank');
                    }}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New
                </Button>

                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmSelection}
                        disabled={tempSelectedImages.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Select {tempSelectedImages.length > 0 ? `(${tempSelectedImages.length})` : ''}
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
};

const ImagePicker: React.FC<ImagePickerProps> = ({
    onSelect,
    multiple = false,
    selectedImages = [],
    trigger,
    className = '',
    maxSelection = 10,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const defaultTrigger = (
        <Button 
            variant="outline" 
            className={`border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 ${className}`}
        >
            <ImageIcon className="mr-2 h-4 w-4" />
            Select Image{multiple ? 's' : ''}
            {selectedImages.length > 0 && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {selectedImages.length}
                </Badge>
            )}
        </Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            
            <ImagePickerModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSelect={onSelect}
                multiple={multiple}
                selectedImages={selectedImages}
                maxSelection={maxSelection}
            />
        </Dialog>
    );
};

export default ImagePicker;

