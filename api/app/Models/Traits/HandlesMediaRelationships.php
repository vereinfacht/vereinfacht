<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Model;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Laravel\Http\Requests\ResourceQuery;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait HandlesMediaRelationships
{
    /**
     * Handle media after resource creation.
     */
    protected function created(Model $model, ResourceRequest $request, ResourceQuery $query)
    {
        $this->syncMedia($model, $request);

        return null;
    }

    /**
     * Handle media after resource update.
     */
    protected function saved(Model $model, ResourceRequest $request, ResourceQuery $query)
    {
        $this->syncMedia($model, $request);

        return null;
    }

    /**
     * Attach or sync media to a model.
     */
    protected function syncMedia(Model $model, ResourceRequest $request): void
    {
        $relationship = $request->input('data.relationships.media.data', []);

        if (empty($relationship)) {
            return;
        }

        $mediaIds = collect($relationship)
            ->pluck('id')
            ->filter()
            ->unique()
            ->values();

        foreach ($mediaIds as $id) {
            $media = Media::find($id);
            if ($media) {
                $media->model()->associate($model);
                $media->save();
            }
        }
    }
}
