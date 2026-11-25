<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('year') && $this->input('year') !== null) {
            $this->merge(['year' => (string) $this->input('year')]);
        }
    }

    public function rules(): array
    {
        return [
            'table' => [
                'required',
                'string',
                'in:petc_sales_receipts,income_receipts,petc_insurance_receipts,petc_expense_receipts,red_goose_expense_receipts,knoah_mari_expense_receipts,consumables_receipts,voucher_receipts,inventory_items',
            ],
            'file_name' => ['sometimes', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'establishment' => ['nullable', 'string', 'max:255'],
            'receipt_date' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'string', 'max:100'],
            'sub_category' => ['nullable', 'string', 'max:100'],
            'sub_category_id' => ['nullable', 'string', 'max:100'],
            'entity' => ['nullable', 'string', 'max:100'],
            'year' => ['nullable', 'string', 'max:10'],
            'month' => ['nullable', 'string', 'max:20'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'quantity' => ['nullable', 'numeric', 'min:0'],
            'unit' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:50'],
            'file_format' => ['nullable', 'string', 'max:20'],
            'file_size' => ['nullable', 'string', 'max:50'],
            'file_path' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'preview_data' => ['nullable', 'array'],
        ];
    }
}
