<?php

namespace App\JsonApi\V1\DivisionMembershipTypes;

use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class DivisionMembershipTypeRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'id' => ['required'],
        ];
    }
}
