<h1>nicerapp couchdb initialization script</h1>
<?php 
require_once (dirname(__FILE__).'/boot.php');
require_once (dirname(__FILE__).'/3rd-party/sag/src/Sag.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);
if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}


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


$dbs = $cdb->getAllDatabases();
foreach ($dbs->body as $idx => $dbName) {
    if (
        (strpos($dbName,'tree__user')!==false)
        || (strpos($dbName,'documents__user')!==false)
    ) {
        $do = true;
        try { $db = $cdb->deleteDatabase($dbName); } catch (Exception $e) { if ($debug) { echo $e->getMessage(); echo '<br/>'; $do = false; die(); }}
    }
}


$security_admin = '{ "admins": { "names": ["Administrator"], "roles": [] }, "members": { "names": [], "roles": ["guests"] } }';
$security_guest = '{ "admins": { "names": [], "roles": ["guests"] }, "members": { "names": [], "roles": ["guests"] } }';

$dbName = str_replace('.','_',$cms->domain).'___analytics';
$cdb->setDatabase($dbName,true);
try { 
    $call = $cdb->setSecurity ($security_guest);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
echo 'Created database '.$dbName.'<br/>';


$dbName = str_replace('.','_',$cms->domain).'___three_d_positions';
$cdb->setDatabase($dbName,true);
try { 
    $call = $cdb->setSecurity ($security_guest);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
echo 'Created database '.$dbName.'<br/>';

$dbName = str_replace('.','_',$cms->domain).'___cms_tree';
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_admin);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
/*
$do = false; try { $doc = $cdb->get('aaa'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aaa", "id" : "aaa", "parent" : "#", "text" : "System", "state" : { "opened" : false }, "type" : "naSystemFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };


$do = false; try { $doc = $cdb->get('aab'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aab", "id" : "aab", "parent" : "aaa", "text" : "Users", "state" : { "opened" : false }, "type" : "naSystemFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('aab_Administrator'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aab_Administrator", "id" : "aab_Administrator", "parent" : "aab", "text" : "Administrator", "state" : { "opened" : false }, "type" : "naSettings" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('aab_Administrator_vividThemes'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aab_Administrator_vividThemes", "id" : "aab_Administrator_vividThemes", "parent" : "aab_Administrator", "text" : "vividThemes", "state" : { "opened" : false }, "type" : "naVividThemes" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('aac'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aac", "id" : "aac", "parent" : "aaa", "text" : "Groups", "state" : { "opened" : false }, "type" : "naSystemFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('aac_Administrators'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aac_Administrators", "id" : "aac_Administrators", "parent" : "aac", "text" : "Administrators", "state" : { "opened" : false }, "type" : "naSettings" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('aac_Editors'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aac_Editors", "id" : "aac_Editors", "parent" : "aac", "text" : "Editors", "state" : { "opened" : false}, "type" : "naSettings" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('aac_Guests'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aac_Guests", "id" : "aac_Guests", "parent" : "aac", "text" : "Guests", "state" : { "opened" : false}, "type" : "naSettings" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('aad'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "aad", "id" : "aad", "parent" : "aaa", "text" : "Site", "state" : { "opened" : false }, "type" : "naSettings" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };
*/

$do = false; try { $doc = $cdb->get('caa'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "caa", "id" : "caa", "parent" : "#", "text" : "Groups", "state" : { "opened" : true }, "type" : "naSystemFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('baa'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "cms_tree", "_id" : "baa", "id" : "baa", "parent" : "#", "text" : "Users", "state" : { "opened" : true }, "type" : "naSystemFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

echo 'Created database '.$dbName.'<br/>';



$dbName = str_replace('.','_',$cms->domain).'___cms_tree__role___guests';
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_guest);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}

$do = false; try { $doc = $cdb->get('cab'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "cab", "id" : "cab", "parent" : "caa", "text" : "Guests", "state" : { "opened" : true }, "type" : "naGroupRootFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('cba'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "cba", "id" : "cba", "parent" : "cab", "text" : "Blog", "state" : { "opened" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('cbb'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "cbb", "id" : "cbb", "parent" : "cab", "text" : "Media Albums", "state" : { "opened" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

echo 'Created database '.$dbName.'<br/>';

$dbName = str_replace('.','_',$cms->domain).'___cms_tree__user___administrator';
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$dbName2 = str_replace('.','_',$cms->domain).'___cms_tree__user__administrator';
try { $cdb->deleteDatabase ($dbName2); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_admin);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}

$do = false; try { $doc = $cdb->get('bab'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "bab", "id" : "bab", "parent" : "baa", "text" : "Administrator", "state" : { "opened" : true }, "type" : "naUserRootFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('bba'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "bba", "id" : "bba", "parent" : "bab", "text" : "Blog", "state" : { "opened" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('bbb'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "bbb", "id" : "bbb", "parent" : "bab", "text" : "Media Albums", "state" : { "opened" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

echo 'Created database '.$dbName.'<br/>';

$dbName = str_replace('.','_',$cms->domain).'___cms_tree__user___guest';
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$dbName2 = str_replace('.','_',$cms->domain).'___cms_tree__user__guest';
try { $cdb->deleteDatabase ($dbName2); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_guest);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}

$do = false; try { $doc = $cdb->get('dab'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "dab", "id" : "dab", "parent" : "baa", "text" : "Guest", "state" : { "opened" : true }, "type" : "naUserRootFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('dba'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "dba", "id" : "dba", "parent" : "dab", "text" : "Blog", "state" : { "opened" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };

$do = false; try { $doc = $cdb->get('dbb'); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "dbb", "id" : "dbb", "parent" : "dab", "text" : "Media Albums", "state" : { "opened" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; };


echo 'Created database '.$dbName.'<br/>';

$dbName = str_replace('.','_',$cms->domain).'___cms_documents__user___administrator';
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$dbName2 = str_replace('.','_',$cms->domain).'___cms_documents__user__administrator';
try { $cdb->deleteDatabase ($dbName2); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_admin);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
echo 'Created database '.$dbName.'<br/>';

$dbName = str_replace('.','_',$cms->domain).'___cms_documents__user___guest';
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$dbName2 = str_replace('.','_',$cms->domain).'___cms_documents__user__guest';
try { $cdb->deleteDatabase ($dbName2); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_guest);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
echo 'Created database '.$dbName.'<br/>';

$dbName = str_replace('.','_',$cms->domain).'___cms_documents__role___guests';
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$dbName2 = str_replace('.','_',$cms->domain).'___cms_documents__role__guests';
try { $cdb->deleteDatabase ($dbName2); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_guest);
} catch (Exception $e) {
    echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die();
}
echo 'Created database '.$dbName.'<br/>';


$xec = 'rm -rf "'.realpath(dirname(__FILE__)).'/siteData/'.$cms->domain.'/*"';
exec ($xec, $output, $result);
$dbg = array (
    'xec' => $xec,
    'output' => $output,
    'result' => $result
);
echo '<pre>'.json_encode($dbg,JSON_PRETTY_PRINT).'</pre><br/>';

?>
