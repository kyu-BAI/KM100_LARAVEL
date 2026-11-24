<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $employeeId = $this->route('id');

        return [
            'name' => ['sometimes', 'string', 'max:191'],
            'email' => ['sometimes', 'string', 'email', 'max:191', 'unique:users,email,' . $employeeId],
            'password' => ['nullable', 'string', 'min:6'],
            'branch' => ['sometimes', 'string', 'in:PETC,Red Goose,Knoah Mari,All'],
            'department' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
