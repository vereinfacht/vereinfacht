<?php

namespace App\Actions\Export;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class AbstractExportResource
{
    public function execute(Collection $resources, string $resourceName, array $options = []): string
    {
        if ($resources->isEmpty()) {
            throw new \Exception('No resources found for export.');
        }

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
        $columns = $this->getColumns();
        $headers = $this->getHeaders($columns);

        fputcsv($csvFile, $headers);

        foreach ($resources as $resource) {
            $row = [];
            foreach ($columns as $key => $column) {
                $row[] = $this->getColumnValue($resource, $key, $column);
            }
            fputcsv($csvFile, $row);
        }
    }

    protected function getHeaders(array $columns): array
    {
        return array_map(function ($column) {
            return $column['header'] ?? ucwords(str_replace(['_', '-'], ' ', $column['attribute'] ?? ''));
        }, $columns);
    }

    protected function getColumnValue(Model $resource, string $key, array $column): string
    {
        if (isset($column['callback']) && is_callable($column['callback'])) {
            return (string) $column['callback']($resource);
        }

        if (isset($column['format'])) {
            $attribute = $column['attribute'] ?? $key;
            $value = $resource->getAttribute($attribute);

            if ($value instanceof \DateTimeInterface) {
                return $value->format($column['format']);
            }

            if (is_string($value)) {
                $date = date_create($value);
                if ($date) {
                    return $date->format($column['format']);
                }
            }

            return (string) $value;
        }

        $attribute = $column['attribute'] ?? $key;
        $value = $resource->getAttribute($attribute);

        if ($value === null) {
            return '';
        }

        return (string) $value;
    }

    abstract protected function getColumns(): array;
}
