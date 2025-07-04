<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'API endpoint is working!',
            'data' => [
                'service' => 'Task Management API',
                'version' => '1.0',
                'timestamp' => now()->toDateTimeString()
            ]
        ]);
    }
}