<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Actions\User\Login;
use App\Actions\User\Logout;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\Club;
use LaravelJsonApi\Core\Document\Error;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Core\Exceptions\JsonApiException;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Laravel\Http\Requests\ResourceQuery;

class UserController extends Controller
{
    use Actions\AttachRelationship;
    use Actions\Destroy;
    use Actions\DetachRelationship;
    use Actions\FetchMany;
    use Actions\FetchOne;
    use Actions\FetchRelated;
    use Actions\FetchRelationship;
    use Actions\Update;
    use Actions\Store;
    use Actions\UpdateRelationship;


    protected function creating(ResourceRequest $request): DataResponse
    {
        try {
            $data = $request->validated();

            $clubIds = collect($data['clubs'] ?? [])->pluck('id');
            $roleIds = collect($data['roles'] ?? [])->pluck('id');

            $user = User::create($data);

            if ($roleIds->isEmpty()) {
                $roleNames = collect(['club admin']);
            } else {
                $roleNames = \Spatie\Permission\Models\Role::whereIn('id', $roleIds)->pluck('name');
            }

            foreach ($clubIds as $clubId) {
                setPermissionsTeamId($clubId);

                foreach ($roleNames as $roleName) {
                    $user->assignRole($roleName);
                }
            }

            setPermissionsTeamId(null);

            $user->load(['clubs', 'roles']);

            return DataResponse::make($user);
        } catch (\Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "User could not be created: {$th->getMessage()}",
            ]));
        }
    }

    public function login(Request $request): DataResponse
    {
        try {
            $loginResult = (new Login)->execute($request);

            return DataResponse::make($loginResult->user)->withMeta([
                'club_id' => $loginResult->clubId,
                'token' => $loginResult->token,
            ]);
        } catch (\Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "User could not be logged in: {$th->getMessage()}",
            ]));
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            (new Logout)->execute($request);

            return response()->json(['success' => 'success'], 200);
        } catch (\Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "User could not be logged out: {$th->getMessage()}}",
            ]));
        }
    }
}
