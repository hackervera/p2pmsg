<?php
include('Crypt/RSA.php');
include('vdump.inc');
$rsa = new Crypt_RSA();
extract($rsa->createKey(512));
$rsa->loadKey($privatekey);
#var_dump($rsa->$privatekey);
#var_dump($rsa);
#print var_dump($rsa->exponent);
#$modulus = new Math_BigInteger('cc0f26cd602216e149fe8c2b4027293cd05cd5ccb8720d48a3e50c11c4ce5402cbd3d186e05f5bf15acb078c945f3ca99d0f1b4c7a01722704981afe7ba58f5b',16);
#print $modulus;
#$rsa->modulus = $modulus;
#print $modulus->toBytes();
#$exponent = new Math_BigInteger('7125236296591296008264008604020622444264428404280820660822086468020248284086068648486006044062808420660884868206084426060600488684860666602844868446066428');
#$rsa->exponent = $exponent;
#var_dump($rsa->modulus);
#var_dump($rsa->exponent);
$message = "I like cheese";
$hasher = new Crypt_Hash('sha1');
$hash = bin2hex($hasher->hash($message));
$priv = $rsa->exponent;
$modulus = $rsa->modulus->toHex();
echo "Hash ".$hash;
function RSASign($sHashHex, $pub, $priv) {//this function copied from the rsa.js script included in Tom Wu's jsbn library
  $n = new Math_BigInteger($pub,16);
  $sMid = "";	$fLen = (strlen($n->toBits()) / 4) - strlen($sHashHex) - 6;
  echo "Bitlength ".strlen($n->toBits());
  for ($i = 0; $i < $fLen; $i += 2) {
    $sMid = $sMid."ff";
    //echo "INTERATING\n";
  }
  $hPM = "0001" . $sMid . "00" . $sHashHex;//this pads the hash to desired length - not entirely sure whether those 'ff' should be random bytes for security or not
  echo "HPM ".$sMid."\n";
  $x = new Math_BigInteger($hPM, 16);//turn the padded message into a jsbn BigInteger object
  $d = new Math_BigInteger($priv,16);
  return $x->modPow($d, $n);
}
$testPub = "cc0f26cd602216e149fe8c2b4027293cd05cd5ccb8720d48a3e50c11c4ce5402cbd3d186e05f5bf15acb078c945f3ca99d0f1b4c7a01722704981afe7ba58f5b";
$testPriv = "880b6df62caa6d90a3d166480b8c504cf029848ce947789dbe4f1d7dd7352c0243dc83e5c7704632b0ad55e9086c11deb7bbda791b59a2eca8da99be6dde6a79";

$signature = RSASign($hash, $testPub, $testPriv);
$signature = $signature->toHex();
#var_dump($signature);
print "foo";
$modulus = $rsa->modulus->toHex();
print "bar";
#echo $message;
//$signature = strToHex($signature->toString());
print "baz";
var_dump($signature);
$socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
$telex = json_encode(array("+key" => $testPub, "_hop" => 1,"+end" => "8bf1cce916417d16b7554135b6b075fb16dd26ce","_to"=>"208.68.163.247:42424", "+sig"=>$signature, "+message"=>$message));
echo $telex;
#var_dump($rsa->publicExponent);
socket_sendto($socket, $telex, strlen($telex), 0, "telehash.org", 42424);
#var_dump($rsa);
?>
