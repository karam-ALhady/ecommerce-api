<?php
namespace Modules\Notifications\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Modules\Orders\Events\OrderCreated;
use Modules\Notifications\Listeners\SendOrderCreatedNotification;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        OrderCreated::class => [
            SendOrderCreatedNotification::class,
        ],
    ];

    protected static $shouldDiscoverEvents = false;
}
