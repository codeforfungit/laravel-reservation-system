@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <h1>教室一覽</h1>
            <ul class="list-group">
              @foreach($classrooms as $classroom)
              <li class="list-group-item">
                <a href="{{ route('showClassroom', $classroom->id) }}">
                {{ $classroom->name }}
                </a>
              </li>
              @endforeach
            </ul>
        </div>
    </div>
</div>
@endsection
