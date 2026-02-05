<?php

namespace App\JsonApi\V1\Statements;

use App\Models\FinanceAccount;
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
            'date' => ['required', 'date'],
            'transactionAmount' => ['required', 'numeric', 'not_in:0'],
            'title' => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['required', 'string', 'min:2', 'max:1000'],
            'club' => ['required', JsonApiRule::toOne()],
            'financeAccount' => [
                'required',
                JsonApiRule::toOne(),
                function ($attribute, $value, $fail) {
                    $accountId = $value['id'] ?? null;

                    if (
                        !$accountId || !FinanceAccount::where('id', $accountId)
                            ->where('account_type', 'cash_box')
                            ->exists()
                    ) {
                        $fail('The selected finance account must be a cash box account.');
                    }
                },
            ],
        ];
    }
}
