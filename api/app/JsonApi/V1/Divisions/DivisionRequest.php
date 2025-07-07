<?php

namespace App\JsonApi\V1\Divisions;

use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class DivisionRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'titleTranslations' => ['required', 'array'],
            'club' => ['nullable', JsonApiRule::toOne()],
            'members' => ['nullable', JsonApiRule::toMany()],
        ];
    }
}
