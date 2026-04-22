<?php

namespace App\JsonApi\V1\DivisionMembershipTypes;

use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class DivisionMembershipTypeRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'monthlyFee' => ['required', 'numeric', 'min:0'],
            'division' => ['required', JsonApiRule::toOne()],
            'membershipType' => ['required', JsonApiRule::toOne()],
        ];
    }
}
