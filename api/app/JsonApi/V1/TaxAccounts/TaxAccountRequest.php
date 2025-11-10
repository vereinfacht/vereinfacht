<?php

namespace App\JsonApi\V1\TaxAccounts;

use LaravelJsonApi\Validation\Rule as JsonApiRule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class TaxAccountRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'accountNumber' => ['string', 'max:255'],
            'description' => ['string', 'max:1000'],
            'club' => ['required', JsonApiRule::toOne()],
        ];
    }
}
