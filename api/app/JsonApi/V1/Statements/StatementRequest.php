<?php

namespace App\JsonApi\V1\Statements;

use LaravelJsonApi\Validation\Rule as JsonApiRule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class StatementRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [];
    }
}
