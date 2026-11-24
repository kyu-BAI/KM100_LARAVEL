<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

abstract class BaseReceipt extends Model
{
    use HasFactory, HasUuids;

    /**
     * Primary key is UUID string.
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'file_name',
        'title',
        'establishment',
        'receipt_date',
        'description',
        'category',
        'category_id',
        'sub_category',
        'sub_category_id',
        'entity',
        'year',
        'month',
        'amount',
        'currency',
        'quantity',
        'unit',
        'status',
        'file_format',
        'file_size',
        'file_path',
        'notes',
        'tags',
        'preview_data',
        'scanned_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'quantity' => 'decimal:2',
        'tags' => 'array',
        'preview_data' => 'array',
        'scanned_at' => 'datetime',
    ];

    /**
     * Relationship to the user that created/uploaded this receipt.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
