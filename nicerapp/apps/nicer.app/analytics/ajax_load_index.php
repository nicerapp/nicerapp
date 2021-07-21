<?php 
$rootpath = realpath(dirname(__FILE__).'/../../..');
require_once ($rootpath.'/boot.php');
require_once ($rootpath.'/3rd-party/sag/src/Sag.php');
require_once ($rootpath.'/Sag-support-functions.php');

global $naDebugAll;
global $naLAN; // true IF the browser is on the internal webserver LAN

$debug = false;
if ($debug) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);

global $cms;
$cms = new nicerAppCMS();
$cms->init();
$cdbDomain = str_replace('.','_',$cms->domain);

$couchdbConfigFilepath = $rootpath.'/domainConfigs/'.$cms->domain.'/couchdb.json';
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

if ($debug) { echo 'info : '.__FILE__.' : $debug = true.<br/>'.PHP_EOL;  }

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);

// create users
$username = $_GET['username'];
$username = str_replace(' ', '__', $username);
$username = str_replace('.', '_', $username);

try {
    $cdb->login($username, $_GET['pw']);
} catch (Exception $e) {
    if ($debug) { echo 'status : Failed : Login failed (username : '.$username.', password : '.$_GET['pw'].').<br/>'.PHP_EOL; die(); }
}
if ($debug) { echo 'info : Login succesful (username : '.$username.', password : '.$_GET['pw'].').<br/>'.PHP_EOL;  }

$security_user = '{ "admins": { "names": ["'.$username.'"], "roles": [] }, "members": { "names": ["'.$username.'"], "roles": [] } }';
if ($debug && false) {
    echo 'info : $security_user = '.$security_user.'.<br/>'.PHP_EOL;
    die(); 
}

//$dbName = $cdbDomain.'___cms_vdsettings__user___'.strtolower($username);
$dbName = $cdbDomain.'___analytics';
$cdb->setDatabase($dbName, false);

$findCommand = array (
    'selector' => array(
        'date' => $_GET['date']
    ),
    'fields' => array( '_id' )
);
if (array_key_exists('role',$_GET) && !is_null($_GET['role'])) $findCommand['selector']['role'] = $_GET['role'];
if (array_key_exists('user',$_GET) && !is_null($_GET['user'])) $findCommand['selector']['user'] = $_GET['user'];


try { 
    $call = $cdb->find ($findCommand);
} catch (Exception $e) {
    echo 'Error while accessing $dbName='.$dbName.'<br/><pre>'.PHP_EOL;
    echo $e->getMessage();
    die();
};
if ($debug) {
    echo '<pre class="naCouchDB_findCommand">';
    echo 'info : $findCommand='; var_dump ($findCommand); echo '.<br/>'.PHP_EOL;
    echo 'info : $call='; var_dump ($call); echo '.<br/>'.PHP_EOL;
    echo '</pre>';
    //die();
}

$recs = array();

foreach ($call->body->docs as $idx => $d) {
    $call2 = $cdb->get($d->_id);
    $recs[] = (array)$call2->body;
    if ($debug && false) {
        echo '<pre class="naCouchDB_getCommand">';
        echo 'info : $call2='; var_dump ($call2); echo '.<br/>'.PHP_EOL;
        echo '</pre>';
        //die();
    }
}

if ($debug) echo '<pre class="naCouchDB_dataReturnedToBrowser">';
echo json_encode ($recs, JSON_PRETTY_PRINT);
if ($debug) echo '</pre>';
?>
