<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GzipApiResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (
            !function_exists('gzencode') ||
            !str_contains($request->header('Accept-Encoding', ''), 'gzip') ||
            $response->headers->has('Content-Encoding')
        ) {
            return $response;
        }

        $content = $response->getContent();
        if (!is_string($content) || strlen($content) < 1024) {
            return $response;
        }

        $compressed = gzencode($content, 6);
        if ($compressed === false) {
            return $response;
        }

        $response->setContent($compressed);
        $response->headers->set('Content-Encoding', 'gzip');
        $response->headers->set('Vary', 'Accept-Encoding', false);
        $response->headers->set('Content-Length', (string) strlen($compressed));

        return $response;
    }
}
