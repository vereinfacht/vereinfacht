<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Traits\HandlesMediaRelationships;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use App\Http\Controllers\Controller;

class ReceiptController extends Controller
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
}
