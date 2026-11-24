<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

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
        'name',
        'email',
        'password',
        'role',
        'branch',
        'department',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Helper to check if user has admin privileges.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Helper to check if user has employee privileges.
     */
    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }

    /**
     * Relationship: Master inventory records created by this user.
     */
    public function inventoryItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InventoryItem::class, 'user_id');
    }

    /**
     * Relationship: PETC sales receipts created by this user.
     */
    public function petcSalesReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PetcSalesReceipt::class, 'user_id');
    }

    /**
     * Relationship: PETC insurance receipts created by this user.
     */
    public function petcInsuranceReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PetcInsuranceReceipt::class, 'user_id');
    }

    /**
     * Relationship: PETC expense receipts created by this user.
     */
    public function petcExpenseReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PetcExpenseReceipt::class, 'user_id');
    }

    /**
     * Relationship: Red Goose expense receipts created by this user.
     */
    public function redGooseExpenseReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RedGooseExpenseReceipt::class, 'user_id');
    }

    /**
     * Relationship: Knoah Mari expense receipts created by this user.
     */
    public function knoahMariExpenseReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(KnoahMariExpenseReceipt::class, 'user_id');
    }

    /**
     * Relationship: Consumables receipts created by this user.
     */
    public function consumablesReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ConsumablesReceipt::class, 'user_id');
    }

    /**
     * Relationship: Voucher receipts created by this user.
     */
    public function voucherReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(VoucherReceipt::class, 'user_id');
    }
}
