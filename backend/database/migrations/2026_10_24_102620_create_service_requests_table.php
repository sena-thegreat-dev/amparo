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
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('family_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('care_recipient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('caregiver_profile_id')->nullable()->constrained()->nullOnDelete();
            $table->string('service_type');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->string('location_area');
            $table->text('address_encrypted')->nullable();
            $table->unsignedInteger('amount_cents');
            $table->string('status')->default('pending')->index();
            $table->index(['family_user_id', 'status', 'created_at']);
            $table->index(['caregiver_profile_id', 'status', 'starts_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
