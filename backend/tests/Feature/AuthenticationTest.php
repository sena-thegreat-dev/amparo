<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_family_registration_creates_owned_recipient_and_authenticates(): void
    {
        $response = $this->post('/cadastro', ['name' => 'Pessoa Exemplo', 'email' => 'pessoa@example.test', 'phone' => '11999999999', 'location' => 'São Paulo', 'cpf' => '529.982.247-25', 'password' => 'senha-segura', 'password_confirmation' => 'senha-segura', 'account_type' => 'family', 'care_for' => 'other', 'recipient' => 'Pessoa assistida', 'relationship' => 'Familiar', 'role' => 'admin']);
        $response->assertRedirect('/familia');
        $user = User::where('email', 'pessoa@example.test')->firstOrFail();
        $this->assertAuthenticatedAs($user);
        $this->assertSame('family', $user->role);
        $this->assertTrue(Hash::check('senha-segura', $user->password));
        $this->assertNotSame('52998224725', $user->cpf_encrypted);
        $this->assertDatabaseHas('care_recipients', ['family_user_id' => $user->id, 'name' => 'Pessoa assistida', 'relationship' => 'Familiar']);
    }

    public function test_caregiver_registration_creates_pending_profile(): void
    {
        $response = $this->post('/cadastro', ['name' => 'Profissional', 'email' => 'profissional@example.test', 'phone' => '11999999999', 'location' => 'São Paulo', 'cpf' => '52998224725', 'password' => 'senha-segura', 'password_confirmation' => 'senha-segura', 'account_type' => 'caregiver', 'services' => 'Acompanhamento']);
        $response->assertRedirect('/cuidador');
        $user = User::where('email', 'profissional@example.test')->firstOrFail();
        $this->assertDatabaseHas('caregiver_profiles', ['user_id' => $user->id, 'document_status' => 'pending']);
    }

    public function test_invalid_registration_does_not_create_account(): void
    {
        $response = $this->post('/cadastro', ['name' => 'Pessoa', 'email' => 'invalid', 'cpf' => '11111111111', 'password' => '123', 'password_confirmation' => 'outro', 'account_type' => 'admin']);
        $response->assertSessionHasErrors(['email', 'cpf', 'password', 'account_type']);
        $this->assertDatabaseCount('users', 0);
    }

    public function test_user_can_login_with_cpf_and_logout(): void
    {
        $this->post('/cadastro', ['name' => 'Pessoa', 'email' => 'pessoa@example.test', 'phone' => '11999999999', 'location' => 'São Paulo', 'cpf' => '52998224725', 'password' => 'senha-segura', 'password_confirmation' => 'senha-segura', 'account_type' => 'family', 'care_for' => 'self'])->assertRedirect('/familia');
        $this->post('/sair')->assertRedirect('/');
        $this->assertGuest();
        $this->post('/acesso', ['credential' => '529.982.247-25', 'password' => 'senha-segura'])->assertRedirect('/familia');
        $this->assertAuthenticated();
    }

    public function test_invalid_password_and_inactive_user_are_rejected(): void
    {
        $user = User::factory()->create(['email' => 'pessoa@example.test', 'password' => Hash::make('senha-segura'), 'status' => 'suspended']);
        $this->post('/acesso', ['credential' => $user->email, 'password' => 'senha-segura'])->assertSessionHasErrors('credential');
        $this->assertGuest();
    }

    public function test_wrong_password_is_rejected_for_an_active_account(): void
    {
        $user = User::factory()->create(['email' => 'pessoa@example.test', 'password' => Hash::make('senha-segura'), 'status' => 'active']);
        $this->post('/acesso', ['credential' => $user->email, 'password' => 'senha-incorreta'])->assertSessionHasErrors('credential');
        $this->assertGuest();
    }

    public function test_guests_cannot_access_restricted_dashboards(): void
    {
        foreach (['/familia', '/cuidador', '/administracao'] as $url) {
            $this->get($url)->assertRedirect('/acesso');
        }
    }

    public function test_registration_and_login_forms_are_available(): void
    {
        $this->get('/acesso')->assertOk()->assertSee('CPF ou e-mail');
        $this->get('/cadastro/familia')->assertOk()->assertSee('Para quem é o cuidado?');
        $this->get('/cadastro/cuidador')->assertOk()->assertSee('Cadastro profissional');
        $this->get('/cadastro/admin')->assertNotFound();
    }

    public function test_duplicate_cpf_is_rejected(): void
    {
        $payload = ['name' => 'Pessoa', 'email' => 'pessoa@example.test', 'phone' => '11999999999', 'location' => 'São Paulo', 'cpf' => '52998224725', 'password' => 'senha-segura', 'password_confirmation' => 'senha-segura', 'account_type' => 'family', 'care_for' => 'self'];
        $this->post('/cadastro', $payload)->assertRedirect('/familia');
        $this->post('/sair');
        $payload['email'] = 'outra@example.test';
        $this->post('/cadastro', $payload)->assertSessionHasErrors('cpf');
        $this->assertDatabaseCount('users', 1);
    }
}
