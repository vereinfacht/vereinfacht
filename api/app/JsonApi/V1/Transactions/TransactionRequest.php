<?php

namespace App\JsonApi\V1\Transactions;

use LaravelJsonApi\Validation\Rule as JsonApiRule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class TransactionRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'not_in:0'],
            'bookedAt' => ['nullable', 'date'],
            'club' => ['required', JsonApiRule::toOne()],
            'financeAccount' => ['required', JsonApiRule::toOne()],
            'receipts' => [JsonApiRule::toMany()],
        ];
    }
}
