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
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { X, GripVertical, Star } from 'lucide-react';

interface NewImagePreview {
    id: string;
    file: File;
    preview: string;
    isPrimary?: boolean;
}

interface DraggableNewImagesProps {
    images: NewImagePreview[];
    onReorder: (images: NewImagePreview[]) => void;
    onRemove: (imageId: string) => void;
    onSetPrimary: (imageId: string) => void;
    primaryImageId?: string | null;
    className?: string;
}

interface SortableNewImageProps {
    image: NewImagePreview;
    onRemove: (imageId: string) => void;
    onSetPrimary: (imageId: string) => void;
    isPrimary?: boolean;
}

function SortableNewImage({
    image,
    onRemove,
    onSetPrimary,
    isPrimary
}: SortableNewImageProps) {
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
            className="relative group flex-shrink-0 w-20 h-20"
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
                    src={image.preview}
                    alt={`Preview ${image.id}`}
                    className="w-20 h-20 object-cover bg-gray-100"
                />

                {/* Remove Button */}
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

                {/* Primary Button */}
                {!isPrimary && (
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
                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-20">
                        1st
                    </div>
                )}

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

export default function DraggableNewImages({
    images,
    onReorder,
    onRemove,
    onSetPrimary,
    primaryImageId,
    className = ''
}: DraggableNewImagesProps) {
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
            onReorder(reorderedImages);
        }
    };

    if (images.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    Drag to reorder • Click star to set primary • Click X to remove
                </p>
                <span className="text-xs text-gray-500">
                    {images.length} image{images.length !== 1 ? 's' : ''}
                </span>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={images.map(img => img.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((image) => (
                            <SortableNewImage
                                key={image.id}
                                image={image}
                                onRemove={onRemove}
                                onSetPrimary={onSetPrimary}
                                isPrimary={primaryImageId === image.id}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

// Hook for managing new image uploads with drag and drop
export function useNewImageUploads() {
    const [images, setImages] = React.useState<NewImagePreview[]>([]);
    const [primaryImageId, setPrimaryImageId] = React.useState<string | null>(null);

    const addImages = React.useCallback((files: File[]) => {
        const newImages: NewImagePreview[] = files.map((file, index) => ({
            id: `new-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
            isPrimary: false
        }));

        setImages(prev => {
            const updated = [...prev, ...newImages];
            // Set first image as primary if no primary is set
            if (!primaryImageId && updated.length > 0) {
                setPrimaryImageId(updated[0].id);
                updated[0].isPrimary = true;
            }
            return updated;
        });
    }, [primaryImageId]);

    const removeImage = React.useCallback((imageId: string) => {
        setImages(prev => {
            const updated = prev.filter(img => img.id !== imageId);
            
            // If removing primary image, set new primary
            if (primaryImageId === imageId) {
                const newPrimary = updated[0];
                if (newPrimary) {
                    setPrimaryImageId(newPrimary.id);
                    newPrimary.isPrimary = true;
                } else {
                    setPrimaryImageId(null);
                }
            }
            
            return updated;
        });
    }, [primaryImageId]);

    const setPrimary = React.useCallback((imageId: string) => {
        setImages(prev => prev.map(img => ({
            ...img,
            isPrimary: img.id === imageId
        })));
        setPrimaryImageId(imageId);
    }, []);

    const reorderImages = React.useCallback((reorderedImages: NewImagePreview[]) => {
        setImages(reorderedImages);
    }, []);

    const clearImages = React.useCallback(() => {
        // Clean up object URLs
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages([]);
        setPrimaryImageId(null);
    }, [images]);

    return {
        images,
        primaryImageId,
        addImages,
        removeImage,
        setPrimary,
        reorderImages,
        clearImages
    };
}
