<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function create(Request $request): Response
    {
        // "?redirect=/#menu" (e.g. from the cart's "Sign In to Order")
        // brings the visitor back after signing in. Only same-site paths
        // are accepted, never full URLs (open-redirect protection).
        $redirect = (string) $request->query('redirect', '');
        if (str_starts_with($redirect, '/') && ! str_starts_with($redirect, '//')) {
            $request->session()->put('url.intended', url($redirect));
        }

        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Those credentials do not match our records.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        $user = Auth::user();
        $isStaff = $user->hasRole([\App\Models\User::ROLE_ADMIN, \App\Models\User::ROLE_MANAGER]);
        $fallback = $isStaff ? '/admin' : '/';

        // Customers must not be bounced to an admin URL they tried earlier.
        $intended = $request->session()->pull('url.intended');
        if ($intended && ! $isStaff && str_contains(parse_url($intended, PHP_URL_PATH) ?? '', '/admin')) {
            $intended = null;
        }

        return redirect($intended ?: $fallback);
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
