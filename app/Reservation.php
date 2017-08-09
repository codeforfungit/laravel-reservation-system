<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

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

    public function plan () {
        return $this->belongsTo('App\Plan');
    }

    public function classroom () {
        return $this->plan->classroom;
    }

    public function equipment () {
        return $this->belongsToMany('App\Equipment');
    }
}
