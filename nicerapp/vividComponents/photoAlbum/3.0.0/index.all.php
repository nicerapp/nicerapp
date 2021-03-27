<html>
<head>
    <style>
        .filename {
            color : white;
        }
    </style>
</head>
<body style="overflow:hidden">
<div id="photoAlbumSelection__scrollpane" class="vividScrollpane vividTheme__scroll_black" style="width:100%; height:100%;">
<?php
    require_once (dirname(__FILE__).'/../../../../boot_stage_001.php');
    global $saSiteHTTP; global $saSiteDomain; global $saSiteRootFolder; global $saFrameworkFolder;
    global $saSiteHD; global $saFrameworkHD; 
    global $saSiteURL; global $saFrameworkURL;global $saCMS;
    set_time_limit(5);
    session_start();
    
    $baseURL = $saSiteURL.'nicerapp/siteData/'.$_SERVER['HTTP_HOST'];
    $baseDir = $saSiteHD.'nicerapp/siteData/'.$_SERVER['HTTP_HOST'];
    
    
    //$albums = json_decode(base64_decode_url($_GET['albums']));
    //echo '<div style="color:white;">'; var_dump ($albums); echo '</div>'; die();
    
    /*  $albums can NOT be passed on the URL from the browser na.tree.tinyMCE_photoAlbums_list(),
        hits real limitations when used in conjunction with larger (5000+ photos) photo databases
        
        so instead, we query the couchdb server from PHP :
    */
    $couchdb = couchdb_client();
    $dbs = $couchdb->getAllDbs();
    $dbList = '';
    $albums = array();
    foreach ($dbs as $idx => $dbName) {
        $dbList .= $dbName.'<br/>';
        
        if (
            (strpos($dbName,'tree__roles')!==false)
            || (strpos($dbName,'tree__user')!==false)
        ) {
            $do = true;
            try { $db = $couchdb->useDb(['name'=>$dbName,'create_if_not_exist'=>false]); } catch (Exception $e) { echo $e->getMessage(); echo '<br/>'; $do = false; }
            if ($do) {
                $docs = $db->getAllDocs();
                //$dbList .= json_encode($docs).'<br/>';
                //$dbList .= 'count : '.count($docs).'<br/>';
                $parentsURL = '';
                for ($i=0; $i<count($docs); $i++) {
                    $it = $docs[$i];
                    if ($it->type==='naMediaAlbum') {
                        $j = $i;
                        $it2 = $docs[$j];
                        $parentsURL = $it2->text;
                        
                        while ($it2->parent!=='#') {
                            $done = false;
                            for ($k=0; $k<count($docs); $k++) {
                                $it3 = $docs[$k];
                                if ($it3->id===$it2->parent) {
                                    $parentsURL = $it3->text . '/' . $parentsURL;
                                    $done = true;
                                    break;
                                }
                            }
                            if (!$done) break;
                            $it2 = $it3;
                        }
                    }
                    if ($parentsURL!=='') {
                        if (strpos($dbName,'tree__user')!==false) $parentsURL = 'Users/'.$parentsURL;
                        if (strpos($dbName,'tree__roles')!==false) $parentsURL = 'Groups/'.$parentsURL;
                        array_push($albums, $parentsURL);
                    }
                    
                }

            }
        }
    };
    //echo '<div style="color:white;">'; var_dump ($parentsURL); echo '</div>';
    //echo '<div style="color:yellow;">'; var_dump ($dbList); echo '</div>';
    //echo '<pre style="color:lime;">'; var_dump ($albums); echo '</div>'; 
    //die();

    
    /*---
    ----- format the photo albums found into HTML to be used in the tinyMCE popup 
    ---*/
    define ("FILE_FORMATS", "/(.*\.png)|(.*\.gif)|(.*\.jpg)/");
    foreach ($albums as $idx => $albumRelativePath) {
        $targetDir = $baseDir.'/'.$albumRelativePath;
        $thumbDir = $targetDir.'/thumbs';
        //echo '<div style="color:white;">'; var_dump ($targetDir); echo '</div>'; die();
        
        /*
        $smID = $_GET['smID'];
        $iid = $_GET['iid'];
        $dialogID = $_GET['dialogID'];
        */
        $imgStyle = ''; // boxShadow perhaps

        $files = getFilePathList ($targetDir, false, FILE_FORMATS, array('file'));
        
        $dbg = array (
            'baseURL' => $baseURL,
            'baseDir' => $baseDir,
            'targetDir' => $targetDir,
            'files' => $files
        );
        //if (count($files)>0) {echo '<pre style="color:red;background:white;border-radius:3px;border:1px solid black;">'; var_dump ($dbg); echo '</pre>'; die();};
        //echo '<pre style="color:red;background:white;border-radius:3px;border:1px solid black;">'; var_dump ($dbg); echo '</pre>';
        
        foreach ($files as $idx2 => $filePath) {
            if ($idx2===0) {
                $fileName = str_replace ($targetDir.'/', '', $filePath);
                $thumbPath = $thumbDir.'/'.$fileName;
                $thumbURL = str_replace ($baseDir, $baseURL, $thumbPath);
                $fileURL = str_replace ($baseDir, $baseURL, $filePath);
                $dbg = array (
                    'fileName' => $fileName,
                    'filePath' => $filePath,
                    'albumRelativePath' => $albumRelativePath,
                    'baseDir' => $baseDir,
                    'thumbDir' => $thumbDir,
                    'thumbPath' => $thumbPath,
                    'thumbURL' => $thumbURL
                );
                //echo '<pre style="color:black;background:white;border-radius:3px;border:1px solid black;">'; var_dump ($dbg); echo '</pre>';
                echo '<div style="overflow:hidden;float:left;width:500px;height:180px;margin:5px;padding:10px;padding-top:20px;border-radius:10px;border:1px solid black;background:rgba(0,0,0,0.7);box-shadow:2px 2px 2px rgba(0,0,0,0.5), inset 1px 1px 1px rgba(0,0,255,0.5), inset -1px -1px 1px rgba(0,0,255,0.5);">';
                
                if ($iid=='pageSettings__pageSettings_siteBackgroundTree_tree') {
                    if ($dialogID!=='siteBackground') {
                        $onclick = 'onclick="window.top.na.sitePopups.pageSettings.setBackground(\''.$dialogID.'\', \''.$fileURL.'\');"';
                    } else {
                        $onclick = 'onclick="window.top.na.s.c.setBackground(\''.$fileURL.'\');"';
                    }
                } else {
                    $onclick = 'onclick="window.top.na.siteManager.insertPhotoAlbum(\''.$albumRelativePath.'\');"';
                }
                
                if (strpos($thumbURL,'ortrait')!==false) 
                echo '<center><img src="'.$thumbURL.'" style="width:100px" '.$onclick.'/><br/><span class="filename">'.$albumRelativePath.'<br/>('.count($files).' files)'.'</span></center>';
                else
                echo '<center><img src="'.$thumbURL.'" style="width:200px" '.$onclick.'/><br/><span class="filename">'.$albumRelativePath.'<br/>('.count($files).' files)'.'</span></center>';
                
                echo '</div>';
            }
        }
    }
    ?>
</div>
<script type="text/javascript">
    var 
    pane = window.top.jQuery('#photoAlbumSelection__scrollpane', document)[0];
    
    pane.document = document;
    
    window.top.na.vcc.init (pane);
</script>
</body>
</html>
