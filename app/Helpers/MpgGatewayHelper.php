<?php

namespace App\Helpers;

/**
  * For MPGGateway version 1.4
  */
class MpgGatewayHelper {

  protected $merchantId;
  protected $hashKey;
  protected $hashIv;

  /**
     * Create a new MpgGatewayHelper instance.
     *
     * @return void
     */
  public function __construct($merchantId=NULL, $hashKey=NULL, $hashIv=NULL) {
    $this->merchantId = $merchantId ? $merchantId : env('MPG_MERCHANTID');
    $this->hashKey = $hashKey ? $hashKey : env('MPG_HASHKEY');
    $this->hashIv = $hashIv ? $hashIv : env('MPG_HASHIV');
  }

  public function getTradeInfo () {

  }

  static function AESEncrypt ($parameter="") {
    $key = env('MPG_KEY', 'key');
    $iv = env('MPG_IV', 'iv');

    $return_str = '';
    if (!empty($parameter)) {
      $return_str = http_build_query($parameter);
    }
    return trim(bin2hex(
      openssl_encrypt(addPadding($return_str), 'AES-256-CBC', $key, 0, $iv)
    ));

    // return trim(bin2hex(
    //   mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key,addPadding($return_str), MCRYPT_MODE_CBC, $iv)
    // ));
  }

  static function SHAEncrypt () {
    $key = env('MPG_KEY', 'key');
    $iv = env('MPG_IV', 'iv');
    return 'SHA';
  }
}

function addPadding($string, $blocksize = 32) {
  $len = strlen($string);
  $pad = $blocksize - ($len % $blocksize);
  $string .= str_repeat(chr($pad), $pad);
  return $string;
}