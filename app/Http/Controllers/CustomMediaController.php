<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Storage;

class CustomMediaController extends Controller
{
    public function crop ($overWrite = true) {
        $dataX = request('dataX');
        $dataY = request('dataY');
        $dataHeight = request('dataHeight');
        $dataWidth = request('dataWidth');
        $image_path = public_path('storage/' . request('working_dir') . '/' . request('img'));
        // $crop_path = $image_path;
        $success = true;
        $error = '';

        \Debugbar::info($dataX);
        \Debugbar::info($dataY);
        \Debugbar::info($dataHeight);
        \Debugbar::info($dataWidth);
        \Debugbar::info($image_path);
        // return 'crop';

        // 切割後產生新圖功能, 暫時不實作
        // if (! $overWrite) {
        //     $fileParts = explode('.', request('img'));
        //     $fileParts[count($fileParts) - 2] = $fileParts[count($fileParts) - 2] . '_cropped_' . time();
        //     $crop_path = parent::getCurrentPath(implode('.', $fileParts));
        // }

        // crop image
        \Image::make($image_path)
            ->crop($dataWidth, $dataHeight, $dataX, $dataY)
            ->save();

        return compact('success', 'error');
    }    
}
