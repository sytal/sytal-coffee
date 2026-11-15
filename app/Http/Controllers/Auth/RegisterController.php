<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Customer-facing sign up — separate from the admin/staff accounts seeded
 * for the admin panel. Anyone can browse the menu without an account; this
 * is what lets a visitor create one so they can place an order.
 */
class RegisterController extends Controller
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

        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        // The sign-up form pre-fills the phone field with "03"; if the visitor
        // leaves it like that, treat it as "no phone" (it's optional).
        if (strlen(preg_replace('/\D/', '', (string) $request->input('phone'))) <= 2) {
            $request->merge(['phone' => null]);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:32', new \App\Rules\PhoneNumber],
            'password' => ['required', Password::min(8)],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role' => User::ROLE_CUSTOMER,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        // A brand-new customer can never use an admin URL, so don't send them
        // to one just because they tried /admin before signing up (→ 403).
        $intended = $request->session()->pull('url.intended');
        $target = $intended && ! str_contains(parse_url($intended, PHP_URL_PATH) ?? '', '/admin') ? $intended : '/';

        return redirect($target)->with('success', 'Welcome to KAVO!');
    }
}
