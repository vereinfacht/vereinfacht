<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ExportableResource
{
    /**
     * Execute the export process for the given resources
     */
    public function execute(Collection $resources, string $resourceName, array $options = []): string;

    /**
     * Get the filename for the export
     */
    public function getFileName(string $resourceName): string;
}
