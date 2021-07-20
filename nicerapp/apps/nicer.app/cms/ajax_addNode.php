<?php
require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../3rd-party/sag/src/Sag.php');
require_once (dirname(__FILE__).'/../../../Sag-support-functions.php');
global $naDebugAll; 
$debug = $naDebugAll;
if ($debug) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

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


global $cms;
$cms = new nicerAppCMS();
$cms->init();

$couchdbConfigFilepath = realpath(dirname(__FILE__).'/../../../').'/domainConfigs/'.$cms->domain.'/couchdb.json';
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);
$cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);

$dbName = str_replace ('.', '_', $_POST['database']);

// create users
$cdb->setDatabase($dbName,false);
try { $parent = $cdb->get($_POST['parent']); } catch (Exception $e) { 
    if ($debug) cdb_error (404, $e, 'could not find record with id='.$_POST['parent'].' in database '.$_POST['database']); die();
};

if (
    $parent->body->type !== 'naFolder'
    && $parent->body->type !== 'naMediaFolder'
) {
    if ($debug) cdb_error (403, null, 'parent record is not of the correct type ("naFolder" or "naMediaFolder")'); die();
}

if (
    $_POST['type'] !== 'naFolder'
    && $_POST['type'] !== 'naDocument'
    && $_POST['type'] !== 'naMediaFolder'
) {
    if ($debug) cdb_error (403, null, 'record to be added is not of the correct type ("naFolder" or "naDocument" or "naMediaFolder")'); die();
}

if ($_POST['type'] == 'naFolder') {
    $text = array_key_exists('label',$_POST)?$_POST['label']:'New';
    $state = array ("opened" => true);
}
if ($_POST['type'] == 'naDocument') {
    $text = array_key_exists('label',$_POST)?$_POST['label']:'New';
    $state = '';
}
if ($_POST['type'] == 'naMediaFolder') {
    $text = array_key_exists('label',$_POST)?$_POST['label']:'New';
    $state = array ("opened" => true);
}

//$children = $cdb->find (...)
// check if children already have ->text==$text
$findCommand = array (
    'selector' => array ( 'parent' => $_POST['parent'] ),
    'fields' => array ( '_id', 'text' )    
);
$call = $cdb->find ($findCommand);
$textFinal = $text;
$textNum = 1;
$found = true;
while ($found) {
    $found = false;
    for ($i=0; $i<count($call->body->docs); $i++) {
        if ($call->body->docs[$i]->text == $textFinal) {
            $textFinal = $text.' ('.$textNum.')';
            $textNum++;
            $found = true;
            break;
        }
    }
}
$id = array_key_exists('id',$_POST) ? $_POST['id'] : cdb_randomString(10);
$recordToAdd = array (
    '_id' => $id,
    'id' => $id,
    'database' => $_POST['database'],
    'parent' => $_POST['parent'],
    'type' => $_POST['type'],
    'text' =>  $textFinal,
    'state' => $state
);

try { $call = $cdb->post($recordToAdd); } catch (Exception $e) {
    if ($debug) cdb_error (500, $e, 'Could not add record'); die();
}

$dbg = array (
    'success' => true,
    'msg' => 'Record added',
    'recordAdded' => $recordToAdd
);
echo json_encode($dbg);
?>
