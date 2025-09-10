<?php

namespace App\JsonApi\V1\Receipts;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Validation\Rule as JsonApiRule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class ReceiptRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'referenceNumber' => ['nullable', 'string', 'max:255'],
            'receiptType' => ['required', Rule::in(['expense', 'income'])],
            'documentDate' => ['required', 'date'],
            'amount' => ['required', 'numeric'],
            'club' => ['required', JsonApiRule::toOne()],
            'financeContact' => ['required', JsonApiRule::toOne()],
            'transactions' => [JsonApiRule::toMany()],
        ];
    }
}
