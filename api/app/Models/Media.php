<?php

namespace App\Models;

use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    public function getOriginalUrlAttribute(): string
    {
        return route('media.download', ['media' => $this->id]);
    }

    public function getPreviewConversionUrlAttribute(): string
    {
        return route('media.preview', ['media' => $this->id]);
    }
}
