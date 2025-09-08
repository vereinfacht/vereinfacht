<?php

use App\Http\Controllers\Api\V1\MembershipController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Middleware\ChangeLocaleFromHeader;
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

        $server->resource('permissions', JsonApiController::class)
            ->only('index');

        $server->resource('finance-contacts', JsonApiController::class)
            ->only('index', 'show', 'store', 'update');

        $server->resource('receipts', JsonApiController::class)
            ->only('index', 'show');

        $server->resource('finance-accounts', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasOne('club', JsonApiController::class);
                $relations->hasMany('transactions', JsonApiController::class);
            })
            ->only('index', 'show', 'store', 'delete');

        $server->resource('transactions', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasOne('financeAccount', JsonApiController::class);
            })
            ->only('index', 'show', 'update');
    });
