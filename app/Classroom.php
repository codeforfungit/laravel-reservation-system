<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    public function plans () {
        return $this->hasMany('App\Plan');
    }
}
