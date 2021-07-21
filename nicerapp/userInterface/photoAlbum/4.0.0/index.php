<html>
<head>
    <link type="text/css" rel="StyleSheet" href="/nicerapp/domainConfigs/nicer.app/index.css?c=<?php echo date('Ymd_His',filemtime(realpath(dirname(__FILE__).'/../../../').'/domainConfigs/nicerapp/index.css'))?>">
    <link type="text/css" rel="StyleSheet" href="/nicerapp/domainConfigs/nicer.app/index.dark.css?c=<?php echo date('Ymd_His',filemtime(realpath(dirname(__FILE__).'/../../../').'/domainConfigs/nicerapp/index.dark.css'))?>">
    <script type="text/javascript" src="/nicerapp/userInterface/photoAlbum/4.0.0/photoAlbum-4.0.0.source.js?c=<?php echo date('Ymd_His', filemtime(dirname(__FILE__).'/../userInterface/photoAlbum/4.0.0/photoAlbum-4.0.0.source.js'));?>"></script>
</head>
<body style="overflow:hidden">
<div class="vividScrollpane" style="width:100%;height:98%;">
<?php
    $root = realpath(dirname(__FILE__).'/../../../../');
    require_once ($root.'/nicerapp/boot.php');
    
    global $naDebugAll; 
    $debug = false;    
    
    global $cms;
    
    $baseURL = '/nicerapp/siteData/'.$cms->domain.'/';
    $baseDir = $root.'/nicerapp/siteData/'.$cms->domain.'/';
    $targetDir = $baseDir.$_GET['basePath'];
    $thumbDir = $targetDir.'/thumbs';
    
    $imgStyle = ''; // boxShadow perhaps

	define ("FILE_FORMATS", "/(.*\.png)|(.*\.gif)|(.*\.jpg)/");
    $files = getFilePathList ($targetDir, false, FILE_FORMATS, array('file'));
    if ($debug) { echo $targetDir."<br/>\r\n"; echo json_encode($files, JSON_PRETTY_PRINT); };
    
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
    if ($debug && false) { echo '<pre style="color:black;background:white;border-radius:3px;border:1px solid black;">'; var_dump ($dbg); echo '</pre>'; }
    foreach ($files as $idx => $filePath) {
        $fileName = str_replace ($targetDir.'/', '', $filePath);
        $thumbPath = $thumbDir.'/'.$fileName;
        $thumbURL = str_replace ($baseDir, $baseURL, $thumbPath);
        $fileURL = str_replace ($baseDir, $baseURL, $filePath);
        $dbg = array (
            'targetDir' => $targetDir,
            'fileName' => $fileName,
            'filePath' => $filePath,
            'baseDir' => $baseDir,
            'thumbDir' => $thumbDir,
            'thumbPath' => $thumbPath,
            'thumbURL' => $thumbURL
        );
        //echo '<pre style="color:black;background:white;border-radius:3px;border:1px solid black;">'; var_dump ($dbg); echo '</pre>';die();
        echo '<div style="overflow:hidden;float:left;width:220px;height:auto;margin:5px;padding:10px;padding-top:20px;border-radius:10px;border:1px solid black;background:rgba(0,0,0,0.7);box-shadow:2px 2px 2px rgba(0,0,0,0.5), inset 1px 1px 1px rgba(0,0,255,0.5), inset -1px -1px 1px rgba(0,0,255,0.5);">';
        
        
        $onclick = 'onclick="window.top.na.blog.onclick_mediaThumbnail(event, \''.$_GET['basePath'].'\', \''.$fileName.'\')"';
        
        echo '<center><img src="'.$thumbURL.'" class="mediaThumb" style="width:200px" '.$onclick.'/><br/><span class="filename">'.$fileName.'</span></center></div>';        
    }
?>
</div>
</body>
</html>
