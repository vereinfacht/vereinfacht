<?php

namespace App\Http\Requests;

use App\Models\Receipt;
use App\Models\Statement;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ExportTableRequest extends FormRequest
{
    protected array $modelMapping = [
        'receipts' => Receipt::class,
        'statements' => Statement::class,
    ];

    protected array $tablesWithClubContext = [
        'receipts',
        'statements',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        if (!$user) {
            return false;
        }

        $resourceName = strtolower($this->input('resourceName'));

        if (!isset($this->modelMapping[$resourceName])) {
            return false;
        }

        $modelClass = $this->modelMapping[$resourceName];

        return $this->user()?->can('viewAny', $modelClass);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'resourceName' => [
                'required',
                'string',
                Rule::in(array_keys($this->modelMapping)),
            ],
            'ids' => [
                'required',
                'min:1',
                'array',
                function ($attribute, $value, $fail) {
                    $resourceName = strtolower($this->input('resourceName'));

                    if (!isset($this->modelMapping[$resourceName])) {
                        $fail('Invalid resource name.');
                        return;
                    }

                    $modelClass = $this->modelMapping[$resourceName];
                    $tableName = (new $modelClass)->getTable();

                    $rule = Rule::exists($tableName, 'id');

                    if (in_array($resourceName, $this->tablesWithClubContext)) {
                        $rule->where(function ($query) {
                            $query->where('club_id', getPermissionsTeamId());
                        });
                    }

                    foreach ($value as $id) {
                        $validator = validator(['id' => $id], ['id' => $rule]);
                        if ($validator->fails()) {
                            $fail("Invalid ID: {$id} for resource {$resourceName}.");
                            break;
                        }
                    }
                },
            ],
            'columns' => [
                'sometimes',
                'array',
            ],
            'columns.*' => [
                'string',
            ],
        ];
    }
}
