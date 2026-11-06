<?php
use Illuminate\Support\Facades\Route;
Route::view('/', 'tool')->name('viewer');
Route::get('/local-routes', function () {
    $rows = collect(Route::getRoutes())->map(fn ($route) => [
        'method' => implode('|', $route->methods()),
        'uri' => $route->uri(),
        'name' => $route->getName(),
        'action' => $route->getActionName(),
        'middleware' => $route->gatherMiddleware(),
        'domain' => $route->getDomain(),
    ])->values();
    return response()->json($rows)->header('Cache-Control', 'no-store');
})->name('viewer.local');
