<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{

    // for Voyager bread relation
    public function classroomId () {
        return $this->belongsTo('App\Classroom', 'classroom_id');
    }

    public function classroom () {
        return $this->belongsTo('App\Classroom');
    }

    public function reservations () {
        return $this->hasMany('App\Reservation');
    }

    public function exclusiveIds () {
        return $this->hasOne('App\PlanExclusive');
    }
}
