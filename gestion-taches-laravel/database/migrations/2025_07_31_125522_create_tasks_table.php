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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['À faire', 'En cours', 'Terminé', 'Annulé'])->default('À faire');
            $table->enum('priority', ['Haute', 'Moyenne', 'Basse'])->default('Moyenne');
            $table->string('category')->default('Travail');
            $table->date('date')->nullable();
            $table->date('deadline')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // lien vers users
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
