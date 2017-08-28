<?php

namespace App\Listeners;

use App\Events\ReservationPaid;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ReservationPaid  $event
     * @return void
     */
    public function handle(ReservationPaid $event)
    {
        //
    }
}
