<html>
<body style="overflow:hidden">
<?php
    require_once (dirname(__FILE__).'/../../../../boot_stage_001.php');
    global $saSiteHTTP; global $saSiteDomain; global $saSiteRootFolder; global $saFrameworkFolder;
    global $saSiteHD; global $saFrameworkHD; 
    global $saSiteURL; global $saFrameworkURL;global $saCMS;
    
    $baseURL = $saSiteURL.'nicerapp/siteData/'.$_SERVER['HTTP_HOST'];
    $baseDir = $saSiteHD.'nicerapp/siteData/'.$_SERVER['HTTP_HOST'];
    $targetDir = $baseDir.'/'.$_GET['basePath'];
    $thumbDir = $targetDir.'/thumbs';
    
    $smID = $_GET['smID'];
    $iid = $_GET['iid'];
    $dialogID = $_GET['dialogID'];
    $imgStyle = ''; // boxShadow perhaps

	define ("FILE_FORMATS", "/(.*\.png)|(.*\.gif)|(.*\.jpg)/");
    $files = getFilePathList ($targetDir, false, FILE_FORMATS, array('file'));
    
    ?>
    <style>
        .filename {
            color : white;
        }
    </style>
    <?php
    
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
        echo '<div style="overflow:hidden;float:left;width:220px;height:240px;margin:5px;padding:10px;padding-top:20px;border-radius:10px;border:1px solid black;background:rgba(0,0,0,0.7);box-shadow:2px 2px 2px rgba(0,0,0,0.5), inset 1px 1px 1px rgba(0,0,255,0.5), inset -1px -1px 1px rgba(0,0,255,0.5);">';
        
        if ($iid=='pageSettings__pageSettings_siteBackgroundTree_tree') {
            if ($dialogID!=='siteBackground') {
                $onclick = 'onclick="window.top.na.sitePopups.pageSettings.setBackground(\''.$dialogID.'\', \''.$fileURL.'\');"';
            } else {
                $onclick = 'onclick="window.top.na.s.c.setBackground(\''.$fileURL.'\');"';
            }
        } else {
            $onclick = '';
        }
        
        echo '<center><img src="'.$thumbURL.'" style="width:200px" '.$onclick.'/><br/><span class="filename">'.$fileName.'</span></center></div>';        
    }
?>
</body>
</html>
