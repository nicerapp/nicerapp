<html>
<head>
    <style>
        .filename {
            color : white;
        }
    </style>
</head>
<body style="overflow:auto">
<div id="photoAlbumSelection__scrollpane" class="vividScrollpane vividTheme__scroll_black" style="width:100%; height:100%;">
<?php
    $root = realpath(dirname(__FILE__).'/../../../');
    require_once ($root.'/boot.php');
    set_time_limit(10);
    /*
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.gc_maxlifetime', 3600);
        session_start(); 
    };*/

    
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);    

    global $cms;
    $cms = new nicerAppCMS();
    $cms->init();
    
    $baseURL = '/nicerapp/siteData/'.$cms->domain;
    $baseDir = $root.'/siteData/'.$cms->domain;
    //echo '<pre style="color:white;">'; var_dump($baseDir); echo '</pre>'; die();
    
    $couchdbConfigFilepath = $root.'/domainConfigs/'.$cms->domain.'/couchdb.json';
    $cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

    $cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
    $cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
    $cdb->useSSL($cdbConfig['useSSL']);
    $cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);

    // create users
    $dbs = $cdb->getAllDatabases();
    //echo '<pre style="color:white;">'; var_dump ($dbs); echo '</pre>'; die();
    
    //$albums = json_decode(base64_decode_url($_GET['albums']));
    //echo '<div style="color:white;">'; var_dump ($albums); echo '</div>'; die();
    
    /*  $albums can NOT be passed on the URL from the browser na.tree.tinyMCE_photoAlbums_list(),
        hits real limitations when used in conjunction with larger (5000+ photos) photo databases
        
        so instead, we query the couchdb server from PHP :
    */
    //$dbs = $couchdb->getAllDbs();
    $dbList = '';
    $albums = array();
    foreach ($dbs->body as $idx => $dbName) {
        $dbList .= $dbName.'<br/>';
        
        if (
            (strpos($dbName,'tree__role')!==false)
            || (strpos($dbName,'tree__user')!==false)
        ) {
            $do = true;
            try { $db = $cdb->setDatabase($dbName,false); } catch (Exception $e) { echo $e->getMessage(); echo '<br/>'; $do = false; die(); }
            if ($do) {
                $docs = $cdb->getAllDocs();
                //echo '<pre style="color:red;">'; var_dump ($docs); echo '</pre>'; die();
                //$dbList .= json_encode($docs).'<br/>';
                //$dbList .= 'count : '.count($docs).'<br/>';
                $parentsURL = '';
                for ($i=0; $i<count($docs->body->rows); $i++) {
                    $it = $cdb->get($docs->body->rows[$i]->id);
                    //echo '<pre style="color:red;">'; var_dump ($it); echo '</pre>'; die();
                    if ($it->body->type==='naMediaFolder') {
                        $j = $i;
                        $it2 = $cdb->get($docs->body->rows[$j]->id);
                        $parentsURL = $it2->body->text;
                        
                        while ($it2->body->parent!=='#') {
                            $done = false;
                            for ($k=0; $k<count($docs->body->rows); $k++) {
                                $it3 = $cdb->get($docs->body->rows[$k]->id);
                                if ($it3->body->id===$it2->body->parent) {
                                    $parentsURL = $it3->body->text . '/' . $parentsURL;
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
                        if (strpos($dbName,'tree__role')!==false) $parentsURL = 'Groups/'.$parentsURL;
                        if (is_string(realpath($baseDir.'/'.$parentsURL))) array_push($albums, $parentsURL);
                    }
                    
                }

            }
        }
    };
    if (false) {
        echo '<div style="color:white;">'; var_dump ($parentsURL); echo '</div>';
        echo '<div style="color:yellow;">'; var_dump ($dbList); echo '</div>';
        echo '<pre style="color:lime;">'; var_dump ($albums); echo '</pre>'; 
        die();
    };

    
    /*---
    ----- format the photo albums found into HTML to be used in the tinyMCE popup 
    ---*/
    define ("FILE_FORMATS", "/(.*\.png)|(.*\.gif)|(.*\.jpg)/");
    foreach ($albums as $idx => $albumRelativePath) {
        $targetDir = $baseDir.'/'.$albumRelativePath;
        //echo '<pre style="color:lime;">'; var_dump ($targetDir); echo '</pre>'; die();
        $thumbDir = $targetDir.'/thumbs';
        //echo '<div style="color:white;">'; var_dump ($targetDir); echo '</div>'; die();
        
        /*
        $smID = $_GET['smID'];
        $iid = $_GET['iid'];
        $dialogID = $_GET['dialogID'];
        */
        $imgStyle = ''; // boxShadow perhaps

        if (!realpath($targetDir)) {
            echo '<p style="color:red;background:white;">'; var_dump($targetDir); echo '</pre>';
        } else {

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
                    
                    $onclick = 'onclick="window.top.na.blog.insertMediaFolder(\''.$albumRelativePath.'\');"';
                    
                    if (strpos($thumbURL,'ortrait')!==false) 
                    echo '<center><img src="'.$thumbURL.'" style="width:100px" '.$onclick.'/><br/><span class="filename">'.$albumRelativePath.'<br/>('.count($files).' files)'.'</span></center>';
                    else
                    echo '<center><img src="'.$thumbURL.'" style="width:200px" '.$onclick.'/><br/><span class="filename">'.$albumRelativePath.'<br/>('.count($files).' files)'.'</span></center>';
                    
                    echo '</div>';
                }
            }
        }
    }
    ?>
</div>
<script type="text/javascript">
    /*
    var 
    pane = window.top.jQuery('#photoAlbumSelection__scrollpane', document)[0];
    
    pane.document = document;
    
    window.top.na.vcc.init (pane);*/
</script>
</body>
</html>
