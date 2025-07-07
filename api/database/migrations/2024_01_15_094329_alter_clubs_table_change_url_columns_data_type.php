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
        Schema::table('clubs', function (Blueprint $table) {
            $table->text('logo_url')->nullable()->change();
            $table->text('privacy_statement_url')->nullable()->change();
            $table->text('contribution_statement_url')->nullable()->change();
            $table->text('constitution_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->string('logo_url')->nullable()->change();
            $table->string('privacy_statement_url')->nullable()->change();
            $table->string('contribution_statement_url')->nullable()->change();
            $table->string('constitution_url')->nullable()->change();
        });
    }
};
