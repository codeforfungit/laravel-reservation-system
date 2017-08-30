@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h1>預約單 ID: {{ $reservation->id }}</h1>
    </div>
    <div class="col-md-12">
      <p>付款結果: {{ $status }}</p>
      <p>訊息: {{ $message }}</p>
      <p><a href="{{ route('reservations') }}">瀏覽預約紀錄</a></p>
    </div>
  </div>
</div>
@endsection