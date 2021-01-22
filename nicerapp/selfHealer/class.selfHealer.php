<?php

class selfHealer {
    public $version = '1.0.0';
    public $about = array(
        'whatsThis' => 'NicerApp selfHealer intrusion detection and response system',
        'version' => '1.0.0',
        'history' => array (
            '1.y.z' => 'Compatible with php7 and above'
        ),
        'created' => 'Sunday, 10 January 2021 23:50 CET',
        'lastModified' => 'Sunday, 10 January 2021 23:50 CET',
        'copyright' => 'Copyright (c) and All Rights Reserved (r) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    );
    
    public function run(&$report) {
        $r = '<h2 class="selfHealerMsg">Nicer.App selfHealer now running</h2>'."\r\n";
        $httpRoot = realpath(dirname(__FILE__).'/..');
        $folders = array(
            '/etc/nginx',
            '/etc/apache2',
            '/etc/php/7.4',
            $httpRoot
        );
        
        $ret = array();
        foreach ($folders as $idx => $folder) {
            $folderRP = realpath($folder);
            if ($folderRP!=='' && file_exists($folderRP)) {
                $ret[] = $this->checkFolderContents($folderRP, $r);
            } else {
                $r .= '<p class="selfHealerMsg selfHealerNotice">Notice : "'.$folder.'" does not exist.</p>'."\r\n";
            }
        }
        //echo '<pre style="color:lime;">';var_dump ($r);echo '</pre>';
        
        $report = $r;
        $ret = in_array (false, $ret, true);
        return !$ret;
    }
    
    public function checkFolderContents ($folder, &$report) {
        $r = '<h2 class="selfHealerTitle">NicerApp SelfHealer for '.$folder.'</h2>'."\r\n";
        //echo $r;
        
        $htdocs = realpath(dirname(__FILE__).'/../../..');
        //echo $htdocs; die();
        $dataFile = $htdocs.'/RAM_disk/'.base64_encode($folder).'.txt';
        
        $xec = 'ls -Rl --full-time "'.$folder.'" | tr -d \'\r\n\' > "'.$dataFile.'"';
        exec ($xec, $output, $result);
        $c = join('',$output);
        
        $dbg = array (
            'xec' => $xec,
            'output' => $output,
            'result' => $result
        );
        //echo '<pre class="selfHealerMsg selfHealerDbg">';var_dump($dbg);echo '</pre>';
        
        $f = fopen ($dataFile, 'a');
        fwrite ($f, join(" _ ",$this->getFolderReport($folder)));
        fclose ($f);
        
        //$c .= join('',$this->getFolderReport($folder));
        
        /*
        $c = file_get_contents($dataFile);
        $c = str_replace("\r\n", '', $c);
        $c = str_replace("\n", '', $c);
        $c = str_replace("\r", '', $c);
        file_put_contents($dataFile, $c);
        */
        
        if (file_exists($dataFile.'.hash')) {
            $c1 = file_get_contents($dataFile.'.hash');

            $xec = 'cat "'.$dataFile.'" | sha512 > "'.$dataFile.'.hash2"';
            //$xec = 'echo '.$c.' | sha512 > "'.$dataFile.'.hash2"';
            exec ($xec, $output, $result);
            //echo '<pre>'.$xec.'</pre><br/>';
            
            $c2 = file_get_contents($dataFile.'.hash2');
            
            //$xec = 'rm -rf "'.$dataFile.'.hash2"';
            //exec ($xec, $output, $result);
            
            $ret = ($c1===$c2);
            if ($ret) {
                $r .= '<p class="selfHealerMsg selfHealerResult">Hash for "'.$folder.'" checks out! :)</p>'."\r\n";
            } else {
                $r .= '<p class="selfHealerMsg selfHealerFailed">Hash check for "'.$folder.'" failed! :(</p>'."\r\n";
            }
            
            $report = $r;
            return $ret;
            
        } else {
            $r .= '<p class="selfHealerMsg selfHealerWarning">Warning : need to create the initial hash file for "'.$folder.'"</p>'."\r\n";
            
            $xec = 'cat "'.$dataFile.'" | sha512 > "'.$dataFile.'.hash"';
            //$xec = 'echo '.escapeshellarg($c).' | sha512 > "'.$dataFile.'.hash"';// 2> "'.$dataFile.'.errs.txt"';
            $output = exec ($xec, $output, $result);
            //echo '<pre>'.$xec.'</pre><br/>';
            /*
            $dbg = array (
                'xec' => $xec,
                'output' => $output,
                'result' => $result
            );
            $r .= '<pre class="selfHealerMsg selfHealerResult">';var_dump($dbg);echo '</pre>';
            */
            
            $report = $r;
            return true;
        }
    }
    
    function getFolderReport ($folder) {
        $files = getFilePathList ($folder, true, '/.*/', array('dir','file'));
        //echo '<pre style="color:lime;">';var_dump ($files);echo '</pre>';
        $basePath = realpath(dirname(__FILE__).'/../..');
        $r = array();
        foreach ($files as $idx => $file) {
            $fileRel = str_replace ($basePath.'/', '', $file);
            clearstatcache();
            //if (strpos($fileRel,'.git')===false) {
                $r[] = $fileRel.' - '.filectime($file).' - '.filemtime($file);
            //}
        }
        return $r;
    }
}

?>
