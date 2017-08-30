<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Reservation;
use App\Classroom;
use App\Plan;
use App\Equipment;
use App\Helpers\MpgGatewayHelper;

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
        $mpg = new MpgGatewayHelper(
            env('MPG_MODE')==='test',
            $reservation->id,
            $reservation->price,
            $reservation->plan->name,
            $reservation->user->email,
            implode(', ', $reservation->equipment->pluck('name')->all())
        );
        $postData = $mpg->getPostData();
        $postURL = $mpg->getPostURL();

        return view('reservations.pay')->with(compact([
            'reservation',
            'postData',
            'postURL'
        ]));
    }

    public function paidNotify (Reservation $reservation) {
        \Log::info('收到金流付款通知!');
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

    public function paidReturn (Reservation $reservation) {
        \Debugbar::info(request());

        // $mpg = new MpgGatewayHelper(
        //     env('MPG_MODE')==='test',
        //     $reservation->id,
        //     $reservation->price,
        //     $reservation->plan->name,
        //     $reservation->user->email,
        //     implode(', ', $reservation->equipment->pluck('name')->all())
        // );

        if (!MpgGatewayHelper::checkTradeSha(request('TradeSha'), request('TradeInfo'))) {
            return 'SHA檢查錯誤';
        }

        \Debugbar::info(json_decode(
            MpgGatewayHelper::AESDecrypt(request('TradeInfo'))
        ));
        $plainObject = json_decode(MpgGatewayHelper::AESDecrypt(request('TradeInfo')));
        $status = $plainObject->Status;
        $message = $plainObject->Message;
        $resule = $plainObject->Result;

        return view('reservations.paidreturn')->with(compact([
            'reservation',
            'status',
            'message'
        ]));
        return json_decode(MpgGatewayHelper::AESDecrypt(request('TradeInfo')));
    }
}
