<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Statement;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class StatementController extends Controller
{
    use Actions\FetchMany;
    use Actions\FetchOne;
    use Actions\Destroy;
    use Actions\FetchRelated;
    use Actions\FetchRelationship;
    use Actions\UpdateRelationship;
    use Actions\AttachRelationship;
    use Actions\DetachRelationship;

    public function store(ResourceRequest $request): DataResponse
    {

        return DB::transaction(function () use ($request) {
            $statement = Statement::create([
                'date' => $request->data['attributes']['date'],
                'club_id' => $request->data['relationships']['club']['data']['id'],
                'finance_account_id' => $request->data['relationships']['financeAccount']['data']['id'],
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
            $statement->update([
                'date' => $request->data['attributes']['date'],
                'finance_account_id' => $request->data['relationships']['financeAccount']['data']['id'],
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
