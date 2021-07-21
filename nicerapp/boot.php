<?php 
    require_once(dirname(__FILE__).'/functions.php');
    require_once(dirname(__FILE__).'/lib_duration.php');
    require_once(dirname(__FILE__).'/lib_fileSystem.php');
    require_once(dirname(__FILE__).'/class.naContentManagementSystem.php');
    require_once(dirname(__FILE__).'/3rd-party/sag/src/Sag.php');
    
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.gc_maxlifetime', 3600);
        session_start();
    };
    
    $naDebugAll = true;
    global $naDebugAll;
    /*
    if ($naDebugAll) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }*/
    
    $filePerms_ownerUser = 'rene'; global $filePerms_ownerUser;
    $filePerms_ownerGroup = 'www-data'; global $filePerms_ownerGroup;
    $filePerms_perms = 0770; global $filePerms_perms;

    global $cms;
    $cms = new nicerAppCMS();
    $cms->init();
    
    $naIP = (
        function_exists('apache_request_headers') 
        && array_key_exists('X-Forwarded-For',apache_request_headers())
        ? apache_request_headers()['X-Forwarded-For'] 
        : array_key_exists('REMOTE_ADDR', $_SERVER)
            ? $_SERVER['REMOTE_ADDR']
            : 'OS commandline probably'
    );
    global $naIP;
    
    $lanConfigFilepath = realpath(dirname(__FILE__)).'/domainConfigs/'.$cms->domain.'/naLAN.json';
    $lanConfig = json_decode(file_get_contents($lanConfigFilepath), true);
    
    if (
        $naIP !== '::1'
        && $naIP !== '127.0.0.1'
        && !in_array($naIP, $lanConfig)
    ) $naLAN = false; else $naLAN = true;
    global $naLAN;
    
    // overrides by the site operator go here :
    $fn = dirname(__FILE__).'/apps/siteOperator_boot.php';
    if (file_exists($fn)) require_once ($fn);
    
    // error handling (catches warnings)
    /*
    set_error_handler(function($errno, $errstr, $errfile, $errline) {
        // error was suppressed with the @-operator
        if (0 === error_reporting()) {
            return false;
        }
        
        throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
    });    */
?>
