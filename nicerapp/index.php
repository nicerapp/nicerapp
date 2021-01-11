<?php 
    require_once(dirname(__FILE__).'/boot.php');
    
    global $cms;
    $cms = new nicerAppCMS();
    $cms->init();
    echo $cms->getSite();
    
    /*
    echo '<pre style="color:green;font-size:2.5rem">'.json_encode($cms->about, JSON_PRETTY_PRINT).'</pre>';
    echo '<pre style="color:blue;font-size:2.5rem">'.$cms->basePath.'</pre>';
    echo '<pre style="color:red;font-size:2.5rem">'.$cms->domain.'</pre>';
    */
    
?>
