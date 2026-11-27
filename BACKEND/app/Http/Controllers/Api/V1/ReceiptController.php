<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\BulkDeleteReceiptRequest;
use App\Http\Requests\V1\StoreReceiptRequest;
use App\Http\Requests\V1\UpdateReceiptRequest;
use App\Http\Resources\V1\ReceiptResource;
use App\Services\ReceiptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    protected ReceiptService $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
    }

    protected const ALLOWED_TABLES = [
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
        'inventory_items',
    ];

    protected function validateTableName(Request $request): string
    {
        $table = $request->query('table') ?: $request->input('table', 'inventory_items');
        if (!in_array($table, self::ALLOWED_TABLES, true)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'table' => ['The selected table is invalid.'],
            ]);
        }
        return $table;
    }

    /**
     * List receipts based on table, branch, and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $table = $this->validateTableName($request);
        $filters = $request->only([
            'entity',
            'year',
            'month',
            'category',
            'status',
            'search',
            'limit',
            'page',
            'per_page',
        ]);
        $filters['table'] = $table;

        $receipts = $this->receiptService->listReceipts($request->user(), $filters);

        return response()->json([
            'success' => true,
            'data' => ReceiptResource::collection($receipts),
            'meta' => [
                'total' => $receipts->count(),
                'table' => $filters['table'] ?? 'inventory_items',
            ],
        ], 200);
    }

    /**
     * Store a new receipt record.
     */
    public function store(StoreReceiptRequest $request): JsonResponse
    {
        $receipt = $this->receiptService->createReceipt($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Receipt created successfully.',
            'data' => new ReceiptResource($receipt),
        ], 201);
    }

    /**
     * Retrieve a single receipt record.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $tableName = $this->validateTableName($request);
        $receipt = $this->receiptService->findReceipt($request->user(), $tableName, $id);

        return response()->json([
            'success' => true,
            'data' => new ReceiptResource($receipt),
        ], 200);
    }

    /**
     * Update an existing receipt record.
     */
    public function update(UpdateReceiptRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();
        $tableName = $validated['table'];
        unset($validated['table']);

        $receipt = $this->receiptService->updateReceipt($request->user(), $tableName, $id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Receipt updated successfully.',
            'data' => new ReceiptResource($receipt),
        ], 200);
    }

    /**
     * Delete a single receipt record.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $tableName = $this->validateTableName($request);
        $this->receiptService->deleteReceipt($request->user(), $tableName, $id);

        return response()->json([
            'success' => true,
            'message' => 'Record deleted successfully.',
        ], 200);
    }

    /**
     * Bulk delete records.
     */
    public function bulkDestroy(BulkDeleteReceiptRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $deletedCount = $this->receiptService->bulkDeleteReceipts(
            $request->user(),
            $validated['table'],
            $validated['ids']
        );

        return response()->json([
            'success' => true,
            'message' => "Successfully deleted {$deletedCount} records.",
            'data' => [
                'deleted_count' => $deletedCount,
            ],
        ], 200);
    }
}
