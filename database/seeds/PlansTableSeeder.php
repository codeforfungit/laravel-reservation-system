<?php

use Illuminate\Database\Seeder;

class PlansTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('plans')->insert([
            'name'=>'方案A-1',
            'classroom_id'=>'1',
            'introduction' => '方案A-1的介紹',
            'price'=>800
        ]);

        DB::table('plans')->insert([
            'name'=>'方案A-2',
            'classroom_id'=>'1',
            'introduction' => '方案A-2的介紹',
            'price'=>1000
        ]);

        DB::table('plans')->insert([
            'name'=>'方案A-3',
            'classroom_id'=>'1',
            'introduction' => '方案A-3的介紹',
            'price'=>500
        ]);

        DB::table('plans')->insert([
            'name'=>'大講堂全廳',
            'classroom_id'=>'2',
            'introduction' => '大講堂的介紹',
            'price'=>3000
        ]);

        DB::table('plans')->insert([
            'name'=>'方案B-1',
            'classroom_id'=>'3',
            'introduction' => '方案B-1的介紹',
            'price'=>1300
        ]);

        DB::table('plans')->insert([
            'name'=>'方案B-2',
            'classroom_id'=>'3',
            'introduction' => '方案B-2的介紹',
            'price'=>1800
        ]);
    }
}
