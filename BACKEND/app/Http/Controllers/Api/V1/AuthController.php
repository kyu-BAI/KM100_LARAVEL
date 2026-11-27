<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\LoginRequest;
use App\Http\Resources\V1\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Authenticate user credentials and return user profile + token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $portalType = $validated['portal_type'] ?? null;

        $result = $this->authService->login([
            'email' => $validated['email'],
            'password' => $validated['password'],
        ], $portalType, $request);

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 200);
    }

    /**
     * Return authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ], 200);
    }

    /**
     * Log user out of the application.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request);

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ], 200);
    }

    /**
     * Register a new user account.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:admin,employee',
            'branch' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
        ]);

        // Security check: If an admin already exists in MySQL,
        // only an authenticated administrator can register an admin account,
        // OR authorization credentials of an active admin must be provided.
        $targetRole = $validated['role'] ?? 'admin';
        if ($targetRole === 'admin') {
            $adminExists = \App\Models\User::where('role', 'admin')->exists();
            $currentUser = $request->user() ?: auth('sanctum')->user();

            $authorizedByCredentials = false;
            $authorizingEmail = $request->input('auth_admin_email') ?? $request->input('authorizing_admin_email');
            $authorizingPassword = $request->input('auth_admin_password') ?? $request->input('authorizing_admin_password');

            if ($authorizingEmail && $authorizingPassword) {
                $authorizingAdmin = \App\Models\User::where('email', $authorizingEmail)
                    ->where('role', 'admin')
                    ->where('is_active', true)
                    ->first();

                if ($authorizingAdmin && \Illuminate\Support\Facades\Hash::check($authorizingPassword, $authorizingAdmin->password)) {
                    $authorizedByCredentials = true;
                }
            }

            if ($adminExists && (!$currentUser || !$currentUser->isAdmin()) && !$authorizedByCredentials) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException(
                    'Administrative account registration requires authorization from an active administrator. Please provide existing admin credentials or register from the authenticated Administrator portal.'
                );
            }
        }
        $validated['role'] = $targetRole;

        $result = $this->authService->register($validated, $request);

        return response()->json([
            'success' => true,
            'message' => 'Registered successfully.',
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }

    /**
     * Request password reset token.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $this->authService->forgotPassword($validated['email'], $request);

        return response()->json([
            'success' => true,
            'message' => 'If this email is registered, a password reset link or token has been issued.',
        ], 200);
    }

    /**
     * Reset password using token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $result = $this->authService->resetPassword($validated, $request);

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ], 200);
    }

    /**
     * Update authenticated user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'current_password' => 'nullable|required_with:password|string',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $user = $this->authService->updateProfile($request->user(), $validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data' => new UserResource($user),
        ], 200);
    }

    /**
     * Mark user email as verified.
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $user = $this->authService->verifyEmail($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
            'data' => new UserResource($user),
        ], 200);
    }
}
