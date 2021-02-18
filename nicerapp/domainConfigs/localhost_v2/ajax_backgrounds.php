<?php 
    require_once(dirname(__FILE__).'/../../boot.php');
    $cacheFile = realpath(dirname(__FILE__).'/../../siteCache').'/backgrounds.json';
    
    if (!file_exists($cacheFile)) {
        $root = realpath(dirname(__FILE__).'/../../siteMedia/backgrounds');
        $files = getFilePathList ($root, true, '/.*/', array('file'));
        $files2 = array();
        foreach ($files as $idx => $file) {
            $files2[] = str_replace ($root, '', $file);
        }
        $r = json_encode($files2, JSON_PRETTY_PRINT);
        echo $r;
        file_put_contents($cacheFile, $r);
    } else {
        echo file_get_contents($cacheFile);
    }
?>
