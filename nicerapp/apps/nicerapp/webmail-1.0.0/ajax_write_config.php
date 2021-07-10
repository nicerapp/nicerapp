<?php
require_once (dirname(__FILE__).'/functions.php');

$r = webmail_save_config(json_encode(json_decode($_POST['config_data']), JSON_PRETTY_PRINT));
if ($r === true) echo 'SUCCESS'; else echo $r;
?>
