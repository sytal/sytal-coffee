<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDomainTest extends TestCase
{
    use RefreshDatabase;

    public function test_no_admin_url_changes_nothing(): void
    {
        config(['app.admin_url' => null]);

        $this->get('http://kavo.test/')->assertOk();
        $this->get('http://kavo.test/admin')->assertRedirect('/login');
    }

    public function test_admin_host_root_opens_the_admin_panel(): void
    {
        config(['app.admin_url' => 'https://kavo-admin.test']);

        $this->get('https://kavo-admin.test/')->assertRedirect('/admin');
        $this->get('https://kavo-admin.test/login')->assertOk();
    }

    public function test_public_host_admin_paths_move_to_the_admin_host(): void
    {
        config(['app.admin_url' => 'https://kavo-admin.test']);

        $this->get('https://kavo.test/admin/orders?status=Pending')
            ->assertRedirect('https://kavo-admin.test/admin/orders?status=Pending');
        $this->get('https://kavo.test/')->assertOk();
    }
}
