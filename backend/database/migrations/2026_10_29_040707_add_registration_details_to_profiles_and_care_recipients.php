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
        Schema::table('profiles_and_care_recipients', function (Blueprint $table) {
            Schema::table('profiles', function (Blueprint $table) {
                $table->text('phone_encrypted')->nullable();
                $table->string('location_area')->nullable();
            });
            Schema::table('care_recipients', function (Blueprint $table) {
                $table->string('relationship')->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles_and_care_recipients', function (Blueprint $table) {
            Schema::table('care_recipients', function (Blueprint $table) {
                $table->dropColumn('relationship');
            });
            Schema::table('profiles', function (Blueprint $table) {
                $table->dropColumn(['phone_encrypted', 'location_area']);
            });
        });
    }
};
