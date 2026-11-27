<?php

namespace App\Services;

use App\Models\BaseReceipt;
use App\Models\ConsumablesReceipt;
use App\Models\IncomeReceipt;
use App\Models\InventoryItem;
use App\Models\KnoahMariExpenseReceipt;
use App\Models\KnoahMariIncomeReceipt;
use App\Models\PetcExpenseReceipt;
use App\Models\PetcIncomeReceipt;
use App\Models\PetcInsuranceReceipt;
use App\Models\PetcSalesReceipt;
use App\Models\RedGooseExpenseReceipt;
use App\Models\RedGooseIncomeReceipt;
use App\Models\User;
use App\Models\VoucherReceipt;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ReceiptService
{
    protected FileStorageService $fileStorageService;

    public function __construct(FileStorageService $fileStorageService)
    {
        $this->fileStorageService = $fileStorageService;
    }

    /**
     * Map table name to Eloquent model class.
     */
    public function resolveModelClass(string $tableName): string
    {
        return match ($tableName) {
            'petc_sales_receipts' => PetcSalesReceipt::class,
            'income_receipts' => IncomeReceipt::class,
            'petc_income_receipts' => PetcIncomeReceipt::class,
            'red_goose_income_receipts' => RedGooseIncomeReceipt::class,
            'knoah_mari_income_receipts' => KnoahMariIncomeReceipt::class,
            'petc_insurance_receipts' => PetcInsuranceReceipt::class,
            'petc_expense_receipts' => PetcExpenseReceipt::class,
            'red_goose_expense_receipts' => RedGooseExpenseReceipt::class,
            'knoah_mari_expense_receipts' => KnoahMariExpenseReceipt::class,
            'consumables_receipts' => ConsumablesReceipt::class,
            'voucher_receipts' => VoucherReceipt::class,
            'inventory_items' => InventoryItem::class,
            default => throw new InvalidArgumentException("Unknown or unsupported table: [{$tableName}]."),
        };
    }

    /**
     * Instantiate model instance from table name.
     */
    public function resolveModel(string $tableName): BaseReceipt
    {
        $class = $this->resolveModelClass($tableName);
        return new $class();
    }

    /**
     * Fetch receipts with filtering, branch access restrictions, and fast versioned caching.
     */
    public function listReceipts(User $user, array $filters): Collection
    {
        $version = Cache::get('receipts:version', 1);
        $userScope = $user->isEmployee() ? "emp_{$user->branch}" : "admin_{$user->id}";
        $filterHash = md5(json_encode($filters));
        $cacheKey = "receipts:v{$version}:{$userScope}:{$filterHash}";

        return Cache::remember($cacheKey, 180, function () use ($user, $filters) {
            $tableName = $filters['table'] ?? 'inventory_items';
            $modelClass = $this->resolveModelClass($tableName);

            /** @var Builder $query */
            $query = $modelClass::query()->select([
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
                'notes',
                'tags',
                'preview_data',
                'scanned_at',
                'created_at',
                'updated_at',
            ]);

            // Enforce employee branch ownership (uses index on entity; utf8mb4_unicode_ci is case-insensitive)
            if ($user->isEmployee() && !empty($user->branch) && strtolower(trim($user->branch)) !== 'all') {
                $query->where('entity', trim($user->branch));
            } elseif (!empty($filters['entity'])) {
                $query->where('entity', trim((string) $filters['entity']));
            }

            if (!empty($filters['year'])) {
                $query->where('year', (string) $filters['year']);
            }

            if (!empty($filters['month'])) {
                $query->where('month', strtoupper((string) $filters['month']));
            }

            if (!empty($filters['category'])) {
                $query->where(function ($q) use ($filters) {
                    $q->where('category', $filters['category'])
                      ->orWhere('category_id', $filters['category']);
                });
            }

            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['search'])) {
                $search = '%' . trim($filters['search']) . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('file_name', 'like', $search)
                      ->orWhere('title', 'like', $search)
                      ->orWhere('establishment', 'like', $search)
                      ->orWhere('description', 'like', $search)
                      ->orWhere('notes', 'like', $search);
                });
            }

            if (!empty($filters['per_page'])) {
                $perPage = max(1, min(200, (int) $filters['per_page']));
                $page = max(1, (int) ($filters['page'] ?? 1));
                return $query->orderBy('created_at', 'desc')
                    ->orderBy('id', 'asc')
                    ->skip(($page - 1) * $perPage)
                    ->take($perPage)
                    ->get();
            }

            $limit = isset($filters['limit']) ? max(1, min(1000, (int) $filters['limit'])) : 500;

            return $query->orderBy('created_at', 'desc')->orderBy('id', 'asc')->limit($limit)->get();
        });
    }

    /**
     * Atomically invalidate all receipt listing caches across all user scopes.
     */
    public function invalidateReceiptCache(): void
    {
        try {
            Cache::increment('receipts:version');
        } catch (\Throwable $e) {
            Cache::put('receipts:version', time());
        }
    }

    /**
     * Store a new receipt record.
     */
    public function createReceipt(User $user, array $data): BaseReceipt
    {
        $tableName = $data['table'] ?? 'inventory_items';
        $modelClass = $this->resolveModelClass($tableName);

        // Enforce employee branch ownership
        if ($user->isEmployee() && !empty($user->branch) && $user->branch !== 'All') {
            if (isset($data['entity']) && strtolower(trim($data['entity'])) !== strtolower(trim($user->branch))) {
                throw new AccessDeniedHttpException("You are only authorized to add records for branch: [{$user->branch}].");
            }
            $data['entity'] = $user->branch;
        }

        // Process file path / image
        if (!empty($data['file_path'])) {
            $data['file_path'] = $this->fileStorageService->storeReceiptImage($data['file_path']);
        }

        $data['user_id'] = $user->id;

        // Wrap primary write + inventory_items mirror in a transaction to prevent dual-storage drift
        $receipt = DB::transaction(function () use ($modelClass, $tableName, $data) {
            if (!empty($data['id'])) {
                $existing = $modelClass::find($data['id']);
                if ($existing) {
                    $existing->update($data);
                    $saved = $existing;
                } else {
                    $saved = $modelClass::create($data);
                }
            } else {
                $saved = $modelClass::create($data);
            }

            if ($tableName !== 'inventory_items') {
                $mirrorData = $data;
                unset($mirrorData['table']);
                $mirrorData['id'] = $saved->id;
                $existingMirror = InventoryItem::find($saved->id);
                if ($existingMirror) {
                    $existingMirror->update($mirrorData);
                } else {
                    InventoryItem::create($mirrorData);
                }
            }

            return $saved;
        });

        $this->invalidateReceiptCache();

        return $receipt;
    }

    /**
     * Find a single receipt by ID and table.
     */
    public function findReceipt(User $user, string $tableName, string $id): BaseReceipt
    {
        $modelClass = $this->resolveModelClass($tableName);
        $record = $modelClass::find($id);

        if (!$record) {
            throw new NotFoundHttpException("Record with ID [{$id}] not found in table [{$tableName}].");
        }

        if ($user->isEmployee() && !empty($user->branch) && strtolower(trim($user->branch)) !== 'all') {
            if (strtolower(trim((string) $record->entity)) !== strtolower(trim($user->branch))) {
                throw new AccessDeniedHttpException("Access denied to records outside assigned branch.");
            }
        }

        return $record;
    }

    /**
     * Update an existing receipt.
     */
    public function updateReceipt(User $user, string $tableName, string $id, array $data): BaseReceipt
    {
        $record = $this->findReceipt($user, $tableName, $id);

        if ($user->isEmployee() && !empty($user->branch) && strtolower(trim($user->branch)) !== 'all') {
            if (isset($data['entity']) && strtolower(trim((string) $data['entity'])) !== strtolower(trim($user->branch))) {
                throw new AccessDeniedHttpException("Cannot change entity outside assigned branch.");
            }
        }

        if (!empty($data['file_path'])) {
            $data['file_path'] = $this->fileStorageService->storeReceiptImage($data['file_path']);
        }

        DB::transaction(function () use ($record, $tableName, $id, $data) {
            $record->update($data);

            // DUAL-STORAGE RULE: If updated in dedicated table, mirror to inventory_items
            if ($tableName !== 'inventory_items') {
                $existingMirror = InventoryItem::find($id);
                if ($existingMirror) {
                    $existingMirror->update($data);
                }
            }
        });

        $this->invalidateReceiptCache();

        return $record->fresh();
    }

    /**
     * Delete a single receipt record.
     */
    public function deleteReceipt(User $user, string $tableName, string $id): bool
    {
        if ($user->isEmployee()) {
            throw new AccessDeniedHttpException("Only administrators can delete receipt records.");
        }

        $record = $this->findReceipt($user, $tableName, $id);

        $deleted = (bool) $record->delete();

        // DUAL-STORAGE RULE: If deleted from dedicated table, remove from inventory_items
        if ($tableName !== 'inventory_items') {
            InventoryItem::where('id', $id)->delete();
        } else {
            // Also clean up across any dedicated table
            $dedicatedTables = [
                'petc_sales_receipts',
                'income_receipts',
                'petc_income_receipts',
                'red_goose_income_receipts',
                'knoah_mari_income_receipts',
                'petc_insurance_receipts',
                'petc_expense_receipts',
                'red_goose_expense_receipts',
                'knoah_mari_expense_receipts',
                'consumables_receipts',
                'voucher_receipts',
            ];
            foreach ($dedicatedTables as $tbl) {
                $this->resolveModelClass($tbl)::where('id', $id)->delete();
            }
        }

        $this->invalidateReceiptCache();

        return $deleted;
    }

    /**
     * Bulk delete records within a database transaction.
     */
    public function bulkDeleteReceipts(User $user, string $tableName, array $ids): int
    {
        if ($user->isEmployee()) {
            throw new AccessDeniedHttpException("Only administrators can perform bulk deletions.");
        }

        $modelClass = $this->resolveModelClass($tableName);

        $deletedCount = DB::transaction(function () use ($modelClass, $tableName, $ids) {
            $count = $modelClass::whereIn('id', $ids)->delete();
            if ($tableName !== 'inventory_items') {
                InventoryItem::whereIn('id', $ids)->delete();
            } else {
                $dedicatedTables = [
                    'petc_sales_receipts',
                    'income_receipts',
                    'petc_income_receipts',
                    'red_goose_income_receipts',
                    'knoah_mari_income_receipts',
                    'petc_insurance_receipts',
                    'petc_expense_receipts',
                    'red_goose_expense_receipts',
                    'knoah_mari_expense_receipts',
                    'consumables_receipts',
                    'voucher_receipts',
                ];
                foreach ($dedicatedTables as $tbl) {
                    $this->resolveModelClass($tbl)::whereIn('id', $ids)->delete();
                }
            }
            return $count;
        });

        $this->invalidateReceiptCache();

        return $deletedCount;
    }

    /**
     * Calculate global system statistics from the mirrored master inventory table (cached & non-duplicated).
     */
    public function getSystemStats(User $user): array
    {
        $version = Cache::get('receipts:version', 1);
        $userScope = ($user->isEmployee() && !empty($user->branch) && strtolower(trim($user->branch)) !== 'all')
            ? 'emp_' . strtolower(trim($user->branch))
            : 'admin';

        return Cache::remember("stats:v{$version}:{$userScope}", 120, function () use ($user) {
            $query = InventoryItem::query();

            if ($user->isEmployee() && !empty($user->branch) && strtolower(trim($user->branch)) !== 'all') {
                $query->where('entity', trim($user->branch));
            }

            $rows = $query
                ->selectRaw('entity, COUNT(*) as aggregate_count, COALESCE(SUM(amount), 0) as aggregate_sum')
                ->groupBy('entity')
                ->get();

            $totalRecords = 0;
            $totalAmount = 0.0;
            $byEntity = [
                'PETC' => ['count' => 0, 'amount' => 0.0],
                'Red Goose' => ['count' => 0, 'amount' => 0.0],
                'Knoah Mari' => ['count' => 0, 'amount' => 0.0],
            ];

            foreach ($rows as $row) {
                $eCount = (int) $row->aggregate_count;
                $eSum = (float) $row->aggregate_sum;

                $totalRecords += $eCount;
                $totalAmount += $eSum;

                $ent = $row->entity;
                if (isset($byEntity[$ent])) {
                    $byEntity[$ent]['count'] += $eCount;
                    $byEntity[$ent]['amount'] += $eSum;
                }
            }

            return [
                'total_records' => $totalRecords,
                'total_amount' => round($totalAmount, 2),
                'by_entity' => $byEntity,
            ];
        });
    }
}
