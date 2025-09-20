<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CaptchaService
{
    /**
     * Verify reCAPTCHA response
     */
    public function verifyRecaptcha(string $response, string $remoteIp = null): bool
    {
        if (!config('antibot.captcha.enabled')) {
            return true; // Skip verification if disabled
        }

        $secretKey = config('antibot.captcha.secret_key');
        
        if (empty($secretKey) || empty($response)) {
            return false;
        }

        try {
            $verifyResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretKey,
                'response' => $response,
                'remoteip' => $remoteIp ?? request()->ip(),
            ]);

            $result = $verifyResponse->json();

            if (!$result['success']) {
                Log::warning('reCAPTCHA verification failed', [
                    'errors' => $result['error-codes'] ?? [],
                    'ip' => $remoteIp ?? request()->ip(),
                ]);
                return false;
            }

            // For reCAPTCHA v3, check the score
            if (isset($result['score'])) {
                $threshold = config('antibot.captcha.threshold', 0.5);
                $passed = $result['score'] >= $threshold;
                
                if (!$passed) {
                    Log::warning('reCAPTCHA score too low', [
                        'score' => $result['score'],
                        'threshold' => $threshold,
                        'ip' => $remoteIp ?? request()->ip(),
                    ]);
                }
                
                return $passed;
            }

            return true;
            
        } catch (\Exception $e) {
            Log::error('reCAPTCHA verification error', [
                'error' => $e->getMessage(),
                'ip' => $remoteIp ?? request()->ip(),
            ]);
            
            // In case of error, allow the request to proceed
            // You might want to change this behavior based on your security requirements
            return true;
        }
    }

    /**
     * Generate a simple math CAPTCHA as fallback
     */
    public function generateMathCaptcha(): array
    {
        $num1 = rand(1, 10);
        $num2 = rand(1, 10);
        $operators = ['+', '-', '*'];
        $operator = $operators[array_rand($operators)];
        
        $answer = match($operator) {
            '+' => $num1 + $num2,
            '-' => $num1 - $num2,
            '*' => $num1 * $num2,
        };
        
        return [
            'question' => "{$num1} {$operator} {$num2} = ?",
            'answer' => $answer,
            'hash' => encrypt($answer), // Encrypted answer to store in form
        ];
    }

    /**
     * Verify math CAPTCHA answer
     */
    public function verifyMathCaptcha(string $userAnswer, string $encryptedAnswer): bool
    {
        try {
            $correctAnswer = decrypt($encryptedAnswer);
            return (int)$userAnswer === (int)$correctAnswer;
        } catch (\Exception $e) {
            Log::warning('Math CAPTCHA verification error', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get CAPTCHA site key for frontend
     */
    public function getSiteKey(): ?string
    {
        return config('antibot.captcha.site_key');
    }

    /**
     * Check if CAPTCHA is enabled
     */
    public function isEnabled(): bool
    {
        return config('antibot.captcha.enabled', false);
    }
}
