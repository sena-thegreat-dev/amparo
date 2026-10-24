<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CaregiverDashboardController;
use App\Http\Controllers\DemoSessionController;
use App\Http\Controllers\FamilyDashboardController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');
Route::get('/acesso', [DemoSessionController::class, 'create'])->name('login');
Route::post('/acesso', [DemoSessionController::class, 'store'])->middleware('throttle:6,1')->name('login.store');
Route::middleware('auth')->group(function (): void {
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
