<?php

namespace App\JsonApi\V1\Users;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Validation\Rule as JsonApiRule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class UserRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        $userId = $this->model()?->id;

        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId)
            ],
            'password' => [
                $this->isCreating() ? 'required' : 'nullable',
                'string',
                'min:8',
                'max:255'
            ],
            'preferredLocale' => ['required', 'string', 'max:2', 'in:en,de'],
            'club' => [$this->isCreating() ? 'required' : 'nullable', JsonApiRule::toOne()],
            'roles' => ['required', JsonApiRule::toMany()],
        ];
    }
}
