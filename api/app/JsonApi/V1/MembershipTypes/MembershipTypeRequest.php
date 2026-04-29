<?php

namespace App\JsonApi\V1\MembershipTypes;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class MembershipTypeRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        $validationData = $this->validationData();
        $hasMinimumNumberOfDivisions = array_key_exists('minimumNumberOfDivisions', $validationData)
            && $validationData['minimumNumberOfDivisions'] !== null
            && $validationData['minimumNumberOfDivisions'] !== '';
        $hasMaximumNumberOfDivisions = array_key_exists('maximumNumberOfDivisions', $validationData)
            && $validationData['maximumNumberOfDivisions'] !== null
            && $validationData['maximumNumberOfDivisions'] !== '';

        return [
            'titleTranslations' => ['required', 'array'],
            'descriptionTranslations' => ['required', 'array'],
            'monthlyFee' => ['required', 'numeric', 'min:0'],
            'admissionFee' => ['nullable', 'numeric', 'min:0'],
            'minimumNumberOfMonths' => ['required', 'integer', 'min:0', 'max:24'],
            'minimumNumberOfMembers' => ['required', 'integer', 'min:1', 'lte:maximumNumberOfMembers'],
            'maximumNumberOfMembers' => ['required', 'integer', 'gte:minimumNumberOfMembers'],
            'minimumNumberOfDivisions' => [
                'nullable',
                'integer',
                'min:0',
                Rule::when($hasMaximumNumberOfDivisions, ['lte:maximumNumberOfDivisions']),
            ],
            'maximumNumberOfDivisions' => [
                'nullable',
                'integer',
                'min:0',
                Rule::when($hasMinimumNumberOfDivisions, ['gte:minimumNumberOfDivisions']),
            ],
            'club' => ['required', JsonApiRule::toOne()],
        ];
    }
}
