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
        if (!auth()->check()) {
            return [
                'message' => 'Authorization fail.',
                'alert-type' => 'warning'
            ];
        }

        $reservations = auth()->user()
            ->reservations()
            ->orderBy('start', 'asc')
            ->get();
        return view('reservations.index', compact('reservations'));
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
        
        // 取出"未來"已被預約時段
        $reservations = $plan->reservations()
            ->where('start', '>', \Carbon\Carbon::now())
            ->pluck('start');

        // 取出"未來"已被設定為假日的日期
        $vocations = \App\Vocation::where('start', '>', \Carbon\Carbon::now())->get();

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
        
        return view('reservations.create', compact('classroom', 'plan', 'reservations', 'vocations', 'equipment'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($planId)
    {
        if (!auth()->check()) {
            return [
                'message' => 'Authorization fail.',
                'alert-type' => 'warning'
            ];
        }

        $plan = Plan::find($planId);
        $equipment = Equipment::find(request('equipment'));
        
        $price = 0;
        foreach ($equipment as $item) {
            $price += $item->price;
        }
        $price += $plan->price;

        try {
            $reservation = auth()->user()->reserve(new Reservation([
                'plan_id' => $planId,
                'price' => $price,
                'start' => Carbon::createFromTimestamp(request('start')),
                'end' => Carbon::createFromTimestamp(request('end'))
            ]));
            $reservation->equipment()->attach(request('equipment'));
            event(new \App\Events\ReservationMade($reservation));                        
            if (request()->ajax()) {
                return [
                    'reservation' => $reservation,
                    'message' => 'Successfully Reserve',
                    'alert-type' => 'success'
                ];
            } else {
                return redirect()
                    ->route('reservations')
                    ->with([
                        'message'    => "Successfully Reserve",
                        'alert-type' => 'success',
                    ]);
            }
        } catch (\Exception $e) {
            return [
                'message' => $e->getMessage(),
                'alert-type' => 'error'
            ];
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

    public function pay (Reservation $reservation) {
        return view('reservations.pay')->with(compact([
            'reservation'
        ]));
    }

    public function paid (Reservation $reservation) {
        // 檢查此request是否為正確的金流方資訊
        if (true) {
            $reservation->status = 'paid';
            $reservation->save();
            event(new \App\Events\ReservationPaid($reservation));                        
            return $reservation;
        } else {
            return;
        }
    }

    function create_mpg_aes_Encrypt ($parameter = "" , $key = "PKTeWwtNOXH6Q9Q1Qi4zaj3wjUtK956Z", $iv = "PZdLwHzkEgruqhvg") {
        $return_str = '';
        if (!empty($parameter)) {
            $return_str = http_build_query($parameter);
        }
        return trim(bin2hex(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, addpadding($return_str), MCRYPT_MODE_CBC, $iv)));
    }
}
