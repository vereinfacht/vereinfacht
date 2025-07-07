<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Membership\ApplyMembershipAction;
use App\Http\Controllers\Controller;
use App\Models\Membership;
use LaravelJsonApi\Core\Document\Error;
use LaravelJsonApi\Core\Exceptions\JsonApiException;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;

class MembershipController extends Controller
{
    use Actions\AttachRelationship;
    use Actions\Destroy;
    use Actions\DetachRelationship;
    use Actions\FetchMany;
    use Actions\FetchOne;
    use Actions\FetchRelated;
    use Actions\FetchRelationship;
    use Actions\Store;
    use Actions\Update;
    use Actions\UpdateRelationship;

    public function apply(Membership $membership): DataResponse
    {
        try {
            (new ApplyMembershipAction)->execute($membership);

            return new DataResponse($membership);
        } catch (\Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "The membership is not eligable to apply: {$th->getMessage()}",
            ]));
        }
    }
}
