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
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'not_in:0'],
            'bookedAt' => ['required', 'date'],
            'club' => ['required', JsonApiRule::toOne()],
            'financeAccount' => [
                'required',
                JsonApiRule::toOne(),
                function ($attribute, $value, $fail) {
                    $accountId = $value['id'] ?? null;

                    if (
                        !$accountId || !\App\Models\FinanceAccount::where('id', $accountId)
                            ->where('account_type', 'cash_box')
                            ->exists()
                    ) {
                        $fail('The selected finance account must be a cash box account.');
                    }
                },
            ],
            'receipts' => [JsonApiRule::toMany()],
        ];
    }
}
