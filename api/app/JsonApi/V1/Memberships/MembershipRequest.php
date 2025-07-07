<?php

namespace App\JsonApi\V1\Memberships;

use App\Enums\MembershipStatusEnum;
use App\Models\Club;
use App\Models\MembershipType;
use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class MembershipRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        $membershipTypeId = data_get(request(), 'data.relationships.membershipType.data.id');
        $membershipType = MembershipType::find($membershipTypeId);

        $club = $this->model()?->club
            ?? Club::find(data_get(request(), 'data.relationships.club.data.id'));
        $possiblePaymentPeriods = $club
            ?->paymentPeriods
            ?->pluck('id')
            ->toArray();

        return [
            'bankIban' => ['required', 'regex:/[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}/'],
            'bankAccountHolder' => ['required', 'string', 'min:2', 'max:255'],
            'startedAt' => ['required', 'date'],
            'endedAt' => ['nullable', 'date', 'after:startedAt'],
            'notes' => ['nullable', 'string', 'max:1500'],
            'voluntaryContribution' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', Rule::in(MembershipStatusEnum::getAllValues())],
            'membershipType' => ['required', JsonApiRule::toOne()],
            'club' => ['required', JsonApiRule::toOne()],
            'owner' => ['nullable', JsonApiRule::toOne()],
            'paymentPeriod' => ['nullable', JsonApiRule::toOne()],
            'paymentPeriod.id' => ['sometimes', Rule::in($possiblePaymentPeriods)],
            'members' => [
                'nullable',
                'array',
                'min:'.$membershipType?->minimum_number_of_members,
                'max:'.$membershipType?->maximum_number_of_members,
                JsonApiRule::toMany(),
            ],
        ];
    }
}
