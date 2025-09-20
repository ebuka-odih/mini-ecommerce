{{-- Honeypot field - invisible to humans, visible to bots --}}
<div style="position: absolute; left: -9999px; top: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true" tabindex="-1">
    <label for="{{ $fieldName }}">Leave this field empty</label>
    <input 
        type="text" 
        name="{{ $fieldName }}" 
        id="{{ $fieldName }}" 
        value="" 
        autocomplete="off"
        tabindex="-1"
        style="position: absolute; left: -9999px; top: -9999px; opacity: 0; pointer-events: none;"
    />
</div>

{{-- Hidden field to track form start time --}}
<input type="hidden" name="_form_start_time" value="{{ $startTime }}" />

{{-- Additional bot trap: CSS-based hidden field --}}
<style>
    .bot-trap {
        display: none !important;
        visibility: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }
</style>

<div class="bot-trap">
    <input type="text" name="confirm_email" value="" tabindex="-1" autocomplete="off" />
    <input type="checkbox" name="accept_terms" value="1" tabindex="-1" />
    <textarea name="comments" tabindex="-1"></textarea>
</div>
