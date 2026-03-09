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
        $nameRules = ['string', 'min:2', 'max:255'];

        $rules = [
            'firstName' => $nameRules,
            'lastName' => $nameRules,
            'gender' => ['nullable', Rule::in(GenderOptionEnum::getAllValues())],
            'companyName' => ['nullable', 'string', 'min:2', 'max:255'],
            'contactType' => ['required', Rule::in(['person', 'company'])],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phoneNumber' => ['nullable', 'string', 'min:2', 'max:255'],
            'address' => $nameRules,
            'zipCode' => $nameRules,
            'city' => $nameRules,
            'country' => ['nullable', 'string', 'min:2', 'max:255'],
            'isExternal' => ['nullable', 'boolean'],
            'club' => ['required', JsonApiRule::toOne()],
        ];

        $isExternal = filter_var($this->validationData()['isExternal'] ?? false, FILTER_VALIDATE_BOOLEAN);

        if (!$isExternal) {
            $rules['firstName'] = array_merge($rules['firstName'], ['required_if:contactType,person']);
            $rules['lastName'] = array_merge($rules['lastName'], ['required_if:contactType,person']);
            $rules['companyName'] = array_merge($rules['companyName'], ['required_if:contactType,company']);
            $rules['address'] = array_merge($rules['address'], ['required']);
            $rules['zipCode'] = array_merge($rules['zipCode'], ['required']);
            $rules['city'] = array_merge($rules['city'], ['required']);
        }

        return $rules;
    }
}
