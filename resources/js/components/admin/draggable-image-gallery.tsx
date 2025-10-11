import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Star, GripVertical } from 'lucide-react';

interface DraggableImage {
    id: string;
    url: string;
    thumbnail_url?: string;
    alt_text?: string;
    is_featured?: boolean;
    sort_order?: number;
    original_name?: string;
}

interface DraggableImageGalleryProps {
    images: DraggableImage[];
    onReorder: (images: DraggableImage[]) => void;
    onRemove?: (imageId: string) => void;
    onSetPrimary?: (imageId: string) => void;
    primaryImageId?: string | null;
    showRemoveButton?: boolean;
    showPrimaryButton?: boolean;
    layout?: 'grid' | 'horizontal';
    className?: string;
}

interface SortableImageItemProps {
    image: DraggableImage;
    onRemove?: (imageId: string) => void;
    onSetPrimary?: (imageId: string) => void;
    isPrimary?: boolean;
    showRemoveButton?: boolean;
    showPrimaryButton?: boolean;
    layout?: 'grid' | 'horizontal';
}

function SortableImageItem({
    image,
    onRemove,
    onSetPrimary,
    isPrimary,
    showRemoveButton = true,
    showPrimaryButton = true,
    layout = 'grid'
}: SortableImageItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group ${
                layout === 'horizontal' 
                    ? 'flex-shrink-0 w-20 h-20' 
                    : 'w-full'
            }`}
        >
            <div className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                isPrimary 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : 'border-gray-600 hover:border-blue-400'
            } ${isDragging ? 'z-50 shadow-lg' : ''}`}>
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-1 left-1 z-10 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <GripVertical className="h-3 w-3 text-white" />
                </div>

                {/* Image */}
                <img
                    src={image.thumbnail_url || image.url}
                    alt={image.alt_text || image.original_name || 'Product image'}
                    className={`object-cover bg-gray-100 ${
                        layout === 'horizontal' 
                            ? 'w-20 h-20' 
                            : 'w-full h-24'
                    }`}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                {/* Remove Button */}
                {showRemoveButton && onRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 border-0 z-20"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(image.id);
                        }}
                        title="Remove image"
                    >
                        <X className="h-3 w-3 text-white" />
                    </Button>
                )}

                {/* Primary Button */}
                {showPrimaryButton && onSetPrimary && !isPrimary && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white border-0 z-20"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSetPrimary(image.id);
                        }}
                        title="Set as primary image"
                    >
                        <Star className="h-3 w-3 text-gray-600" />
                    </Button>
                )}

                {/* Primary Badge */}
                {isPrimary && (
                    <Badge className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 z-20">
                        1st
                    </Badge>
                )}

                {/* Image Number Badge */}
                <Badge className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 z-20">
                    {image.sort_order !== undefined ? image.sort_order + 1 : ''}
                </Badge>

                {/* Drag Indicator */}
                {isDragging && (
                    <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center z-30">
                        <div className="text-blue-500 font-medium text-sm">Moving...</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DraggableImageGallery({
    images,
    onReorder,
    onRemove,
    onSetPrimary,
    primaryImageId,
    showRemoveButton = true,
    showPrimaryButton = true,
    layout = 'grid',
    className = ''
}: DraggableImageGalleryProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex((item) => item.id === active.id);
            const newIndex = images.findIndex((item) => item.id === over.id);

            const reorderedImages = arrayMove(images, oldIndex, newIndex);
            
            // Update sort_order for each image
            const updatedImages = reorderedImages.map((image, index) => ({
                ...image,
                sort_order: index
            }));

            onReorder(updatedImages);
        }
    };

    if (images.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No images to display</p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    Drag images to reorder • Click star to set primary • Click X to remove
                </p>
                <Badge variant="outline" className="text-xs">
                    {images.length} image{images.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={images.map(img => img.id)}
                    strategy={layout === 'horizontal' ? horizontalListSortingStrategy : verticalListSortingStrategy}
                >
                    <div className={
                        layout === 'horizontal' 
                            ? 'flex gap-2 overflow-x-auto pb-2'
                            : 'grid grid-cols-3 md:grid-cols-6 gap-2'
                    }>
                        {images.map((image) => (
                            <SortableImageItem
                                key={image.id}
                                image={image}
                                onRemove={onRemove}
                                onSetPrimary={onSetPrimary}
                                isPrimary={primaryImageId === image.id}
                                showRemoveButton={showRemoveButton}
                                showPrimaryButton={showPrimaryButton}
                                layout={layout}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

// Hook for managing image order state
export function useImageOrder(initialImages: DraggableImage[] = []) {
    const [images, setImages] = React.useState<DraggableImage[]>(initialImages);

    React.useEffect(() => {
        setImages(initialImages);
    }, [initialImages]);

    const handleReorder = React.useCallback((reorderedImages: DraggableImage[]) => {
        setImages(reorderedImages);
    }, []);

    const handleRemove = React.useCallback((imageId: string) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
    }, []);

    const handleSetPrimary = React.useCallback((imageId: string) => {
        setImages(prev => prev.map(img => ({
            ...img,
            is_featured: img.id === imageId
        })));
    }, []);

    const addImages = React.useCallback((newImages: DraggableImage[]) => {
        setImages(prev => [...prev, ...newImages.map((img, index) => ({
            ...img,
            sort_order: prev.length + index
        }))]);
    }, []);

    return {
        images,
        handleReorder,
        handleRemove,
        handleSetPrimary,
        addImages,
        setImages
    };
}
