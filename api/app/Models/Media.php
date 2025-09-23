<?php

namespace App\Models;

use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;
use Spatie\MediaLibrary\MediaCollections\File;

class Media extends BaseMedia
{
    public function getOriginalUrlAttribute(): string
    {
        return $this->getUrl();
    }
}
