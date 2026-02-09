<?php

namespace App\Actions\Export;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ExportResourceCsv
{
    public function execute(Collection $resources, string $resourceName): string
    {
        if ($resources->isEmpty()) {
            throw new \Exception('No resources found for export.');
        }

        // @todo: use current user's locale
        app()->setLocale('de');

        return $this->generateCsv($resources, $resourceName);
    }

    protected function generateCsv(Collection $resources, string $resourceName): string
    {
        $tempDir = storage_path('app/tmp');

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $csvFileName = $this->getFileName($resourceName) . '.csv';
        $csvFile = fopen($tempDir . '/' . $csvFileName, 'w');

        $this->writeCsvData($csvFile, $resources);

        fclose($csvFile);

        return $tempDir . '/' . $csvFileName;
    }

    public function getFileName(string $resourceName): string
    {
        $clubId = getPermissionsTeamId();

        if (!$clubId) {
            throw new \Exception('Unable to determine club context for export.');
        }

        return $clubId . '-' . $resourceName . '-export-' . date('Y-m-d-H-i-s');
    }

    protected function writeCsvData($csvFile, Collection $resources): void
    {
        $columnsToExport = $this->getColumns();

        $headers = array_map(fn($column) => $column['header'], $columnsToExport);
        fputcsv($csvFile, $headers);

        foreach ($resources as $resource) {
            $row = [];
            foreach ($columnsToExport as $column) {
                $row[] = $this->getColumnValue($resource, $column);
            }
            fputcsv($csvFile, $row);
        }
    }

    protected function getColumns(): array
    {
        return [];
    }

    protected function getColumnValue(Model $resource, array $column): string
    {
        if (in_array('callback', array_keys($column))) {
            $callback = $column['callback'];

            if (is_callable($callback)) {
                return (string) $callback($resource);
            }

            return '';
        }

        $value = $resource->getAttribute($column['attribute']);

        if ($value === null) {
            return '';
        }

        if ($value instanceof \Carbon\Carbon || $value instanceof \DateTime) {
            return $value->toISOString();
        }

        return (string) $value;
    }
}
