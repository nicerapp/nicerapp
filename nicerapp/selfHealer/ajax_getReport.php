<?php 
    $ramDiskFolder = realpath(dirname(__FILE__).'/../../..').'/RAM_disk';
    echo file_get_contents ($ramDiskFolder.'/report.html');
?>
