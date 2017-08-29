<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

use GuzzleHttp\Pool;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;

use App\Events\ReservationMade;
use App\Mail\ReservationMadeMail;

class SendMadeNotification
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
     * @param  ReservationMade  $event
     * @return void
     */
    public function handle(ReservationMade $event)
    {
        // 通知slack
        $data = [
            'text'=> '有人建立的新的預約, 但尚未付款. 預約ID: ' . $event->reservation->id . "."
        ];
        $client = new Client();
        $request = new GuzzleRequest("POST", "https://hooks.slack.com/services/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",
        [
            "Content-Type" => "application/json; charset=utf-8"
        ],
        json_encode($data));
        $response = $client->send($request);
        
        // 通知預約者
        Mail::to($event->reservation->user)
            ->send(new ReservationMadeMail($event->reservation));

        return;
    }
}
