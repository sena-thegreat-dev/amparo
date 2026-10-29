<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CaregiverDashboardController;
use App\Http\Controllers\FamilyDashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');
Route::middleware('guest')->group(function (): void {
    Route::get('/acesso', [SessionController::class, 'create'])->name('login');
    Route::post('/acesso', [SessionController::class, 'store'])->middleware('throttle:6,1')->name('login.store');
    Route::get('/cadastro/{type}', [RegistrationController::class, 'create'])->whereIn('type', ['familia', 'cuidador'])->name('register');
    Route::post('/cadastro', [RegistrationController::class, 'store'])->middleware('throttle:6,1')->name('register.store');
});
Route::middleware('auth')->group(function (): void {
    Route::post('/sair', [SessionController::class, 'destroy'])->name('logout');
    Route::get('/familia', [FamilyDashboardController::class, 'index'])->name('family.dashboard');
    Route::get('/familia/cuidadores', [FamilyDashboardController::class, 'caregivers'])->name('family.caregivers');
    Route::get('/familia/contratacoes', [FamilyDashboardController::class, 'contracts'])->name('family.contracts');
    Route::get('/familia/financeiro', [FamilyDashboardController::class, 'finance'])->name('family.finance');
    Route::get('/cuidador', [CaregiverDashboardController::class, 'index'])->name('caregiver.dashboard');
    Route::get('/cuidador/oportunidades', [CaregiverDashboardController::class, 'opportunities'])->name('caregiver.opportunities');
    Route::get('/cuidador/agenda', [CaregiverDashboardController::class, 'agenda'])->name('caregiver.agenda');
    Route::get('/cuidador/repasses', [CaregiverDashboardController::class, 'payouts'])->name('caregiver.payouts');
    Route::get('/administracao', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/administracao/{section}', [AdminDashboardController::class, 'section'])->whereIn('section', ['usuarios', 'documentos', 'conciliacao', 'ocorrencias', 'auditoria'])->name('admin.section');
});
