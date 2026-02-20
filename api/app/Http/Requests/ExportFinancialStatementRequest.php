<?php

namespace App\Http\Requests;

use App\Models\Receipt;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ExportFinancialStatementRequest extends FormRequest
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

        return $this->user()?->can('viewAny', Receipt::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receipts' => [
                'required',
                'min:1',
                'array',
                Rule::exists('receipts', 'id')->where(function ($query) {
                    $query->where('club_id', getPermissionsTeamId());
                }),
            ],
        ];
    }
}
