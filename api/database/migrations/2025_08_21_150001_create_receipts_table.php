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
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->nullable();
            $table->string('receipt_type');
            $table->timestamp('document_date');
            $table->integer('amount');

            $table->foreignId('club_id')
                ->constrained('clubs')
                ->cascadeOnDelete();

            $table->foreignId('finance_contact_id')
                ->nullable()
                ->constrained('finance_contacts')
                ->cascadeOnDelete();

            $table->foreignId('tax_account_id')
                ->nullable()
                ->constrained('tax_accounts')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
