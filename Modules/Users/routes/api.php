<?php

use Illuminate\Support\Facades\Route;
use Modules\Users\Http\Controllers\UserController;

Route::post('/register', [UserController::class, 'register']);

Route::post('/login', [UserController::class, 'login'])
    ->middleware('throttle:5,1');

Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
});
