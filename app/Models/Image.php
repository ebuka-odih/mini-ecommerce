<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use HasUuids;

    protected $fillable = [
        'filename',
        'original_name',
        'mime_type',
        'extension',
        'path',
        'disk',
        'folder',
        'size',
        'width',
        'height',
        'imageable_type',
        'imageable_id',
        'alt_text',
        'caption',
        'is_featured',
        'is_optimized',
        'sort_order',
        'metadata',
        'tags',
        'uploaded_at',
        'uploaded_by',
        'color_palette',
        'download_count',
        'last_used_at',
        'usage_context',
    ];

    protected $casts = [
        'metadata' => 'array',
        'color_palette' => 'array',
        'is_featured' => 'boolean',
        'is_optimized' => 'boolean',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'sort_order' => 'integer',
        'download_count' => 'integer',
        'uploaded_at' => 'datetime',
        'last_used_at' => 'datetime',
    ];

    protected $appends = [
        'url',
        'thumbnail_url',
        'medium_url',
        'formatted_size',
        'dimensions',
        'tags_array'
    ];

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute()
    {
        $url = Storage::disk($this->disk)->url($this->path);
        
        // Fix for incorrect APP_URL - replace with correct domain
        $url = str_replace('marodesignclothings.test', 'gnosisbrand.test', $url);
        
        // Fix localhost URLs for production - handle all localhost variations
        if (str_contains($url, 'localhost')) {
            // Replace any localhost URL with the configured APP_URL
            $url = preg_replace('/^https?:\/\/localhost(?::\d+)?/', config('app.url'), $url);
        }
        
        return $url;
    }

    public function getFullPathAttribute()
    {
        return Storage::disk($this->disk)->path($this->path);
    }

    public function getThumbnailUrlAttribute()
    {
        $pathInfo = pathinfo($this->path);
        $thumbnailPath = $pathInfo['dirname'] . '/thumbnails/' . $pathInfo['basename'];
        
        if (Storage::disk($this->disk)->exists($thumbnailPath)) {
            $url = Storage::disk($this->disk)->url($thumbnailPath);
            
            // Fix for incorrect APP_URL - replace with correct domain
            $url = str_replace('marodesignclothings.test', 'gnosisbrand.test', $url);
            
            // Fix localhost URLs for production - handle all localhost variations
            if (str_contains($url, 'localhost')) {
                // Replace any localhost URL with the configured APP_URL
                $url = preg_replace('/^https?:\/\/localhost(?::\d+)?/', config('app.url'), $url);
            }
            
            return $url;
        }
        
        return $this->url;
    }

    public function getMediumUrlAttribute()
    {
        $pathInfo = pathinfo($this->path);
        $mediumPath = $pathInfo['dirname'] . '/medium/' . $pathInfo['basename'];
        
        if (Storage::disk($this->disk)->exists($mediumPath)) {
            $url = Storage::disk($this->disk)->url($mediumPath);
            
            // Fix for incorrect APP_URL - replace with correct domain
            $url = str_replace('marodesignclothings.test', 'gnosisbrand.test', $url);
            
            // Fix localhost URLs for production - handle all localhost variations
            if (str_contains($url, 'localhost')) {
                // Replace any localhost URL with the configured APP_URL
                $url = preg_replace('/^https?:\/\/localhost(?::\d+)?/', config('app.url'), $url);
            }
            
            return $url;
        }
        
        return $this->url;
    }

    public function getFormattedSizeAttribute()
    {
        if (!$this->size) {
            return 'Unknown';
        }
        
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getDimensionsAttribute()
    {
        if ($this->width && $this->height) {
            return $this->width . ' × ' . $this->height;
        }
        
        return 'Unknown';
    }

    public function getTagsArrayAttribute()
    {
        if (empty($this->tags)) {
            return [];
        }
        
        return array_map('trim', explode(',', $this->tags));
    }

    public function setTagsArrayAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['tags'] = implode(', ', array_filter($value));
        } else {
            $this->attributes['tags'] = $value;
        }
    }

    public function incrementDownloadCount()
    {
        $this->increment('download_count');
        $this->update(['last_used_at' => now()]);
    }

    public function updateUsageContext($context)
    {
        $existingContexts = json_decode($this->usage_context, true) ?: [];
        
        if (!in_array($context, $existingContexts)) {
            $existingContexts[] = $context;
            $this->update([
                'usage_context' => json_encode($existingContexts),
                'last_used_at' => now()
            ]);
        }
    }

    // Scopes for filtering
    public function scopeInFolder($query, $folder)
    {
        return $query->where('folder', $folder);
    }

    public function scopeWithTags($query, $tags)
    {
        if (is_string($tags)) {
            $tags = [$tags];
        }
        
        foreach ($tags as $tag) {
            $query->where('tags', 'LIKE', '%' . $tag . '%');
        }
        
        return $query;
    }

    public function scopeByMimeType($query, $type)
    {
        return $query->where('mime_type', 'LIKE', $type . '%');
    }

    public function scopeUnused($query)
    {
        return $query->whereNull('imageable_id');
    }

    public function scopeRecentlyUploaded($query, $days = 7)
    {
        return $query->where('uploaded_at', '>=', now()->subDays($days));
    }

    public function deleteFile()
    {
        if (Storage::disk($this->disk)->exists($this->path)) {
            Storage::disk($this->disk)->delete($this->path);
        }

        // Delete thumbnail if exists
        $pathInfo = pathinfo($this->path);
        $thumbnailPath = $pathInfo['dirname'] . '/thumbnails/' . $pathInfo['basename'];
        if (Storage::disk($this->disk)->exists($thumbnailPath)) {
            Storage::disk($this->disk)->delete($thumbnailPath);
        }

        // Delete medium if exists
        $mediumPath = $pathInfo['dirname'] . '/medium/' . $pathInfo['basename'];
        if (Storage::disk($this->disk)->exists($mediumPath)) {
            Storage::disk($this->disk)->delete($mediumPath);
        }
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($image) {
            $image->deleteFile();
        });
    }
}
