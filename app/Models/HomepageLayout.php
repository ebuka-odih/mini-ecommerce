<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomepageLayout extends Model
{
    use HasUuids;

    protected $fillable = [
        'grid_position',
        'section_name',
        'category_id',
        'cover_image_id',
        'use_custom_cover',
        'cover_image_url',
        'layout_type',
        'slider_speed',
        'title',
        'subtitle',
        'description',
        'background_color',
        'text_color',
        'gradient_from',
        'gradient_to',
        'is_active',
        'sort_order',
        'grid_size',
        'custom_link',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'use_custom_cover' => 'boolean',
        'slider_speed' => 'integer',
    ];

    /**
     * Get the category for this layout.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the cover image for this layout.
     */
    public function coverImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'cover_image_id');
    }

    /**
     * Get the effective cover image URL (smart fallback logic).
     */
    public function getCoverImageUrlAttribute()
    {
        // If custom cover is enabled and image exists, use it
        if ($this->use_custom_cover && $this->cover_image_id && $this->coverImage) {
            return $this->coverImage->url;
        }

        // If custom cover image URL is set directly, use it
        if ($this->use_custom_cover && $this->attributes['cover_image_url']) {
            return $this->attributes['cover_image_url'];
        }

        // Fall back to category image
        if ($this->category && $this->category->image) {
            return $this->category->image->url;
        }

        // Final fallback to a default image
        return '/images/default-layout-cover.jpg';
    }

    /**
     * Check if this layout uses a slider.
     */
    public function getIsSliderAttribute()
    {
        return $this->layout_type === 'slider';
    }

    /**
     * Get slider configuration for frontend.
     */
    public function getSliderConfigAttribute()
    {
        if (!$this->is_slider) {
            return null;
        }

        return [
            'speed' => $this->slider_speed,
            'autoplay' => true,
            'loop' => true,
        ];
    }

    /**
     * Scope for active layouts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for specific grid position.
     */
    public function scopeForPosition($query, $position)
    {
        return $query->where('grid_position', $position);
    }

    /**
     * Get formatted background gradient.
     */
    public function getBackgroundGradientAttribute()
    {
        if ($this->gradient_from && $this->gradient_to) {
            return "from-{$this->gradient_from} to-{$this->gradient_to}";
        }
        
        return $this->background_color ?: 'from-gray-600 to-gray-700';
    }
}

