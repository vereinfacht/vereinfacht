<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Media;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use LaravelJsonApi\Laravel\Http\Requests\ResourceQuery;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Contracts\Routing\Route;
use LaravelJsonApi\Contracts\Store\Store as StoreContract;
use LaravelJsonApi\Core\Responses\DataResponse;

class MediaController extends Controller
{

    use Actions\FetchMany;
    use Actions\FetchOne;
    // use Actions\Store;
    use Actions\Update;
    use Actions\Destroy;
    use Actions\FetchRelated;
    use Actions\FetchRelationship;
    use Actions\UpdateRelationship;
    use Actions\AttachRelationship;
    use Actions\DetachRelationship;

    public function store(Route $route, StoreContract $store)
    {
        $request = ResourceRequest::forResource(
            $resourceType = $route->resourceType()
        );

        $query = ResourceQuery::queryOne($resourceType);
        $response = null;

        if (method_exists($this, 'saving')) {
            $response = $this->saving(null, $request, $query);
        }

        if (!$response && method_exists($this, 'creating')) {
            $response = $this->creating($request, $query);
        }

        if ($response) {
            return $response;
        }

        // Create the media resource in DB
        $model = Media::create([
            // 'title' => $validated['attributes']['title'] ?? null,
            // add other fillable attributes here
            'model_type' => 'App\Models\TemporaryUpload',
            'model_id' => 1,
            'collection_name' => 'temporary',
            'name' => 'asdf',
            'file_name' => 'fdas',
            'disk' => 'public',
            'size' => 78986,
            'manipulations' => [],
            'custom_properties' => [],
            'generated_conversions' => '{"preview":true}',
            'responsive_images' => [],
            'club_id' => 1,
        ]);

        // Attach uploaded file with Spatie Media Library
        if ($request->hasFile('file')) {
            $model
                ->addMediaFromRequest('file')
                ->toMediaCollection('uploads'); // use your configured collection name
        }

        // $model = $store
        //     ->create($resourceType)
        //     ->withRequest($query)
        //     ->store($request->validated());

        if (method_exists($this, 'created')) {
            $response = $this->created($model, $request, $query);
        }

        if (!$response && method_exists($this, 'saved')) {
            $response = $this->saved($model, $request, $query);
        }

        return $response ?? DataResponse::make($model)
            ->withQueryParameters($query)
            ->didCreate();
    }
}
