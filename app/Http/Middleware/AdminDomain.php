<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Splits the admin panel onto its own host when ADMIN_URL is set:
 *  - admin host, "/"          -> /admin (the auth gate then shows /login)
 *  - public host, /admin/...  -> same path on the admin host
 * With ADMIN_URL unset (local dev) every request passes straight through.
 */
class AdminDomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $adminUrl = config('app.admin_url');
        $adminHost = $adminUrl ? parse_url($adminUrl, PHP_URL_HOST) : null;

        if (! $adminHost) {
            return $next($request);
        }

        $onAdminHost = strcasecmp($request->getHost(), $adminHost) === 0;

        if ($onAdminHost && $request->path() === '/') {
            return redirect('/admin');
        }

        if (! $onAdminHost && $request->is('admin', 'admin/*') && $request->isMethodSafe()) {
            return redirect()->away(rtrim($adminUrl, '/').$request->getRequestUri());
        }

        return $next($request);
    }
}
