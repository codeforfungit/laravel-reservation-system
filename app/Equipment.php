<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    public function reservations () {
        return $this->belongsToMany('App\Reservation');
    }
}
