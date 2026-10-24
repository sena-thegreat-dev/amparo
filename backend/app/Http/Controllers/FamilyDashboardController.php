<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class FamilyDashboardController extends Controller
{
    private function view(string $active): View
    {
        abort_unless(request()->user()?->isRole('family'), 403);

        return view('family.source', compact('active'));
    }

    public function index(): View
    {
        return $this->view('overview');
    }

    public function caregivers(): View
    {
        return $this->view('search');
    }

    public function contracts(): View
    {
        return $this->view('contracts');
    }

    public function finance(): View
    {
        return $this->view('finance');
    }
}
