<?php

namespace App\JsonApi\V1\Members;

use App\Enums\GenderOptionEnum;
use App\Enums\MemberStatusEnum;
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
        $isUpdate = $this->model() !== null;

        $membership = $this->model()?->membership
            ?? Membership::find($this->input('data.relationships.membership.data.id'));
        $possibleDivisions = $membership
            ?->membershipType
            ?->divisions()
            ?->pluck('division_id')
            ->toArray();

        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'id' => ['nullable'],
            'firstName' => [$required],
            'lastName' => [$required],
            'gender' => ['nullable', Rule::in(GenderOptionEnum::getAllValues())],
            'address' => [$required],
            'zipCode' => [$required],
            'city' => [$required],
            'country' => [$required],
            'birthday' => [$required],
            'phoneNumber' => [],
            'email' => [$required],
            'status' => ['required', Rule::in(MemberStatusEnum::getAllValues())],
            'club' => ['required', JsonApiRule::toOne()],
            'membership' => ['nullable', JsonApiRule::toOne()],
            'hasConsentedMediaPublication' => ['nullable', JsonApiRule::boolean()],
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
