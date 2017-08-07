<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/classrooms', 'ClassroomController@index')->name('classrooms');

Route::get('/classrooms/{id}', 'ClassroomController@show')->name('showClassroom');

Route::get('/reservations', 'ReservationController@index')->middleware('auth')->name('reservations');
Route::get('/reservations/{planId}/create', 'ReservationController@create')->middleware('auth')->name('createReservation');
Route::post('/reservations/{planId}', 'ReservationController@store')->middleware('auth');

Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});


Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});


Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});
