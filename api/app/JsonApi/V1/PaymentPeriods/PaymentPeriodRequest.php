<?php

namespace App\JsonApi\V1\PaymentPeriods;

use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;

class PaymentPeriodRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'rrule' => ['required', 'string'],
        ];
    }
}
