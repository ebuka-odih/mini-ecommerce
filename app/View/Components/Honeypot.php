<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class Honeypot extends Component
{
    public string $fieldName;
    public int $startTime;

    /**
     * Create a new component instance.
     */
    public function __construct(string $fieldName = null)
    {
        $this->fieldName = $fieldName ?? config('antibot.honeypot.field_name', 'website_url');
        $this->startTime = time();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View
    {
        return view('components.honeypot');
    }
}
