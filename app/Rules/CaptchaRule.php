<?php

namespace App\Rules;

use App\Services\CaptchaService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CaptchaRule implements ValidationRule
{
    protected CaptchaService $captchaService;

    public function __construct()
    {
        $this->captchaService = app(CaptchaService::class);
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Skip if CAPTCHA is disabled
        if (!$this->captchaService->isEnabled()) {
            return;
        }

        // Check if it's a reCAPTCHA response
        if ($attribute === 'g-recaptcha-response' || $attribute === 'recaptcha_token') {
            if (!$this->captchaService->verifyRecaptcha($value)) {
                $fail('The CAPTCHA verification failed. Please try again.');
            }
            return;
        }

        // Check if it's a math CAPTCHA
        if ($attribute === 'captcha_answer') {
            $encryptedAnswer = request()->input('captcha_hash');
            if (!$encryptedAnswer || !$this->captchaService->verifyMathCaptcha($value, $encryptedAnswer)) {
                $fail('The CAPTCHA answer is incorrect. Please try again.');
            }
            return;
        }

        // Default: treat as reCAPTCHA
        if (!$this->captchaService->verifyRecaptcha($value)) {
            $fail('The CAPTCHA verification failed. Please try again.');
        }
    }
}
