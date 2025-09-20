<?php

use App\Models\Image;
use Illuminate\Support\Facades\Route;

// Test route to debug images
Route::get('/test-images', function () {
    $images = Image::take(3)->get();
    
    $html = '<h1>Image Test</h1>';
    
    foreach ($images as $image) {
        $html .= '<div style="margin: 20px; padding: 20px; border: 1px solid #ccc;">';
        $html .= '<h3>' . $image->original_name . '</h3>';
        $html .= '<p>URL: <a href="' . $image->url . '" target="_blank">' . $image->url . '</a></p>';
        $html .= '<p>Thumbnail: <a href="' . $image->thumbnail_url . '" target="_blank">' . $image->thumbnail_url . '</a></p>';
        $html .= '<div style="display: flex; gap: 20px;">';
        $html .= '<div><h4>Original</h4><img src="' . $image->url . '" style="max-width: 200px; max-height: 200px;" /></div>';
        $html .= '<div><h4>Thumbnail</h4><img src="' . $image->thumbnail_url . '" style="max-width: 200px; max-height: 200px;" /></div>';
        $html .= '</div>';
        $html .= '</div>';
    }
    
    return $html;
});

