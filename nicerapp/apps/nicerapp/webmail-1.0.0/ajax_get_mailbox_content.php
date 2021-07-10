<?php 
    require_once (dirname(__FILE__).'/functions.php');
    
      echo webmail_get_mailbox_content (
        $_POST['serverConfig'], 
        $_POST['serverIdx'], 
        $_POST['mailboxes'], 
        $_POST['mailboxIdx'], 
        $_POST['pageIdx'],
        $_POST['perPage']
    );
?>
