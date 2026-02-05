<?php

namespace App\Http\Requests;

use App\Models\Statement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ImportStatementsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        if (!$user) {
            return false;
        }

        return $this->user()?->can('create', Statement::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'financeAccountId' => ['required', 'string', 'exists:finance_accounts,id'],
            'file' => ['required', 'file', 'mimes:txt,sta,mta,mt940,xml'],
        ];
    }
}
