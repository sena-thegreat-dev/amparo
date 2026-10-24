<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class CaregiverDashboardController extends Controller
{
    private function view(string $active): View
    {
        abort_unless(request()->user()?->isRole('caregiver'), 403);

        return view('caregiver.source', compact('active'));
    }

    public function index(): View
    {
        return $this->view('dashboard');
    }

    public function opportunities(): View
    {
        return $this->view('opportunities');
    }

    public function agenda(): View
    {
        return $this->view('agenda');
    }

    public function payouts(): View
    {
        return $this->view('payouts');
    }
}
