<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\NewDashboardController;
use App\Http\Controllers\Admin\NewProductController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\HomepageController;
use App\Http\Controllers\Admin\VariationController;
use App\Http\Controllers\Admin\ProductImportController;
use App\Http\Controllers\Admin\ComingSoonController;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // New Modern Admin Dashboard (Main Route)
    Route::get('/', [NewDashboardController::class, 'index'])->name('dashboard');
    
    // Old Admin Dashboard (Backup)
    Route::get('/old-dashboard', [AdminController::class, 'index'])->name('old-dashboard');
    
    // Product Import (must be before resource route to avoid conflicts)
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('import', [ProductImportController::class, 'index'])->name('import');
        Route::get('import/preview', [ProductImportController::class, 'index'])->name('import.preview.get'); // Redirect GET requests to import page
        Route::post('import/preview', [ProductImportController::class, 'preview'])->name('import.preview');
        Route::post('import', [ProductImportController::class, 'import'])->name('import.store');
    });
    
    // New Products Management
    Route::resource('products', NewProductController::class);
    Route::post('products/{product}/toggle-featured', [NewProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
    
    // Old Products (Backup)
    Route::prefix('old')->name('old.')->group(function () {
        Route::resource('products', ProductController::class);
        Route::post('products/{product}/images', [ProductController::class, 'storeImages'])->name('products.images.store');
        Route::delete('products/images/{image}', [ProductController::class, 'deleteImage'])->name('products.images.delete');
    });
    
    // Categories
    Route::resource('categories', CategoryController::class);
    
    // Orders
    Route::resource('orders', OrderController::class);
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::post('orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus'])->name('orders.update-payment-status');
    Route::post('orders/bulk-update', [OrderController::class, 'bulkUpdate'])->name('orders.bulk-update');
    Route::get('orders/export', [OrderController::class, 'export'])->name('orders.export');
    Route::get('orders/analytics', [OrderController::class, 'analytics'])->name('orders.analytics');
    
    // Customers
    Route::resource('customers', CustomerController::class)->only(['index', 'show']);
    Route::get('customers/{customer}/orders', [CustomerController::class, 'orders'])->name('customers.orders');
    Route::post('customers/{customer}/status', [CustomerController::class, 'updateStatus'])->name('customers.update-status');
    Route::get('customers/export', [CustomerController::class, 'export'])->name('customers.export');
    
    // Media Library
    Route::resource('media', MediaController::class)->except(['create', 'edit']);
    Route::post('media/bulk-delete', [MediaController::class, 'bulkDelete'])->name('media.bulk-delete');
    Route::post('media/move-to-folder', [MediaController::class, 'moveToFolder'])->name('media.move-to-folder');
    Route::get('media-picker', [MediaController::class, 'picker'])->name('media.picker');
    Route::post('media/{medium}/attach', [MediaController::class, 'attach'])->name('media.attach');
    Route::post('media/{medium}/detach', [MediaController::class, 'detach'])->name('media.detach');
    Route::post('media/import-urls', [MediaController::class, 'importFromUrls'])->name('media.import-urls');
    
    // Homepage Layout
    Route::get('homepage-layout', [HomepageController::class, 'index'])->name('homepage.index');
    Route::post('homepage-layout', [HomepageController::class, 'store'])->name('homepage.store');
    Route::put('homepage-layout/{layout}', [HomepageController::class, 'update'])->name('homepage.update');
    Route::delete('homepage-layout/{layout}', [HomepageController::class, 'destroy'])->name('homepage.destroy');
    Route::post('homepage-layout/{layout}/toggle', [HomepageController::class, 'toggle'])->name('homepage.toggle');
    Route::get('homepage-layout/preview', [HomepageController::class, 'preview'])->name('homepage.preview');
    
    // Product Variations Management
    Route::get('variations', [VariationController::class, 'index'])->name('variations.index');
    
    // Size Management
    Route::post('variations/sizes', [VariationController::class, 'storeSize'])->name('variations.sizes.store');
    Route::put('variations/sizes/{size}', [VariationController::class, 'updateSize'])->name('variations.sizes.update');
    Route::delete('variations/sizes/{size}', [VariationController::class, 'destroySize'])->name('variations.sizes.destroy');
    
    // Color Management
    Route::post('variations/colors', [VariationController::class, 'storeColor'])->name('variations.colors.store');
    Route::put('variations/colors/{color}', [VariationController::class, 'updateColor'])->name('variations.colors.update');
    Route::delete('variations/colors/{color}', [VariationController::class, 'destroyColor'])->name('variations.colors.destroy');
    
    // Coming Soon
Route::get('coming-soon', [ComingSoonController::class, 'index'])->name('coming-soon.index');
Route::put('coming-soon', [ComingSoonController::class, 'update'])->name('coming-soon.update');
Route::post('coming-soon/toggle', [ComingSoonController::class, 'toggle'])->name('coming-soon.toggle');

// Settings routes
Route::get('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
Route::put('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
Route::post('settings/upload-logo', [\App\Http\Controllers\Admin\SettingsController::class, 'uploadLogo'])->name('settings.upload-logo');
});
