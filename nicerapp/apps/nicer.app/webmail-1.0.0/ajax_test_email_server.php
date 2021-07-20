<?php 
    require_once (dirname(__FILE__).'/functions.php');
    
    echo webmail_test_email_server ($_POST['config']);
?>
