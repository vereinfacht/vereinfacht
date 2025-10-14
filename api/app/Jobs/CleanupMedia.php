<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CleanupMedia implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function handle(): void
    {
        // Delete temporary uploads older than 24 hours
        Media::where('created_at', '<', now()->subDay())
            ->where('model_type', 'App\Models\TemporaryUpload')
            ->each(function (Media $media) {
                $media->delete();
            });
    }
}
