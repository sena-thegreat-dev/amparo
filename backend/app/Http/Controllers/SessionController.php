<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class SessionController extends Controller
{
    public function create(): View
    {
        return view('auth.login');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate(['credential' => ['required', 'string', 'max:255'], 'password' => ['required', 'string', 'max:128']]);
        $credential = trim($data['credential']);
        $field = str_contains($credential, '@') ? 'email' : 'cpf_hash';
        $value = $field === 'email' ? strtolower($credential) : hash_hmac('sha256', preg_replace('/\D/', '', $credential), config('app.key'));
        if (! Auth::attempt([$field => $value, 'password' => $data['password'], 'status' => 'active'])) {
            return back()->withErrors(['credential' => 'Dados de acesso inválidos.']);
        }
        $request->session()->regenerate();

        return redirect()->route(match ($request->user()->role) {
            'family' => 'family.dashboard', 'caregiver' => 'caregiver.dashboard', 'admin' => 'admin.dashboard', default => 'landing',
        });
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('landing');
    }
}
