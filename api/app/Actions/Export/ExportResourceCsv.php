<?php

namespace App\Actions\Export;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ExportResourceCsv
{
    public function execute(Collection $resources, string $resourceName, array $columns = []): string
    {
        if ($resources->isEmpty()) {
            throw new \Exception('No resources found for export.');
        }

        // @todo: use current user's locale
        app()->setLocale('de');

        return $this->generateCsv($resources, $resourceName, $columns);
    }

    protected function generateCsv(Collection $resources, string $resourceName, array $columns): string
    {
        $tempDir = storage_path('app/tmp');

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $csvFileName = $this->getFileName($resourceName) . '.csv';
        $csvFile = fopen($tempDir . '/' . $csvFileName, 'w');

        $this->writeCsvData($csvFile, $resources, $columns);

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

    protected function writeCsvData($csvFile, Collection $resources, array $columns): void
    {
        $firstResource = $resources->first();

        $columnsToExport = $this->getColumnsToExport($firstResource, $columns);

        $headers = $this->getHeaders($columnsToExport);
        fputcsv($csvFile, $headers);

        foreach ($resources as $resource) {
            $row = [];
            foreach ($columnsToExport as $column) {
                $row[] = $this->getColumnValue($resource, $column);
            }
            fputcsv($csvFile, $row);
        }
    }

    protected function getColumnsToExport(Model $resource, array $columns): array
    {
        if (!empty($columns)) {
            return $columns;
        }

        $fillable = $resource->getFillable();

        if (empty($fillable)) {
            return array_keys($resource->getAttributes());
        }

        return $fillable;
    }

    protected function getHeaders(array $columns): array
    {
        return array_map(function ($column) {
            $translationKey = $this->getTranslationKey($column);
            $translated = __($translationKey);

            if ($translated === $translationKey) {
                return ucwords(str_replace(['_', '-'], ' ', $column));
            }

            return $translated;
        }, $columns);
    }

    protected function getTranslationKey(string $column): string
    {
        $patterns = [
            'fields.' . $column,
            'attributes.' . $column,
            $column
        ];

        foreach ($patterns as $pattern) {
            if (__($pattern) !== $pattern) {
                return $pattern;
            }
        }

        return $column;
    }

    protected function getColumnValue(Model $resource, string $column): string
    {
        $value = $resource->getAttribute($column);

        if ($value === null) {
            return '';
        }

        if ($value instanceof \Carbon\Carbon || $value instanceof \DateTime) {
            return $value->format('Y-m-d');
        }

        return (string) $value;
    }
}
