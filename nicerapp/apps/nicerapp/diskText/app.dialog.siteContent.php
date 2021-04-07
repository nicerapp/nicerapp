<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);    

require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../vividComponents/photoAlbum/4.0.0/functions.php');
$app = json_decode (base64_decode_url($_GET['apps']), true);

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);
/*if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}*/


?>
<!--<div class="lds-facebook"><!-- thanks for allowing CC0 license usage : https://loading.io/css/ -- ><div></div><div></div><div></div></div> -->
<!--<pre><?php //echo json_encode($app, JSON_PRETTY_PRINT);?></pre>-->

<?php
global $cms;
$cms = new nicerAppCMS();
$cms->init();

$file = realpath(dirname(__FILE__).'/../../../').'/domainConfigs/'.$cms->domain.'/app.'.$_GET['id'].'.dialog.siteContent.php';
echo execPHP($file);
?>
