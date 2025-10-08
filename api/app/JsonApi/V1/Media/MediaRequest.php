<?php

namespace App\JsonApi\V1\Media;

use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class MediaRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            // 'fileName' => ['required', 'string', 'min:1', 'max:255'],
        ];
    }
}
