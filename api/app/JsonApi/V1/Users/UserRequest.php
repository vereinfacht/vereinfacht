<?php

namespace App\JsonApi\V1\Users;

use LaravelJsonApi\Validation\Rule as JsonApiRule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class UserRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
            'preferredLocale' => ['required', 'string', 'max:2', 'in:en,de'],
            'club' => ['required', JsonApiRule::toMany()],
            'permissions' => [JsonApiRule::toMany()],
        ];
    }
}
