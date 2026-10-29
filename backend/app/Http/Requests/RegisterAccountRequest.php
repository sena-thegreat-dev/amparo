<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterAccountRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => strtolower(trim($this->input('email')))]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^[0-9 ()+\-]{8,30}$/'],
            'location' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:128', 'confirmed'],
            'cpf' => ['bail', 'required', 'string', 'max:18', 'regex:/^[0-9.\-]+$/', function (string $attribute, mixed $value, \Closure $fail): void {
                $cpf = preg_replace('/\D/', '', $value);
                if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
                    $fail('Informe um CPF válido.');

                    return;
                }
                for ($length = 9; $length < 11; $length++) {
                    $sum = 0;
                    for ($i = 0; $i < $length; $i++) {
                        $sum += (int) $cpf[$i] * ($length + 1 - $i);
                    }
                    $remainder = $sum % 11;
                    $digit = $remainder < 2 ? 0 : 11 - $remainder;
                    if ($digit !== (int) $cpf[$length]) {
                        $fail('Informe um CPF válido.');

                        return;
                    }
                }
            }],
            'care_for' => ['required_if:account_type,family', 'nullable', 'in:self,other'],
            'recipient' => ['required_if:care_for,other', 'nullable', 'string', 'max:120'],
            'relationship' => ['nullable', 'string', 'max:100'],
            'services' => ['required_if:account_type,caregiver', 'nullable', 'string', 'max:1000'],
            'account_type' => ['required', 'in:family,caregiver'],
        ];
    }
}
