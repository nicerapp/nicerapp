<?php 
require_once (dirname(__FILE__).'/nicerapp/boot.php');
    if (array_key_exists('apps', $_GET) && $_GET['apps']!=='') {
        $app = json_decode (base64_decode_url($_GET['apps']), true);
        //var_dump ($app); 
        //$files = getFilePathList (realpath(dirname(__FILE__)).'/apps', true, '/app.site.*.php/', array('file'), 3);
        $folders = getFilePathList (realpath(dirname(__FILE__)).'/nicerapp/apps', true, '/.*/', array('dir'), 1);
        //echo '<pre>'; var_dump ($files); die();
        foreach ($folders as $idx => $folder) {
            foreach ($app as $appName => $appSettings) {
                //$dir = realpath(dirname(__FILE__)).'/nicerapp/apps/'.basename($folder).'/'.$appName;
                $files = getFilePathList($folder.'/'.$appName, false, '/.*/', array('file'), 1);
                $dbg = array (
                    'folder' => $folder,
                    'appName' => $appName,
                    'siteContent' => 
                        file_exists($folder.'/'.$appName.'/app.siteContent.php')
                        ? execPHP($folder.'/'.$appName.'/app.siteContent.php')
                        : false,
                    'siteToolbarRight' => 
                        file_exists($folder.'/'.$appName.'/app.siteToolbarRight.php')
                        ? execPHP($folder.'/'.$appName.'/app.siteToolbarRight.php')
                        : false
                );
                //echo '<pre style="color:green;">'; echo json_encode($dbg, JSON_PRETTY_PRINT); echo '</pre>'."\r\n";
                //echo '<pre>'; echo json_encode($files, JSON_PRETTY_PRINT); echo '</pre>'."\r\n";
                echo json_encode($dbg);
            }
        }
    } else {    
        global $cms;
        $cms = new nicerAppCMS();
        $cms->init();
        
        $contentFile = realpath(dirname(__FILE__)).'/nicerapp/domainConfigs/'.$cms->domain.'/frontpage.siteContent.php';
        $siteToolbarRightFile = realpath(dirname(__FILE__)).'/nicerapp/domainConfigs/'.$cms->domain.'/frontpage.siteToolbarRight.php';
        $dbg = array (
            'folder' => $folder,
            'appName' => $appName,
            'contentFile' => $contentFile,
            'siteContent' => 
                file_exists($contentFile)
                ? execPHP($contentFile)
                : false,
            'siteToolbarRight' => 
                file_exists($siteToolbarRightFile)
                ? execPHP($siteToolbarRightFile)
                : false
        );
        echo json_encode($dbg);
    }

?>
