<?php
    require_once (dirname(__FILE__).'/../../../boot.php');
    //require_once (dirname(__FILE__).'/../../../../../../ui/jsonViewer/jsonViewer.php');

    header ('Content-Type: application/json');
    ob_start("ob_gzhandler");
    ini_set ('memory_limit', '512M');
    
    $dataRoot = dirname(__FILE__).'/newsItems';
    $data = array();
    
    /*
    $_GET['dateBegin'] = 'Tue Mar 20 2018 16:31:58 GMT+0100 (CET)';
    $_GET['dateEnd'] = 'Tue Mar 20 2018 17:31:58 GMT+0100 (CET)';
    echo $_GET['dateBegin'].' to '.$_GET['dateEnd'].'<br/>'.PHP_EOL;
    */
    //echo $_GET['dateBegin'].' to '.$_GET['dateEnd'].'<br/>'.PHP_EOL;die();
    $dateBeginStr = str_replace('.','0',$_GET['dateBegin']);
    $dateEndStr = str_replace('.','0',$_GET['dateEnd']);
    $dateBeginStr = str_replace ('GMT000', 'GMT+0000', $dateBeginStr);
    $dateEndStr = str_replace ('GMT000', 'GMT+0000', $dateEndStr);
    $dateBeginStr = str_replace ('GMT-01000', 'GMT-1000', $dateBeginStr);
    $dateEndStr = str_replace ('GMT-01000', 'GMT-1000', $dateEndStr);
    $dateBegin = new DateTime($dateBeginStr);
    //echo $_GET['dateBegin'].' to '.$_GET['dateEnd'].'<br/>'.PHP_EOL;
    $dateScanning = new DateTime($dateBeginStr);
    $dateEnd = new DateTime($dateEndStr);
    //$dateEnd = $dateEnd->add (new DateInterval('PT2M'));
    
    $dateRelativePath2 = '';
    
    $dateBegin->setTimeZone(new DateTimeZone(date_default_timezone_get()));
    $dateScanning->setTimeZone(new DateTimeZone(date_default_timezone_get()));
    $dateEnd->setTimeZone(new DateTimeZone(date_default_timezone_get()));
    
    
    $dateDiff = $dateEnd->format('U') - $dateBegin->format('U');
    if (
        $dateDiff < 0
        || $dateDiff > 60 * 60 // 1 hour
    ) {
        //die();
    }
    /*
    $dirs2 = array();
    $i = 0;
    while ($dateScanning->format('U') <= $dateEnd->format('U')) {
        $dateRelativePath = $dateScanning->format('Y/m/d/H'); // years, months without leading 0, days without leading 0, hours without leading 0
        //echo $dateRelativePath.'<br/>'.PHP_EOL;
        $i++;
        //if ($i > 10) die();
        
        
        //echo '/([0-9]+|'.str_replace('_',' ', preg_replace('/__/','|',$_GET['section'])).')/'; die();
            
            // fetch relevant directories
        //$dirs = getFilePathList ($dataRoot.'/'.$_GET['date'], true, '/.* /', array('dir'), 7);
        
        $preg = '/[0-9]+|'.str_replace('_',' ', preg_replace('/__/','|',$_GET['section'])).'/i';
        //$preg = '|.*nglish .*|i';
        //echo $preg.'<br/>'.PHP_EOL;
        
        
        //echo $dataRoot.'/'.$dateRelativePath.PHP_EOL;
        if (
            $dateRelativePath2===$dateRelativePath
            || (!file_exists($dataRoot.'/'.$dateRelativePath))
        ) {
            //echo '!file_exists '.$dataRoot.'/'.$dateRelativePath.PHP_EOL;
            $dateScanning = $dateScanning->add (new DateInterval('PT9M'));
            continue;
        }
        
        $dirs = getFilePathList ($dataRoot.'/'.$dateRelativePath, true, $preg, array('dir'));


        /*
        echo '<div style="background:orange;color:white;">Data on disk (relevant disk locations only)</div>'.PHP_EOL;
        echo '<pre style="color:blue">'; var_dump ($dirs); echo '</pre>';
        die();
        * /
        
        foreach ($dirs as $idx => $dir) {
			if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
				$dir = str_replace ('/','\\',$dir);
				$dataRoot = str_replace ('/','\\',$dataRoot);
				$dateRelativePath = str_replace ('/','\\',$dateRelativePath);
				$c = substr_count ($dir, '\\');
				$c1 = substr_count ($dataRoot.'\\'.$dateRelativePath, '\\');
			} else {
				$c = substr_count ($dir, '/');
				$c1 = substr_count ($dataRoot.'/'.$dateRelativePath, '/');
			}
            //echo '$c, $c1 = '; var_dump ($c); var_dump ($c1); echo '<br/>';
            //if ($c > $c1 + 3) $dirs2[] = $dir;
            
            $interesting = str_replace ($dataRoot,'',$dir);
			if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
				$interesting = str_replace (str_replace ('_', ' ', str_replace ('__', '\\', $_GET['section'])), '', $interesting);
				$interesting = str_replace ('\\\\', '', $interesting);
			} else {
				$interesting = str_replace (str_replace ('_', ' ', str_replace ('__', '/', $_GET['section'])), '', $interesting);
				$interesting = str_replace ('//', '', $interesting);
			}
            $interesting = substr ($interesting, 1);
			//echo '$interesting='.$interesting.'<br/>';
            //if ($c > $c1 + 4) $dirs2[] = $interesting;
            
            
            if  ($c > $c1 + 2) {
				if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
					$tp = explode ('\\', $interesting);
				} else {
					$tp = explode ('/', $interesting);
				}
                $dateStr = $tp[0].'-'.padIt($tp[1]).'-'.padIt($tp[2]).' '.padIt($tp[3]).':'.padIt($tp[4]).':'.padIt($tp[5]);
                
				if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
					$dateStr2 = $tp[0].'\\'.padIt($tp[1]).'\\'.padIt($tp[2]).'\\'.padIt($tp[3]).'\\'.padIt($tp[4]).'\\'.padIt($tp[5]);
				} else {
					$dateStr2 = $tp[0].'/'.padIt($tp[1]).'/'.padIt($tp[2]).'/'.padIt($tp[3]).'/'.padIt($tp[4]).'/'.padIt($tp[5]);
				}
                $date = new DateTime ($dateStr);
                /*
                $r = array (
                    'ds' => $dateStr,
                    'db1' => $dateBegin,
                    'db2' => $dateEnd,
                    'db' => $dateBegin < $date,
                    'de' => $dateEnd > $date,
                    'dn' => $dateBegin < $date
                            && $dateEnd > $date

                );
                $dirs2[] = $r;
                * /
               
				
                if (
                    $dateBegin < $date
                    && $dateEnd > $date
                ) {
                    $dirs2[] = $dateStr2;
                }
			}
        }
        
        $dateScanning = $dateScanning->add (new DateInterval('PT9M'));
        $dateRelativePath2 = $dateRelativePath;
    }
    $dirs = $dirs2; unset ($dirs2);

    /*
    echo '<div style="background:red;color:white;">Data on disk (relevant disk locations only)</div>'.PHP_EOL;
    echo '<pre style="color:blue">'; var_dump ($dirs); echo '</pre>';
	die();
	* /
	
    $dirs2 = array();
    foreach ($dirs as $idx => $dir) {
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
			//var_dump ($dir);
			$dir = str_replace ('/','\\',$dir);
			$tp = explode('\\',$dir);
			$relativePath = $tp[0].'\\'.$tp[1].'\\'.$tp[2].'\\'.$tp[3].'\\'.$tp[4].'\\'.$tp[5].'\\';
		} else {
			$tp = explode ('/', $dir);
			//$dirs2[] = $tp;
			$relativePath = $tp[0].'/'.$tp[1].'/'.$tp[2].'/'.$tp[3].'/'.$tp[4].'/'.$tp[5].'/';
		};
        $dirs2[] = $relativePath;
    }
    $dirs2 = array_unique($dirs2);
    $dirs = $dirs2; unset ($dirs2);

    
    //echo '<div style="background:orange;color:white;">Data on disk (relevant disk locations only)</div>'.PHP_EOL;
    //echo '<pre style="color:blue">'; var_dump ($dirs); echo '</pre>';
    //die();
    if (array_key_exists ('q', $_GET)) {
        $searchQueryLookAheads = '';
        $searchQueryLookArounds = '';
        $searchQueryRegx = '';
        $searchQueryParts = explode (' ', $_GET['q']);
        foreach ($searchQueryParts as $idx => $searchQueryPart) {
            if (strpos('-',$searchQueryPart)!==false) {
                $searchQueryPartCorrected = substr ($searchQueryPart, 1, strlen($searchQueryPart)-1);
                $searchQueryLookAheads .= '(!'.$searchQueryPartCorrected.')';
            } else {
                $searchQueryLookArounds .= '(?=.'.$searchQueryPart.')';
            }
        }
        $searchQueryRegx = '^'.$searchQueryLookAheads.$searchQueryLookArounds.'.*$';
    } else {
        $searchQueryRegx = null;
    }
    */
    
       // read in relevant files
    //echo '<pre>'.json_encode($dirs,JSON_PRETTY_PRINT); die();
       
    $dirs = json_decode('{"0": "2021\/02\/11\/16\/47\/06\/","3": "2021\/02\/11\/16\/52\/06\/","6": "2021\/02\/11\/16\/32\/06\/","9": "2021\/02\/11\/16\/27\/05\/","12": "2021\/02\/11\/16\/42\/06\/","15": "2021\/02\/11\/16\/37\/06\/","18": "2021\/02\/11\/16\/57\/06\/"}', true);
    foreach ($dirs as $idx => $dir) {
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		    $fn = $dataRoot.'\\'.$dir.str_replace('_',' ', preg_replace('/__/','\\',$_GET['section'])).'\\items.json';

			$relPath = str_replace($dataRoot.'\\','',$dir);
		} else {
			$fn = $dataRoot.'/'.$dir.str_replace('_',' ', preg_replace('/__/','/',$_GET['section'])).'/items.json';
       		$relPath = str_replace($dataRoot.'/','',$dir);
		} 
        $relPath = substr($relPath, 0, strlen($relPath)-1);
        //echo $fn.'<br/>'.PHP_EOL;
        
        $d = &chaseToPath($data, $relPath, true);
        //echo $fn.'<br/>';
        $fc = file_get_contents($fn);
        if (is_null($searchQueryRegx)) {
            $d = json_decode ($fc, true);
        } else if (preg_match($searchQueryRegx, $fc)!==0) {
            $d = json_decode ($fc, true);
        } else {
            echo 'ERROR : INVALID REGX OR DATE TIME RANGE';
        }
    }
    //echo $searchQueryRegx.'<br/>';
    echo json_encode ($data);
    
    
    //if (array_key_exists('howmuch', $_GET)) $fn.='_'.$_GET['howmuch'].'.json';
    
    //if (file_exists($fn)) readfile ($fn);
    
    
    
    function padIt ($n) {
        $n1 = (int)$n;
        if ($n1 < 10) {
            return str_pad($n1, 2, '0', STR_PAD_LEFT);
        } else {
            return $n;
        }
    }
?>
