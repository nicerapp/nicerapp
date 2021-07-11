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
    
    $naDebugAll = false;
    global $naDebugAll;
    if ($naDebugAll) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }
?>
