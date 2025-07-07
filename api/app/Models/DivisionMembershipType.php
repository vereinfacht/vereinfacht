<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Relations\Pivot;

class DivisionMembershipType extends Pivot
{
    public $incrementing = true;

    protected function casts(): array
    {
        return [
            'monthly_fee' => MoneyCast::class,
        ];
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function club()
    {
        return $this->hasOneThrough(
            Club::class,
            MembershipType::class,
            'id',
            'id',
            'membership_type_id',
            'club_id',
        );
    }
}
