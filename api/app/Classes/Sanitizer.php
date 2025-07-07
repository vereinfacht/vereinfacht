<?php

namespace App\Classes;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class Sanitizer
{
    protected HtmlSanitizer $htmlSanitizer;

    public function __construct()
    {
        $this->htmlSanitizer = $this->getHtmlSanitizer();
    }

    public function get(string $string): string
    {
        $string = $this->sanitizeHtml($string);

        return $string;
    }

    protected function sanitizeHtml(string $string): string
    {
        return $this->htmlSanitizer->sanitize($string);
    }

    protected function getHtmlSanitizer(): HtmlSanitizer
    {
        $config = (new HtmlSanitizerConfig)
            ->allowSafeElements();

        return new HtmlSanitizer($config);
    }
}
