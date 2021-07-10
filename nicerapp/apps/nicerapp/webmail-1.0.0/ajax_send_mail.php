<?php 
    require_once (dirname(__FILE__).'/functions.php');
    
    echo webmail_send_mail (
        $_POST['serverConfig'], 
        $_POST['mailFrom'],
        $_POST['mailTo'],
        $_POST['mailSubject'],
        $_POST['mailBody']
    
    );
?>
