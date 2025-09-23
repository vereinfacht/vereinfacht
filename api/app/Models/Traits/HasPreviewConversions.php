<?php

namespace App\Models\Traits;

use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait HasPreviewConversions
{
    /**
     * Register a "preview" conversion for images and PDFs.
     */
    public function registerPreviewConversion(?Media $media = null): void
    {
        // PDF conversion
        if ($media && str_contains($media->mime_type, 'pdf')) {
            $this->addMediaConversion('preview')
                ->width(368)
                ->height(232)
                ->pdfPageNumber(1)
                ->nonQueued();
            return;
        }

        // Image conversion
        $this->addMediaConversion('preview')
            ->width(368)
            ->height(232)
            ->fit(Fit::Contain)
            ->nonQueued();
    }
}
