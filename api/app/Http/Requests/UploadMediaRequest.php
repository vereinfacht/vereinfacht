<?php

namespace App\Http\Requests;

use App\Models\Media;
use Illuminate\Foundation\Http\FormRequest;

class UploadMediaRequest extends FormRequest
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

        return $this->user()?->can('create', Media::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'collectionName' => ['required', 'string', 'in:receipts'],
            'clubId' => ['required', 'integer', 'exists:clubs,id'],
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf'],
        ];
    }
}
