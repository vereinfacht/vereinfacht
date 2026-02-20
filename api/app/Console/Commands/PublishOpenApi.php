<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class PublishOpenApi extends Command
{
    protected $signature = 'openapi:publish {version=v1} {--format=json}';

    protected $description = 'Generate the OpenAPI spec and publish it to public/{version}_openapi.{format}';

    public function handle(): int
    {
        $version = (string) $this->argument('version');
        $format = (string) $this->option('format');

        $this->info("Generating OpenAPI spec for {$version} ({$format})...");

        $exitCode = Artisan::call('jsonapi:openapi:generate', [
            'serverKey' => $version,
            'format' => $format,
        ]);

        if ($exitCode !== 0) {
            $this->error('Failed to generate OpenAPI spec.');
            return $exitCode;
        }

        $disk = config('openapi.filesystem_disk');
        if ($disk === null) {
            $disk = config('filesystems.default');
        }

        $sourceRelative = "{$version}_openapi.{$format}";
        $sourcePath = Storage::disk($disk)->path($sourceRelative);
        $destinationPath = public_path($sourceRelative);

        if (! File::exists($sourcePath)) {
            $this->error("Generated spec not found at: {$sourcePath}");
            return 1;
        }

        File::ensureDirectoryExists(dirname($destinationPath));

        File::copy($sourcePath, $destinationPath);

        $this->info("Published OpenAPI spec to: {$destinationPath}");

        return 0;
    }
}
