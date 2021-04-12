<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);    

require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../userInterface/photoAlbum/4.0.0/functions.php');
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

$couchdbConfigFilepath = realpath(dirname(__FILE__).'/../../../').'/domainConfigs/'.$cms->domain.'/couchdb.json';
//var_dump ($couchdbConfigFilepath); die();
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);
$cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);

$cdb->setDatabase(str_replace('_tree', '_documents', $app['cmsText']['database']),false);
try { $call = $cdb->get ($app['cmsText']['id']); } catch (Exception $e) { echo $e->getMessage(); die(); };

$doc = $call->body->document;
$p = preg_match ('/:{.*}:/', $doc, $matches, PREG_OFFSET_CAPTURE);
//echo '<pre style="color:yellow;background:black;">'; var_dump ($matches); echo '</pre><br/>'; //die();
foreach ($matches as $idx => $match) {
    $cmd = json_decode (substr($match[0],1,strlen($match[0])-2), true);
    if (array_key_exists('mediaFolder',$cmd)) {
        $doc = str_replace ($match[0], naPhotoAlbum($cmd['mediaFolder']), $doc);
    }
}

echo $doc;

?>
