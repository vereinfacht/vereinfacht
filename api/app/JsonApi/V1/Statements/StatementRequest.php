<?php

namespace App\JsonApi\V1\Statements;

use LaravelJsonApi\Validation\Rule as JsonApiRule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class StatementRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'identifier' => ['string', 'max:255'],
            'date' => ['date'],
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
            'transactions' => [JsonApiRule::toMany()],
        ];
    }
}
