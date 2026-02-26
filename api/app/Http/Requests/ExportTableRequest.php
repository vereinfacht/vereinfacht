<?php

namespace App\Http\Requests;

use App\Models\Division;
use App\Models\FinanceContact;
use App\Models\Receipt;
use App\Models\Statement;
use App\Models\MembershipType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExportTableRequest extends FormRequest
{
    private const RESOURCES = [
        'receipts' => Receipt::class,
        'statements' => Statement::class,
        'finance_contacts' => FinanceContact::class,
        'divisions' => Division::class,
        'membership-types' => MembershipType::class,
    ];

    public function authorize(): bool
    {
        $model = self::RESOURCES[$this->input('resourceName')] ?? null;

        return $model && $this->user()->can('viewAny', $model);
    }

    public function rules(): array
    {
        $model = self::RESOURCES[$this->input('resourceName')] ?? null;
        $tableName = $model ? (new $model)->getTable() : $this->input('resourceName');

        return [
            'resourceName' => ['required', Rule::in(array_keys(self::RESOURCES))],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', Rule::exists($tableName, 'id')->where('club_id', getPermissionsTeamId())],
        ];
    }
}
