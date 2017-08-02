<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'plan_id',
        'start',
        'end'
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
}
