<?php

namespace App\Models\Traits;

use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait HasPreviewConversions
{
    public function registerPreviewConversion(?Media $media = null): void
    {
        if ($media && str_contains($media->mime_type, 'pdf')) {
            $this->addMediaConversion('preview')
                ->width(400)
                ->height(565)
                ->pdfPageNumber(1)
                ->nonqueued();
            return;
        }

        $this->addMediaConversion('preview')
            ->width(400)
            ->height(565)
            ->nonqueued();
    }
}
