@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <div class="panel panel-default">
        <!-- Default panel contents -->
        <div class="panel-heading">預約紀錄</div>

        <!-- Table -->
        <table class="table">
          {{-- Heading --}}
          <tr>
            <th>#</th>
            <th>教室</th>
            <th>方案</th>
            <th>預約時段</th>
            <th>狀態</th>
          </tr>

          {{-- Body --}}
          @foreach($reservations as $key=>$reservation)
          <tr>
            <td>{{ $key+1 }}</td>
            <td><a href="{{ route('showClassroom', $reservation->plan->classroom->id) }}">{{ $reservation->plan->classroom->name }}</a></td>
            <td><a href="{{ route('createReservation', $reservation->plan->id) }}">{{ $reservation->plan->name }}</a></td>
            <td>{{ $reservation->start }}</td>
            <td>{{ $reservation->status }}</td>
          </tr>
          @endforeach
        </table>
      </div>
    </div>
  </div>
</div>
@endsection