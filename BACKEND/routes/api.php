<?php

use App\Http\Controllers\Api\HealthCheckController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EmployeeController;
use App\Http\Controllers\Api\V1\FileController;
use App\Http\Controllers\Api\V1\GeminiController;
use App\Http\Controllers\Api\V1\OcrController;
use App\Http\Controllers\Api\V1\ReceiptController;
use App\Http\Controllers\Api\V1\SystemStatsController;
use Illuminate\Support\Facades\Route;

// Public API root redirect
Route::get('/', function () {
    return redirect('/api/v1');
});

// Public Health Check Endpoint: GET /api/health
Route::get('/health', [HealthCheckController::class, 'check'])->middleware('throttle:60,1');

Route::prefix('v1')->group(function () {
    // API v1 Index Overview: GET /api/v1
    Route::get('/', function () {
        return response()->json([
            'success' => true,
            'app' => 'KM100 MacroSync REST API',
            'version' => 'v1',
            'status' => 'operational',
            'health_check' => url('/api/v1/health'),
            'endpoints' => [
                'auth' => [
                    'login' => 'POST /api/v1/auth/login',
                    'register' => 'POST /api/v1/auth/register',
                    'logout' => 'POST /api/v1/auth/logout',
                    'me' => 'GET /api/v1/auth/me',
                ],
                'receipts' => [
                    'list' => 'GET /api/v1/receipts?table={table}',
                    'create' => 'POST /api/v1/receipts',
                    'show' => 'GET /api/v1/receipts/{id}?table={table}',
                    'update' => 'PUT /api/v1/receipts/{id}',
                    'delete' => 'DELETE /api/v1/receipts/{id}?table={table}',
                    'bulk_delete' => 'POST /api/v1/receipts/bulk-delete',
                ],
                'employees' => 'GET, POST, PUT, DELETE /api/v1/employees',
                'files' => 'POST /api/v1/files/upload',
            ],
            'frontend_app' => 'http://localhost:3000',
        ], 200);
    });

    // Health check alias under v1: GET /api/v1/health
    Route::get('/health', [HealthCheckController::class, 'check'])->middleware('throttle:60,1');

    // Public authentication routes (with dedicated rate limiting)
    Route::post('/auth/login', [AuthController::class, 'login'])->name('login')->middleware('throttle:30,1');
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:30,1');
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:30,1');
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:30,1');

    // Authenticated API routes
    Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
        // Auth profile, update, email verification & logout
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/email/verify', [AuthController::class, 'verifyEmail']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Receipt and inventory management
        Route::get('/receipts', [ReceiptController::class, 'index']);
        Route::post('/receipts', [ReceiptController::class, 'store']);
        Route::get('/receipts/{id}', [ReceiptController::class, 'show']);
        Route::put('/receipts/{id}', [ReceiptController::class, 'update']);
        Route::delete('/receipts/{id}', [ReceiptController::class, 'destroy']);
        Route::post('/receipts/bulk-delete', [ReceiptController::class, 'bulkDestroy']);

        // Global statistics
        Route::get('/stats/summary', [SystemStatsController::class, 'summary']);

        // Gemini AI Integration (multimodal vision OCR, text generation, assistant)
        Route::get('/gemini/health', [GeminiController::class, 'health'])->middleware('throttle:60,1');
        Route::post('/gemini/generate', [GeminiController::class, 'generate'])->middleware('throttle:30,1');
        Route::post('/gemini/process-receipt', [GeminiController::class, 'processReceipt'])->middleware('throttle:15,1');
        Route::post('/ocr/process', [OcrController::class, 'process'])->middleware('throttle:15,1');

        // File storage management
        Route::get('/files', [FileController::class, 'index']);
        Route::post('/files/upload', [FileController::class, 'upload']);
        Route::post('/storage/upload', [FileController::class, 'upload']);
        Route::get('/files/{path}', [FileController::class, 'show'])->where('path', '.*');
        Route::delete('/files/{path}', [FileController::class, 'destroy'])->where('path', '.*');

        // Employee account management (Admin only)
        Route::apiResource('employees', EmployeeController::class);
    });
});
