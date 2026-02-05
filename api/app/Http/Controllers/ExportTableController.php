<?php

namespace App\Http\Controllers;

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

            $exporter = match ($resourceName) {
                'receipts' => new ExportReceiptResource(),
                'statements' => new ExportStatementResource(),
                default => throw new \Exception("Unsupported resource type: {$resourceName}")
            };

            $query = $exporter->getQuery($ids, $clubId);
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
