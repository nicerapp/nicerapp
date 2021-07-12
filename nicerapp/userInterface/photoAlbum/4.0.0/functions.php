<?php
//require_once (dirname(__FILE__).'/../../../../boot_stage_001.php');
    
function naPhotoAlbum ($basePath=null) {
    $root = realpath(dirname(__FILE__).'/../../../../');
    global $cms;
    $cms = new nicerAppCMS();
    $cms->init();
    
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);    

    
    
    $baseURL = '/nicerapp/siteData/'.$cms->domain;
    $baseDir = $root.'/nicerapp/siteData/'.$cms->domain;
    $targetDir = realpath($baseDir.'/'.$basePath);
    $thumbDir = $targetDir.'/thumbs';
    
	define ("FILE_FORMATS", "/(.*\.png)|(.*\.gif)|(.*\.jpg)/");
    $files = getFilePathList ($targetDir, false, FILE_FORMATS, array('file'));
    $r = '<style>.filename {color : white;}</style>';
    
    $dbg = array (
        'baseURL' => $baseURL,
        'baseDir' => $baseDir,
        'targetDir' => $targetDir,
        'files' => $files
    );
    //echo '<pre style="color:black;background:white;border-radius:3px;border:1px solid black;">'; var_dump ($dbg); echo '</pre>';
    foreach ($files as $idx => $filePath) {
        $fileName = str_replace ($targetDir.'/', '', $filePath);
        $thumbPath = $thumbDir.'/'.$fileName;
        $thumbURL = str_replace ($baseDir, $baseURL, $thumbPath);
        $fileURL = str_replace ($baseDir, $baseURL, $filePath);
        $dbg = array (
            'fileName' => $fileName,
            'filePath' => $filePath,
            'baseDir' => $baseDir,
            'thumbDir' => $thumbDir,
            'thumbPath' => $thumbPath,
            'thumbURL' => $thumbURL
        );
        //echo '<pre style="color:black;background:white;border-radius:3px;border:1px solid black;">'; var_dump ($dbg); echo '</pre>';
        $r .= '<div style="overflow:hidden;float:left;width:220px;height:200px;margin:5px;padding:10px;padding-top:20px;border-radius:10px;border:1px solid black;background:rgba(0,0,0,0.7);box-shadow:2px 2px 2px rgba(0,0,0,0.5), inset 1px 1px 1px rgba(0,0,255,0.5), inset -1px -1px 1px rgba(0,0,255,0.5);">';
        
        $onclick = '';
        $href = '';
        $arr = array (
            "cmsViewMedia" => array (
                "basePath" => $basePath,
                "filename" => $fileName
            )
        );
        $json = json_encode($arr);
        $href = "/apps/".base64_encode_url($json);
        
        
        $r .= '<center><a href="'.$href.'"><img src="'.$thumbURL.'" style="width:200px" '.$onclick.'/><br/><span class="filename">'.$fileName.'</span></a></center></div>';        
    }
    return $r;
}
?>
