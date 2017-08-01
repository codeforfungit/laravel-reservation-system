@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
          <div class="jumbotron">
            <h1>教室: {{ $classroom->name }}</h1>
            <p>方案: {{ $plan->name }}</p>
          </div>
        </div>
    </div>

    <div class="row">
      
      <div class="col-md-12">
        <div class="form-group">
          <div class="input-group">
            <label for="bookdate">預約日期：</label>
            <input type="date" id="bookdate" placeholder="2014-09-18">
          </div>

          <div class="input-group">
            <label for="bookdate">預約時段：</label>
            <input type="time" id="bookdate" placeholder="2014-09-18">
          </div>
        </div>
      </div>

    </div>
</div>
@endsection

@section('script')
@endsection
