<?php

namespace App\JsonApi\V1\FinanceContacts;

use App\Enums\GenderOptionEnum;
use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class FinanceContactRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'firstName' => ['required', 'string', 'min:2', 'max:255', 'required_if:contactType,person'],
            'lastName' => ['required', 'string', 'min:2', 'max:255', 'required_if:contactType,person'],
            'gender' => ['nullable', Rule::in(GenderOptionEnum::getAllValues())],
            'companyName' => ['nullable', 'string', 'min:2', 'max:255', 'required_if:contactType,company'],
            'contactType' => ['required', Rule::in(['person', 'company'])],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phoneNumber' => ['nullable', 'string', 'min:2', 'max:255'],
            'address' => ['required', 'string', 'min:2', 'max:255'],
            'zipCode' => ['required', 'string', 'min:2', 'max:255'],
            'city' => ['required', 'string', 'min:2', 'max:255'],
            'country' => ['nullable', 'string', 'min:2', 'max:255'],
            'club' => ['required', JsonApiRule::toOne()],
        ];
    }
}
