<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use App\Models\Traits\HasPreviewConversions;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class TemporaryUpload extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasPreviewConversions;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('temporary');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerPreviewConversion($media);
    }
}
