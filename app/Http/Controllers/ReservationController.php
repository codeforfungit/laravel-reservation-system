<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Reservation;
use App\Classroom;
use App\Plan;
use App\Equipment;

use GuzzleHttp\Pool;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;

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
        
        \Debugbar::info(compact('classroom', 'plan', 'reservations'));
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

        $reservation = auth()->user()->reserve(new Reservation([
            'plan_id' => $planId,
            'price' => $price,
            'start' => Carbon::createFromTimestamp(request('start')),
            'end' => Carbon::createFromTimestamp(request('end'))
        ]));

        if ($reservation === null) {
            return [
                'message' => 'Error With Making Reservation',
                'alert-type' => 'error'
            ];
        } else {
            // 增加設備至pivot table
            $reservation->equipment()->attach(request('equipment'));

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

    public function paid () {
        $client = new Client();
        $request = new GuzzleRequest("POST", "https://hooks.slack.com/services/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",
        [
            "Content-Type" => "application/json; charset=utf-8"
        ],
        "{\"text\":\"this is a book\"}");

        $response = $client->send($request);
        return "Response HTTP : " . $response->getStatusCode();
    }
}
