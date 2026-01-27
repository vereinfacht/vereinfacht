<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\Statement;
use App\Http\Requests\ExportTableRequest;
use App\Actions\Export\ExportReceiptResource;
use App\Actions\Export\ExportStatementResource;

class ExportTableController extends Controller
{
    public function export(ExportTableRequest $request)
    {
        try {
            $resourceName = strtolower($request->input('resourceName'));
            $ids = $request->input('ids');
            $clubId = getPermissionsTeamId();

            [$query, $exporter] = match ($resourceName) {
                'receipts' => [
                    Receipt::whereIn('id', $ids)
                        ->where('club_id', $clubId)
                        ->with(['financeContact', 'taxAccount']),
                    new ExportReceiptResource()
                ],
                'statements' => [
                    Statement::whereIn('id', $ids)
                        ->where('club_id', $clubId)
                        ->with(['financeAccount', 'transactions', 'club']),
                    new ExportStatementResource()
                ],
                default => throw new \Exception("Unsupported resource type: {$resourceName}")
            };

            if (!empty($ids)) {
                $idsString = implode(',', array_map('intval', $ids));
                $query->orderByRaw("FIELD(id, $idsString)");
            }

            $resources = $query->get();

            if ($resources->isEmpty()) {
                return response()->json([
                    'errors' => 'No resources found for the provided IDs.',
                ], 404, ['Content-Type' => 'application/vnd.api+json']);
            }

            $csvFilePath = $exporter->execute($resources, $resourceName);

            return response()->download($csvFilePath)->deleteFileAfterSend(true);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => $th->getMessage(),
            ], 500, ['Content-Type' => 'application/vnd.api+json']);
        }
    }
}
