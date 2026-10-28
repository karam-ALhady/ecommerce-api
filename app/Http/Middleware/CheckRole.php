<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user('api') || $request->user('api')->role !== $role) {
            return response()->json([
                'message' => 'Forbidden. You do not have permission.'
            ], 403);
        }

        return $next($request);
    }
}
