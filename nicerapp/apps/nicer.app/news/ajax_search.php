<?php
    require_once (dirname(__FILE__).'/../../../../../../../boot_stage_001a.php');
    //require_once (dirname(__FILE__).'/../../../../../../ui/jsonViewer/jsonViewer.php');
    
    ini_set ('memory_limit', '1024M');

    header ('Content-Type: application/json');
    ob_start("ob_gzhandler");
    
    $dataRoot = dirname(__FILE__).'/newsItems';
    $data = array();
    
    if (array_key_exists('section',$_GET)) {
        $section = str_replace('_',' ', preg_replace('/__/','/',$_GET['section']));
        $sectionFilesys = str_replace('_',' ', $_GET['section']);
    }
    
    $xec = 'grep -riL "'.$_GET['q'].'" "'.$dataRoot.'"';
    $exec = exec ($xec, $filesList, $result);
    //echo '<pre>'; var_dump ($xec); var_dump ($result); var_dump ($filesList); echo '</pre><br/>'; //die();
    
    foreach ($filesList as $idx => $filepath) {
        
        if (array_key_exists('section',$_GET)) {
            if (strpos($filepath, $sectionFilesys)===false) continue;
        };
        
        $relPath = str_replace (dirname(__FILE__).'/newsItems', '', $filepath);
        $relPath = str_replace ('/items.json', '', $relPath);

        $d = &chaseToPath($data, $relPath, true);
        $d = json_decode (file_get_contents($filepath), true);
    }
    
    echo json_encode ($data);
?>
