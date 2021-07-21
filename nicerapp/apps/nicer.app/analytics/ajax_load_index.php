<?php 
require_once (dirname(__FILE__).'/boot.php');
require_once (dirname(__FILE__).'/3rd-party/sag/src/Sag.php');
require_once (dirname(__FILE__).'/Sag-support-functions.php');
global $naDebugAll;
$debug = true;
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

if ($debug) { echo 'info : '.__FILE__.' : $debug = true.<br/>'.PHP_EOL;  }

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);

// create users
$username = $_POST['username'];
$username = str_replace(' ', '__', $username);
$username = str_replace('.', '_', $username);

try {
    $cdb->login($username, $_POST['pw']);
} catch (Exception $e) {
    if ($debug) { echo 'status : Failed : Login failed (username : '.$username.', password : '.$_POST['pw'].').<br/>'.PHP_EOL; die(); }
}
if ($debug) { echo 'info : Login succesful (username : '.$username.', password : '.$_POST['pw'].').<br/>'.PHP_EOL;  }

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
        'url' => $_POST['url']
    ),
    'fields' => array( '_id' )
);
if (array_key_exists('role',$_POST) && !is_null($_POST['role'])) $findCommand['selector']['role'] = $_POST['role'];
if (array_key_exists('user',$_POST) && !is_null($_POST['user'])) $findCommand['selector']['user'] = $_POST['user'];


try { 
    $call = $cdb->find ($findCommand);
} catch (Exception $e) {
    echo 'Error while accessing $dbName='.$dbName.'<br/><pre>'.PHP_EOL;
    echo $e->getMessage();
    die();
};
if ($debug) {
    echo 'info : $findCommand='; var_dump ($findCommand); echo '.<br/>'.PHP_EOL;
    echo 'info : $call='; var_dump ($call); echo '.<br/>'.PHP_EOL;
    //die();
}


?>
