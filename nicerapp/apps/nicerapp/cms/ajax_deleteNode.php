<?php
require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../3rd-party/sag/src/Sag.php');
require_once (dirname(__FILE__).'/../../../Sag-support-functions.php');
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/

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

$cdb->setDatabase($_POST['database'],false);
$doc = array (
    'database' => $_POST['database'],
    '_id' => $_POST['id'],
    'id' => $_POST['id']
);
try { $call = $cdb->get ($_POST['id']); } catch (Exception $e) { cdb_error (404, $e, 'Could not find record'); die(); };

$root = realpath(dirname(__FILE__).'/../../../').'/siteData/'.$cms->domain.'/';
$path = $root.$_POST['currPath'];
$xec = 'rm -rf "'.$path.'"';
exec ($xec, $output, $result);
//$dbg = array ('x'=>$xec, 'o'=>$output, 'r'=>$result); var_dump ($dbg); die();

//var_dump ($call->body);die();

$parents = array ($call->body->_id);
$ids = array(array ('id'=>$call->body->_id,'rev'=>$call->body->_rev));
$docs = $cdb->getAllDocs();
$docz = array();
//var_dump ($docs); die();
$reset = true;
while ($reset) {
    $reset = false;
    foreach ($docs->body->rows as $idx => $row) {
        if (!array_key_exists($idx, $docz)) $docz[$idx] = $cdb->get ($row->id);
        //var_dump ($doc); die();
        //var_dump ($parents); echo '<br/>'.PHP_EOL;
        if (in_array($docz[$idx]->body->parent, $parents) && !in_array($docz[$idx]->body->_id,$parents)) {
            array_push ( $parents, $docz[$idx]->body->_id );
            array_push ( $ids, array ('id'=>$docz[$idx]->body->_id, 'rev'=>$docz[$idx]->body->_rev) );
            $reset = true;
            break;
        }
    }
}

foreach ($ids as $idx => $rec) {
    try { $call2 = $cdb->delete($rec['id'], $rec['rev']); } catch (Exception $e) { cdb_error (500, $e, 'Could not delete record'); die(); };
};
//var_dump ($ids); die();

//try { $call = $cdb->delete($call->body->_id, $call->body->_rev); } catch (Exception $e) { cdb_error (500, $e, 'Could not delete record'); die(); };

echo 'Success'; // echo json_encode($recordToAdd); <-- not needed, js will refresh the entire tree (accounting for multiple users working on the same tree at the same time)
?>
