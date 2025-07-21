<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;

// Test simple pour voir si le fichier fonctionne
Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

// Authentification
Route::post('/login', [AuthController::class, 'login']);

// Gestion des utilisateurs
Route::apiResource('users', UserController::class);

// Gestion des tâches
Route::apiResource('tasks', TaskController::class);

