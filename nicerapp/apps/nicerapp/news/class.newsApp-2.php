<?php 
// Copyright (c) and All Right Reserved (r) 2018 by Rene AJM Veerman, Amsterdam, Netherlands.
// The License for this web-app "news" / "newsApp" is located at http://nicer.app/LICENSE.txt

require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/sources-list.php');
require_once (dirname(__FILE__).'/functions.php'); // generic walker functions and anything else you wouldn't want to see end up in a class code file.

//require_once (dirname(__FILE__).'/../../../../../../userInterface/jsonViewer/jsonViewer.php');

$prevLevel = 0; global $prevLevel;

function leading_zero ($x) {
    if ($x<10) $r = '0'.$x; else $r = $x;
    return $r;
}

class newsApp2_class {
    public $fs = array(); // factorySettings
    public $ds = array(); // dataSources
    public $d = array(); // data
    public $curlOps = array(); // cURL operations
    public static $prevLevel = 0;

    public $daysToKeepData = 14;

    public static function about () {
        $r = array(
            'name' => 'newsApp',
            'address' => 'https://nicer.app/news',
            'copyright' => 'Copyright (c) and All Rights Reserved (r) 2018-2020 by Rene AJM Veerman',
            'version' => '2.1.1'
        );
        return $r;
    }
    
	public function __construct ($factorySettings=null) {
        global $newsApp2_dataSources;
        $this->ds = $newsApp2_dataSources;
        $this->fs = $factorySettings;
        
        $dataRoot = dirname(__FILE__).'/newsItems';
        createDirectoryStructure ($dataRoot);
    }
    
    public static function &dataSources () {
        return $this->ds;
    }
    
    public function deleteOldNews () {
        $dataRoot = dirname(__FILE__).'/newsItems';
        $dateBegin = date('Y-m-d H:i:s');
        $dateBegin2 = date('Y-m-d H:i:s', strtotime('-'.$this->daysToKeepData.' days'));
        $datePath = date('Y/m/d/H/i/s', strtotime($dateBegin2));
        
        createDirectoryStructure ($dataRoot.'/2019/06/01/10/00/00');
        createDirectoryStructure ($dataRoot.'/2019/06/01/11/00/00');
        createDirectoryStructure ($dataRoot.'/2019/07/22/10/00/00');
        
        // fetch relevant directories
        $dirs = getFilePathList ($dataRoot, true, '/.*/', array('dir'), 7);
        //var_dump ($dirs);die();
        $dirs2 = array();
        foreach ($dirs as $idx => $dir) {
            $c = substr_count ($dir, '/');
            $c1 = substr_count ($dataRoot, '/');
            //var_dump ($c); var_dump ($c1); echo '<br/>';
            if ($c == $c1 + 6) {
                //var_dump ($dataRoot.'/'.$datePath.' > '.$dir.' = '.($dataRoot.'/'.$datePath > $dir?'true':'false'));
                if ($dataRoot.'/'.$datePath > $dir) $dirs2[] = $dir;
            }
        }
        $dirs = $dirs2; unset ($dirs2);
        sort ($dirs);
        var_dump ($dirs);
        
        foreach ($dirs as $idx => $dir) {
            $dors = explode('/',$dir);
            unset ($dors[count($dors)-1]);
            unset ($dors[count($dors)-1]);
            unset ($dors[count($dors)-1]);
            $dir = implode ('/', $dors);
        
            $cmd = 'rm -rf '.str_replace(' ', '\ ', $dir);
            $r = exec ($cmd, $output, $return);
            $dbg = array (
                'cmd' => $cmd,
                'r' => $r,
                'output' => $output,
                'return' => $return
            );
            //var_dump ($dbg); die();
            echo $cmd.PHP_EOL;
            
            /*
            $datePath = str_replace ($dataRoot, '', $dir);
            $scanPath = $datePath;
            while ($scanPath!=='') {
                $scanPath2 = explode('/',$scanPath);
                $scanPath3 = '';
                for ($i=0; $i<count($scanPath2)-4; $i++) { if ($scanPath3!=='') $scanPath3.='/'; $scanPath3.=$scanPath2[$i]; }
                $scanPath4 = '';
                for ($i=0; $i<count($scanPath2)-5; $i++) { if ($scanPath4!=='') $scanPath4.='/'; $scanPath4.=$scanPath2[$i]; }
                $dbg = array (
                    'scanPath3' => $scanPath3,
                    'scanPath4' => $scanPath4
                );
                var_dump ($dbg);
                
                if (file_exists($dataRoot.'/'.$scanPath3)) {                
                    //$files = getFilePathList ($dataRoot.'/'.$scanPath3, true, '/. * /', array('dir','file'));
                    //$dbg = array ('path'=>$dataRoot.'/'.$scanPath3,'files'=>$files);
                    //var_dump ($dbg);
                    //if (count($files)===1) {
                        $cmd = 'rm -rf '.$dataRoot.'/'.$scanPath3;
                        $r = exec ($cmd, $output, $return);
                        $dbg = array (
                            'cmd' => $cmd,
                            'r' => $r,
                            'output' => $output,
                            'return' => $return
                        );
                        //var_dump ($dbg);
                        echo $cmd.PHP_EOL;
                        
                    //}
                }
                
                $scanPath = $scanPath4;
            }*/
        }
    }
    
    public function deleteOldNewsFromRAM() {
        //var_dump ($this->d);
        $dateBegin2 = date('Y-m-d H:i:s', strtotime('-'.$this->daysToKeepData.' days'));
        $datePath = date('Y/m/d/H/i/s', strtotime($dateBegin2));
        $dateParts = explode('/',$datePath);
        //var_dump ($dateParts); die();
        $dp = '';
        for ($i=0; $i<count($dateParts); $i++) {
            if ($dp!=='') $dp.='/';
            $dp.=(int)$dateParts[$i];
            if (substr_count($dp,'/')>1) {
                $d = &chaseToPath($this->d, $dp, true);
                //var_dump ($dp); var_dump ($d);
                if (count($d)>0) {
                    $dp2 = $dp;
                    $dp3 = explode ('/',$dp2);
                    $dp4 = '';
                    for ($j=0; $j<count($dp3); $j++) {
                        if ($dp4!=='') $dp4.='/';
                        $dp4.=$dp3[$j];
                    }
                    $d2 = &chaseToPath ($this->d, $dp4, true);
                    unset ($d2);
                    echo 'Removed from RAM memory : '.$dp4."\r\n";
                }
            }
        }
        //die();
        //$d = &chaseToPath($this->d, $datePath, true);
    }
    
    public function readFromDisk () {
        $dataRoot = dirname(__FILE__).'/newsItems';
        
        // fetch relevant directories
        $dirs = getFilePathList ($dataRoot, true, '/.*/', array('dir'), 7);
        $dirs2 = array();
        foreach ($dirs as $idx => $dir) {
            $c = substr_count ($dir, '/');
            $c1 = substr_count ($dataRoot, '/');
            //var_dump ($c); var_dump ($c1); echo '<br/>';
            if ($c > $c1 + 6) $dirs2[] = $dir;
        }
        $dirs = $dirs2; unset ($dirs2);
        sort ($dirs);
        //echo '<div style="background:orange;color:white;">Data on disk (relevant disk locations only)</div>'.PHP_EOL;
        //echo '<pre style="color:blue">'; var_dump ($dirs); echo '</pre>';
        //die();
        
        // read in relevant files
        $fileCount = 0;
        $dirCount = 0;
        foreach ($dirs as $idx => $dir) {
            $dirCount++;
            $fn = $dir.'items.json';
            $relPath = str_replace($dataRoot.'/','',$dir);
            $relPath = substr($relPath, 0, strlen($relPath)-1);
            //echo 'readFromDisk: relPath='.$relPath.PHP_EOL;
            
            if (file_exists($fn)) {
                $fileCount++;
                $d = &chaseToPath($this->d, $relPath, true);
                $d = json_decode (file_get_contents($fn), true);
            }
        }
        //$this->sortHoursMinutes();
        
        $count = $this->countNewsItemsInRAM();
        echo 'Read in '.$count.' news items from '.$fileCount.' files in '.$dirCount.' folders.'.PHP_EOL;
        //die();
        
        //echo '<div style="background:orange;color:white;">Data in memory after reading from disk</div>'.PHP_EOL;
        //echo '<pre style="color:green">'; var_dump ($this->d); echo '</pre>';
    }
    
    public function countNewsItemsInRAM() {
        $count = 0;
        $params = array (
            'd' => &$this->d,
            'itemCount' => &$count
        );
        
        walkArray (
            $this->d, 
            'newsApp2_class::countNewsItemsInRAM__walk_key', 
            null/*'newsApp2_class::countNewsItemsInRAM__walk_value'*/, 
            false, 
            $params
        );
        
        return $count;
    }
    
    public static function countNewsItemsInRAM__walk_key ($cd) {
        $p = substr($cd['path'].'/'.$cd['k'], 1);
        $d = &$cd['params']['d'];
        
        $r1 = &chaseToPath($d, $p, false);
        if (
            is_array($r1)
            && array_key_exists('items',$r1)
            && is_array($r1['items'])
            && count($r1['items']) > 0
        ) {
            $cd['params']['itemCount'] += count($r1['items']);
        }     
    }
    
    public static function countNewsItemsInRAM__walk_value ($cd) {
        
    }
    
    public function writeToDisk() {
        foreach ($this->d as $Y => &$Yd) {
            foreach ($Yd as $m => &$md) {
                foreach ($md as $d => &$dd) {
                    foreach ($dd as $H => &$Hd) {
                        foreach ($Hd as $i => &$id) {
                            foreach ($id as $s => &$sd) {
                                $path = $Y.'/'.leading_zero($m).'/'.leading_zero($d).'/'.leading_zero($H).'/'.leading_zero($i).'/'.leading_zero($s);
                                //echo '<pre>';var_dump ($path);echo'</pre>';
                                $this->writeToDisk_node($sd, $path);
                            }
                        }
                    }
                }
            }
        }
    }
    
    public function writeToDisk_node (&$s, $path) {
        foreach ($s as $k=>&$v) {
            if (
                is_array($v)
                && array_key_exists('items',$v)
            ) {
                $this->writeToDisk_leaf_source ($v, $path.'/'.$k);
            } else {
                if (is_array($v)) {
                    $this->writeToDisk_leaf_category ($v, $path.'/'.$k, $k);
                    $this->writeToDisk_node ($v, $path.'/'.$k);
                } else {
                    /*
                    return badResult (E_USER_ERROR, array(
                        'msg' => 'newsApp2_class::writeToDisk_node() : did not expect to find non-array values.'
                    ));
                    */
                }
            }
        }
    }
    
    public function writeToDisk_leaf_category (&$v, $path, $k) {
        $dataRoot = dirname(__FILE__).'/newsItems';
        $fn = $dataRoot.'/'.$path.'/items.json';
        if (!file_exists(dirname($fn))) createDirectoryStructure (dirname($fn));
        
        $d = &$v;/*array (
            $k => &$v
        );*/
        
        if (!file_exists($fn)) {
            file_put_contents ($fn, json_encode($d));
            //echo '$fn1='.$fn.', filesize='.filesizeHumanReadable(filesize($fn)).PHP_EOL;
        }
    }
    
    public function writeToDisk_leaf_source (&$v, $path) {
        $dataRoot = dirname(__FILE__).'/newsItems';
        $fn = $dataRoot.'/'.$path.'.items.json';
        if (false) { 
        // we don't really need these files and they just take up diskspace and 
        // it also greatly increases the time spent by .../updateLiveServer.sh 
        // once news accumulates after a few weeks.
            if (!file_exists(dirname($fn))) createDirectoryStructure (dirname($fn));
            if (!file_exists($fn)) {
                file_put_contents ($fn, json_encode($v));
                //echo '$fn2='.$fn.', filesize='.filesizeHumanReadable(filesize($fn)).PHP_EOL;
            }
        }
    }
    
    public static function sortHoursMinutes () {
        $date = new DateTime();
        $dateStr = $date->format('Y/n/j');
        $h = &chaseToPath ($this->d, $dateStr);
        ksort ($h);
        //var_dump ($h);
        foreach ($h as $m=>&$s) {
            ksort ($m);
        }
    }
    
    public static function sortResultsByNumber ($a, $b) {
        return $b - $a;
    }
    
    public static function sortResultsByDateTime ($a, $b) {
        if (
            !array_key_exists('date',$b)
            || !array_key_exists('date',$a)
            || !is_numeric($b['date']) 
            || !is_numeric($a['date'])
            
        ) {
        //echo'<pre>'; var_dump ($a); var_dump ($b); echo '</pre>'; 
        }
        return $b['date'] - $a['date']; // REVERSE DATE SORT -> NEWEST ITEMS FIRST
    }
    
    
    public function writeOutMenuIfNeeded () {
    
        if (!file_exists(dirname(__FILE__).'/mainmenu.php')) {
            $ctRSSlist = filectime(dirname(__FILE__).'/sources-list.php');
            $ctMenuFile = 0;
        } else {
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                $ctRSSlist = filectime(dirname(__FILE__).'\\sources-list.php');
                $ctMenuFile = filectime(dirname(__FILE__).'\\mainmenu.php');
            } else {
                $ctRSSlist = filectime(dirname(__FILE__).'/sources-list.php');
                $ctMenuFile = filectime(dirname(__FILE__).'/mainmenu.php');
            };
        }
		
        if ($ctMenuFile < $ctRSSlist) {
            //$htmlMenu = '<ul style="display:none;">'.PHP_EOL."\t".'<li><a href="#">News</a>'.PHP_EOL."\t".'<ul>'.PHP_EOL;
            $htmlMenu = '<li><a href="#">News</a>'.PHP_EOL;
            $keyCount = 0;
            $valueCount = 0;
            $params = array (
                //'d' => &$this->d,
                'html' => &$htmlMenu,
                'prevLevel' => 0,
                'keyCount' => &$keyCount,
                'valueCount' => &$valueCount
            );
        
            walkArray ($this->ds['RSS_list'], 'newsApp2_class::writeOutMenuIfNeeded_walk_key', 'newsApp2_class::writeOutMenuIfNeeded_walk_value', false, $params);
			global $prevLevel;
			$prevLevel = 0;
            
            $htmlMenu .= "\t".'</ul>'.PHP_EOL.'</li>'.PHP_EOL.'</ul>'.PHP_EOL;
            
            file_put_contents (dirname(__FILE__).'/mainmenu.php', $htmlMenu);
            file_put_contents (dirname(__FILE__).'/mainmenu.keyCount.txt', $params['keyCount']);
            file_put_contents (dirname(__FILE__).'/mainmenu.valueCount.txt', $params['valueCount']);
        }       
    }
    
    public static function writeOutMenuIfNeeded_walk_key ($cd) {
        $path = $cd['path'].'/'.$cd['k'];
        $path = substr($path,1);
        $path2 = str_replace (' ', '_', $path);
        $path2a = str_replace('/','__', $path2);
        $indent = str_pad ('', $cd['level']+2, "\t");
        
        global $prevLevel;
        
        //var_dump ($cd); 
        
        //$x = $cd['k'].' - '.$cd['params']['prevPath'].' - '.$cd['path'].' - '.$cd['params']['prevLevel'].' - '.($cd['level']+1); var_dump ($x);
        //$x = $cd['k'].' - '.$cd['params']['prevLevel'].' - '.$cd['level']; var_dump ($x);
        //$x = $cd['k'].' - '.$prevLevel.' - '.$cd['level']; var_dump ($x);
        
        //[1]
        if ($prevLevel > $cd['level']) {
            for ($i=$prevLevel; $i>$cd['level']; $i--) {
                $cd['params']['html'].= $indent.'</ul>'.PHP_EOL;
            }
        }
            
        
        //var_dump ($cd['v']); die();
        $json = '{"news":"'.$path2a.'"}';
        $href = '/apps/'.base64_encode_url($json);
        $cd['params']['html'] .= $indent.'<li><a href="'.$href.'">'.$cd['k'].'</a>';
        $cd['params']['keyCount'] = $cd['params']['keyCount'] + 1;
        
        $doUL = false;
        if (is_array($cd['v'])) {
            foreach ($cd['v'] as $k=>$v) {
                if (is_array($v)) $doUL = true;
            }
        };
        
        if ($doUL) {
            $cd['params']['html'] .= PHP_EOL.$indent.'<ul>'.PHP_EOL;
        } else {
            $cd['params']['html'] .= '</li>'.PHP_EOL;
        }
        
            //$cd['params']['prevLevel'] = 0 + $cd['level']; // just wont work, gets updated ahead of [1]
            $prevLevel = $cd['level'];
            //$cd['params']['prevPath'] = $cd['path'];
    }
    
    public static function writeOutMenuIfNeeded_walk_value ($cd) {
        $cd['params']['valueCount'] = $cd['params']['valueCount'] + 1;
        //$path = $cd['path'];
        //echo $path.'/'.$cd['k'].PHP_EOL;
        //$path2 = str_replace (' ', '_', $path);
        //$path2a = str_replace('/','__', $path2);
        //if ($cd['level'] > 0) $indent = str_pad ('', $cd['level'], "\t"); else $indent='';
        
        //$cd['params']['html'] .= $indent.'<li><a href="/news(section\''.$path2a.'\')">'.$cd['k'].'</a></li>'.PHP_EOL;
        //$cd['params']['html'] .= '</li>'.PHP_EOL;
            //$cd['params']['prevLevel'] = $cd['level'];
    }
    
    public function fetch () {
        $d = new DateTime();
        $newCount = 0;
        $params = array (
            'd' => &$this->d,
            'date' => $d->format('Y/n/j/H/i/s'), 
            'this' => &$this,
            'newCount' => &$newCount
        );
        
        $this->writeOutMenuIfNeeded();
        
        // prep cURL operations
        walkArray ($this->ds['RSS_list'], null, 'newsApp2_class::fetch_walk_value', false, $params);
        
        /*echo 'pre curl : ';
        foreach ($this->curlOps as $idx => $curlOp) {
            echo $idx.' - '.$curlOp['cd']['path'].'/'.$curlOp['cd']['k'];
            echo PHP_EOL;
        }*/
        
        // execute cURL operations asynchronously
        $mh = curl_multi_init();
        curl_multi_setopt ($mh, CURLMOPT_MAX_HOST_CONNECTIONS, 2); // Pass a number that specifies the maximum number of connections to a single host. Recommended you dont push this above 2.
        curl_multi_setopt($mh, CURLMOPT_PIPELINING, /* depracated : CURLPIPE_HTTP1  | */CURLPIPE_MULTIPLEX); // use whatever fancyness the HTTP layer of the operating system supports
        
        foreach ($this->curlOps as $idx => $curlOp) {
            curl_multi_add_handle ($mh, $curlOp['ch']);
        }
        
        // execute all queries simultaneously, and continue when all are complete
        $running = null;
        do {
            //ob_start();
            curl_multi_exec($mh, $running);
            //ob_end_clean();
            
            // windows server bugfix before the bug even crawl in.
            if (curl_multi_select($mh) == -1) {
                    usleep(100);
            }
        } while ($running);

        $duration = getDuration('fetch');
        $fetchIntervalInMinutes = 5;
        $waitTime = round((60*$fetchIntervalInMinutes)-$duration);
        $minutes = floor($waitTime/60);
        $secs = $waitTime - ($minutes * 60);
        $minutesSpent = floor($duration/60);
        $secondsSpent = round($duration - ($minutesSpent * 60));
        echo 'Fetching news for '.file_get_contents(dirname(__FILE__).'/mainmenu.valueCount.txt').' RSS pages, '.file_get_contents(dirname(__FILE__).'/mainmenu.keyCount.txt').' menu-items, took '.$minutesSpent.' minutes, '.$secondsSpent.' seconds.'.PHP_EOL;
        
        startDuration('processing');
        
        
        // all of our requests are done, we can now process the results
        foreach ($this->curlOps as $idx => $curlOp) {
            $curlOp['rss'] = curl_multi_getcontent ($curlOp['ch']);
            curl_multi_remove_handle($mh, $curlOp['ch']);
            curl_close ($curlOp['ch']);
            //echo 'pre fetch_pcr : '.$curlOp['cd']['path'].'/'.$curlOp['cd']['k'].PHP_EOL;
            $this->fetch_processCurlResults ($curlOp);
        }
        curl_multi_close($mh);
        
        // prep for next cURL operations
        $this->curlOps = array();
        
        return $newCount;
    }

    public static function fetch_walk_value ($cd) {
        $url = $cd['v'];
        $path = $cd['path'].'/'.$cd['k']; 
        
        $curlOp = array(
            'ch' => curl_init(),
            'url' => $url,
            'cd' => array (
                'path' => $cd['path'],
                'k' => $cd['k'],
                'v' => &$cd['v'],
                'params' => $cd['params'],
                'level' => $cd['level']
            )
        );
        curl_setopt ($curlOp['ch'], CURLOPT_URL, $url);
        curl_setopt ($curlOp['ch'], CURLOPT_HEADER, 0);
        curl_setopt ($curlOp['ch'], CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($curlOp['ch'], CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt ($curlOp['ch'], CURLOPT_TIMEOUT, 10);
        
        $cd['params']['this']->curlOps[] = $curlOp;
    }
    
    public function fetch_processCurlResults ($curlOp) {
        $cd = $curlOp['cd'];
        $rss = $curlOp['rss'];
        $url = $curlOp['url'];

        $nc1 = $cd['params']['newCount'];
        
        
        $items = $cd['params']['this']->processItems ($cd, $rss, $url, $cd['path'], $cd['k'], $cd['level']);
        
        $nc2 = $cd['params']['newCount'];
        
        if (is_array($items) and count($items)>0) {
            $d = &chaseToPath($cd['params']['d'], $cd['params']['date'].$cd['path'].'/'.$cd['k'], true);
            echo 'Processed : '.$cd['params']['date'].$cd['path'].'/'.$cd['k'].' ('.($nc2-$nc1).' new items).'.PHP_EOL;
            
            $d = array (
                'url' => $url,
                'items' => $items
            );

            $fn = $cd['params']['this']->urlToFilename($url);
            $fnDetails = dirname(__FILE__).'/newsItems/settings/'.$fn;
            createDirectoryStructure (dirname($fnDetails));
            
            $urlDetails = $cd['params']['this']->processURL($cd, $rss, $url);
            if ($urlDetails!==false) file_put_contents ($fnDetails, json_encode($urlDetails));
        }
    }
    
    public static function processURL ($cd, $rss, $rssURL) {
        $r = array();
        $anythingAdded = false;

        preg_match_all ('|<lastBuildDate>(.*)</lastBuildDate>|msU', $rss, $matches2);
        if (array_key_exists(1,$matches2) && array_key_exists(0,$matches2[1])) {
            $r['lastBuildDate'] = $matches2[1][0];
            $anythingAdded = true;
        }
        
        preg_match_all ('|<.*updatePeriod>(.*)</.*updatePeriod>|msU', $rss, $matches2);
        if (array_key_exists(1,$matches2) && array_key_exists(0,$matches2[1])) {
            $r['updatePeriod'] = $matches2[1][0];
            $anythingAdded = true;
        }

        preg_match_all ('|<.*updateFrequency>(.*)</.*updateFrequency>|msU', $rss, $matches2);
        if (array_key_exists(1,$matches2) && array_key_exists(0,$matches2[1])) {
            $r['updateFrequency'] = $matches2[1][0];
            $anythingAdded = true;
        }
        
        if ($anythingAdded) {
            return $r;
        } else {
            return false;
        }
    }
    
    public static function doesItemExistOnDate ($date, $item, $cd, $path, $k) {
        $dateStr = $date->format('Y/n/j');
        $rd = is_array($cd['params']['d']);
        //echo '<pre style="color:purple">$rd='; var_dump ($rd!==false); echo '</pre>';
        if ($rd) $rd = &chaseToPath ($cd['params']['d'], $dateStr, false);
        //echo '<pre style="color:red">$rd='; var_dump ($dateStr); echo '</pre>';
        //echo '<pre style="color:red">$rd='; var_dump ($rd!==false); echo '</pre>';

        if ($rd!==false) {
        foreach ($rd as $h => &$hd) { // hd = hour data
            foreach ($hd as $m => &$md) { // md = minute data
                foreach ($md as $s => &$sd) { // sd = second data
                
                    // find previous results specific to the current news source ($url)
                    //echo '<pre style="color:green">$path='; var_dump ($path); echo '</pre>';
                    //echo '<pre style="color:green">$h/$m/$s='.$h.'/'.$m.'/'.$s.'</pre>';
                    /*
                    $p2 = substr($path, 1);
                    if (strpos($p2,'/')!==false) {
                        $p = substr($p2, 0, strpos($p2,'/'));
                    } else {
                        $p = $path;
                    };*/
                    $p3 = substr($path.'/'.$k, 1);
                    $r1 = &chaseToPath ($sd, $p3, false); 
                    /*
                    if ($r1!==false) {
                        echo '<pre style="color:blue">path='; var_dump ($dateStr.'/'.$h.'/'.$m.'/'.$s); echo '</pre>';
                        //echo '<pre style="color:blue">$sd='; var_dump ($sd); echo '</pre>';
                        echo '<pre style="color:blue">$r1='; var_dump ($r1!==false); echo '</pre>';
                        echo '<pre style="color:blue">$path."/".$k='; var_dump ($path.'/'.$k); echo '</pre>';
                        echo '<pre style="color:blue">relPathChecked='; var_dump ($p); echo '</pre>';
                        echo '<pre style="color:blue">hasItems='; var_dump (array_key_exists('items',$r1)); echo '</pre>';
                        var_dump (array_keys($r1)); 
                        var_dump (array_keys($r1['Wereld']['NOS Algemeen']));
                        $r2 = &chaseToPath ($sd, $p3, false); 
                        //echo '$p3='; var_dump ($p3); echo PHP_EOL;
                        //echo '$r2!==false : '; var_dump ($r2!==false);
                        //die();
                    }*/
                    
                    // and if found, search all those results to see if the item to be added 
                    // was already added before.
                    if ($r1!==false && array_key_exists('items', $r1)) {
                        $r1 = &$r1['items'];
                        //echo '<pre style="color:red">$r1='; var_dump ($r1); echo '</pre>';
        
                        foreach ($r1 as $idx => $rec) {
                            //if ($item['date']==$rec['date']) $add = false;
                            if (is_string($rec['t']) 
                                && $rec['t']!='' 
                                && is_string($item['t']) 
                                && $item['t']!='' 
                                && $item['t']==$rec['t']) return true;
                            if (is_string($rec['t']) 
                                && $rec['t']!='' 
                                && is_string($item['t']) 
                                && $item['t']!='' 
                                && strpos($item['t'], $rec['t'])!==false) return true;
                            if (is_string($rec['t']) 
                                && $rec['t']!='' 
                                && is_string($item['t']) 
                                && $item['t']!='' 
                                && strpos($rec['t'], $item['t'])!==false) return true;
                            if (is_string($rec['de']) 
                                && is_string($rec['de']) 
                                && is_string($item['de']) 
                                && $item['de']!='' 
                                && $item['de']===$rec['de']) return true;
                        }
                    }
                }
            }
        }
        }
        return false;
    }

    public static function processItems ($cd, $rss, $rssURL, $path, $k, $level) {
        //preg_match_all ('|<pubDate>(.*)</pubDate>|msU', $rss, $matches2);
        //$rssURL_pubDate = $matches2[1][0];
        
        preg_match_all ('|<item>(.*)</item>|msU', $rss, $matches);
        //echo '<pre>'; echo $rssURL.'<br/>'; var_dump ($matches); echo '</pre>';
        $r = array();
        if (array_key_exists(1, $matches)) {
            foreach ($matches[1] as $idx => $item) {
                $item = $cd['params']['this']->processItem ($cd, $item, $rss, $rssURL, $path, $level);
                // $item['rssPubDate'] = $rssURL_pubDate; often completely unreliable!
                
                if (
                    $item!==false
                    && is_string($item['u']) && $item['u']!==''
                    && is_string($item['de']) && $item['de']!==''
                ) {
                    $date = new DateTime();
                    $add = !$cd['params']['this']->doesItemExistOnDate ($date, $item, $cd, $path, $k);
                    if ($add) {
                        $date2 = $date->sub(new DateInterval('P1D'));
                        $add = !$cd['params']['this']->doesItemExistOnDate ($date2, $item, $cd, $path, $k);
                    }
                    if ($add) {
                        $date2 = $date->sub(new DateInterval('P2D'));
                        $add = !$cd['params']['this']->doesItemExistOnDate ($date2, $item, $cd, $path, $k);
                    }
                    
                    // if the item is not found in the database, put it in the database.
                    if ($add) {
                        //echo '<pre>'; var_dump ($item); echo '</pre>'; 
                        $cd['params']['newCount']++;
                        $r[] = $item;
                    } /*else {
                        echo 'Found '.$path.'/'.$k.' --> '.$item['u'].' --> not adding.'.PHP_EOL;
                    }*/
                }
            }
        }
        return $r; 
    }

    public static function processItem ($cd, $item, $rss, $rssURL, $path, $level) {
        $item = $cd['params']['this']->escapeCData($item);
        if (strpos($item,'&lt;')!==false) $item = html_entity_decode($item);
        
        // stage 1 - cast a wide net
        // gather all the data you can possibly gather, even if it does mean more CPU-expensive regular expression
        // searches
        // any extra RSS data that might be found for new news sources needs to be extracted here.
        $newItem = array (
            'url' => $cd['params']['this']->getField ('|<url>(.*)</url>|msU', $item),
            'link' => $cd['params']['this']->getField ('|<link>(.*)</link>|msU', $item),
            'title' => $cd['params']['this']->getField ('|<title>(.*)</title>|msU', $item),
            'desc' => $cd['params']['this']->getField ('|<description>(.*)</description>|msU', $item),
            'desc2' => $cd['params']['this']->getField ('|<content:encoded>(.*)</content:encoded>|msU', $item),
            'date' => $cd['params']['this']->getField ('|<pubDate>(.*)</pubDate>|msU', $item),
            'media' => $cd['params']['this']->getField ('|<media:group>(.*)</media:group>|msU', $item, 0),
            'commentRSS' => $cd['params']['this']->getField ('|<wfw:commentRss>(.*)</wfw:commentRss>|msU', $item),
            'commentsCount' => $cd['params']['this']->getField ('|<slash:comments>(.*)</slash:comments>|msU', $item)
        );
        

        
        
        // stage 2 - customizations
        $media = null;
        
        if (is_string($newItem['url'])) {
            $url = $newItem['url'];
        } else if (is_string($newItem['link'])) {
            $url = $newItem['link'];
        } else {
            //echo $item;
            //var_dump ($newItem);
            return false;
        }
        
        $debug = false;
        //if ($newItem['media']!=='') $debug = true;
        //if ($rssURL == 'https://news.google.com/news/rss/headlines/section/topic/WORLD?ned=us&hl=en&gl=US') $debug=true;
        //if ($rssURL=='http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/front_page/rss.xml') $debug=true;
        
        if ($debug) var_dump ($newItem['media']);
        
        
        
        if ($newItem['media']!=='') {
            $media = $cd['params']['this']->getField ('|<media:content .*>(.*)</media:content>|msU', $item);
            if ($debug) { echo '1 - '; var_dump ($media); };
            if (is_string($media) && $media!=='') {
                $media = array (
                    $media
                );
            };
            if (!is_array($media)) {
                $media = null;
            }
            
            if (is_null($media)) {
                $media = $cd['params']['this']->getField('|<media(.*)/>|msU', $item, 0);
                if ($debug)  { echo '2a - '; var_dump ($media); };
                if (is_string($media) && $media!=='') {
                    $media = array (
                        $media
                    );
                };
                if (!is_array($media)) {
                    $media = null;
                }
            } 
            
            if (is_null($media)) {
                $media = $cd['params']['this']->getField('|<enclosure.*url=".*".*/>|msU', $item, 0);
                if ($debug)  { echo '3 - '; var_dump ($media); }
                if (is_string($media) && $media!=='') {
                    $media = array (
                        $media
                    );
                }; 
                if (!is_array($media)) {
                    $media = null;
                }
            }
        }
        
        
        $newMedia = array();
        $allMedia = array();
        if (is_array($media)) {
            $minWidth = null;
            $m1 = null;
            foreach ($media as $idx => $mediaTag) {
                if ($debug)  { echo '4a - '; var_dump ($mediaTag); };
                
                // [1] normally you'd use longer keynames (u, w, h, etc) 
                // but since the database is going to grow huge and needs to be searched through in RAM memory,
                // we're using short keynames.
                $parts = array (
                    'u' => $cd['params']['this']->getField('|url="(.*)"|msU', $mediaTag),
                    'w' => $cd['params']['this']->getField('|width="(.*)"|msU', $mediaTag),
                    'h' => $cd['params']['this']->getField('|height="(.*)"|msU', $mediaTag),
                    'm' => $cd['params']['this']->getField('|medium="(.*)"|msU', $mediaTag),
                    't' => strpos($mediaTag,':thumbnail')!==false,
                    'c' => strpos($mediaTag,':content')!==false
                );
                
                if ($parts['u']===false) {
                    continue;
                };
                
                $width = (
                    is_numeric($parts['w'])
                    ? (int)$parts['w']
                    : 400
                );
                if (is_null($minWidth)) $minWidth = $width;
                if (!array_key_exists(0,$newMedia)) $newMedia[0] = $parts;
                if ($width < $minWidth && $width > 400) {
                    if ($debug) { echo '4b - '; var_dump ($width); var_dump ($minWidth); }; 
                    $minWidth = $width;
                    $newMedia[0] = $parts;
                }
                
                //$parts['img'] = '<img src="'.$parts['url'].'" style="width:'.$parts['width'].'px;height:'.$parts['height'].'px;"/>';
                //$parts['img'] = '<img src="'.$parts['url'].'" style="width:256px;height:144px;"/>';
                $allMedia[$idx] = $parts;
            }
            
            
            /*
            $desc = $newItem['desc'];
            if (strpos($desc,'<table')!==false) {
                $desc = '<table cellpadding="2" cellspacing="3">';
                $desc.= '<tr><td>'.html_entity_decode($newItem['desc']).'</td></tr>';
                $desc.= '<tr><td class="newsApp__item__mediaMultiple"></td></tr>';
                $desc.= '</table>';
            } else {
                $desc = '<table cellpadding="2" cellspacing="3">';
                $desc.= '<tr>';
                $desc.= '<td class="newsApp__item__mediaSingle"></td>';
                $desc.= '<td>'.html_entity_decode($newItem['desc']).'</td>';
                $desc.= '</tr></table>';
            }
            */
        };
        
        //if (strpos($rssURL, 'news.google.com')!==false) {
            if ($debug) { echo '4 - '; var_dump ($newMedia); }
            //die();
        //};
        if (is_string($newItem['desc2']) && $newItem['desc2']!=='') {
            $desc = $newItem['desc2'];
        } else {
            $desc = $newItem['desc'];
        };
        $date = $newItem['date'];
        $pubDate = $date;
        if (is_string($date) && $date!=='') $date = strtotime($date); 
            else {
            $date = time();
            $date = $date - 60*60; // to get to UTC time. (subtract or add your own timezone difference to GMT/UTC, measured in seconds)
        }
        $dateStr = date(DATE_RFC822, $date);

        $downloadDate = new DateTime();

        // no checks done here, done at $this->processItems() instead
        //if (strlen($desc)!==101 && $url!==false) {        
        
            // again, short keynames [1]
            $newItem = array (
                //'rssURL' => $rssURL,
                'u' => $url,
                't' => $newItem['title'],
                'de' => $desc,
                'm' => $newMedia,
                'am' => $allMedia,
                
                // unfortunately 3 date fields is the minimum for any kind of accuracy given that RSS feeds may sometimes list completely bogus data in the pubDate field, or not supply a pubDate field for their news items at all.
                'pd' => $pubDate,
                'da' => $date,
                //'dateStr' => $dateStr, // $dateStr is just a translation of $date, can be done on the clientside.
                'dd' => $downloadDate->format('U'),
                
                'c' => $newItem['commentRSS'],
                'cc' => $newItem['commentsCount']
                
                //'path' => $path, // path gets worked out in javascript on the browser-side.
                //'level' => $level // level too
            );
        /*} else {
            $newItem = false;
        }*/
        
        //if (strpos($rssURL, 'http://feeds.nos.nl/nosnieuwsbuitenland?format=xml')!==false) { echo '<pre>$newItem='; var_dump ($newItem); die(); }
        
        if ($debug) die();

        // stage 3
        return $newItem;
    }

    public static function urlToFilename ($url) {
        $fp = $url;
        $fp = str_replace ('://','---', $fp);
        $fp = str_replace   ('/','._.', $fp);
        $fp = str_replace   ('?','-_-', $fp);
        $fp = str_replace   ('&','_-_', $fp);
        $fp = str_replace   ('=','___', $fp);
        $fp = str_replace   ('%','...', $fp);
        return $fp;
    }
    
    
    public static function escapeCData ($src) {
        $r = $src;
        $r = str_replace ('<![CDATA[', '', $r);
        $r = str_replace (']]>', '', $r);
        //$r = html_entity_decode ($r);
        return $r;
    }

    public static function getField ($regx, $item, $matchSet=1) {
        preg_match_all ($regx, $item, $matches);
        if (array_key_exists($matchSet,$matches)) {
            if (count($matches[$matchSet])==1) {
                return $matches[$matchSet][0];
            } else if (count($matches[$matchSet])>1) {
                return $matches[$matchSet];
            }
        }
        return false;
    }
    
}
?>
