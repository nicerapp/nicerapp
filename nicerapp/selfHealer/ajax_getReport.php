<?php 
    $ramDiskFolder = realpath(dirname(__FILE__).'/../../..').'/RAM_disk';
    //echo $ramDiskFolder;
    echo file_get_contents ($ramDiskFolder.'/report.html');
?>
