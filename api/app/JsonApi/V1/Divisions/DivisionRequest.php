<?php

namespace App\JsonApi\V1\Divisions;

use App\Rules\TranslationTitleRule;
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
            ...TranslationTitleRule::getLocaleRules(),
            'titleTranslations' => [
                'required',
                'array',
                new TranslationTitleRule(),
            ],
            'club' => ['required', JsonApiRule::toOne()],
        ];
    }
}
