<?php

namespace App\JsonApi\V1\FinanceAccounts;

use App\Enums\FinanceAccountTypeEnum;
use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class FinanceAccountRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'accountType' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::in(FinanceAccountTypeEnum::getAllValues()),
            ],
            'iban' => ['nullable', 'required_if:accountType,' . FinanceAccountTypeEnum::BANK_ACCOUNT->value, 'regex:/[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}/'],
            'initialBalance' => [
                'nullable',
                'required_if:accountType,' . FinanceAccountTypeEnum::CASH_BOX->value,
                'numeric',
            ],
            'deletedAt' => [
                'nullable',
                JsonApiRule::dateTime()
            ],
        ];
    }

}
