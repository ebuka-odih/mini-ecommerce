<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Anti-Bot Protection Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration file contains settings for protecting your application
    | from bots and automated attacks.
    |
    */

    'enabled' => env('ANTIBOT_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limiting for different types of requests
    |
    */
    'rate_limiting' => [
        'login' => [
            'max_attempts' => 5,
            'decay_minutes' => 15,
        ],
        'register' => [
            'max_attempts' => 3,
            'decay_minutes' => 60,
        ],
        'contact' => [
            'max_attempts' => 5,
            'decay_minutes' => 30,
        ],
        'checkout' => [
            'max_attempts' => 10,
            'decay_minutes' => 5,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Honeypot Configuration
    |--------------------------------------------------------------------------
    |
    | Honeypot fields are invisible to humans but visible to bots
    |
    */
    'honeypot' => [
        'enabled' => true,
        'field_name' => env('HONEYPOT_FIELD_NAME', 'website_url'),
        'time_limit' => 3, // Minimum seconds before form can be submitted
    ],

    /*
    |--------------------------------------------------------------------------
    | Bot Detection
    |--------------------------------------------------------------------------
    |
    | Configure bot detection based on user agents and behavior patterns
    |
    */
    'bot_detection' => [
        'enabled' => true,
        'user_agent_blacklist' => [
            'bot',
            'crawler',
            'spider',
            'scraper',
            'curl',
            'wget',
            'python-requests',
        ],
        'suspicious_patterns' => [
            'too_fast_submission' => 2, // Seconds
            'multiple_forms_per_minute' => 5,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CAPTCHA Configuration
    |--------------------------------------------------------------------------
    |
    | Configure CAPTCHA settings
    |
    */
    'captcha' => [
        'enabled' => env('CAPTCHA_ENABLED', false),
        'provider' => 'recaptcha', // recaptcha, hcaptcha
        'site_key' => env('RECAPTCHA_SITE_KEY'),
        'secret_key' => env('RECAPTCHA_SECRET_KEY'),
        'threshold' => 0.5, // For reCAPTCHA v3
    ],

    /*
    |--------------------------------------------------------------------------
    | Protected Routes
    |--------------------------------------------------------------------------
    |
    | Routes that should be protected by anti-bot measures
    |
    */
    'protected_routes' => [
        'login',
        'register',
        'contact',
        'checkout.process',
        'password.email',
        'password.store',
    ],

    /*
    |--------------------------------------------------------------------------
    | Blocked IPs
    |--------------------------------------------------------------------------
    |
    | IP addresses to block completely
    |
    */
    'blocked_ips' => [
        // Add suspicious IPs here
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    |
    | Configure logging for bot detection events
    |
    */
    'logging' => [
        'enabled' => true,
        'channel' => 'antibot',
        'log_blocked_attempts' => true,
        'log_suspicious_activity' => true,
    ],
];
