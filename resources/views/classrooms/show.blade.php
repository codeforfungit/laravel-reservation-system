@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <h1>{{ $classroom->name }}</h1>
            <p>{!! $classroom->introduction !!}</p>
            <ul class="list-group">
                @foreach($plans as $plan)
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{ $plan->name }}</h3>
                    </div>
                    <div class="panel-body">
                        {!! $plan->introduction !!}
                    </div>
                    <div class="panel-footer">
                        <a href="{{ route('createReservation', $plan->id) }}" class="btn btn-default">預約</a>
                    </div>
                </div>
                @endforeach
            </ul>
        </div>
    </div>
</div>
@endsection
