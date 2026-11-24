<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'file_name' => $this->file_name,
            'title' => $this->title ?: $this->file_name,
            'establishment' => $this->establishment ?: '',
            'receipt_date' => $this->receipt_date ?: '',
            'description' => $this->description ?: '',
            'category' => $this->category ?: '',
            'category_id' => $this->category_id ?: '',
            'sub_category' => $this->sub_category ?: '',
            'sub_category_id' => $this->sub_category_id ?: '',
            'entity' => $this->entity ?: '',
            'year' => $this->year ?: '',
            'month' => $this->month ?: '',
            'amount' => (float) $this->amount,
            'currency' => $this->currency ?: 'PHP',
            'quantity' => (float) $this->quantity,
            'unit' => $this->unit ?: 'receipt',
            'status' => $this->status ?: 'Active',
            'file_format' => $this->file_format ?: 'JPG',
            'file_size' => $this->file_size ?: '0 KB',
            'file_path' => $this->file_path ?: '',
            'notes' => $this->notes ?: '',
            'tags' => is_array($this->tags) ? $this->tags : [],
            'preview_data' => $this->preview_data ?: null,
            'scanned_at' => $this->scanned_at?->toISOString() ?: null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
