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
try {
    $cdb->login($_POST['username'], $_POST['pw']);
} catch (Exception $e) {
    if ($debug) { echo 'status : Failed : Login failed (username : '.$_POST['username'].', password : '.$_POST['pw'].').<br/>'.PHP_EOL; die(); }
}
if ($debug) { echo 'info : Login succesful (username : '.$_POST['username'].', password : '.$_POST['pw'].').<br/>'.PHP_EOL;  }



// create users
$username = $_POST['username'];
$username = str_replace(' ', '__', $username);
$username = str_replace('.', '_', $username);

$dbName = $cdbDomain.'___cms_vdsettings__user___'.strtolower($username);
$cdb->setDatabase($dbName, false);


$findCommand = array (
    'selector' => array(
        'url' => $_POST['url']
    ),
    'fields' => array(
        '_id', '_rev'
    )
);
$call = $cdb->find ($findCommand);
//var_dump ($call); die();

if (!$call->headers->_HTTP->status===200) { 
    $id = cdb_getRandomString(20); 
} else {
    $id = $call->body->docs[0]->_id;
}

$call = $cdb->get($id);
//echo json_encode($call, JSON_PRETTY_PRINT).'<br/>'.PHP_EOL; die();
$rec = (array)$call->body;
$rec2 = array (
    'dialogs' => json_decode($_POST['dialogs'], true)                
);
$rec = array_merge ($rec, $rec2);
//var_dump ($rec); die();
try {
    $call3 = $cdb->post($rec);
} catch (Exception $e) {
    if ($debug) {
        echo 'status : Failed : could not update record in database ('.$dbName.').<br/>'.PHP_EOL;
        echo '$rec = <pre style="color:blue">'.PHP_EOL; var_dump ($rec); echo PHP_EOL.'</pre>'.PHP_EOL;
        echo '$call3 = <pre style="color:red">'.PHP_EOL; var_dump ($call3); echo PHP_EOL.'</pre>'.PHP_EOL;
        echo '$e = <pre style="color:red">'.PHP_EOL; var_dump ($e); echo PHP_EOL.'</pre>'.PHP_EOL; 
        die(); 
    
    } else {
        echo 'status : Failed.'; die();
    }
}
        
echo 'status : Success';
?>
