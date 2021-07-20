<?php 

function naGetAppSettings__news () {
    $r = array(
        'divs' => array(
            '#siteContent' => realpath(dirname(__FILE__)).'/newsApp.siteContent.php'
        )
    );
    
    return $r;
}

?>
