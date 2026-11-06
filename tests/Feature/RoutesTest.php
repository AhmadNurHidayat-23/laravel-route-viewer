<?php
namespace Tests\Feature;
use Tests\TestCase;
class RoutesTest extends TestCase
{
    public function test_local_routes_only_list_this_application(): void
    {
        $this->get('/local-routes')->assertOk()->assertJsonFragment(['name' => 'viewer.local', 'uri' => 'local-routes']);
    }
}
