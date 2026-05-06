<?php

namespace App\Actions\Export;

use App\Models\Member;
use Illuminate\Database\Eloquent\Builder;

class ExportMemberResource extends ExportResourceCsv
{
    public function getQuery(array $ids, int $clubId): Builder
    {
        $query = Member::query()
            ->whereIn('id', $ids)
            ->where('club_id', $clubId)
            ->with(['membership.membershipType']);

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
            'first_name' => [
                'header' => 'First Name',
                'attribute' => 'first_name',
            ],
            'last_name' => [
                'header' => 'Last Name',
                'attribute' => 'last_name',
            ],
            'membership_id' => [
                'header' => 'Membership ID',
                'attribute' => 'membership_id',
            ],
            'membership_type' => [
                'header' => 'Membership Type',
                'callback' => function ($member) {
                    return $member->membership?->membershipType?->title ?? '';
                },
            ],
            'status' => [
                'header' => 'Status',
                'attribute' => 'status',
            ],
            'gender' => [
                'header' => 'Gender',
                'attribute' => 'gender',
            ],
            'birthday' => [
                'header' => 'Birthday',
                'attribute' => 'birthday',
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
            'email' => [
                'header' => 'Email',
                'attribute' => 'email',
            ],
            'phone_number' => [
                'header' => 'Phone Number',
                'attribute' => 'phone_number',
            ],
            'preferred_locale' => [
                'header' => 'Preferred Locale',
                'attribute' => 'preferred_locale',
            ],
            'consented_media_publication_at' => [
                'header' => 'Media Consent At',
                'attribute' => 'consented_media_publication_at',
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
