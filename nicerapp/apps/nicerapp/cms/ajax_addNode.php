<?php
require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../3rd-party/sag/src/Sag.php');
require_once (dirname(__FILE__).'/../../../Sag-support-functions.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

// create users
$cdb->setDatabase($_POST['database'],false);
try { $parent = $cdb->get($_POST['parent']); } catch (Exception $e) { 
    cdb_error (404, $e, 'could not find record with id='.$_POST['parent'].' in database '.$_POST['database']); die();
};

if (
    $parent->body->type !== 'naFolder'
) {
    cdb_error (403, null, 'parent record is not of the correct type ("naFolder")'); die();
}

if (
    $_POST['type'] !== 'naFolder'
    && $_POST['type'] !== 'naDocument'
    && $_POST['type'] !== 'naMediaFolder'
) {
    cdb_error (403, null, 'record to be added is not of the correct type ("naFolder" or "naDocument" or "naMediaFolder")'); die();
}

if ($_POST['type'] == 'naFolder') {
    $text = 'New Folder';
    $state = '{"opened":true}';
}
if ($_POST['type'] == 'naDocument') {
    $text = 'New Document';
    $state = '';
}
if ($_POST['type'] == 'naMediaFolder') {
    $text = 'New Document';
    $state = '';
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
$id = cdb_randomString(10);
$recordToAdd = array (
    '_id' => $id,
    'id' => $id,
    'parent' => $_POST['parent'],
    'type' => $_POST['type'],
    'text' =>  $textFinal,
    'state' => $state
);

try { $call = $cdb->post($recordToAdd); } catch (Exception $e) {
    cdb_error (500, $e, 'Could not add record'); die();
}

echo 'Success'; // echo json_encode($recordToAdd); <-- not needed, js will refresh the entire tree (accounting for multiple users working on the same tree at the same time)
?>
