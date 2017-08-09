<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Reservation;
use App\Classroom;
use App\Plan;
use App\Equipment;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (auth()->check()) {
            $reservations = auth()->user()
                ->reservations()
                ->orderBy('start', 'asc')
                ->get();
            return view('reservations.index', compact('reservations'));
        } else {
            return;
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($planId)
    {
        $plan = Plan::findOrFail($planId);
        $classroom = $plan->classroom;
        
        // 取出已被預約時段
        $reservations = $plan->reservations()
            ->where('start', '>', time())
            ->pluck('start');

        $equipment = Equipment::all();

        // 將互斥的方案預約時段加入
        $exclusivePlanIdArray = json_decode($plan->exclusive_ids);
        if(is_array($exclusivePlanIdArray) && count($exclusivePlanIdArray)>0 ){
            foreach($exclusivePlanIdArray as $exclusivePlanId) {
                $exclusivePlan = Plan::find($exclusivePlanId);
                $exclusiveReservations = $exclusivePlan->reservations()
                                            ->where('start', '>', time())
                                            ->pluck('start');
                $reservations = $reservations->merge($exclusiveReservations);
            }
        }
        
        \Debugbar::info(compact('classroom', 'plan', 'reservations'));
        return view('reservations.create', compact('classroom', 'plan', 'reservations', 'equipment'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($planId)
    {
        if (auth()->check())
        {
            $plan = Plan::find($planId);
            $equipment = Equipment::find(request('equipment'));
            
            $price = 0;
            foreach ($equipment as $item) {
                $price += $item->price;
            }
            $price += $plan->price;

            $reservation = auth()->user()->reserve(new Reservation([
                'plan_id' => $planId,
                'price' => $price,
                'start' => Carbon::createFromTimestamp(request('start')),
                'end' => Carbon::createFromTimestamp(request('end'))
            ]));

            $reservation->equipment()->attach(request('equipment'));
            
            return response()->json([
                'reservation' => $reservation
            ]);
        } else {
            return response()->json([
                'error' => 'did not login'
            ]);
        }        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
