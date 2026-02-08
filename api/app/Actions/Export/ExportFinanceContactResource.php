<?php

namespace App\Actions\Export;

use App\Models\FinanceContact;
use Illuminate\Database\Eloquent\Builder;

class ExportFinanceContactResource extends ExportResourceCsv
{
    public function getQuery(array $ids, int $clubId): Builder
    {
        $query = FinanceContact::query()->whereIn('id', $ids)
            ->where('club_id', $clubId);

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
            'contact_type' => [
                'header' => 'Type',
                'attribute' => 'contact_type',
            ],
            'first_name' => [
                'header' => 'First Name',
                'attribute' => 'first_name',
            ],
            'last_name' => [
                'header' => 'Last Name',
                'attribute' => 'last_name',
            ],
            'company_name' => [
                'header' => 'Company Name',
                'attribute' => 'company_name',
            ],
            'gender' => [
                'header' => 'Gender',
                'attribute' => 'gender',
            ],
            'address' => [
                'header' => 'Address',
                'attribute' => 'address',
            ],
            'zip_code' => [
                'header' => 'Zip Code',
                'attribute' => 'zip_code',
            ],
            'city' => [
                'header' => 'City',
                'attribute' => 'city',
            ],
            'country' => [
                'header' => 'Country',
                'attribute' => 'country',
            ],
            'phone_number' => [
                'header' => 'Phone Number',
                'attribute' => 'phone_number',
            ],
            'email' => [
                'header' => 'Email',
                'attribute' => 'email',
            ]
        ];
    }
}
