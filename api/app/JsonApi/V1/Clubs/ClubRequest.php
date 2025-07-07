<?php

namespace App\JsonApi\V1\Clubs;

use App\Enums\MembershipStartCycleTypeEnum;
use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class ClubRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:2', 'max:255'],
            'extendedTitle' => ['required', 'string', 'min:2', 'max:255'],
            'address' => ['required', 'string', 'min:2', 'max:255'],
            'zipCode' => ['required', 'string', 'min:2', 'max:255'],
            'city' => ['required', 'string', 'min:2', 'max:255'],
            'country' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email'],
            'websiteUrl' => ['required', 'url', 'max:1000'],
            'logoUrl' => ['required', 'url', 'max:1000'],
            'privacyStatementUrl' => ['required', 'url', 'max:1000'],
            'contributionStatementUrl' => ['required', 'url', 'max:1000'],
            'constitutionUrl' => ['required', 'url', 'max:1000'],
            'membershipStartCycleType' => ['required', Rule::in(MembershipStartCycleTypeEnum::getAllValues())],
            'allowVoluntaryContribution' => ['required', JsonApiRule::boolean()],
            'hasConsentedMediaPublicationIsRequired' => ['required', JsonApiRule::boolean()],
            'hasConsentedMediaPublicationDefaultValue' => ['required', JsonApiRule::boolean()],
            'divisions' => ['nullable', JsonApiRule::toMany()],
            'paymentPeriods' => ['nullable', JsonApiRule::toMany()],
            'membershipTypes' => ['nullable', JsonApiRule::toMany()],
            'financeAccounts' => ['nullable', JsonApiRule::toMany()],
        ];
    }
}
