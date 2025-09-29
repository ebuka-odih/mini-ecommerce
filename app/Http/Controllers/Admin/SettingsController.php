<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page
     */
    public function index()
    {
        $settings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/img/paperview.png'),
            'currency' => Setting::getValue('currency', 'USD'),
            'theme' => Setting::getValue('theme', 'dark'),
            'frontpage' => Setting::getValue('frontpage', 'homepage'),
        ];

        // Get site settings for layout
        $siteSettings = [
            'site_name' => $settings['site_name'],
            'site_logo' => $settings['site_logo'],
        ];

        return Inertia::render('admin/settings', [
            'settings' => $settings,
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'site_name' => 'required|string|max:255',
            'site_logo' => 'nullable|string|max:500',
            'currency' => 'required|string|in:NGN,USD,EUR,GBP,CAD,AUD,ZAR',
            'theme' => 'required|string|in:light,dark',
            'frontpage' => 'required|string|in:homepage,homepage-second,homepage-3',
        ]);

        // Update settings
        Setting::setValue('site_name', $request->site_name, 'string', 'general', 'Website name');
        Setting::setValue('site_logo', $request->site_logo, 'string', 'general', 'Website logo path');
        Setting::setValue('currency', $request->currency, 'string', 'general', 'Default currency');
        Setting::setValue('theme', $request->theme, 'string', 'appearance', 'Website theme');
        Setting::setValue('frontpage', $request->frontpage, 'string', 'frontend', 'Homepage template');

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }

    /**
     * Handle logo upload
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'logo-' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');
            
            $logoUrl = '/storage/logos/' . $filename;
            
            // Update the setting
            Setting::setValue('site_logo', $logoUrl, 'string', 'general', 'Website logo path');
            
            // Return redirect with flash data for Inertia
            return redirect()->back()->with([
                'success' => 'Logo uploaded successfully!',
                'logo_url' => $logoUrl
            ]);
        }

        return redirect()->back()->with('error', 'No file uploaded');
    }
}

