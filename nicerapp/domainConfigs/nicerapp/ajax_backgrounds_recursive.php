<?php 
    require_once(dirname(__FILE__).'/../../boot.php');
    $cacheFile = realpath(dirname(__FILE__).'/../../siteCache/').'/backgrounds_recursive.json';
    $root = realpath(dirname(__FILE__).'/../../siteMedia/backgrounds');
    
    if (!file_exists($cacheFile)) {
        $files = getFilePathList ($root, true, '/.*/', array('file'), null, 1, true);
        $files2 = array();
        
        $r = json_encode($files, JSON_PRETTY_PRINT);
        echo $r;
        file_put_contents($cacheFile, $r);
    } else {
        echo file_get_contents($cacheFile);
    }

    /*
    function adjustArray (&$src, &$output) {
        $root = realpath(dirname(__FILE__).'/../../siteMedia/backgrounds');
        foreach ($src as $k => $v) {
            if (is_array($v) && count($v)>0) {
                $k2 = str_replace ($root, '', $k);
                $k2 = substr($k2, 1, strlen($k2)-2);
                $output[$k2] = array();
                adjustArray ($src[$k], $output[$k2]);
            } else {
                $k2 = str_replace ($root, '', $k);
                $k2 = substr($k2, 1, strlen($k2)-1);
                $output[] = $k2;
            }
        }
    }*/
            
?>
