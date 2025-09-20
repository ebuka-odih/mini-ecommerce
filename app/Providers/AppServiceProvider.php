<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);

        View::composer('*', function ($view) {
            $cart = Session::get('cart', []);
            $cartCount = array_sum(array_column($cart, 'quantity'));
            $view->with('cartCount', $cartCount);
        });
    }
}
