<?php 
require_once (dirname(__FILE__).'/boot.php');
require_once (dirname(__FILE__).'/3rd-party/vendor/autoload.php');

function couchdb_address ($tableName=null, $username=null, $password=null) {
    global $naCouchDB;
    global $cms;
    if (!$cms) {
        $cms = new nicerAppCMS();
        $cms->init();
    }
    if (!$naCouchDB) {
        $fn = realpath(dirname(__FILE__).'/domainConfigs').'/'.$cms->domain.'/couchdb.json';
        //echo $fn.' - '; var_dump(file_exists($fn)); die();
        $naCouchDB = json_decode(file_get_contents($fn), true);
    }
    $r = 
        $naCouchDB['http']
        .(is_null($username) || $username==='' ? $naCouchDB['adminUsername'] : $username)
        .($username!=='' ? ':' : '')
        .(is_null($password) || $password==='' ? $naCouchDB['adminPassword'] : $password)
        .($password!=='' ? '@' : '')
        .$naCouchDB['domain']
        .':'
        .$naCouchDB['port']
        .(!is_null($tableName) ? '/'.$tableName : '');
        
    //echo $r; die();
    return $r;
}

function couchdb_client($tableName=null, $username=null, $password=null) {
    $client = new \PHPCouchDB\Server(["url" => couchdb_address(null, $username, $password)]);
    return $client;
}


$client = couchdb_client(); 
$serverHTTPhost = str_replace('.','_',$_SERVER['HTTP_HOST']);

$security = Array(
    'members'=>Array(
        'roles'=>Array('guests')
    ),
    'admins'=>Array(
        'roles'=>Array('guests')
    )
);

echo 'deleting any old databases entirely so they can be re-initialized<br/>';
$dbs = $client->getAllDbs();
foreach ($dbs as $idx => $dbName) {
    if (substr($dbName,0,1)!=='_') {
        $do = true;
        try { $db = $client->useDb(['name'=>$dbName,'create_if_not_exists'=>false]); } catch (Exception $e) { echo $e->getMessage(); echo '<br/>'; $do = false; }
        echo 'deleting db '.$dbName.'<br/>';
        if ($do) try { $db->delete(); } catch (Exception $e) { echo $e->getMessage(); echo '<br/>'; };
    }
}

echo 'creating couchdb+nicerapp user "Administrator"<br/>';
$db = $client->useDb(["name" => '_users', 'create_if_not_exists' => true]);
$do = false; try { $doc = $db->getDocById('org.couchdb.user:Administrator'); } catch (Exception $e) { $do = true; };
if ($do) $db->create([
    'id' => 'org.couchdb.user:Administrator', 
    'name' => 'Administrator', 
    'password' => (array_key_exists('AdministratorPassword',$_REQUEST) ? $_REQUEST['AdministratorPassword'] : 'Administrator'), 
    'realname' => 'nicerapp Administrator', 
    'email' => (array_key_exists('AdministratorEmail',$_REQUEST) ? $_REQUEST['AdministratorEmail'] : 'root@localhost'), 
    'roles' => [ "guests", "administrators", "editors" ], 
    'type' => "user"
]);

echo 'creating couchdb+nicerapp user "Guest"<br/>';
$do = false; try { $doc = $db->getDocById('org.couchdb.user:Guest'); } catch (Exception $e) { $do = true; };
if ($do) $db->create([
    'id' => 'org.couchdb.user:Guest', 
    'name' => 'Guest', 
    'password' => 'Guest', 
    'realname' => 'nicerapp Guest', 
    'email' => 'guest@localhost', 
    'roles' => [ "guests" ], 
    'type' => "user"
]);

echo 'creating couchdb database analytics<br/>';
$db = $client->useDb(["name" => $serverHTTPhost.'___analytics', 'create_if_not_exists' => true]);
$json = '{ "admins": { "names": [], "roles": ["guests"] }, "members": { "names": ["Administrator"], "roles": ["guests"] } }';
$db->setAdmins ($json);

echo 'creating couchdb database analytics_self<br/>';
$db = $client->useDb(["name" => $serverHTTPhost.'___analytics_self', 'create_if_not_exists' => true]);
$json = '{ "admins": { "names": [], "roles": ["guests"] }, "members": { "names": ["Administrator"], "roles": ["guests"] } }';
$db->setAdmins ($json);

echo 'creating couchdb database three_d_positions<br/>';
$db = $client->useDb(["name" => $serverHTTPhost.'___three_d_positions', 'create_if_not_exists' => true]);
$json = '{ "admins": { "names": [], "roles": ["guests"] }, "members": { "names": ["Administrator"], "roles": ["guests"] } }';
$db->setAdmins ($json);
?>
