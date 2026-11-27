<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Authenticate user credentials and return user model + Sanctum token.
     */
    public function login(array $credentials, ?string $portalType = null, ?Request $request = null): array
    {
        $email = Str::lower(trim($credentials['email']));
        $throttleKey = 'login|' . $email . '|' . ($request?->ip() ?? '127.0.0.1');

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$seconds} seconds."],
            ])->status(429);
        }

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['This user account has been deactivated. Please contact an administrator.'],
            ]);
        }

        // Validate portal type access
        if ($portalType === 'admin' && !$user->isAdmin()) {
            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'email' => ['Access denied: Administrator privileges required for this portal.'],
            ])->status(403);
        }

        RateLimiter::clear($throttleKey);

        // Log into web guard for stateful cookie session support
        Auth::login($user);

        // Generate Sanctum Personal Access Token
        $token = $user->createToken('km100-spa-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Terminate user session and revoke current access token.
     */
    public function logout(Request $request): void
    {
        $user = $request->user();

        if ($user) {
            $token = $user->currentAccessToken();
            if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
                $token->delete();
            }
        }

        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
    }

    /**
     * Register a new user account and return user model + Sanctum token.
     */
    public function register(array $data, ?Request $request = null): array
    {
        $throttleKey = 'register|' . ($request?->ip() ?? '127.0.0.1');

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => ["Too many registration requests. Please wait {$seconds} seconds."],
            ])->status(429);
        }

        RateLimiter::hit($throttleKey, 60);

        $user = User::create([
            'name' => $data['name'] ?? 'System Admin',
            'email' => Str::lower(trim($data['email'])),
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'admin',
            'branch' => $data['branch'] ?? 'All',
            'department' => $data['department'] ?? 'Administration',
            'is_active' => true,
        ]);

        if (Auth::guard('web') instanceof \Illuminate\Contracts\Auth\StatefulGuard) {
            Auth::guard('web')->login($user);
        }
        $token = $user->createToken('km100-spa-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Generate password reset token.
     */
    public function forgotPassword(string $email, ?Request $request = null): array
    {
        $throttleKey = 'forgot-pw|' . Str::lower(trim($email)) . '|' . ($request?->ip() ?? '127.0.0.1');

        if (RateLimiter::tooManyAttempts($throttleKey, 20)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => ["Too many password reset requests. Please wait {$seconds} seconds."],
            ])->status(429);
        }

        RateLimiter::hit($throttleKey, 60);

        $cleanEmail = Str::lower(trim($email));
        $user = User::where('email', $cleanEmail)->first();

        // Prevent email enumeration: return standard response even if email doesn't exist
        if (!$user) {
            return [
                'success' => true,
                'message' => 'If this email is registered, a password reset token has been generated.',
                'token' => null,
            ];
        }

        $plainToken = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $cleanEmail],
            [
                'token' => Hash::make($plainToken),
                'created_at' => now(),
            ]
        );

        return [
            'success' => true,
            'message' => 'If this email is registered, a password reset token has been generated.',
            'token' => null,
        ];
    }

    /**
     * Reset user password using token.
     */
    public function resetPassword(array $data, ?Request $request = null): array
    {
        $cleanEmail = Str::lower(trim($data['email']));
        $throttleKey = 'reset-pw|' . ($request?->ip() ?? '127.0.0.1');

        if (RateLimiter::tooManyAttempts($throttleKey, 20)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => ["Too many attempts. Please try again in {$seconds} seconds."],
            ])->status(429);
        }

        $record = DB::table('password_reset_tokens')->where('email', $cleanEmail)->first();

        if (!$record) {
            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired password reset token.'],
            ]);
        }

        // Expire token after 60 minutes
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $cleanEmail)->delete();
            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'token' => ['This password reset token has expired. Please request a new one.'],
            ]);
        }

        if (!Hash::check($data['token'], $record->token)) {
            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired password reset token.'],
            ]);
        }

        $user = User::where('email', $cleanEmail)->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['User account not found.'],
            ]);
        }

        // Update password and invalidate reset token
        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        DB::table('password_reset_tokens')->where('email', $cleanEmail)->delete();

        // Invalidate all existing API tokens for security
        $user->tokens()->delete();

        RateLimiter::clear($throttleKey);

        return [
            'success' => true,
            'message' => 'Password has been reset successfully. Please sign in with your new password.',
        ];
    }

    /**
     * Update user profile or change password.
     */
    public function updateProfile(User $user, array $data): User
    {
        if (!empty($data['password'])) {
            if (empty($data['current_password']) || !Hash::check($data['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The provided current password does not match.'],
                ]);
            }
            $user->password = Hash::make($data['password']);
        }

        if (!empty($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['branch'])) {
            $user->branch = $data['branch'];
        }

        if (isset($data['department'])) {
            $user->department = $data['department'];
        }

        $user->save();

        return $user;
    }

    /**
     * Mark user email as verified.
     */
    public function verifyEmail(User $user): User
    {
        $user->email_verified_at = now();
        $user->save();

        return $user;
    }
}
