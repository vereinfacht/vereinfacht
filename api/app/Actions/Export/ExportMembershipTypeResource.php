<?php

namespace App\Actions\Export;

use App\Models\MembershipType;
use Illuminate\Database\Eloquent\Builder;

class ExportMembershipTypeResource extends ExportResourceCsv
{
    public function getQuery(array $ids, int $clubId): Builder
    {
        $query = MembershipType::query()->whereIn('id', $ids)
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
            'title' => [
                'header' => 'Title',
                'attribute' => 'title',
            ],
            'description' => [
                'header' => 'Description',
                'attribute' => 'description',
            ],
            'admission_fee' => [
                'header' => 'Admission Fee',
                'attribute' => 'admission_fee',
            ],
            'monthly_fee' => [
                'header' => 'Monthly Fee',
                'attribute' => 'monthly_fee',
            ],
            'minimum_number_of_members' => [
                'header' => 'Minimum Number of Members',
                'attribute' => 'minimum_number_of_members',
            ],
            'maximum_number_of_members' => [
                'header' => 'Maximum Number of Members',
                'attribute' => 'maximum_number_of_members',
            ],
            'minimum_number_of_divisions' => [
                'header' => 'Minimum Number of Divisions',
                'attribute' => 'minimum_number_of_divisions',
            ],
            'maximum_number_of_divisions' => [
                'header' => 'Maximum Number of Divisions',
                'attribute' => 'maximum_number_of_divisions',
            ],
            'minimum_number_of_months' => [
                'header' => 'Minimum Number of Months',
                'attribute' => 'minimum_number_of_months',
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
