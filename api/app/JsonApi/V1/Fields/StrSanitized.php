<?php

namespace App\JsonApi\V1\Fields;

use App\Classes\Sanitizer;
use Closure;
use LaravelJsonApi\Eloquent\Fields\Str;

class StrSanitized extends Str
{
    protected Closure $sanitizeSerializer;

    /**
     * Create a string attribute.
     *
     * @return Str
     */
    public static function make(string $fieldName, ?string $column = null): self
    {
        $field = new self($fieldName, $column);

        $field->sanitizeSerializer = function ($value) {
            if (blank($value)) {
                return $value;
            }

            return (new Sanitizer)->get($value);
        };

        $field->serializeUsing($field->sanitizeSerializer);

        return $field;
    }

    /**
     * @return $this
     */
    public function serializeUsing(Closure $serializer): self
    {
        parent::serializeUsing($this->sanitizeSerializer);

        return $this;
    }
}
