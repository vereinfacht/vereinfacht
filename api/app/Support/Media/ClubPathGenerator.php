<?php

namespace App\Support\Media;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class ClubPathGenerator implements PathGenerator
{
    protected function basePath(Media $media): string
    {
        $clubId = $media->club_id;
        $collection = $media->collection_name ?? 'default';

        return $clubId . '/' . $collection . '/' . $media->id . '/';
    }

    public function getPath(Media $media): string
    {
        return $this->basePath($media);
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->basePath($media) . 'conversions/';
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->basePath($media) . 'responsive-images/';
    }
}
