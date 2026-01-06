<?php

namespace App\Actions\FinancialStatement;

use App\Classes\FinancialStatement;

class ExportCsv
{
    public function execute(FinancialStatement $financialStatement): string
    {
        app()->setLocale('de'); // @todo: use current user's local

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

        $this->writeCsv($csvFile, $financialStatement);

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

    protected function writeCsv($csvFile, FinancialStatement $financialStatement): void
    {
        $headers = [
            __('financial-statement.account_number'),
            __('financial-statement.type'),
            __('financial-statement.description'),
            __('financial-statement.amount')
        ];
        fputcsv($csvFile, $headers);

        $calculation = $financialStatement->getIncomeExpensesCalculation();

        // income rows
        foreach ($calculation->income as $row) {
            $this->putDataInCsv($csvFile, $row);
        }

        // subtotal income row
        fputcsv($csvFile, [
            '',
            __('receipt.receipt_type.income'),
            __('financial-statement.subtotal'),
            $calculation->totalIncome,
        ]);

        // expenses rows
        foreach ($calculation->expenses as $row) {
            $this->putDataInCsv($csvFile, $row);
        }

        // subtotal expenses row
        fputcsv($csvFile, [
            '',
            __('receipt.receipt_type.expense'),
            __('financial-statement.subtotal'),
            $calculation->totalExpenses,
        ]);

        // total row
        fputcsv($csvFile, [
            '',
            '',
            __('financial-statement.total'),
            $calculation->totalIncome - $calculation->totalExpenses,
        ]);

        fclose($csvFile);
    }

    protected function putDataInCsv($csvFile, array $row): void
    {
        fputcsv($csvFile, [
            $row['account_number'],
            __('receipt.receipt_type.' . $row['type']),
            $row['description'],
            $row['amount'],
        ]);
    }
}
