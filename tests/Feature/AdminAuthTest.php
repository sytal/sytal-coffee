<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_area_rejects_requests_without_credentials(): void
    {
        $response = $this->get('/admin');

        $response->assertStatus(401);
    }

    public function test_admin_area_rejects_wrong_credentials(): void
    {
        $response = $this->withHeader('Authorization', 'Basic '.base64_encode('wrong:wrong'))->get('/admin');

        $response->assertStatus(401);
    }

    public function test_admin_area_allows_correct_credentials(): void
    {
        $response = $this->withAdminAuth()->get('/admin');

        $response->assertStatus(200);
    }

    public function test_public_site_is_not_protected(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
