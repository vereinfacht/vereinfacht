<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportStatementsRequest;

class StatementController extends Controller
{
    public function import(ImportStatementsRequest $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file attached'], 400);
        }

        // call import action

        return response()->json([
            'total_statements_created' => 5,
            'total_transactions_created' => 7,
        ], 201, ['Content-Type' => 'application/vnd.api+json']);
    }
}
