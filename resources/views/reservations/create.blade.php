@extends('layouts.app')

@section('content')
  <reservation :classroom="{{ $classroom }}" :plan="{{ $plan }}" :reservations="{{ $reservations }}" :vocations="{{ $vocations }}" :equipment="{{ $equipment }}"></reservation>
@endsection

@section('script')
@endsection
