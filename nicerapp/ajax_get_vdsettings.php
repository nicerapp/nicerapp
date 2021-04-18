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

$security_user = '{ "admins": { "names": ["'.$username.'"], "roles": [] }, "members": { "names": ["'.$username.'"], "roles": [] } }';
if ($debug && false) {
    echo 'info : $security_user = '.$security_user.'.<br/>'.PHP_EOL;
    die(); 
}

$dbName = $cdbDomain.'___cms_vdsettings__user___'.strtolower($username);
$cdb->setDatabase($dbName, false);
try {
    $call = $cdb->getAllDocs();
    //var_dump ($call); die();
    $callOK = $call->status === '200';
} catch (Exception $e) {
    if ($debug) {
        echo 'info : database does not yet exist ('.$dbName.').<br/>'.PHP_EOL;
        echo '<pre style="color:red">'.PHP_EOL; var_dump ($e); echo PHP_EOL.'</pre>'.PHP_EOL; 
       // die(); 
    }


    try {
        $cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);
    } catch (Exception $e) {
        if ($debug) { 
            echo 'status : Failed : could not login as admin to create new database ('.$dbName.').<br/>'.PHP_EOL;
            echo '<pre style="color:red">'.PHP_EOL; var_dump ($e); echo PHP_EOL.'</pre>'.PHP_EOL; 
            die(); 
        }
    }
    
    try { 
        $cdb->setDatabase($dbName, true);
    } catch (Exception $e) {
        if ($debug) { 
            echo 'status : Failed : could not create database. ('.$dbName.')<br/>'.PHP_EOL;
            echo '<pre style="color:red">'.PHP_EOL; var_dump ($e); echo PHP_EOL.'</pre>'.PHP_EOL; 
            die(); 
        }
    }
    
    try {
        $call = $cdb->setSecurity ($security_user);
    } catch (Exception $e) {
        if ($debug) { 
            echo 'status : Failed : could not set security on newly created database. ('.$dbName.')<br/>'.PHP_EOL;
            echo '<pre style="color:red">'.PHP_EOL; var_dump ($e); echo PHP_EOL.'</pre>'.PHP_EOL; 
            die(); 
        }
    }
    
    echo 'info : Created new database. ('.$dbName.').<br/>'.PHP_EOL;

    $cdb->login($_POST['username'], $_POST['pw']);

    $callOK = true;
}

//var_dump ($cdb->getAllDocs());
if ($callOK) {
    
    $findCommand = array (
        'selector' => array(
            'url' => $_POST['url']
        ),
        'fields' => array( '_id' )
    );
    $call = $cdb->find ($findCommand);
    if ($debug) {
        echo 'info : $findCommand='; var_dump ($findCommand); echo '.<br/>'.PHP_EOL;
        echo 'info : $call='; var_dump ($call); echo '.<br/>'.PHP_EOL;
        //die();
    }
    
    $hasRecord = false;
    if ($call->headers->_HTTP->status==='200') {
        foreach ($call->body->docs as $idx => $d) {
            $hasRecord = true;
            $call2 = $cdb->get($d->_id);
            echo json_encode($call2->body, JSON_PRETTY_PRINT);//.'<br/>'.PHP_EOL;
            die();
        }
    }
    if (!$hasRecord) {
        $rec = array (
            '_id' => cdb_randomString(20),
            'url' => $_POST['url'],
            'dialogs' => json_decode($_POST['dialogs'], true)
        );
        try {
            $call2 = $cdb->post($rec);
        } catch (Exception $e) {
            if ($debug) {
                echo 'status : Failed : could not add record to database ('.$dbName.').<br/>'.PHP_EOL;
                echo '$rec = <pre style="color:blue">'.PHP_EOL; var_dump ($rec); echo PHP_EOL.'</pre>'.PHP_EOL;
                echo '$call2 = <pre style="color:red">'.PHP_EOL; var_dump ($call2); echo PHP_EOL.'</pre>'.PHP_EOL;
                echo '$e = <pre style="color:red">'.PHP_EOL; var_dump ($e); echo PHP_EOL.'</pre>'.PHP_EOL; 
                die(); 
            
            }
        }
        echo json_encode($rec, JSON_PRETTY_PRINT);
    }
    
    if ($debug) echo 'status : Success';
} else {
    if ($debug) {
        echo 'status : Failed to get database access.<br/>'.PHP_EOL;
        echo 'info : $call='; var_dump ($call); echo '.<br/>'.PHP_EOL;
    } else echo 'status : Failed.';
}
?>
