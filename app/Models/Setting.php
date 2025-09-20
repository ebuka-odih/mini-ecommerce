<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description'
    ];

    /**
     * Get a setting value by key
     */
    public static function getValue($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        switch ($setting->type) {
            case 'boolean':
                return (bool) $setting->value;
            case 'json':
                return json_decode($setting->value, true);
            case 'integer':
                return (int) $setting->value;
            case 'float':
                return (float) $setting->value;
            default:
                return $setting->value;
        }
    }

    /**
     * Set a setting value by key
     */
    public static function setValue($key, $value, $type = 'string', $group = 'general', $description = null)
    {
        $setting = self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
                'description' => $description
            ]
        );

        return $setting;
    }

    /**
     * Check if coming soon banner is enabled
     */
    public static function isComingSoonEnabled()
    {
        return self::getValue('coming_soon_enabled', false);
    }

    /**
     * Get coming soon settings
     */
    public static function getComingSoonSettings()
    {
        return [
            'enabled' => self::getValue('coming_soon_enabled', false),
            'message' => self::getValue('coming_soon_message', 'We\'re working hard to bring you something amazing. Stay tuned!'),
            'password' => self::getValue('coming_soon_password', ''),
        ];
    }
}
