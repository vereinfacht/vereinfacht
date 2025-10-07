<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Traits\HandlesMediaRelationships;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use LaravelJsonApi\Contracts\Routing\Route;
use LaravelJsonApi\Contracts\Store\Store as StoreContract;

class ReceiptController extends JsonApiController
{
    use HandlesMediaRelationships;

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

    // public function attachingMedias(
    //     $post,
    //     $request,
    //     $query
    // ): void {
    //     $tags = $request->toMany();
    //     ray($tags);
    // }

    // public function store(Route $route, StoreContract $store)
    // {
    //     ray("asdad");
    // }
}
