<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class AntiBotMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $protection = 'default'): Response
    {
        if (!config('antibot.enabled')) {
            return $next($request);
        }

        // Check if IP is blocked
        if ($this->isIpBlocked($request)) {
            $this->logSuspiciousActivity($request, 'blocked_ip');
            return response()->json(['error' => 'Access denied'], 403);
        }

        // Check user agent for bot patterns
        if ($this->isSuspiciousUserAgent($request)) {
            $this->logSuspiciousActivity($request, 'suspicious_user_agent');
            return response()->json(['error' => 'Access denied'], 403);
        }

        // Apply rate limiting
        if ($this->isRateLimited($request, $protection)) {
            $this->logSuspiciousActivity($request, 'rate_limited');
            return response()->json([
                'error' => 'Too many attempts. Please try again later.',
                'retry_after' => $this->getRateLimitRetryAfter($request, $protection)
            ], 429);
        }

        // Check honeypot (for POST requests)
        if ($request->isMethod('POST') && $this->isHoneypotTriggered($request)) {
            $this->logSuspiciousActivity($request, 'honeypot_triggered');
            // Silently reject - don't let bot know it was caught
            return response()->json(['success' => true], 200);
        }

        // Check submission speed (too fast = bot)
        if ($request->isMethod('POST') && $this->isSubmissionTooFast($request)) {
            $this->logSuspiciousActivity($request, 'submission_too_fast');
            return response()->json(['error' => 'Please slow down'], 429);
        }

        return $next($request);
    }

    /**
     * Check if IP is in the blocked list
     */
    protected function isIpBlocked(Request $request): bool
    {
        $ip = $request->ip();
        $blockedIps = config('antibot.blocked_ips', []);
        
        return in_array($ip, $blockedIps);
    }

    /**
     * Check if user agent contains suspicious patterns
     */
    protected function isSuspiciousUserAgent(Request $request): bool
    {
        if (!config('antibot.bot_detection.enabled')) {
            return false;
        }

        $userAgent = strtolower($request->userAgent() ?? '');
        $blacklist = config('antibot.bot_detection.user_agent_blacklist', []);

        foreach ($blacklist as $pattern) {
            if (str_contains($userAgent, strtolower($pattern))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if request is rate limited
     */
    protected function isRateLimited(Request $request, string $protection): bool
    {
        $rateLimits = config('antibot.rate_limiting', []);
        
        if (!isset($rateLimits[$protection])) {
            $protection = 'default';
        }

        $config = $rateLimits[$protection] ?? ['max_attempts' => 10, 'decay_minutes' => 60];
        
        $key = $this->getRateLimitKey($request, $protection);
        
        return RateLimiter::tooManyAttempts($key, $config['max_attempts']);
    }

    /**
     * Get rate limit key for the request
     */
    protected function getRateLimitKey(Request $request, string $protection): string
    {
        return sprintf(
            'antibot:%s:%s:%s',
            $protection,
            $request->ip(),
            $request->fingerprint()
        );
    }

    /**
     * Get rate limit retry after seconds
     */
    protected function getRateLimitRetryAfter(Request $request, string $protection): int
    {
        $key = $this->getRateLimitKey($request, $protection);
        return RateLimiter::availableIn($key);
    }

    /**
     * Check if honeypot field is filled (indicates bot)
     */
    protected function isHoneypotTriggered(Request $request): bool
    {
        if (!config('antibot.honeypot.enabled')) {
            return false;
        }

        $honeypotField = config('antibot.honeypot.field_name', 'website_url');
        
        // If honeypot field has any value, it's a bot
        return !empty($request->input($honeypotField));
    }

    /**
     * Check if form submission is too fast (indicates bot)
     */
    protected function isSubmissionTooFast(Request $request): bool
    {
        $timeLimit = config('antibot.honeypot.time_limit', 3);
        $formStartTime = $request->input('_form_start_time');

        if (!$formStartTime) {
            return false;
        }

        $submissionTime = time();
        $timeTaken = $submissionTime - $formStartTime;

        return $timeTaken < $timeLimit;
    }

    /**
     * Log suspicious activity
     */
    protected function logSuspiciousActivity(Request $request, string $reason): void
    {
        if (!config('antibot.logging.enabled')) {
            return;
        }

        $data = [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'reason' => $reason,
            'timestamp' => now()->toISOString(),
            'headers' => $request->headers->all(),
        ];

        Log::channel(config('antibot.logging.channel', 'default'))
           ->warning('Anti-bot protection triggered', $data);
    }

    /**
     * Hit the rate limiter for this request
     */
    public function hitRateLimit(Request $request, string $protection): void
    {
        $rateLimits = config('antibot.rate_limiting', []);
        $config = $rateLimits[$protection] ?? ['decay_minutes' => 60];
        
        $key = $this->getRateLimitKey($request, $protection);
        
        RateLimiter::hit($key, $config['decay_minutes'] * 60);
    }
}
