@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h1>Pay for ID: {{ $reservation->id }}</h1>
    </div>
    <div class="col-md-12">
      <form name="Spgateway" method="post" action="https://core.spgateway.com/MPG/mpg_gateway">
        MerchantID: <input type="text" name="MerchantID" value="MS32284558">
        TradeInfo: <input type="text" name="TradeInfo" value="AES">
        TradeSha: <input type="text" name="TradeSha" value="SHA">
        Version: <input type="text" name="Version" value="1.4">
        <input type="submit" value="Submit">
      </form>
    </div>
  </div>
</div>
@endsection