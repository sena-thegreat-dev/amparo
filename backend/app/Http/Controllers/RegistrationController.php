<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterAccountRequest;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class RegistrationController extends Controller
{
    public function create(string $type): View
    {
        abort_unless(in_array($type, ['familia', 'cuidador'], true), 404);

        return view('auth.register', ['type' => $type === 'familia' ? 'family' : 'caregiver']);
    }

    public function store(RegisterAccountRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $cpf = preg_replace('/\D/', '', $data['cpf']);
        $cpfHash = hash_hmac('sha256', $cpf, config('app.key'));
        if (User::query()->where('cpf_hash', $cpfHash)->exists()) {
            return back()->withErrors(['cpf' => 'Não foi possível concluir o cadastro com os dados informados.'])->withInput($request->except('password', 'password_confirmation', 'cpf'));
        }
        try {
            $user = DB::transaction(function () use ($data, $cpf, $cpfHash): User {
                $user = new User;
                $user->name = $data['name'];
                $user->email = strtolower($data['email']);
                $user->password = Hash::make($data['password']);
                $user->role = $data['account_type'];
                $user->status = 'active';
                $user->cpf_encrypted = Crypt::encryptString($cpf);
                $user->cpf_hash = $cpfHash;
                $user->save();
                DB::table('profiles')->insert(['user_id' => $user->id, 'display_name' => $user->name, 'phone_encrypted' => Crypt::encryptString($data['phone']), 'location_area' => $data['location'], 'created_at' => now(), 'updated_at' => now()]);
                if ($user->role === 'family') {
                    DB::table('care_recipients')->insert(['family_user_id' => $user->id, 'name' => $data['care_for'] === 'other' ? $data['recipient'] : $user->name, 'relationship' => $data['care_for'] === 'other' ? ($data['relationship'] ?? null) : null, 'created_at' => now(), 'updated_at' => now()]);
                } else {
                    DB::table('caregiver_profiles')->insert(['user_id' => $user->id, 'services_summary' => $data['services'], 'document_status' => 'pending', 'created_at' => now(), 'updated_at' => now()]);
                }

                return $user;
            });
        } catch (QueryException $exception) {
            if (User::query()->where('cpf_hash', $cpfHash)->exists()) {
                return back()->withErrors(['cpf' => 'Não foi possível concluir o cadastro com os dados informados.'])->withInput($request->except('password', 'password_confirmation', 'cpf'));
            }
            if (User::query()->where('email', $data['email'])->exists()) {
                return back()->withErrors(['email' => 'Não foi possível concluir o cadastro com os dados informados.'])->withInput($request->except('password', 'password_confirmation', 'cpf'));
            }
            throw $exception;
        }
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route($user->role === 'family' ? 'family.dashboard' : 'caregiver.dashboard');
    }
}
