<?php

namespace App\Http\Controllers;

use App\Actions\FinancialStatement\ExportCsv;
use App\Classes\FinancialStatement;
use App\Http\Requests\ExportFinancialStatementRequest;
use App\Models\Receipt;
use ZipArchive;

class FinancialStatementController extends Controller
{
    public function export(ExportFinancialStatementRequest $request)
    {
        $receipts = Receipt::whereIn('id', $request->input('receipts'))->get();

        $financialStatement = new FinancialStatement($receipts);

        try {
            $export = new ExportCsv();

            $statementFilePath = $export->execute($financialStatement);

            // this is currently not implemented in the frontend
            if (!$request->input('includeMedia')) {
                return response()->download($statementFilePath)->deleteFileAfterSend(true);
            }

            $zipPath = $this->getZipPath($receipts, $export->getFileName(), $statementFilePath);

            return response()->download($zipPath)->deleteFileAfterSend(false);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => $th->getMessage(),
            ], 500, ['Content-Type' => 'application/vnd.api+json']);
        }
    }

    protected function getZipPath($receipts, string $fileName, string $statementFilePath): string
    {
        $tempDir = storage_path('app/tmp');

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $zipPath = $tempDir . '/' . $fileName . '.zip';
        $zip = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        foreach ($receipts as $receipt) {
            foreach ($receipt->getMedia('receipts') as $media) {
                $filePath = $media->getPath();

                if (file_exists($filePath)) {
                    $zip->addFile(
                        $filePath,
                        $media->file_name
                    );
                }
            }
        }

        $zip->addFile($statementFilePath, basename($statementFilePath));
        $zip->close();

        unlink($statementFilePath);

        return $zipPath;
    }
}
