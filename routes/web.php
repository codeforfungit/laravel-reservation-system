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
Route::post('/reservations/{reservation}/paidreturn', 'ReservationController@paidReturn')->name('paidReturn');
Route::get('/reservations/{planId}/create', 'ReservationController@create')->middleware('auth')->name('createReservation');
Route::post('/reservations/{planId}', 'ReservationController@store')->middleware('auth');
Route::get('/reservations/{reservation}/pay', 'ReservationController@pay')->middleware('auth')->name('pay');

$adminPrefix = 'admin';
Route::group(['prefix' => $adminPrefix], function () {
    Voyager::routes();
    
    // Admin Media Crop Image
    Route::post('/media/crop_image', 'CustomMediaController@crop')->name('crop');
});