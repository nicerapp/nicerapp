<?php

class selfHealer {
    public $version = '1.0.0';
    public $about = array(
        'whatsThis' => 'NicerApp selfHealer anti-intrusion system',
        'version' => '1.0.0',
        'history' => array (
            '1.y.z' => 'Compatible with php7 and above'
        ),
        'created' => 'Sunday, 10 January 2021 23:50 CET',
        'lastModified' => 'Sunday, 10 January 2021 23:50 CET',
        'copyright' => 'Copyright (c) and All Rights Reserved (r) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    );
    
    public function checkFolderContents ($folder) {
        $r = "\t\t".'<h2 class="selfHealerTitle">NicerApp SelfHealer for '.$folder.'</h2>'."\r\n";
        //echo $r;
        
        $dataFile = realpath(dirname(__FILE__).'/appData').'/'.base64_encode($folder).'.txt';
        $scriptFile = realpath(dirname(__FILE__).'/appData').'/script.sh';
        
        $xec = 'ls -Ral --full-time "'.$folder.'" > "'.$dataFile.'"';
        exec ($xec, $output, $result);
        //echo '<pre>'.$xec.'</pre><br/>';
        $dbg = array (
            'xec' => $xec,
            'output' => $output,
            'result' => $result
        );
        //echo '<pre class="selfHealerMsg selfHealerDbg">';var_dump($dbg);echo '</pre>';
        
        // useless : checks access time (ls -u) of all files
        /*
        $xec = 'ls -Ralu --full-time "'.$folder.'" >> "'.$dataFile.'"';
        exec ($xec, $output, $result);
        //echo '<pre>'.$xec.'</pre><br/>';
        $dbg = array (
            'xec' => $xec,
            'output' => $output,
            'result' => $result
        );
        echo '<pre class="selfHealerMsg selfHealerDbg">';var_dump($dbg);echo '</pre>';
        */
        
        if (file_exists($dataFile.'.hash')) {
            $c1 = file_get_contents($dataFile.'.hash');

            $xec = 'echo password | sha512 "'.$dataFile.'" > "'.$dataFile.'.hash2"';
            exec ($xec, $output, $result);
            //echo '<pre>'.$xec.'</pre><br/>';
            
            $c2 = file_get_contents($dataFile.'.hash2');
            
            $xec = 'rm -rf "'.$dataFile.'.hash2"';
            exec ($xec, $output, $result);
            
            $r = ($c1===$c2);
            if ($r) {
                echo "\t\t".'<p class="selfHealerMsg selfHealerResult">Hash for "'.$folder.'" checks out! :)</p>'."\r\n";
            } else {
                echo "\t\t".'<p class="selfHealerMsg selfHealerFailed">Hash check for "'.$folder.'" failed! :(</p>'."\r\n";
            }
            return $r;
            
        } else {
            echo "\t\t".'<p class="selfHealerMsg selfHealerWarning">Warning : need to create the initial hash file for "'.$folder.'"</p>'."\r\n";
            
            $xec = 'echo password | sha512 "'.$dataFile.'" > "'.$dataFile.'.hash"';
            exec ($xec, $output, $result);
            //echo '<pre>'.$xec.'</pre><br/>';
            $dbg = array (
                'xec' => $xec,
                'output' => $output,
                'result' => $result
            );
            //echo '<pre class="selfHealerMsg selfHealerResult">';var_dump($dbg);echo '</pre>';
            
            return true;
        }
    }
}

?>
