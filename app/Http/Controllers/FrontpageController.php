<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FrontpageController extends Controller
{
    public function index()
    {
        return Inertia::render('index');
    }
} 