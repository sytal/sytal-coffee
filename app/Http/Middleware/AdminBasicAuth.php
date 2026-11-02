<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gates the whole /admin/* area behind a single shared username/password
 * (set via ADMIN_USERNAME / ADMIN_PASSWORD in .env) using standard HTTP
 * Basic Auth. This is a stopgap, not a real multi-user auth system — the
 * admin panel has no per-user accounts, roles, or audit trail. Good enough
 * to stop it being wide open to the public; replace with Breeze/Fortify +
 * real user accounts before this is relied on for anything sensitive.
 */
class AdminBasicAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $username = config('admin.username');
        $password = config('admin.password');

        if (! $username || ! $password) {
            abort(500, 'Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in .env.');
        }

        if ($request->getUser() === $username && $request->getPassword() === $password) {
            return $next($request);
        }

        return response('Unauthorized', 401, ['WWW-Authenticate' => 'Basic realm="Crunches Cafe Admin"']);
    }
}
