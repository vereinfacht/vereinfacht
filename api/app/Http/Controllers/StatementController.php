<?php

namespace App\Http\Controllers;

use App\Actions\Transaction\FileImport;
use App\Http\Requests\ImportStatementsRequest;
use App\Models\FinanceAccount;

class StatementController extends Controller
{
    public function import(ImportStatementsRequest $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file attached'], 400);
        }

        $financeAccount = FinanceAccount::find($request->input('financeAccountId'));

        if (!$financeAccount) {
            return response()->json(['error' => 'Finance account not found'], 404);
        }

        $action = (new FileImport())->execute($financeAccount);

        return response()->json([
            'total_statements_created' => $action['total_statements_created'],
            'total_transactions_created' => $action['total_transactions_created'],
        ], 201, ['Content-Type' => 'application/vnd.api+json']);
    }
}
