<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = [
        'bank_iban',
        'bank_account_holder',
        'started_at',
        'ended_at',
        'status',
        'voluntary_contribution',
        'membership_type_id',
        'owner_member_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'voluntary_contribution' => MoneyCast::class,
        ];
    }

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'owner_member_id');
    }

    public function membershipType(): BelongsTo
    {
        return $this->belongsTo(MembershipType::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function paymentPeriod(): BelongsTo
    {
        return $this->belongsTo(PaymentPeriod::class);
    }

    public function scopeWithMembersDivisionsFee(Builder $query): void
    {
        $query->addSelect([
            'members_divisions_fee' => function (QueryBuilder $query) {
                $query->select(DB::raw('CAST(SUM(division_membership_type.monthly_fee) AS UNSIGNED INT)'))
                    ->from('members')
                    ->join('division_member', 'members.id', '=', 'division_member.member_id')
                    ->join('division_membership_type', 'division_member.division_id', '=', 'division_membership_type.division_id')
                    ->whereColumn('division_membership_type.membership_type_id', 'memberships.membership_type_id')
                    ->whereColumn('members.membership_id', 'memberships.id');
            },
        ]);
    }

    public function getMonthlyFee(): mixed
    {
        $membershipTypeFee = $this->membershipType?->monthly_fee ?? 0;

        $selectedDivisionsFee = (static::where('id', $this->id)
            ->withMembersDivisionsFee()
            ->first()
            ->members_divisions_fee ?? 0) / 100;

        $voluntaryContribution = $this->club?->allow_voluntary_contribution
            ? $this->voluntary_contribution
            : 0;

        $result = $membershipTypeFee + $selectedDivisionsFee + $voluntaryContribution;

        return $result;
    }

    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->owner?->full_name} – {$this->id}",
        );
    }
}
