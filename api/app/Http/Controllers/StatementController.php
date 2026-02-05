<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\FinanceAccount;
use App\Actions\Statement\ImportFile;
use App\Http\Requests\ImportStatementsRequest;

class StatementController extends Controller
{
    public function __construct(
        private ImportFile $fileImport
    ) {}

    public function import(ImportStatementsRequest $request)
    {
        $financeAccount = FinanceAccount::find($request->input('financeAccountId'));

        if (!$financeAccount) {
            return response()->json(['error' => 'Finance account not found'], 404);
        }

        try {
            $action = $this->fileImport->execute($request->file('file'), $financeAccount);
        } catch (Throwable $th) {
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
