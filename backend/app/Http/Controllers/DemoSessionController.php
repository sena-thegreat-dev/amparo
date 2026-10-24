<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DemoSessionController extends Controller
{
    public function create(): View
    {
        abort_unless(app()->isLocal(), 404);

        return view('demo-login');
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(app()->isLocal(), 404);
        $credentials = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        if (! Auth::attempt($credentials)) {
            return back()->withErrors(['email' => 'Credenciais demonstrativas inválidas.']);
        }
        $request->session()->regenerate();

        return redirect(match ($request->user()->role) {
            'family' => route('family.dashboard'), 'caregiver' => route('caregiver.dashboard'), default => route('admin.dashboard')
        });
    }
}
