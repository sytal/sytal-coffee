<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Log in as an admin user for the rest of the test.
     */
    protected function withAdminAuth(): static
    {
        $this->actingAs(User::factory()->create(['role' => User::ROLE_ADMIN]));

        return $this;
    }
}
