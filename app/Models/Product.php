<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'stock',
        'sku',
        'barcode',
        'category_id',
        'is_featured',
        'is_active',
        'weight',
        'dimensions',
        'specifications',
        'views',
        'external_id',
        'source_url',
        'source_platform',
        'meta_title',
        'meta_description',
        'stock_quantity',
    ];

    protected $casts = [
        'specifications' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'stock' => 'integer',
        'stock_quantity' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            if (empty($product->sku)) {
                $product->sku = 'SKU-' . strtoupper(Str::random(8));
            }
            // Sync stock fields
            if (isset($product->stock_quantity) && !isset($product->stock)) {
                $product->stock = $product->stock_quantity;
            } elseif (isset($product->stock) && !isset($product->stock_quantity)) {
                $product->stock_quantity = $product->stock;
            }
        });

        static::updating(function ($product) {
            // Sync stock fields on update
            if (isset($product->stock_quantity) && !isset($product->stock)) {
                $product->stock = $product->stock_quantity;
            } elseif (isset($product->stock) && !isset($product->stock_quantity)) {
                $product->stock_quantity = $product->stock;
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable')->orderBy('sort_order');
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function activeVariations(): HasMany
    {
        return $this->hasMany(ProductVariation::class)->where('is_active', true);
    }



    public function featuredImage(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable')->where('is_featured', true);
    }

    public function getFeaturedImageUrlAttribute()
    {
        $featuredImage = $this->featuredImage()->first();
        return $featuredImage ? $featuredImage->url : null;
    }

    public function getFeaturedImageThumbnailUrlAttribute()
    {
        $featuredImage = $this->featuredImage()->first();
        return $featuredImage ? $featuredImage->thumbnail_url : null;
    }

    public function getFinalPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->sale_price && $this->price > $this->sale_price) {
            return round((($this->price - $this->sale_price) / $this->price) * 100);
        }
        return 0;
    }

    public function getIsOnSaleAttribute()
    {
        return $this->sale_price && $this->sale_price < $this->price;
    }

    public function getStockStatusAttribute()
    {
        if ($this->stock <= 0) {
            return 'out_of_stock';
        } elseif ($this->stock <= 10) {
            return 'low_stock';
        }
        return 'in_stock';
    }

    public function incrementViews()
    {
        $this->increment('views');
    }
}
