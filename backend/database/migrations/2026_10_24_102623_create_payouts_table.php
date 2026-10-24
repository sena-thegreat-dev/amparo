<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('caregiver_profile_id')->constrained()->cascadeOnDelete();
            $table->string('idempotency_key')->unique();
            $table->unsignedInteger('amount_cents');
            $table->string('status')->default('requested')->index();
            $table->string('provider')->default('simulated');
            $table->unique(['service_id', 'caregiver_profile_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
