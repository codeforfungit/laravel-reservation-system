<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Reservation;

class ReservationMadeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->subject('已建立預約, 將為您保留24小時, 請儘快前往付款並完成預約程序')
            ->view('emails.made')
            ->with(compact([
            'reservation'
        ]));
    }
}
