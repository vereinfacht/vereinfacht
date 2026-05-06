<?php

namespace App\Actions\Export;

use App\Models\Membership;
use Illuminate\Database\Eloquent\Builder;

class ExportMembershipResource extends ExportResourceCsv
{
    public function getQuery(array $ids, int $clubId): Builder
    {
        $query = Membership::query()
            ->whereIn('id', $ids)
            ->where('club_id', $clubId)
            ->with(['owner', 'membershipType', 'paymentPeriod', 'members']);

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
            'owner_member_id' => [
                'header' => 'Owner Member ID',
                'attribute' => 'owner_member_id',
            ],
            'owner_name' => [
                'header' => 'Owner Name',
                'callback' => function ($membership) {
                    return $membership->owner?->full_name ?? '';
                },
            ],
            'membership_type_id' => [
                'header' => 'Membership Type ID',
                'attribute' => 'membership_type_id',
            ],
            'membership_type' => [
                'header' => 'Membership Type',
                'callback' => function ($membership) {
                    return $membership->membershipType?->title ?? '';
                },
            ],
            'payment_period_id' => [
                'header' => 'Payment Period ID',
                'attribute' => 'payment_period_id',
            ],
            'payment_period' => [
                'header' => 'Payment Period',
                'callback' => function ($membership) {
                    return $membership->paymentPeriod?->title ?? '';
                },
            ],
            'status' => [
                'header' => 'Status',
                'attribute' => 'status',
            ],
            'started_at' => [
                'header' => 'Started At',
                'attribute' => 'started_at',
            ],
            'ended_at' => [
                'header' => 'Ended At',
                'attribute' => 'ended_at',
            ],
            'bank_account_holder' => [
                'header' => 'Bank Account Holder',
                'attribute' => 'bank_account_holder',
            ],
            'bank_iban' => [
                'header' => 'Bank IBAN',
                'attribute' => 'bank_iban',
            ],
            'voluntary_contribution' => [
                'header' => 'Voluntary Contribution',
                'attribute' => 'voluntary_contribution',
            ],
            'monthly_fee' => [
                'header' => 'Monthly Fee',
                'callback' => function ($membership) {
                    return $membership->getMonthlyFee();
                },
            ],
            'members_count' => [
                'header' => 'Members Count',
                'callback' => function ($membership) {
                    return $membership->members?->count() ?? 0;
                },
            ],
            'notes' => [
                'header' => 'Notes',
                'attribute' => 'notes',
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
