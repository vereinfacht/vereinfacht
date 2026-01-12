<?php

namespace App\Actions\Export;

class ExportStatementResource extends AbstractExportResource
{
    protected function getColumns(): array
    {
        return [
            'id' => [
                'header' => 'ID',
                'attribute' => 'id',
            ],
            'identifier' => [
                'header' => 'Statement Identifier',
                'attribute' => 'identifier',
            ],
            'statement_type' => [
                'header' => 'Statement Type',
                'attribute' => 'statement_type',
            ],
            'transactions_count' => [
                'header' => 'Number of Transactions',
                'callback' => function ($statement) {
                    return $statement->transactions->count();
                },
            ],
            'date' => [
                'header' => 'Statement Date',
                'attribute' => 'date',
                'format' => 'Y-m-d',
            ],
            'amount' => [
                'header' => 'Total Amount',
                'callback' => function ($statement) {
                    return $statement->getAmount();
                },
            ],
            'status' => [
                'header' => 'Status',
                'callback' => function ($statement) {
                    return $statement->status?->value ?? '';
                },
            ],
            'finance_account_id' => [
                'header' => 'Finance Account ID',
                'attribute' => 'finance_account_id',
            ],
            'finance_account_title' => [
                'header' => 'Finance Account Title',
                'callback' => function ($statement) {
                    return $statement->financeAccount?->title ?? '';
                },
            ],
            'finance_account_iban' => [
                'header' => 'Finance Account IBAN',
                'callback' => function ($statement) {
                    return $statement->financeAccount?->iban ?? '';
                },
            ],
            'created_at' => [
                'header' => 'Created At',
                'attribute' => 'created_at',
            ],
            'updated_at' => [
                'header' => 'Updated At',
                'attribute' => 'updated_at',
            ],
        ];
    }
}
