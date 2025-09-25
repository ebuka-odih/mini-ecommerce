<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Main application routes
Route::get('/', [HomeController::class, 'index'])->name('index');
Route::get('/homepage-second', [HomeController::class, 'homepageSecond'])->name('homepage-second');
Route::get('/shop', [HomeController::class, 'shop'])->name('shop');
Route::get('/product/{product:slug}', [HomeController::class, 'show'])->name('product.show');
Route::get('/api/products/{id}', [HomeController::class, 'getProduct'])->name('api.product.get');
Route::get('/docs', fn () => view('docs'))->name('docs');

// Coming soon password verification
Route::post('/coming-soon/verify', [HomeController::class, 'verifyComingSoonPassword'])->name('coming-soon.verify')->middleware('antibot:contact');
Route::post('/coming-soon/subscribe', [HomeController::class, 'subscribeEmail'])->name('coming-soon.subscribe')->middleware('antibot:contact');

// Cart routes
Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'updateQuantity'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'removeFromCart'])->name('cart.remove');
Route::get('/cart', [CartController::class, 'view'])->name('cart.index');
Route::get('/cart/data', [CartController::class, 'getCart'])->name('cart.get');
Route::get('/cart/get', [CartController::class, 'getCartData'])->name('cart.get-data');
Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');
Route::get('/cart/sidebar', [CartController::class, 'sidebar'])->name('cart.sidebar');

// Checkout routes
Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');

// Payment routes
Route::get('/payment/{order}', [PaymentController::class, 'show'])->name('payment.show');
Route::post('/payment/{order}/initialize', [PaymentController::class, 'initialize'])->name('payment.initialize');
Route::get('/payment/success/{order}', [PaymentController::class, 'success'])->name('order.success');
Route::get('/payment/failed', [PaymentController::class, 'failed'])->name('order.failed');

// Media image serving route
Route::get('/media/{filename}', function ($filename) {
    $path = public_path('media/' . $filename);
    if (file_exists($path)) {
        return response()->file($path);
    }
    abort(404);
})->where('filename', '.*');

// Payment callback (outside splade middleware)
Route::get('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');

// Payment webhook (outside splade middleware)
Route::post('/payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');

// Slider images API (public)
Route::get('/api/slider-images', [\App\Http\Controllers\Admin\SliderSettingsController::class, 'getSliderImages'])->name('slider.images');

require __DIR__.'/auth.php';
require __DIR__.'/test.php';
require __DIR__.'/admin.php';
