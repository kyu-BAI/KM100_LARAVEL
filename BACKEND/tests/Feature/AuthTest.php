<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('login|admin@km100.ph|127.0.0.1');
        RateLimiter::clear('register|127.0.0.1');

        // Seed admin user
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@km100.ph',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);

        // Seed employee user
        User::create([
            'name' => 'Knoah Mari Staff',
            'email' => 'knoahmari@km100.ph',
            'password' => Hash::make('Employee123!'),
            'role' => 'employee',
            'branch' => 'Knoah Mari',
            'department' => 'Operations',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@km100.ph',
            'password' => 'Admin123!',
            'portal_type' => 'admin',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'admin@km100.ph',
                        'role' => 'admin',
                    ],
                ],
            ]);

        $this->assertArrayHasKey('token', $response->json('data'));
    }

    public function test_employee_cannot_login_to_admin_portal(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'knoahmari@km100.ph',
            'password' => 'Employee123!',
            'portal_type' => 'admin',
        ]);

        $response->assertStatus(403)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_fails_with_invalid_password(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@km100.ph',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_fetch_profile(): void
    {
        $admin = User::where('email', 'admin@km100.ph')->first();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'admin@km100.ph',
                    'role' => 'admin',
                ],
            ]);
    }

    public function test_user_can_logout(): void
    {
        $admin = User::where('email', 'admin@km100.ph')->first();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_admin_can_register(): void
    {
        $admin = User::where('email', 'admin@km100.ph')->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/auth/register', [
            'name' => 'New Admin',
            'email' => 'newadmin@km100.ph',
            'password' => 'SecurePass123!',
            'role' => 'admin',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'newadmin@km100.ph',
                        'role' => 'admin',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('users', ['email' => 'newadmin@km100.ph']);
    }

    public function test_unauthorized_user_cannot_register_as_admin(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Unauthorized Admin Attempt',
            'email' => 'unauth_admin@km100.ph',
            'password' => 'RegisterPass123!',
            'role' => 'admin',
        ]);

        $response->assertStatus(403);
    }

    public function test_unauthorized_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_password_reset_flow(): void
    {
        // 1. Request password reset token
        $forgotResponse = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'admin@km100.ph',
        ]);

        $forgotResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $token = $forgotResponse->json('token');
        $this->assertNotEmpty($token);

        // 2. Reset password using token
        $resetResponse = $this->postJson('/api/v1/auth/reset-password', [
            'email' => 'admin@km100.ph',
            'token' => $token,
            'password' => 'NewAdminPass2026!',
            'password_confirmation' => 'NewAdminPass2026!',
        ]);

        $resetResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        // 3. Login with newly reset password
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@km100.ph',
            'password' => 'NewAdminPass2026!',
            'portal_type' => 'admin',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_authenticated_user_can_update_profile(): void
    {
        $admin = User::where('email', 'admin@km100.ph')->first();

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson('/api/v1/auth/profile', [
                'name' => 'Updated System Administrator',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Updated System Administrator',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@km100.ph',
            'name' => 'Updated System Administrator',
        ]);
    }

    public function test_authenticated_user_can_verify_email(): void
    {
        $admin = User::where('email', 'admin@km100.ph')->first();
        $this->assertNull($admin->email_verified_at);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/auth/email/verify');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $admin->refresh();
        $this->assertNotNull($admin->email_verified_at);
    }

    public function test_login_rate_limiting(): void
    {
        $throttleKey = 'login|throttled@km100.ph|127.0.0.1';
        RateLimiter::clear($throttleKey);

        // Fail 5 times
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'throttled@km100.ph',
                'password' => 'wrong',
            ]);
        }

        // 6th attempt should return 429
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'throttled@km100.ph',
            'password' => 'wrong',
        ]);

        $response->assertStatus(429);
        RateLimiter::clear($throttleKey);
    }

    public function test_sanctum_csrf_cookie_endpoint_is_accessible(): void
    {
        $response = $this->get('/sanctum/csrf-cookie');
        $response->assertStatus(204);
    }
}
