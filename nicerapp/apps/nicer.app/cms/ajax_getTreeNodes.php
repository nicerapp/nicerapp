<?php 
require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../3rd-party/sag/src/Sag.php');
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/

global $naIP;
$ip = $naIP;
/*if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}*/
/*
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.gc_maxlifetime', 3600);
    session_start(); 
};*/

global $cms;
$cms = new nicerAppCMS();
$cms->init();

$couchdbConfigFilepath = realpath(dirname(__FILE__).'/../../../').'/domainConfigs/'.$cms->domain.'/couchdb.json';
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);

$username = array_key_exists('cdb_loginName',$_SESSION) ? $_SESSION['cdb_loginName'] : $cdbConfig['username'];
$username = str_replace(' ', '__', $username);
$username = str_replace('.', '_', $username);
$pw = array_key_exists('cdb_pw',$_SESSION) ? $_SESSION['cdb_pw'] : $cdbConfig['password'];
$cdb->login($username, $pw);

$cdb_domain = $cms->domain;
$cdb_domain = str_replace('.','_',$cdb_domain);

$databases = array (
    $cdb_domain.'___cms_tree',
    $cdb_domain.'___cms_tree__role___guests',
    $cdb_domain.'___cms_tree__user___'.strtolower($username)
    //$cms->domain.'___cms_tree__user__administrator',
    //$cms->domain.'___cms_tree__user__guest'
);

$data = array();
$ret = array();
foreach ($databases as $idx=>$dbName) {
    //trigger_error ('ajax_getTreeNodes.php : $dbName='.$dbName, E_USER_NOTICE);
    try { $cdb->setDatabase ($dbName, false); } catch (Exception $e) { echo $e->getMessage(); };
    try { $docs = $cdb->getAllDocs(); } catch (Exception $e) { echo $e->getMessage(); };
    $data = $docs->body->rows;
    foreach ($data as $idx2=>$recordSummary) {
        $record = $cdb->get($recordSummary->id);
        $ret = array_merge ($ret, array(json_decode(json_encode($record->body),true)));
    }
}

echo json_encode($ret, JSON_PRETTY_PRINT);
?>
