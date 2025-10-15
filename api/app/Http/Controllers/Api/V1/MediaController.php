<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadMediaRequest;
use App\Models\TemporaryUpload;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;

class MediaController extends Controller
{

    use Actions\FetchMany;
    use Actions\FetchOne;
    use Actions\Store;
    use Actions\Update;
    use Actions\Destroy;
    use Actions\FetchRelated;
    use Actions\FetchRelationship;
    use Actions\UpdateRelationship;
    use Actions\AttachRelationship;
    use Actions\DetachRelationship;

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
