<?php 
    require_once(dirname(__FILE__).'/boot.php');
    
    global $cms;
    $cms = new nicerAppCMS();
    $cms->init();
    echo $cms->getPageCSS();
?>
