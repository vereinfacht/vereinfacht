<?php

namespace App\Models\Traits;

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
                ->width(400)
                ->height(565)
                ->pdfPageNumber(1);
            return;
        }

        // Image conversion
        $this->addMediaConversion('preview')
            ->width(400)
            ->height(565);
    }
}
