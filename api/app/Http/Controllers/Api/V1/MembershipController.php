<?php

namespace App\Http\Controllers\Api\V1;

use Throwable;
use App\Models\Membership;
use App\Http\Controllers\Controller;
use LaravelJsonApi\Core\Document\Error;
use LaravelJsonApi\Core\Responses\DataResponse;
use App\Actions\Membership\ApplyMembershipAction;
use LaravelJsonApi\Core\Exceptions\JsonApiException;
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

class MembershipController extends Controller
{
    use AttachRelationship;
    use Destroy;
    use DetachRelationship;
    use FetchMany;
    use FetchOne;
    use FetchRelated;
    use FetchRelationship;
    use Store;
    use Update;
    use UpdateRelationship;

    public function apply(Membership $membership): DataResponse
    {
        try {
            (new ApplyMembershipAction)->execute($membership);

            return new DataResponse($membership);
        } catch (Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "The membership is not eligable to apply: {$th->getMessage()}",
            ]));
        }
    }
}
