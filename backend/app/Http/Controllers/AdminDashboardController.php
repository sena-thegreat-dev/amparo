<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class AdminDashboardController extends Controller
{
    public function index(): View
    {
        return $this->section('dashboard');
    }

    public function section(string $section): View
    {
        abort_unless(request()->user()?->isRole('admin'), 403);
        $map = ['dashboard' => 'admin-dashboard', 'usuarios' => 'admin-users', 'documentos' => 'admin-docs', 'conciliacao' => 'admin-reconciliation', 'ocorrencias' => 'admin-occurrences', 'auditoria' => 'admin-audit'];
        $active = $map[$section];

        return view('admin.source', compact('active'));
    }
}
