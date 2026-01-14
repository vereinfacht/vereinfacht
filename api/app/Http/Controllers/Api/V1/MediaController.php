<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\TemporaryUpload;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadMediaRequest;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\Store;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\Update;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\Destroy;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchOne;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchMany;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchRelated;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchRelationship;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\AttachRelationship;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\DetachRelationship;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\UpdateRelationship;

class MediaController extends Controller
{

    use FetchMany;
    use FetchOne;
    use Store;
    use Update;
    use Destroy;
    use FetchRelated;
    use FetchRelationship;
    use UpdateRelationship;
    use AttachRelationship;
    use DetachRelationship;

    public function upload(UploadMediaRequest $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file attached'], 400);
        }

        $temporaryOwner = new TemporaryUpload();
        $temporaryOwner->id = 0;
        $temporaryOwner->exists = true;

        $media = $temporaryOwner
            ->addMediaFromRequest('file')
            ->withProperties(['club_id' => $request->input('clubId')])
            ->toMediaCollection($request->input('collectionName'));

        return response()->json([
            'data' => [
                'type' => 'media',
                'id' => (string) $media->id,
            ],
        ], 201, ['Content-Type' => 'application/vnd.api+json']);
    }
}
