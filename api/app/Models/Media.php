<?php

namespace App\Models;

use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    public function getOriginalUrlAttribute(): string
    {
        return $this->getUrl();
    }

    public function getPreviewUrlAttribute(): string
    {
        return $this->hasGeneratedConversion('preview') ? $this->getUrl('preview') : '';
    }
}
