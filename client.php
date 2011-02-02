<?php
include('./phpseclib/Crypt/RSA.php');

//I ported this from javascript
function RSASign($sHashHex, $pub, $priv) {//this function copied from the rsa.js script included in Tom Wu's jsbn library
  $n = new Math_BigInteger($pub,16);
  $sMid = "";	$fLen = (strlen($n->toBits()) / 4) - strlen($sHashHex) - 6;
  for ($i = 0; $i < $fLen; $i += 2) {
    $sMid = $sMid."ff";
  }
  $hPM = "0001" . $sMid . "00" . $sHashHex;//this pads the hash to desired length - not entirely sure whether those 'ff' should be random bytes for security or not
  $x = new Math_BigInteger($hPM, 16);//turn the padded message into a jsbn BigInteger object
  $d = new Math_BigInteger($priv,16);
  return $x->modPow($d, $n);
}

$rsa = new Crypt_RSA();
extract($rsa->createKey(512));
$rsa->loadKey($privatekey);
$message = $argv[1];
$hasher = new Crypt_Hash('sha1');
$hash = bin2hex($hasher->hash($message));
$priv = $rsa->exponent->toHex();
$modulus = $rsa->modulus->toHex();
$signature = RSASign($hash, $modulus, $priv);
$signature = $signature->toHex();

$socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
$telex = json_encode(array("+key" => $modulus, "_hop" => 1,"+end" => "8bf1cce916417d16b7554135b6b075fb16dd26ce","_to"=>"208.68.163.247:42424", "+sig"=>$signature, "+message"=>$message));
socket_sendto($socket, $telex, strlen($telex), 0, "telehash.org", 42424);
?>
