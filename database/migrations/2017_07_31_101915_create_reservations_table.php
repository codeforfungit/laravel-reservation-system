<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('plan_id');
            $table->dateTime('start');
            $table->dateTime('end');
            
            // pending, confirmed
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // 若是想要一次預約多個時段
        // Schema::create('reserved_times', function (Blueprint $table) {
        //     $table->increments('id');
        //     $table->integer('reservation_id');
        //     $table->dateTime('start');
        //     $table->dateTime('end');
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservations');
        // Schema::dropIfExists('reserved_times');
    }
}
