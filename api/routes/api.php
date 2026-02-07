<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StatementController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\ExportTableController;
use App\Http\Middleware\ChangeLocaleFromHeader;
use App\Http\Controllers\Api\V1\MediaController;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Routing\ActionRegistrar;
use App\Http\Controllers\Api\V1\MembershipController;
use App\Http\Controllers\FinancialStatementController;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use App\Http\Controllers\Api\V1\StatementController as V1StatementController;

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

Route::middleware(['auth:sanctum', ChangeLocaleFromHeader::class])
    ->prefix('v1')
    ->group(function () {
        Route::post('upload/media', [MediaController::class, 'upload']);
        Route::get('media/{media}/download', [MediaController::class, 'download'])->name('media.download');
        Route::get('media/{media}/preview', [MediaController::class, 'preview'])->name('media.preview');
        Route::post('import/statements', [StatementController::class, 'import']);
        Route::post('export/financial-statement', [FinancialStatementController::class, 'export']);
        Route::post('export/table', [ExportTableController::class, 'export']);
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
            ->only('index', 'show',  'store', 'update');

        $server->resource('clubs', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasMany('membershipTypes', JsonApiController::class);
                $relations->hasMany('divisions', JsonApiController::class);
                $relations->hasMany('financeAccounts', JsonApiController::class);
            })
            ->only('index', 'show', 'update');

        $server->resource('users', UserController::class)
            ->only('index', 'show', 'login', 'logout', 'store', 'update', 'destroy')
            ->actions(function (ActionRegistrar $actions) {
                $actions->post('login');
                $actions->post('logout');
            });

        $server->resource('media', MediaController::class)
            ->only('destroy');

        $server->resource('permissions', JsonApiController::class)
            ->only('index');

        $server->resource('roles', JsonApiController::class)
            ->only('index');

        $server->resource('finance-contacts', JsonApiController::class)
            ->only('index', 'show', 'store', 'update');

        $server->resource('receipts', JsonApiController::class)
            ->only('index', 'show', 'store', 'update');

        $server->resource('finance-accounts', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasOne('club', JsonApiController::class);
                $relations->hasMany('statements', JsonApiController::class);
            })
            ->only('index', 'show', 'store', 'update');

        $server->resource('transactions', JsonApiController::class)
            ->relationships(function ($relations) {
                $relations->hasOne('statement', JsonApiController::class);
            })
            ->only('index', 'show');

        $server->resource('statements', V1StatementController::class)
            ->relationships(function ($relations) {
                $relations->hasOne('financeAccount', JsonApiController::class);
                $relations->hasMany('transactions', JsonApiController::class);
            })
            ->only('index', 'show', 'store', 'update');

        $server->resource('tax-accounts', JsonApiController::class)
            ->only('index', 'show', 'store', 'update', 'destroy');
    });
