<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'table' => [
                'required',
                'string',
                'in:petc_sales_receipts,petc_insurance_receipts,petc_expense_receipts,red_goose_expense_receipts,knoah_mari_expense_receipts,consumables_receipts,voucher_receipts,inventory_items',
            ],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'string'],
        ];
    }
}
