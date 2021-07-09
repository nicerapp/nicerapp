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

$date = new DateTime();
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



//$dbName = $cdbDomain.'___cms_vdsettings__user___'.strtolower($username);
$dbName = $cdbDomain.'___cms_vdsettings';
$cdb->setDatabase($dbName, false);


$findCommand = array (
    'selector' => array(
        'url' => $_POST['url']
    ),
    'fields' => array(
        '_id', '_rev'
    )
);
if (array_key_exists('role',$_POST) && !is_null($_POST['role'])) $findCommand['selector']['role'] = $_POST['role'];
if (array_key_exists('user',$_POST) && !is_null($_POST['user'])) $findCommand['selector']['user'] = $_POST['user'];

try {
    $call = $cdb->find ($findCommand);
    //echo '<pre>'; var_dump ($call); die();

} catch (Exception $e) {
    echo 'Status : Failed';
    if ($debug) {
        echo 'When : While trying to find in db "'.$dbName.'" the record with the following fields :'.PHP_EOL;
        var_dump ($findCommand['selector']); echo PHP_EOL;
        echo 'Reason : '.$e->getMessage();
    }
}

$d = $call->body->docs[0];
try {

    $cdb->delete ($d->_id,$d->_rev);
    echo 'Status : Success';
    
} catch (Exception $e) {
    echo 'Status : Failed.'.PHP_EOL;
    if ($debug) {
        echo 'When : While trying to delete from "'.$dbName.'", record with _id='.$d->_id.' and _rev='.$d->_rev.PHP_EOL;
        echo 'Reason : '.$e->getMessage().PHP_EOL;
    }
}
?>
