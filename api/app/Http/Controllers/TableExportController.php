<?php

namespace App\Http\Controllers;

use App\Contracts\ExportableResource;
use App\Actions\Export\ExportResourceCsv;
use App\Http\Requests\ExportTableRequest;
use App\Actions\Export\ExportReceiptResource;
use App\Actions\Export\ExportStatementResource;

class TableExportController extends Controller
{
    protected array $modelMapping = [
        'receipts' => \App\Models\Receipt::class,
        'statements' => \App\Models\Statement::class,
    ];

    protected array $exportMapping = [
        'receipts' => ExportReceiptResource::class,
        'statements' => ExportStatementResource::class,
    ];

    public function export(ExportTableRequest $request)
    {
        try {
            $resourceName = $request->input('resourceName');
            $ids = $request->input('ids');

            $modelClass = $this->getModelClass($resourceName);

            $query = $modelClass::whereIn('id', $ids);

            if ($this->modelHasClubContext($modelClass)) {
                $query->where('club_id', getPermissionsTeamId());
            }

            if (!empty($ids)) {
                $idsString = implode(',', array_map('intval', $ids));
                $query->orderByRaw("FIELD(id, $idsString)");
            }

            if (strtolower($resourceName) === 'receipts') {
                $query->with(['financeContact', 'taxAccount']);
            } elseif (strtolower($resourceName) === 'statements') {
                $query->with(['financeAccount', 'transactions', 'club']);
            }

            $resources = $query->get();

            if ($resources->isEmpty()) {
                return response()->json([
                    'errors' => 'No resources found for the provided IDs.',
                ], 404, ['Content-Type' => 'application/vnd.api+json']);
            }

            $export = $this->getExporter($resourceName);
            $csvFilePath = $export->execute($resources, $resourceName);

            return response()->download($csvFilePath)->deleteFileAfterSend(true);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => $th->getMessage(),
            ], 500, ['Content-Type' => 'application/vnd.api+json']);
        }
    }

    protected function getModelClass(string $resourceName): string
    {
        $resourceKey = strtolower($resourceName);

        if (!isset($this->modelMapping[$resourceKey])) {
            throw new \Exception("Unsupported resource type: {$resourceName}");
        }

        return $this->modelMapping[$resourceKey];
    }

    protected function getExporter(string $resourceName): ExportableResource
    {
        $resourceKey = strtolower($resourceName);

        if (isset($this->exportMapping[$resourceKey])) {
            $exportClass = $this->exportMapping[$resourceKey];
            return new $exportClass();
        }

        return new ExportResourceCsv();
    }

    protected function modelHasClubContext(string $modelClass): bool
    {
        $model = new $modelClass;
        return $model->getFillable() && in_array('club_id', $model->getFillable());
    }
}
