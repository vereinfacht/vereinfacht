<?php

namespace App\Http\Controllers\Api\V1;

use Throwable;
use App\Models\User;
use App\Actions\User\Login;
use App\Actions\User\Logout;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use LaravelJsonApi\Core\Document\Error;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Core\Exceptions\JsonApiException;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
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

class UserController extends Controller
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

    protected function creating(ResourceRequest $request): DataResponse
    {
        try {
            $data = $request->validated();
            $repository = app(UserRepository::class);

            $user = $repository->createWithRoles(
                $data,
                $data['club']['id'],
                collect($data['roles'] ?? [])->pluck('id')->toArray()
            );

            return DataResponse::make($user);
        } catch (Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "User could not be created: {$th->getMessage()}",
            ]));
        }
    }


    protected function updating(User $user, ResourceRequest $request): DataResponse
    {
        try {
            $data = $request->validated();
            $repository = app(UserRepository::class);

            $clubId = $user->clubs()->exists() ? $user->clubs()->first()->id : null;
            $updatedUser = $repository->updateWithRoles(
                $user,
                $data,
                $clubId,
                collect($data['roles'] ?? [])->pluck('id')->toArray()
            );

            return DataResponse::make($updatedUser);
        } catch (Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "User could not be updated: {$th->getMessage()}",
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
        } catch (Throwable $th) {
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
        } catch (Throwable $th) {
            throw new JsonApiException(Error::fromArray([
                'status' => 422,
                'detail' => "User could not be logged out: {$th->getMessage()}}",
            ]));
        }
    }
}
