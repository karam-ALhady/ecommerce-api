<?php

namespace Modules\Notifications\Listeners;

use Modules\Orders\Events\OrderCreated;
use Modules\Notifications\Notifications\OrderCreatedNotification;

class SendOrderCreatedNotification
{
    public function handle(OrderCreated $event): void
    {
        $event->order->user->notify(
            new OrderCreatedNotification($event->order)
        );
    }
}
