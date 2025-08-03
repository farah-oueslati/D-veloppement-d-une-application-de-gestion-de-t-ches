<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Auth;

// Test simple pour voir si le fichier fonctionne
Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

// Authentification
Route::post('/login', [AuthController::class, 'login']);

// Gestion des utilisateurs
Route::apiResource('users', UserController::class);

// Gestion des tâches
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class);
});

Route::middleware('auth:sanctum')->get('/me', function () {
    return Auth::user();
});
