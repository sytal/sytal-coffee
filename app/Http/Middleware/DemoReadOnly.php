<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets the public demo admin look around the admin panel without being able
 * to change, upload or delete anything. Real admins are unaffected.
 */
class DemoReadOnly
{
    public const MESSAGE = 'Demo account is read-only — changes are disabled.';

    public function handle(Request $request, Closure $next): Response
    {
        if (! self::isDemoAdmin($request->user()) || $request->isMethodSafe()) {
            return $next($request);
        }

        // Marking notifications as read only affects the demo user's own view.
        if ($request->is('admin/notifications/*')) {
            return $next($request);
        }

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['message' => self::MESSAGE], 403);
        }

        return back()->with('error', self::MESSAGE);
    }

    public static function isDemoAdmin($user): bool
    {
        return $user !== null
            && config('demo.enabled')
            && strcasecmp($user->email, (string) config('demo.admin.email')) === 0;
    }
}
