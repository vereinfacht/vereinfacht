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
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('extended_title')->nullable();
            $table->string('address');
            $table->string('zip_code');
            $table->string('city');
            $table->string('country');
            $table->string('email');
            $table->string('primary_color')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('privacy_statement_url')->nullable();
            $table->string('contribution_statement_url')->nullable();
            $table->string('constitution_url')->nullable();
            $table->foreignId('owner_user_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clubs');
    }
};
