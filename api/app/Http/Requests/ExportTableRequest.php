<?php

namespace App\Http\Requests;

use App\Models\Receipt;
use App\Models\Statement;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ExportTableRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $resourceName = strtolower($this->input('resourceName'));

        return match ($resourceName) {
            'receipts' => $this->user()?->can('viewAny', Receipt::class) ?? false,
            'statements' => $this->user()?->can('viewAny', Statement::class) ?? false,
            default => false,
        };
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $resourceName = strtolower($this->input('resourceName'));
        $clubId = getPermissionsTeamId();

        if ($resourceName === 'receipts') {
            return [
                'resourceName' => ['required', 'string', Rule::in(['receipts', 'statements'])],
                'ids' => ['required', 'array', 'min:1'],
                'ids.*' => [Rule::exists('receipts', 'id')->where('club_id', $clubId)],
            ];
        }

        if ($resourceName === 'statements') {
            return [
                'resourceName' => ['required', 'string', Rule::in(['receipts', 'statements'])],
                'ids' => ['required', 'array', 'min:1'],
                'ids.*' => [Rule::exists('statements', 'id')->where('club_id', $clubId)],
            ];
        }

        return [
            'resourceName' => ['required', 'string', Rule::in(['receipts', 'statements'])],
            'ids' => ['required', 'array', 'min:1'],
        ];
    }
}
