<?php

use Illuminate\Database\Seeder;

class ClassroomsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('classrooms')->insert([
            'name' => '教室A',
            'introduction' => '教室A的介紹'
        ]);

        DB::table('classrooms')->insert([
            'name' => '大講堂',
            'introduction' => '大講堂的介紹'
        ]);

        DB::table('classrooms')->insert([
            'name' => '教室B',
            'introduction' => '教室B的介紹'
        ]);
    }
}
