<?php 
require_once (dirname(__FILE__).'/boot.php');
require_once (dirname(__FILE__).'/3rd-party/sag/src/Sag.php');
require_once (dirname(__FILE__).'/Sag-support-functions.php');
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

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);
$cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);

// create users
$username = $_POST['loginName'];
$username = str_replace(' ', '__', $username);
$username = str_replace('.', '_', $username);

$security_role = '{ "admins": { "names": [], "roles": ["guests"] }, "members": { "names": [], "roles": [] } }';
$security_user = '{ "admins": { "names": ["'.$username.'"], "roles": [] }, "members": { "names": ["'.$username.'"], "roles": [] } }';

$uid = 'org.couchdb.user:'.$username;
$got = true;
$cdb->setDatabase('_users',false);
try { $call = $cdb->get($uid); } catch (Exception $e) { $got = false; }
if (!$got) {
    try {
        $rec = array (
            '_id' => $uid,
            'name' => $username, 
            'password' => $_POST['pw'], 
            'realname' => $username, 
            'email' => $_POST['email'], 
            'roles' => [ "guests"], 
            'type' => "user"
        );
        $call = $cdb->post ($rec);
        if ($call->body->ok && $debug) echo 'Created user record.<br/>'; else echo '<span style="color:red">Could not create user record.</span><br/>';
    } catch (Exception $e) {
        if ($debug) echo '<pre style="color:red">'; var_dump ($e); echo '</pre>';
    }
} else {
    if ($debug) echo 'Already have this user record.<br/>'.PHP_EOL;
}

$dbName = $cdbDomain.'___cms_tree__user___'.strtolower($username);
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_user);
} catch (Exception $e) {
    if ($debug) { echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die(); }
}
if ($debug) echo '<pre style="color:green">'; var_dump($call); echo '</pre>'.PHP_EOL; 

$rec1_id = cdb_randomString(20);
$do = false; try { $doc = $cdb->get($rec1_id); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "'.$rec1_id.'", "id" : "'.$rec1_id.'", "parent" : "baa", "text" : "'.$_POST['loginName'].'", "state" : { "opened" : true }, "type" : "naUserRootFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { if ($debug) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; }};

$rec2_id = cdb_randomString(20);
$do = false; try { $doc = $cdb->get($rec2_id); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "'.$rec2_id.'", "id" : "'.$rec2_id.'", "parent" : "'.$rec1_id.'", "text" : "Blog", "state" : { "opened" : true, "selected" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { if ($debug) {echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; }};

$rec3_id = cdb_randomString(20);
$do = false; try { $doc = $cdb->get($rec3_id); } catch (Exception $e) { $do = true; };
$data = '{ "database" : "'.$dbName.'", "_id" : "'.$rec3_id.'", "id" : "'.$rec3_id.'", "parent" : "'.$rec1_id.'", "text" : "Media Albums", "state" : { "opened" : true }, "type" : "naFolder" }';
if ($do) try { $cdb->post($data); } catch (Exception $e) { if ($debug) { echo '<pre>'.json_encode(json_decode($data),JSON_PRETTY_PRINT).'</pre>'; echo $e->getMessage(); echo '<br/>'; }};


echo 'Created database '.$dbName.'<br/>'.PHP_EOL;

$dbName = $cdbDomain.'___cms_documents__user___'.strtolower($username);
try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_user);
} catch (Exception $e) {
    if ($debug) { echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die(); }
}
echo 'Created database '.$dbName.'<br/>'.PHP_EOL;

//$dbName = $cdbDomain.'___cms_vdsettings__user___'.strtolower($username);
$dbName = $cdbDomain.'___cms_vdsettings';
//try { $cdb->deleteDatabase ($dbName); } catch (Exception $e) { };
$cdb->setDatabase($dbName, true);
try { 
    $call = $cdb->setSecurity ($security_role);
} catch (Exception $e) {
    if ($debug) { echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die(); }
}

$rec = array(
    'url' => '[default]',
    'user' => $_POST['loginName'],
    '_id' => cdb_randomString(20),
    'dialogs' => array (
        '.vividDialog' => array (
            'color' => 'white',
            'boxShadow' => '4px 4px 3px 2px rgba(0,0,0,0.7), inset -2px -2px 3px 2px rgba(255,255,255,0.55)',
            'borderRadius' => '15px',
            'border' => '3px ridge lime'
        ),
        '.vividDialog .vdBackground' => array (
            'background' => 'rgba(0,0,0,0.5)',
            'borderRadius' => '15px'
        ),
        '#siteDateTime' => array (
            'border' => '3px ridge lime',
            'background' => 'rgba(0,0,0,0.7)',
            'color' => 'white'
        ),
        '#siteContent' => array (
            'borderRadius' => '15px'
        ),
        '#siteContent .vdBackground' => array (
            'background' => 'rgba(0,0,0,0.5)',
            'borderRadius' => '15px'
        ),
        '#siteVideo .vdBackground' => array (
            'background' => 'url("/nicerapp/siteMedia/backgrounds/tiled/active/red/318801228_12f7b6a8a2.jpg") repeat',
            'borderRadius' => '15px',
            'opacity' => 0.7
        ),
        '#siteVideoSearch .vdBackground' => array (
            'background' => 'url("/nicerapp/siteMedia/backgrounds/tiled/active/red/318801228_12f7b6a8a2.jpg") repeat',
            'borderRadius' => '15px',
            'opacity' => 0.7
        ),
        '#siteComments .vdBackground' => array (
            'background' => 'url("/nicerapp/siteMedia/backgrounds/tiled/active/blue/seamless-texture-blue-watercolor.jpg") repeat',
            'borderRadius' => '15px',
            'opacity' => 0.7
        ),
        '#siteToolbarRight .vdBackground' => array (
            'background' => 'url("/nicerapp/siteMedia/backgrounds/tiled/active/blue/seamless-texture-blue-watercolor.jpg") repeat',
            'borderRadius' => '15px',
            'opacity' => 0.7
        ),
        '#siteStatusbar .vdBackground' => array (
            'background' => 'url("/nicerapp/siteMedia/backgrounds/tiled/active/green/cloth 003C.png") repeat',
            'borderRadius' => '15px',
            'opacity' => 0.7
        )
    )
);
try {
    $cdb->post($rec);
} catch (Exception $e) {
    if ($debug) { echo '<pre style="color:red">'; var_dump ($e); echo '</pre>'; die(); }
}

echo 'Created and populated database '.$dbName.'<br/>'.PHP_EOL;
?>
