<?php

use App\Http\Middleware\GzipApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        $middleware->api(append: [GzipApiResponse::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Enforce JSON responses for all /api/* routes
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });

        // Format 401 unauthenticated responses cleanly
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        });

        // Format 404 responses cleanly
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'Resource not found.',
                ], 404);
            }
        });

        // Format 403 access denied responses cleanly
        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'Access denied.',
                ], 403);
            }
        });

        // Format 500 server errors cleanly without exposing internals when debug is off
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*') && !($e instanceof AuthenticationException || $e instanceof NotFoundHttpException || $e instanceof AccessDeniedHttpException || $e instanceof \Illuminate\Validation\ValidationException)) {
                $isDebug = config('app.debug', false);
                return response()->json([
                    'success' => false,
                    'message' => $isDebug ? $e->getMessage() : 'An unexpected server error occurred.',
                ], 500);
            }
        });
    })->create();
