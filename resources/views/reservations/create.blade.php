@extends('layouts.app')

@section('content')
  <reservation :classroom="{{ $classroom }}" :plan="{{ $plan }}" :reservations="{{ $reservations }}"></reservation>
@endsection

@section('script')
@endsection
