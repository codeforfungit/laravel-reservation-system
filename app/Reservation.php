<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Events\ReservationPaid;

class Reservation extends Model
{
    protected $fillable = [
        'plan_id',
        'start',
        'end',
        'price'
    ];

    public function user () {
        return $this->belongsTo('App\User');
    }
    public function userId () {
        return $this->belongsTo('App\User', 'user_id');
    }

    public function plan () {
        return $this->belongsTo('App\Plan');
    }
    public function planId () {
        return $this->belongsTo('App\Plan', 'plan_id');
    }

    public function classroom () {
        return $this->plan->classroom;
    }

    public function equipment () {
        return $this->belongsToMany('App\Equipment');
    }

    public function paid () {
        $this->status = 'paid';
        $this->save();
        event(new ReservationPaid($this));
    }
}
