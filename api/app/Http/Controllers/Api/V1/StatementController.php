<?php

namespace App\Http\Controllers\Api\V1;

use DateTime;
use App\Models\Statement;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Classes\StatementIdentifierGenerator;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\Destroy;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchOne;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchMany;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchRelated;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\FetchRelationship;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\AttachRelationship;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\DetachRelationship;
use LaravelJsonApi\Laravel\Http\Controllers\Actions\UpdateRelationship;

class StatementController extends Controller
{
    use FetchMany;
    use FetchOne;
    use Destroy;
    use FetchRelated;
    use FetchRelationship;
    use UpdateRelationship;
    use AttachRelationship;
    use DetachRelationship;

    public function store(ResourceRequest $request): DataResponse
    {

        return DB::transaction(function () use ($request) {
            $statementIdentifier = StatementIdentifierGenerator::generate(
                new DateTime($request->data['attributes']['date']),
                $request->data['attributes']['transactionAmount'],
                $request->data['attributes']['description']
            );

            $statement = Statement::create([
                'date' => $request->data['attributes']['date'],
                'club_id' => $request->data['relationships']['club']['data']['id'],
                'finance_account_id' => $request->data['relationships']['financeAccount']['data']['id'],
                'statement_type' => 'individual',
                'identifier' => $statementIdentifier,
            ]);

            Transaction::create([
                'title' => $request->data['attributes']['title'],
                'description' => $request->data['attributes']['description'],
                'valued_at' => $request->data['attributes']['date'],
                'booked_at' => $request->data['attributes']['date'],
                'amount' => $request->data['attributes']['transactionAmount'],
                'currency' => 'EUR',
                'statement_id' => $statement->id,
            ]);

            $statement->load(['transactions', 'financeAccount', 'club']);

            return DataResponse::make($statement);
        });
    }

    public function update(ResourceRequest $request, Statement $statement): DataResponse
    {
        return DB::transaction(function () use ($request, $statement) {
            $statementIdentifier = StatementIdentifierGenerator::generate(
                new DateTime($request->data['attributes']['date']),
                $request->data['attributes']['transactionAmount'],
                $request->data['attributes']['description']
            );

            $statement->update([
                'date' => $request->data['attributes']['date'],
                'finance_account_id' => $request->data['relationships']['financeAccount']['data']['id'],
                'statement_type' => 'individual',
                'identifier' => $statementIdentifier,
            ]);

            $transaction = $statement->transactions()->first();
            if ($transaction) {
                $transaction->update([
                    'title' => $request->data['attributes']['title'],
                    'description' => $request->data['attributes']['description'],
                    'valued_at' => $request->data['attributes']['date'],
                    'booked_at' => $request->data['attributes']['date'],
                    'amount' => $request->data['attributes']['transactionAmount'],
                ]);
            }

            $statement->load(['transactions', 'financeAccount', 'club']);

            return DataResponse::make($statement);
        });
    }
}
