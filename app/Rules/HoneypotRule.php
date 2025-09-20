<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Log;

class HoneypotRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // If honeypot field has any value, it's filled by a bot
        if (!empty($value)) {
            // Log the bot attempt
            Log::warning('Honeypot triggered', [
                'field' => $attribute,
                'value' => $value,
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'url' => request()->fullUrl(),
            ]);

            // Fail validation but don't reveal why
            $fail('The form submission is invalid.');
        }

        // Also check additional bot trap fields
        $botTrapFields = ['confirm_email', 'accept_terms', 'comments'];
        
        foreach ($botTrapFields as $field) {
            $trapValue = request()->input($field);
            if (!empty($trapValue)) {
                Log::warning('Bot trap triggered', [
                    'field' => $field,
                    'value' => $trapValue,
                    'ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
                
                $fail('The form submission is invalid.');
                break;
            }
        }
    }
}
