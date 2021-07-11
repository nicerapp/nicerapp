<?php 
require_once (dirname(__FILE__).'/boot.php');
require_once (dirname(__FILE__).'/3rd-party/sag/src/Sag.php');
require_once (dirname(__FILE__).'/Sag-support-functions.php');
$debug = false;
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
$cdbDomain = str_replace('.','_',$cms->domain);

$couchdbConfigFilepath = realpath(dirname(__FILE__)).'/domainConfigs/'.$cms->domain.'/couchdb.json';
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);
//var_dump ($cdbConfig); echo PHP_EOL;

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);


// create users
$username = $_POST['loginName'];
$username = str_replace(' ', '__', $username);
$username = str_replace('.', '_', $username);

try {
    $cdb->login($username, $_POST['pw']);
} catch (Exception $e) {
    echo 'status : Failed'.PHP_EOL;
    die();
}

$dbName = $cdbDomain.'___cms_tree__user___'.strtolower($username);
//var_dump ($dbName); var_dump($_POST);
$cdb->setDatabase($dbName, false);
try {
    //var_dump ($cdb->getAllDocs());
    $rows = $cdb->getAllDocs()->body->rows;
    $callOK = is_array($rows) && count($rows) >= 1;
} catch (Exception $e) {
    //echo 'Database '.$dbName.PHP_EOL;
    //echo 'Username '.$username.PHP_EOL;
    //echo 'Password '.$_POST['pw'].PHP_EOL;
    echo 'status : Failed'.PHP_EOL;
    //var_dump ($e);
    die();
}
//var_dump ($cdb->getAllDocs());
if ($callOK) {
    if (session_status() === PHP_SESSION_NONE) session_start();
    $_SESSION['cdb_loginName'] = $_POST['loginName'];
    $_SESSION['cdb_pw'] = $_POST['pw'];
    echo 'Success';
} else {
    echo 'Failed';
}
?>
