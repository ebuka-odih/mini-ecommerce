# Anti-Bot Protection Setup

This project includes comprehensive anti-bot protection features including honeypot traps, rate limiting, bot detection, and more.

## Features Implemented

### 1. Honeypot Protection ✅
- Invisible fields that bots fill but humans don't see
- Multiple trap fields with different names
- Form submission timing validation
- Silent rejection of bot attempts

### 2. Rate Limiting ✅
- Configurable limits per form type (login, register, contact, checkout)
- IP-based and fingerprint-based tracking
- Automatic blocking of excessive requests

### 3. Bot Detection ✅
- User agent analysis for known bot patterns
- Suspicious behavior detection
- IP blocking capabilities

### 4. Comprehensive Logging ✅
- Dedicated antibot log channel
- Detailed logging of all suspicious activities
- Daily log rotation

## Configuration

Add these variables to your `.env` file:

```env
# Enable/Disable anti-bot protection
ANTIBOT_ENABLED=true

# Honeypot field name (should look legitimate to bots)
HONEYPOT_FIELD_NAME=website_url

# Optional: CAPTCHA Configuration
CAPTCHA_ENABLED=false
RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Logging
LOG_LEVEL=debug
```

## Protected Routes

The following routes are automatically protected:

- `POST /login` - Login attempts
- `POST /register` - User registration
- `POST /forgot-password` - Password reset requests
- `POST /reset-password` - Password reset submissions
- `POST /cart/add` - Add to cart
- `POST /cart/update` - Update cart
- `POST /cart/remove` - Remove from cart
- `POST /coming-soon/verify` - Coming soon password verification

## Usage in Forms

### Blade Templates
Add the honeypot component to any form:
```blade
<form method="POST" action="{{ route('register') }}">
    @csrf
    <x-honeypot />
    <!-- Your form fields here -->
</form>
```

### React/Inertia Forms
Import and use the Honeypot component:
```tsx
import Honeypot from '@/components/Honeypot';

function MyForm() {
    const { data, setData, post } = useForm({
        // ... your fields
        website_url: '',
        _form_start_time: Math.floor(Date.now() / 1000),
    });

    return (
        <form onSubmit={handleSubmit}>
            <Honeypot onFormStart={(startTime) => setData('_form_start_time', startTime)} />
            {/* Your form fields here */}
        </form>
    );
}
```

## Rate Limiting Configuration

Edit `config/antibot.php` to adjust rate limits:

```php
'rate_limiting' => [
    'login' => [
        'max_attempts' => 5,
        'decay_minutes' => 15,
    ],
    'register' => [
        'max_attempts' => 3,
        'decay_minutes' => 60,
    ],
    // ... more configurations
],
```

## Monitoring

### Log Files
- Main logs: `storage/logs/laravel.log`
- Anti-bot specific: `storage/logs/antibot.log`

### What Gets Logged
- Honeypot triggers
- Rate limit violations  
- Suspicious user agents
- Bot trap activations
- IP blocking events

## Customization

### Adding New Protected Routes
In your route files, add the antibot middleware:
```php
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('antibot:contact');
```

### Custom Honeypot Field Names
Change in `config/antibot.php`:
```php
'honeypot' => [
    'field_name' => 'your_custom_field_name',
],
```

### Blocking IPs
Add suspicious IPs to the config:
```php
'blocked_ips' => [
    '192.168.1.100',
    '10.0.0.50',
],
```

## Testing

To test the anti-bot protection:

1. **Honeypot Test**: Fill the hidden field and submit - should be rejected
2. **Rate Limit Test**: Submit forms rapidly - should be rate limited
3. **Bot User Agent Test**: Use curl or change user agent to include "bot"
4. **Speed Test**: Submit form too quickly (< 3 seconds) - should be rejected

## Bonus Features

### Additional Bot Traps
The honeypot component includes multiple hidden fields:
- `confirm_email` - Email confirmation trap
- `accept_terms` - Terms acceptance trap  
- `comments` - Comments field trap

### Silent Rejection
Bots that trigger honeypots get a "success" response but their data is discarded, preventing them from knowing they were detected.

### Fingerprinting
Rate limiting uses both IP address and browser fingerprint for more accurate tracking.

## Performance Impact

The anti-bot protection is designed to be lightweight:
- Minimal database queries
- Efficient caching
- Non-blocking for legitimate users
- Configurable to disable if needed

## Security Notes

1. **Honeypot Field Names**: Use field names that look legitimate to bots
2. **Log Rotation**: Logs are automatically rotated to prevent disk space issues
3. **Rate Limits**: Adjust based on your legitimate user patterns
4. **IP Blocking**: Use carefully to avoid blocking legitimate users behind NAT

## Troubleshooting

### Common Issues

1. **Legitimate Users Blocked**: Adjust rate limits in config
2. **Honeypot False Positives**: Check field names don't conflict with real fields
3. **High Log Volume**: Adjust log level or disable verbose logging

### Debug Mode
Enable debug logging to see detailed anti-bot activity:
```env
LOG_LEVEL=debug
```
