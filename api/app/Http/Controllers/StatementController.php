<?php

namespace App\Http\Controllers;

use App\Actions\Statement\FileImport;
use App\Http\Requests\ImportStatementsRequest;
use App\Models\FinanceAccount;

class StatementController extends Controller
{
    public function __construct(
        private FileImport $fileImport
    ) {}

    public function import(ImportStatementsRequest $request)
    {
        $file = $request->file('file');

        if (!$file) {
            return response()->json(['error' => 'No file attached'], 400);
        }

        $financeAccount = FinanceAccount::find($request->input('financeAccountId'));

        if (!$financeAccount) {
            return response()->json(['error' => 'Finance account not found'], 404);
        }

        try {
            $action = $this->fileImport->execute($file, $financeAccount);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => $th->getMessage(),
            ], 500, ['Content-Type' => 'application/vnd.api+json']);
        }

        return response()->json([
            'total_statements_created' => $action['total_statements_created'],
            'total_statements_skipped' => $action['total_statements_skipped'],
        ], 201, ['Content-Type' => 'application/vnd.api+json']);
    }
}
