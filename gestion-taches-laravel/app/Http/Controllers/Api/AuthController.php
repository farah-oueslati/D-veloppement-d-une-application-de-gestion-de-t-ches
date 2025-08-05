<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Hash;
use App\Models\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        // Crée un token personnel
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,  // <-- renvoi du token ici
        ], 200);
    }

}
