<?php

namespace App\Helpers;
/**
  * For MPGGateway version 1.4
  */
class MpgGatewayHelper {

  const VERSION = '1.4';
  const POSTURL = 'https://core.spgateway.com/MPG/mpg_gateway';
  const TESTPOSTURL = 'https://ccore.spgateway.com/MPG/mpg_gateway';
  

  protected $merchantId;
  protected $hashKey;
  protected $hashIv;
  protected $parameters;
  protected $testMode;
  /**
     * Create a new MpgGatewayHelper instance.
     *
     * @return void
     */
  public function __construct($testMode = true, $orderNumber, $amount, $desc, $email, $comment = null) {
    $this->testMode = $testMode;

    if ($this->getTestMode()) {
      $this->merchantId = env('MPG_TEST_MERCHANTID');
      $this->hashKey = env('MPG_TEST_HASHKEY');
      $this->hashIv = env('MPG_TEST_HASHIV');
    } else {
      $this->merchantId = env('MPG_MERCHANTID');
      $this->hashKey = env('MPG_HASHKEY');
      $this->hashIv = env('MPG_HASHIV');
    }

    $this->parameters = array(
      // 商店代號
      'MerchantID' => $this->getMerchantId(),

      // 回傳格式: 'String' | 'JSON'
      'RespondType' => 'JSON',
      
      // 時間戳記
      'TimeStamp' => time(),

      // 串接程式版本
      'Version' => MpgGatewayHelper::VERSION,

      // 商品訂單編號
      'MerchantOrderNo' => $orderNumber,

      // 商品金額
      'Amt' => $amount,
      
      // 商品描述
      'ItemDesc' => $desc,
      
      // 交易限制秒數
      // 'TradeLimit' => 0,

      // 繳費有效期限
      // 'ExpireDate' => \Carbon\Carbon::now()->tomorrow()->format('Ymd'),

      // 語系 'en' | 'zh-TW'
      // 'LangType' => 'zh-TW',

      // 支付完成後, 客戶返回的網址
      'ReturnURL' => route('paidReturn', $orderNumber),

      // 支付完成後, 系統通知的網址
      'NotifyURL' => route('paidNotify', $orderNumber),
      
      // 系統取號之後post的網址, 留空則會顯示在智付通頁面
      // 'CustomerURL' => '',
      
      // 交易取消時, 客戶點擊返回鈕回到的網址
      // 'ClientBackURL' => '',
      
      // 客戶email, 完成支付後會通知此email
      'Email' => $email,
      
      // email是否可以修改
      // 'EmailModify' => 0,
      
      // 是否需要登入智付通
      'LoginType' => 0,
      
      // 是否開啟信用卡
      // 'CREDIT' => 1,
      
      // 是否開啟信用卡分期
      // 'InstFlag' => '1',
      
      // 是否開啟紅利點數兌換
      // 'CreditRed' => 1,
      
      // 是否開啟銀聯卡
      // 'UNIONPAY' => 1,
      
      // 是否開啟WebATM
      // 'WEBATM' => 1,
      
      // 是否開啟轉帳
      // 'VACC' => 1,
      
      // 是否開啟超商代碼繳費
      // 'CVS' => 1,
      
      // 是否開啟超商條碼繳費
      // 'BARCODE' => 1,

      // 是否開啟Pay2go電子錢包支付
      // 'P2G' => 1,
    );

    if (isset($comment)) {
      // 訂單備註
      $this->setParameter('OrderComment', $comment);
    }
  }

  public function setTestMode ($isTestMode) {
    $this->testMode = $isTestMode;
  }

  public function getTestMode () {
    return $this->testMode;
  }

  public function getPostURL () {
    return $this->getTestMode() ? MpgGatewayHelper::TESTPOSTURL : MpgGatewayHelper::POSTURL;
  }

  public function getMerchantId () {
    return $this->merchantId;
  }

  public function getHashKey () {
    return $this->hashKey;
  }

  public function getHashIv () {
    return $this->hashIv;
  }

  public function setParameter ($key, $value) {
    $this->parameters[$key] = $value;
  }

  public function getParameters () {
    return $this->parameters;
  }

  public function getPostData () {
    $tradeInfo = $this->getTradeInfo();
    $tradeSha = $this->getTradeSha($tradeInfo);

    $postData = array(
      'MerchantID' => $this->getMerchantId(),
      'TradeInfo' => $tradeInfo,
      'TradeSha' => $tradeSha,
      'Version' => MpgGatewayHelper::VERSION
    );
    
    return $postData;
  }

  protected function getTradeInfo () {
    $parameters = $this->getParameters();
    return MpgGatewayHelper::AESEncrypt($parameters);
  }

  protected function getTradeSha ($tradeInfo) {
    $stringForEncrypt = 'HashKey=' . $this->getHashKey() . '&' .
                     $tradeInfo . '&' . 'HashIV=' . $this->getHashIv();

    return strtoupper(hash("sha256", $stringForEncrypt));
  }

  static function checkTradeSha ($tradeSha, $tradeInfo) {
    if (env('MPG_MODE') === 'test') {
      $key = env('MPG_TEST_HASHKEY');
      $iv = env('MPG_TEST_HASHIV');
    } else {
      $key = env('MPG_HASHKEY');
      $iv = env('MPG_HASHIV');
    }
    $stringForEncrypt = 'HashKey=' . $key . '&' .
                        $tradeInfo . '&' . 'HashIV=' . $iv;
    return strtoupper(hash("sha256", $stringForEncrypt)) === $tradeSha;
  }

  static function AESEncrypt ($parameters="") {
    if (env('MPG_MODE') === 'test') {
      $key = env('MPG_TEST_HASHKEY');
      $iv = env('MPG_TEST_HASHIV');
    } else {
      $key = env('MPG_HASHKEY');
      $iv = env('MPG_HASHIV');
    }
    
    $return_str = '';
    if (!empty($parameters)) {
      ksort($parameters);
      $return_str = http_build_query($parameters);
    }
    
    return trim(bin2hex(openssl_encrypt($return_str, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv)));
  }

  static function AESDecrypt ($tradeInfo) {
    if (env('MPG_MODE') === 'test') {
      $key = env('MPG_TEST_HASHKEY');
      $iv = env('MPG_TEST_HASHIV');
    } else {
      $key = env('MPG_HASHKEY');
      $iv = env('MPG_HASHIV');
    }

    $cipher = hex2bin($tradeInfo);

    return MpgGatewayHelper::removePKCS7Padding(openssl_decrypt(
      $cipher,
      'AES-256-CBC',
      $key,
      OPENSSL_RAW_DATA | OPENSSL_NO_PADDING,
      $iv
    ));
  }

  // for mcrypt only
  static function addPKCS7Padding ($string, $blockSize = 32) {
    $len = strlen($string);
    $pad = $blockSize - ($len % $blockSize);
    $string .= str_repeat(chr($pad), $pad);
    return $string;
  }

  static function removePKCS7Padding ($string) {
      $slast = ord(substr($string, -1));
      $slastc = chr($slast);
      if (preg_match("/$slastc{" . $slast . "}/", $string)) {
          $string = substr($string, 0, strlen($string) - $slast);
          return $string;
      } else {
          return false;
      }
  }
}