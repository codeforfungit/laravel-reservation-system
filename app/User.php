<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Reservation;
use App\Vocation;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function reservations () {
        return $this->hasMany('App\Reservation');
    }

    public function reserve (Reservation $reservation) {
        if (Reservation::whereBetween('start', [$reservation->start, $reservation->end])->orWhereBetween('end', [$reservation->start, $reservation->end])->count() > 0) {
            // return null;
            throw new \Exception('該時段已被預約.');
        }

        if (Vocation::where('start', '<=', $reservation->start)->where('end', '>=', $reservation->start)->count() > 0 || 
            Vocation::where('start', '<=', $reservation->end)->where('end', '>=', $reservation->end)->count() > 0) {
                // return null;
            throw new \Exception('該時段無法進行預約.');
        }

        return $this->reservations()->save($reservation);
    }
}
