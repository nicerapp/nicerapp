<?php 
    require_once (dirname(__FILE__).'/nicerapp/boot.php');
    
    global $naDebugAll;
    $debug = true;
    if ($debug) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }
    
    
    if (array_key_exists('apps', $_GET) && $_GET['apps']!=='') {
        $app = json_decode (base64_decode_url($_GET['apps']), true);
        if ($debug) { var_dump ($app); echo PHP_EOL.PHP_EOL;  };
        $folders = getFilePathList (realpath(dirname(__FILE__)).'/nicerapp/apps', true, '/.*/', array('dir'), 1);
        if ($debug) { var_dump ($folders); echo PHP_EOL.PHP_EOL;  };
        foreach ($folders as $idx => $folder) {
            foreach ($app as $appName => $appSettings) {
                if ($appName=='meta') continue;
                $files = getFilePathList($folder.'/'.$appName, false, '/app.dialog.*\.php/', array('file'), 1);
                if ($debug) { var_dump ($folder.'/'.$appName); var_dump ($files); echo PHP_EOL.PHP_EOL;  }
                
                $ret = array ();
                
                foreach ($files as $idx2 => $filepath) {
                    if (substr(basename($filepath),0,1)=='.') continue;
                    $fileRoot = $folder.$appName.'/';
                    $filename = str_replace ($fileRoot, '', $filepath);
                    $dialogID = str_replace ('app.dialog.', '', $filename);
                    $dialogID = str_replace ('.php', '', $dialogID);
                    $arr = array ( $dialogID => execPHP($filepath) );
                    //echo $filepath.'='; var_dump ($arr); echo PHP_EOL.PHP_EOL;
                    //$arr = array ( $dialogID => $filepath );
                    $ret = array_merge ($ret, $arr);
                }
                //var_dump ($ret); die();
                if ($debug) {
                    echo '<pre style="color:green;">'; echo json_encode($ret, JSON_PRETTY_PRINT); echo '</pre>'."\r\n";
                    echo '<pre>'; echo json_encode($files, JSON_PRETTY_PRINT); echo '</pre>'."\r\n";
                }
                echo json_encode($ret);
            }
        }
    } else {    
        global $cms;
        if (!$cms) {
            $cms = new nicerAppCMS();
            $cms->init();
        }
        
        $folder = realpath(dirname(__FILE__)).'/nicerapp/domainConfigs/'.$cms->domain.'/';
        $files = getFilePathList($folder, false, '/frontpage.dialog.*\.php/', array('file'), 1);
        if ($debug) { echo json_encode($files); echo PHP_EOL.PHP_EOL; };
        
        $ret = array ();
        foreach ($files as $idx2 => $filepath) {
            $fileRoot = $folder;
            $filename = str_replace ($fileRoot, '', $filepath);
            $dialogID = str_replace ('frontpage.dialog.', '', $filename);
            $dialogID = str_replace ('.php', '', $dialogID);
            $arr = array ( $dialogID => execPHP($filepath) );
            //$arr = array ( $dialogID => $filepath );
            $ret = array_merge ($ret, $arr);
        }
        echo json_encode($ret);
    }

?>
