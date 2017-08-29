<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

use GuzzleHttp\Pool;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;

use App\Events\ReservationPaid;
use App\Mail\ReservationPaidMail;

class SendPaidNotification
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
        // 通知slack
        $data = [
            'text'=> '預約ID: ' . $event->reservation->id . ", 已完成付款, 請前往後臺進行確認."
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
            ->send(new ReservationPaidMail($event->reservation));

        return;
    }
}
