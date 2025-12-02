<?php

namespace App\Actions\FinancialStatement;

use App\Classes\FinancialStatement;

class ExportCsv
{
    public function execute(FinancialStatement $financialStatement): string
    {
        return $this->asIncomeExpensesCalculation($financialStatement);
    }

    protected function asIncomeExpensesCalculation(FinancialStatement $financialStatement): string
    {
        $tempDir = storage_path('app/tmp');

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $csvFileName = $this->getFileName() . '.csv';
        $csvFile = fopen($tempDir . '/' . $csvFileName, 'w');
        $headers = ['Steuerkontonummer', 'Bezeichnung', 'Betrag'];
        fputcsv($csvFile, $headers);

        $calculation = $financialStatement->getIncomeExpensesCalculation();

        foreach ($calculation->income as $row) {
            $this->putDataInCsv($csvFile, $row);
        }

        foreach ($calculation->expenses as $row) {
            $this->putDataInCsv($csvFile, $row);
        }

        fclose($csvFile);

        return $tempDir . '/' . $csvFileName;
    }

    public function getFileName(): string
    {
        $clubId = getPermissionsTeamId();

        if (!$clubId) {
            throw new \Exception('Unable to determine club context for financial statement export.');
        }

        return $clubId . '-einnahmen-ausgaben-rechnung-' . date('Y-m-d');
    }

    protected function putDataInCsv($csvFile, array $row): void
    {
        fputcsv($csvFile, [
            $row['account_number'],
            $row['description'],
            $row['amount'],
        ]);
    }
}
