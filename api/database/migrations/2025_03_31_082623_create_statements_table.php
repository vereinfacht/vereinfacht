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
        Schema::create('statements', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->nullable();
            $table->timestamp('date')->nullable();

            $table->foreignId('finance_account_id')
                ->constrained('finance_accounts')
                ->cascadeOnDelete();
            $table->foreignId('club_id')
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
        Schema::dropIfExists('statements');
    }
};
