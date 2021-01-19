<?php 
    require_once(dirname(__FILE__).'/../../boot.php');
    $root = realpath(dirname(__FILE__).'/../../siteMedia/backgrounds');
    $files = getFilePathList ($root, true, '/.*/', array('dir','file'));
    $files2 = array();
    foreach ($files as $idx => $file) {
        $files2[] = str_replace ($root, '', $file);
    }
    echo json_encode($files2, JSON_PRETTY_PRINT);
?>
