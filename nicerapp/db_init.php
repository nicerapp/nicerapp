<h1>nicerapp couchdb initialization script</h1>
<?php 
require_once (dirname(__FILE__).'/boot.php');
require_once (dirname(__FILE__).'/3rd-party/sag/src/Sag.php');


global $cms;
$cms = new nicerAppCMS();
$cms->init();

$couchdbConfigFilepath = realpath(dirname(__FILE__)).'/domainConfigs/'.$cms->domain.'/couchdb.json';
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);
$cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);

// create users
$uid = 'org.couchdb.user:Administrator';
$got = true;
$cdb->setDatabase('_users',false);
try { $call = $cdb->get($uid); } catch (Exception $e) { $got = false; }
if (!$got) {
    try {
        $rec = array (
            '_id' => $uid,
            'name' => 'Administrator', 
            'password' => (array_key_exists('AdministratorPassword',$_REQUEST) ? $_REQUEST['AdministratorPassword'] : 'Administrator'), 
            'realname' => 'nicerapp Administrator', 
            'email' => (array_key_exists('AdministratorEmail',$_REQUEST) ? $_REQUEST['AdministratorEmail'] : 'root@localhost'), 
            'roles' => [ "guests", "administrators", "editors" ], 
            'type' => "user"
        );
        $call = $cdb->post ($rec);
        if ($call->body->ok) echo 'Created Administrator user record.<br/>'; else echo '<span style="color:red">Could not create Administrator user record.</span><br/>';
    } catch (Exception $e) {
        echo '<pre style="color:red">'; var_dump ($e); echo '</pre>';
    }
} else {
    echo 'Already have an Administrator user record.<br/>';
}

$uid = 'org.couchdb.user:Guest';
$got = true;
$cdb->setDatabase('_users',false);
try { $call = $cdb->get($uid); } catch (Exception $e) { $got = false; }
if (!$got) {
    try {
        $rec = array (
            '_id' => $uid, 
            'name' => 'Guest', 
            'password' => 'Guest', 
            'realname' => 'nicerapp Guest', 
            'email' => 'guest@localhost', 
            'roles' => [ "guests" ], 
            'type' => "user"
        );
        $call = $cdb->post ($rec);
        if ($call->body->ok) echo 'Created Guest user record.<br/>'; else echo '<span style="color:red">Could not create Guest user record.</span><br/>';
    } catch (Exception $e) {
        echo '<pre style="color:red">'; var_dump ($e); echo '</pre>';
    }
} else {
    echo 'Already have a Guest user record.<br/>';
}


$cdb->setDatabase($cms->domain.'___analytics',true);
$json = '{ "admins": { "names": [], "roles": ["guests"] }, "members": { "names": ["Administrator"], "roles": ["guests"] } }';
try { 
    $call = $cdb->setAdmins ($json);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
echo 'Created database '.$cms->domain.'___analytics<br/>';


$cdb->setDatabase($cms->domain.'___three_d_positions',true);
$json = '{ "admins": { "names": [], "roles": ["guests"] }, "members": { "names": ["Administrator"], "roles": ["guests"] } }';
try { 
    $call = $cdb->setAdmins ($json);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
echo 'Created database '.$cms->domain.'___three_d_positions<br/>';
?>
