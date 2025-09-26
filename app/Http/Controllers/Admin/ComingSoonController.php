<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComingSoonController extends Controller
{
    /**
     * Display the coming soon settings page
     */
    public function index()
    {
        $settings = Setting::getComingSoonSettings();
        
        // Get site settings for layout
        $siteSettings = [
            'site_name' => Setting::getValue('site_name', 'GNOSIS'),
            'site_logo' => Setting::getValue('site_logo', '/brand/GNOSIS4.png'),
        ];

        return Inertia::render('admin/coming-soon', [
            'settings' => $settings,
            'site_settings' => $siteSettings,
        ]);
    }

    /**
     * Update coming soon settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'enabled' => 'boolean',
            'message' => 'required|string|max:1000',
            'password' => 'nullable|string|max:255',
        ]);

        // Update settings
        Setting::setValue('coming_soon_enabled', $request->enabled ? '1' : '0', 'boolean', 'coming_soon', 'Enable or disable the coming soon banner');
        Setting::setValue('coming_soon_message', $request->message, 'string', 'coming_soon', 'Message displayed in the coming soon banner');
        Setting::setValue('coming_soon_password', $request->password, 'string', 'coming_soon', 'Password to bypass the coming soon banner');

        return redirect()->back()->with('success', 'Coming soon settings updated successfully!');
    }

    /**
     * Toggle coming soon status
     */
    public function toggle()
    {
        $currentStatus = Setting::isComingSoonEnabled();
        $newStatus = !$currentStatus;
        
        Setting::setValue('coming_soon_enabled', $newStatus ? '1' : '0', 'boolean', 'coming_soon', 'Enable or disable the coming soon banner');
        
        return response()->json([
            'success' => true,
            'enabled' => $newStatus,
            'message' => $newStatus ? 'Coming soon banner enabled' : 'Coming soon banner disabled'
        ]);
    }
}
