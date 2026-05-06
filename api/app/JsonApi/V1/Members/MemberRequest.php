<?php

namespace App\JsonApi\V1\Members;

use App\Enums\GenderOptionEnum;
use App\Enums\MemberStatusEnum;
use App\Models\Club;
use App\Models\Membership;
use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class MemberRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        $clubId = $this->input('data.relationships.club.data.id')
            ?? $this->model()?->club?->id;
        $club = $clubId ? Club::find($clubId) : null;

        $membershipId = $this->input('data.relationships.membership.data.id')
            ?? $this->model()?->membership?->id;
        $membership = $membershipId ? Membership::find($membershipId) : null;
        $possibleDivisions = $membership
            ?->membershipType
            ?->divisions()
            ?->pluck('divisions.id')
            ->toArray() ?? [];

        $consentRule = $club?->has_consented_media_publication_is_required
            ? 'required'
            : 'nullable';

        return [
            'id' => ['nullable'],
            'firstName' => ['required'],
            'lastName' => ['required'],
            'gender' => ['nullable', Rule::in(GenderOptionEnum::getAllValues())],
            'address' => ['required'],
            'zipCode' => ['required'],
            'city' => ['required'],
            'country' => ['required'],
            'birthday' => ['required'],
            'phoneNumber' => [],
            'email' => ['required'],
            'status' => ['nullable', Rule::in(MemberStatusEnum::getAllValues())],
            'club' => ['required', JsonApiRule::toOne()],
            'membership' => ['nullable', JsonApiRule::toOne()],
            'hasConsentedMediaPublication' => [$consentRule, JsonApiRule::boolean()],
            'divisions' => [
                'nullable',
                JsonApiRule::toMany(),
            ],
            'divisions.*.id' => [
                Rule::in($possibleDivisions),
            ],
        ];
    }
}
