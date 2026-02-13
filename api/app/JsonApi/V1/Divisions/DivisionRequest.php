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
            'titleTranslations.de' => ['nullable', 'string', 'min:2'],
            'titleTranslations.en' => ['nullable', 'string', 'min:2'],
            'titleTranslations' => [
                'required',
                'array',
                function ($attribute, $value, $fail) {
                    if (
                        empty($value['de']) &&
                        empty($value['en'])
                    ) {
                        $fail('Mindestens eine Sprache muss ausgefüllt sein.');
                    }
                },
            ],
            'club' => ['nullable', JsonApiRule::toOne()],
        ];
    }
}
