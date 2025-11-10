<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tax_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tax_account_chart_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('account_number');
            $table->text('description')->nullable();

            $table->foreignId('club_id')
                ->nullable()
                ->constrained('clubs')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_accounts');
    }
};
