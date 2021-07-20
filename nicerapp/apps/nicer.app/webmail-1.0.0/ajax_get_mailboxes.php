<?php 
    require_once (dirname(__FILE__).'/functions.php');
    
    echo json_encode (webmail_get_mailboxes($_POST['config']), JSON_PRETTY_PRINT);
?>
