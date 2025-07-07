<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\User\Login;
use App\Actions\User\Logout;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use LaravelJsonApi\Core\Document\Error;
use LaravelJsonApi\Core\Exceptions\JsonApiException;
use LaravelJsonApi\Core\Responses\DataResponse;

class UserController extends Controller
{
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
