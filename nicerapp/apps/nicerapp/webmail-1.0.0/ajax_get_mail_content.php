<?php 
    require_once (dirname(__FILE__).'/functions.php');
    
      echo webmail_get_mail_content (
        $_POST['serverConfig'], 
        $_POST['serverIdx'], 
        $_POST['mailboxes'], 
        $_POST['mailboxIdx'], 
        $_POST['mailIdx']
    );
?>
