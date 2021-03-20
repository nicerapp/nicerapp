<?php 
require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../3rd-party/sag/src/Sag.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);
if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}


global $cms;
$cms = new nicerAppCMS();
$cms->init();

$couchdbConfigFilepath = realpath(dirname(__FILE__).'/../../../').'/domainConfigs/'.$cms->domain.'/couchdb.json';
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);
$cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);

$databases = array (
    $cms->domain.'___cms_tree',
    $cms->domain.'___cms_tree__roles__guests',
    $cms->domain.'___cms_tree__user__administrator',
    $cms->domain.'___cms_tree__user__guest'
);
$data = array();
$ret = array();
foreach ($databases as $idx=>$dbName) {
    $cdb->setDatabase ($dbName, false);
    $docs = $cdb->getAllDocs();
    $data = $docs->body->rows;
    foreach ($data as $idx2=>$recordSummary) {
        $record = $cdb->get($recordSummary->id);
        $ret = array_merge ($ret, array(json_decode(json_encode($record->body),true)));
    }
}

echo json_encode($ret, JSON_PRETTY_PRINT);
?>