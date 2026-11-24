<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthCheckController extends Controller
{
    /**
     * Health check endpoint to verify backend status and database connectivity.
     * Never exposes credentials, hosts, or internal secrets.
     */
    public function check(): JsonResponse
    {
        $dbConnected = false;

        try {
            DB::connection()->getPdo();
            $dbConnected = true;
        } catch (Throwable $e) {
            $dbConnected = false;
        }

        $statusCode = $dbConnected ? 200 : 503;

        return response()->json([
            'status' => $dbConnected ? 'healthy' : 'unhealthy',
            'app' => config('app.name', 'KM100_MacroSync'),
            'environment' => config('app.env', 'production'),
            'database' => $dbConnected ? 'connected' : 'disconnected',
            'timestamp' => now()->toIso8601String(),
        ], $statusCode);
    }
}
