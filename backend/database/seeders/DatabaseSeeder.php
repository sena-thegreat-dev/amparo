<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            return;
        }

        foreach ([['Gabriel Sena', 'family'], ['Beto', 'caregiver'], ['Gabriel Sena Administrador', 'admin']] as [$name, $role]) {
            User::query()->firstOrCreate(['email' => $role.'@amparo.test'], ['name' => $name, 'role' => $role, 'status' => 'active', 'password' => Hash::make('amparo-demo')]);
        }
    }
}
