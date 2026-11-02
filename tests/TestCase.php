<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Testing\TestResponse;

abstract class TestCase extends BaseTestCase
{
    /**
     * Send the next request with valid admin Basic Auth credentials
     * (matches ADMIN_USERNAME/ADMIN_PASSWORD set in phpunit.xml).
     */
    protected function withAdminAuth(): static
    {
        $credentials = base64_encode(config('admin.username').':'.config('admin.password'));

        $this->withHeader('Authorization', 'Basic '.$credentials);

        return $this;
    }
}
