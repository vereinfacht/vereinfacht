<?php

namespace App\Actions\Export;

use App\Models\Division;
use Illuminate\Database\Eloquent\Builder;

class ExportDivisionResource extends ExportResourceCsv
{
    public function getQuery(array $ids, int $clubId): Builder
    {
        $query = Division::query()->whereIn('id', $ids)
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
