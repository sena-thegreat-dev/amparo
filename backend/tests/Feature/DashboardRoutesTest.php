<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class DashboardRoutesTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_landing_page_renders_for_guests(): void
    {
        $this->get('/')->assertOk()->assertSee('amparo');
    }

    public function test_family_routes_render_for_a_family_user(): void
    {
        $user = User::factory()->create(['role' => 'family']);

        foreach (['/familia', '/familia/cuidadores', '/familia/contratacoes', '/familia/financeiro'] as $url) {
            $this->actingAs($user)->get($url)->assertOk()->assertSee('Pular para o conteúdo');
        }
    }

    public function test_dashboard_role_boundaries_are_enforced(): void
    {
        $family = User::factory()->create(['role' => 'family']);
        $caregiver = User::factory()->create(['role' => 'caregiver']);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($family)->get('/cuidador')->assertForbidden();
        $this->actingAs($caregiver)->get('/administracao')->assertForbidden();
        $this->actingAs($admin)->get('/administracao/auditoria')->assertOk()->assertSee('Auditoria');
    }
}
