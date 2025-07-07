<?php

namespace App\JsonApi\V1\MembershipTypes;

use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class MembershipTypeRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'titleTranslations' => ['required', 'array'],
            'descriptionTranslations' => ['required', 'array'],
            'monthlyFee' => ['required', 'numeric', 'min:0'],
            'admissionFee' => ['nullable', 'numeric', 'min:0'],
            'minimumNumberOfMonths' => ['required', 'integer', 'min:0', 'max:24'],
            'minimumNumberOfMembers' => ['required', 'integer', 'min:1', 'lte:maximumNumberOfMembers'],
            'maximumNumberOfMembers' => ['required', 'integer', 'gte:minimumNumberOfMembers'],
        ];
    }
}
