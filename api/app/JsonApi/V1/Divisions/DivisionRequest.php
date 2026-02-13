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
            'titleTranslations.de' => ['nullable', 'string', 'min:2'],
            'titleTranslations.en' => ['nullable', 'string', 'min:2'],
            'titleTranslations' => [
                'required',
                'array',
                new TranslationTitleRule(),
            ],
            'club' => ['nullable', JsonApiRule::toOne()],
        ];
    }
}
