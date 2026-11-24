<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_health_check_returns_ok_and_connected_database(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'healthy',
                'database' => 'connected',
            ]);

        $data = $response->json();
        $this->assertArrayHasKey('app', $data);
        $this->assertArrayHasKey('timestamp', $data);

        // Security check: Verify no passwords, secrets, or internal hosts are leaked
        $jsonString = json_encode($data);
        $this->assertStringNotContainsStringIgnoringCase('password', $jsonString);
        $this->assertStringNotContainsStringIgnoringCase('MacroSync2026', $jsonString);
        $this->assertStringNotContainsStringIgnoringCase('root', $jsonString);
    }

    public function test_v1_health_check_alias_returns_ok(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'healthy',
                'database' => 'connected',
            ]);
    }
}
