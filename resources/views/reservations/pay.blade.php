@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h1>Pay for ID: {{ $reservation->id }}</h1>
    </div>
    <div class="col-md-12">
      <form name="Spgateway" method="post" action="{{ $postURL }}">
        MerchantID: <input type="text" name="MerchantID" value="{{ $postData['MerchantID'] }}">
        TradeInfo: <input type="text" name="TradeInfo" value="{{ $postData['TradeInfo'] }}">
        TradeSha: <input type="text" name="TradeSha" value="{{ $postData['TradeSha'] }}">
        Version: <input type="text" name="Version" value="{{ $postData['Version'] }}">
        <input type="submit" value="Submit">
      </form>
    </div>
  </div>
</div>
@endsection