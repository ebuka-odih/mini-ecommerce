<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Jackets',
            'T-Shirts',
            'Jeans',
            'Hoodies',
        ];

        $categoryIds = [];
        foreach ($categories as $cat) {
            $slug = \Str::slug($cat);
            $category = Category::firstOrCreate([
                'slug' => $slug,
            ], [
                'name' => $cat,
            ]);
            // If the name is different, update it
            if ($category->name !== $cat) {
                $category->name = $cat;
                $category->save();
            }
            $categoryIds[$cat] = $category->id;
        }

        $products = [
            [
                'name' => 'Classic Blue Denim Jacket',
                'price' => 120.00,
                'category_id' => $categoryIds['Jackets'],
            ],
            [
                'name' => 'White Cotton T-Shirt',
                'price' => 30.00,
                'category_id' => $categoryIds['T-Shirts'],
            ],
            [
                'name' => 'Black Slim Fit Jeans',
                'price' => 80.00,
                'category_id' => $categoryIds['Jeans'],
            ],
            [
                'name' => 'Red Hoodie',
                'price' => 65.00,
                'category_id' => $categoryIds['Hoodies'],
            ],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate([
                'name' => $data['name'],
            ], $data);
        }
    }
} 