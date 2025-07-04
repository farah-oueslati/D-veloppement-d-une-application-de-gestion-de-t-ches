<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;

Route::apiResource('users', UserController::class);
Route::apiResource('tasks', TaskController::class);
Route::get('/test', \App\Http\Controllers\TestController::class);
