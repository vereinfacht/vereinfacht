<?php

namespace App\Actions\Export;

use App\Models\Receipt;
use Illuminate\Database\Eloquent\Builder;

class ExportReceiptResource extends ExportResourceCsv
{
    public function getQuery(array $ids, int $clubId): Builder
    {
        $query = Receipt::whereIn('id', $ids)
            ->where('club_id', $clubId)
            ->with(['financeContact', 'taxAccount']);

        if (!empty($ids)) {
            $idsString = implode(',', array_map('intval', $ids));
            $query->orderByRaw("FIELD(id, $idsString)");
        }

        return $query;
    }

    protected function getColumns(): array
    {
        return [
            'id' => [
                'header' => 'ID',
                'attribute' => 'id',
            ],
            'receipt_type' => [
                'header' => 'Receipt Type',
                'attribute' => 'receipt_type',
            ],
            'reference_number' => [
                'header' => 'Reference Number',
                'attribute' => 'reference_number',
            ],
            'booking_date' => [
                'header' => 'Booking Date',
                'attribute' => 'booking_date',
            ],
            'amount' => [
                'header' => 'Amount',
                'attribute' => 'amount',
            ],
            'finance_contact_id' => [
                'header' => 'Finance Contact ID',
                'attribute' => 'finance_contact_id',
            ],
            'finance_contact_name' => [
                'header' => 'Finance Contact Name',
                'callback' => function ($receipt) {
                    $contact = $receipt->financeContact;
                    if ($contact) {
                        return trim($contact->first_name . ' ' . $contact->last_name);
                    }
                    return '';
                },
            ],
            'tax_account_id' => [
                'header' => 'Tax Account ID',
                'attribute' => 'tax_account_id',
            ],
            'tax_account_details' => [
                'header' => 'Tax Account Details',
                'callback' => function ($receipt) {
                    $account = $receipt->taxAccount;
                    if ($account) {
                        return $account->account_number . ' - ' . $account->description;
                    }
                    return '';
                },
            ],
            'status' => [
                'header' => 'Status',
                'attribute' => 'status',
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
