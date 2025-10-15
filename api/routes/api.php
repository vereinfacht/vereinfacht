<?php

use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\MembershipController;
use App\Http\Controllers\Api\V1\ReceiptController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Middleware\ChangeLocaleFromHeader;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use LaravelJsonApi\Laravel\Routing\ActionRegistrar;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::post('media/upload', [MediaController::class, 'upload']);
    });

JsonApiRoute::server('v1')
    ->prefix('v1')
    ->middleware(ChangeLocaleFromHeader::class)
    ->resources(function ($server) {
        $server->resource('memberships', MembershipController::class)
            ->only('index', 'show', 'store', 'update')
            ->actions('-actions', function (ActionRegistrar $actions) {
                $actions->withId()->post('apply');
            });

        $server->resource('membership-types', JsonApiController::class)
            ->only('index', 'show', 'update');

        $server->resource('members', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasMany('divisions', JsonApiController::class);
            })
            ->only('store');

        $server->resource('divisions', JsonApiController::class)
            ->only('index', 'show', 'update');

        $server->resource('clubs', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasMany('membershipTypes', JsonApiController::class);
                $relations->hasMany('divisions', JsonApiController::class);
                $relations->hasMany('financeAccounts', JsonApiController::class);
            })
            ->only('index', 'show', 'update');

        $server->resource('users', UserController::class)
            ->only('index', 'show', 'login', 'logout')
            ->actions(function (ActionRegistrar $actions) {
                $actions->post('login');
                $actions->post('logout');
            });

        $server->resource('media', MediaController::class)
            ->only('destroy');

        $server->resource('permissions', JsonApiController::class)
            ->only('index');

        $server->resource('finance-contacts', JsonApiController::class)
            ->only('index', 'show', 'store', 'update');

        $server->resource('receipts', ReceiptController::class)
            ->only('index', 'show', 'store', 'update');

        $server->resource('finance-accounts', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasOne('club', JsonApiController::class);
                $relations->hasMany('statements', JsonApiController::class);
            })
            ->only('index', 'show', 'store', 'update');

        $server->resource('transactions', JsonApiController::class)
            ->only('index', 'show', 'store', 'update');

        $server->resource('statements', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasOne('financeAccount', JsonApiController::class);
                $relations->hasMany('transactions', JsonApiController::class);
            })
            ->only('index', 'show', 'store', 'update');
    });
