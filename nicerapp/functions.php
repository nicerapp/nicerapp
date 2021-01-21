<?php 

function isLocalhost () {
    $ip = array_key_exists('X-Forwarded-For', $_SERVER) ? $_SERVER['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR'];
    //echo '<pre>';var_dump ($_SERVER);die();
    switch ($ip) {
        case '80.101.238.137':
        case '192.168.178.30':
        case '127.0.0.1':
        case '::1':
            return true;
        default:
            return false;
    }
}

function execPHP ($file) {
    ob_flush();
    ob_end_clean();
    ob_start();
    require_once ($file);
    $c = ob_get_contents();
    ob_end_clean();
    ob_start();
    return $c;
};

function require_return ($file) {
// used by .../domainConfigs/DOMAIN.EXT/mainmenu.php
    ob_start();
    require ($file);
    $r = ob_get_clean();
    return $r;
}


function getFilePathList ( 
//TODO: all features listed below $level are untested.
	
	//$pathStart, 
	$path,								// current path 
	$recursive = false,					// if true, we also process any subdirectory.
	$fileSpecRE = "/.*/",				// Regular Expression file specs - will be matched against any filename found.
	// ^-- this is NOT the same as normal "somefile-*.something.extension" type wildcards. see example above.
	$fileTypesFilter = array (),		// array (int=>string (filetype() result) ==== int=>"file"|"dir" )
	$depth = null,
	$level = 1,
	$ownerFilter = array (),			// array (int=>string (username) ); only return files owned by someone in $ownerFilter.
	$fileSizeMin = null,				// If >=0, any files returned must have a minimum size of $fileSizeMin bytes.
	$fileSizeMax = null,				// same as above, but maximum size

	/* all date parameters below must be provided in the mktime() format. */
	$aTimeMin = null,					// calls fileatime(). Read The Friendly Manual. http://www.php.net/manual/
	$aTimeMax = null,					//	^- access includes a program reading from this file.
	$mTimeMin = null,					// calls filemtime(). RTFM.
	$mTimeMax = null,
	$cTimeMin = null,					// calls filectime(). rtfm.
	$cTimeMax = null,
	/*	on windows XP, cTime = creation time; mTime = modified time; aTime = access time. 
		I also noted some BUGS in retrieving these dates from my system.
	*/
	$listCall = ""						// interesting feature; lets you include results from any informational file function(s).
/*	TODO : fix $*Date* parameter handling, 
	returns an array consisting of all files in a directory structure, filtered by the parameters given.
	results are returned in directory order. if ($recursive) then subdirectory content is listed before file content.
	OKAY, this one is monolithic :)   But very usefull, so an exception to the rule is granted here.
example: 
	htmlDump (getFilePathList("c:/dat/web", true, "/.*\.php$|.*\.php\d$|.*\.inc$/",
		array(), array(), null, null, null, null, null, null, null, null,
		"\"ctime=\".date (\"Y/m/d H:m:s\", filectime (\$filepath)).".
		"\" - atime=\".date (\"Y/m/d H:m:s\", fileatime (\$filepath)).".
		"\" - mtime=\".date (\"Y/m/d H:m:s\", filemtime (\$filepath)).".
		";"
		));
	-== this returns an array with complete filepaths of all files under c:/dat/web, that have an extension like
		*.php, *.php3, *.php4 or *.inc. 
		for my system, it returns:
			array(4) {
			  [0]=>
			  string(115) "c:/dat/web/index.php - [listCall=ctime=2003/05/11 18:05:26 - atime=2003/05/16 05:05:44 - mtime=2003/05/16 05:05:44]"
			  [1]=>
			  string(122) "c:/dat/web/preProcessor.php - [listCall=ctime=2003/05/15 16:05:55 - atime=2003/05/16 04:05:47 - mtime=2003/05/15 17:05:35]"
			  [2]=>
			  string(116) "c:/dat/web/source.php - [listCall=ctime=2003/05/11 18:05:26 - atime=2003/05/16 04:05:47 - mtime=2003/04/28 13:04:07]"
			  [3]=>
			  string(117) "c:/dat/web/sources.php - [listCall=ctime=2003/05/11 18:05:26 - atime=2003/05/16 04:05:50 - mtime=2003/05/12 00:05:22]"
}
		in this example, the $listCall is kinda complicated. but only to show it's power.
		if you're having trouble debugging your $listCall, turn on the relevant htmlDump() call in this function.
	
another example:
	htmlDump (getFilePathList("c:/dat/web", false, "/.*\.php$|.*\.php\d$|.*\.inc$/", 
		array(), array(), null, null, null, null, null, time()-mktime (0,0,0,0,1,0));
	-== this returns, for my system, all *.php,*.php3/4,*.inc files in c:/dat/web, that havent changed since 24 hours ago:
*/

) {
	//if (stripos($path, $pathStart)!==false) {
		$path = realpath($path);
		$result = array();
		//if (!in_array("file",$fileTypesFilter)) $fileTypesFilter[count($fileTypesFilter)]="file";
		//htmlOut (" --== $path ==--");
		if ($path[strlen($path)-1]!="/") $path.="/";
		//echo $path.'<br/>'; 
		if ($handle = opendir($path)) {
			/* This is the correct way to loop over the directory. */
			while (false !== ($file = readdir($handle))) { 
			//if (!is_file($path.$file)) continue;
			if ($file != "." && $file != "..") { 
			
				$pass = true;
				//echo $path.$file.'<br/>'; 
				$ft = filetype($path.$file); 
				if (!in_array ($ft, $fileTypesFilter)) $pass = false;
				// htmlDump ($ft, "filesys");
				if ($ft=="dir") $filepath = $path.$file."/"; else $filepath = $path.$file;
				
				//echo '<pre>';
				//var_dump ($file); echo PHP_EOL;
				//var_dump ($fileSpecRE); echo PHP_EOL;
				if ($pass) $pass = preg_match ($fileSpecRE, strToLower($file))!==0;
				//var_dump ($pass); echo PHP_EOL;
				//echo '</pre>';
				if ($pass && count($ownerFilter)>0) {
					$fo = fileowner ($filepath);
					if ($fo!=false) {
						$fo = posix_getpwuid($fo);
						if (!in_array ($fo, $ownerFilter)) $pass=false;
					} else {
					//couldn't retrieve username. be strict & safe, fail.
						$pass = false;
					}
				}
				if ($pass && isset($fileSizeMin)) if (filesize ($filepath) < $fileSizeMin) $pass=false;
				if ($pass && isset($fileSizeMax)) if (filesize ($filepath) > $fileSizeMax) $pass=false;

				if ($pass && isset($aTimeMin)) 
					$pass=evalDate ("fileatime", $filepath, ">=", $aTimeMin, "aTimeMin");
				if ($pass==true && isset($aTimeMax)) 
				//	^- if ($stringValue) == always true!, 
				//		so explicitly check for boolean true result after calling 
				//		functions that may return an (error) string.
					$pass=evalDate ("fileatime", $filepath, "<=", $aTimeMax, "aTimeMax");
				if ($pass==true && isset($mTimeMin))
					$pass=evalDate ("filemtime", $filepath, ">=", $mTimeMin, "mTimeMin");
				if ($pass==true && isset($mTimeMax))
					$pass=evalDate ("filemtime", $filepath, "<=", $mTimeMax, "mTimeMax");
				if ($pass==true && isset($cTimeMin))
					$pass=evalDate ("filectime", $filepath, ">=", $cTimeMin, "cTimeMin");
				if ($pass==true && isset($cTimeMax))
					$pass=evalDate ("filectime", $filepath, "<=", $cTimeMax, "cTimeMax");

				if ($pass==true) {
					//htmlOut ("PASSED");
					$r = "";

					$ev = "\$r = $listCall";
					//htmlDump ($ev);
					if (!empty($listCall)) eval ($ev);
					$idx = count ($result);
					if (!empty($r)) $r = " - [listCall=$r]";
					$result[$idx] = $filepath.$r;
				}
				if (is_string($pass)) {
					//htmlOut ("PASSED - checks failed");
					$result[count($result)] = "[$pass]".$filepath;
				}
				if ($recursive && $ft=="dir" && (is_null($depth) || $level<$depth)) {
					$subdir = getFilePathList ($filepath,$recursive, $fileSpecRE, 
						$fileTypesFilter, $depth, $level+1, $ownerFilter, $fileSizeMin, $fileSizeMax, 
						$aTimeMin, $aTimeMax, $mTimeMin, $mTimeMax,
						$cTimeMin, $cTimeMax, $listCall);
					array_splice ($result, count($result)+1, 0, $subdir);
				}
			}
			}
		//}
		//htmlDump ($result, "result");
		return $result;
	}
	$result = array();
	return $result;
}


function walkArray (&$a, $keyCallback=null, $valueCallback=null, $callKeyForValues=false, $callbackParams=null, $k='', $level=0, $path='') {
// usage : walkArray ($someRecursiveArray, 'walkArray_printKey', 'walkArray_printValue');
// can handle recursive arrays. a nested array is a recursive array.
// is faster, especially on large arrays, than RecuriveArrayIterator, see speed testing comment at http://php.net/manual/en/class.recursiveiteratoriterator.php
// provides detailed information to callbacks on where in the data we are, something that array_walk_recursive just doesnt do.
// passes data around as pointers, not copies of data.
    if (!is_array($a)) {
        return badResult (E_USER_ERROR, array (
            'msg' => 'walkArray() was called but $a parameter passed is not an array.'
        ));
    } else {
        foreach ($a as $k=>&$v) {
            $cd = array ( // callback data
                'type' => 'key',
                'path' => $path,
                'level' => $level,
                'k' => &$k,
                'v' => &$v,
                'params' => &$callbackParams
            );                
            if (!is_null($keyCallback) && ($callKeyForValues || is_array($v))) call_user_func ($keyCallback, $cd);
            if (is_array ($v)) {
                walkArray ($a[$k], $keyCallback, $valueCallback, $callKeyForValues, $callbackParams, $k, $level+1, $path.'/'.$k);
            } else {
                $cd['type'] = 'value';
                if (!is_null($valueCallback)) call_user_func ($valueCallback, $cd);
            }
        }
    }
    $r = true;
    return goodResult($r);
}

function walkArray_printKey ($cd) {
    echo '<div style="background:blue;color:yellow;border-radius:5px;padding:2px;margin-top:5px;">'.PHP_EOL;
    $indent = 20 * $cd['level'];
    echo '<div style="padding-left:'.$indent.'px">'.PHP_EOL;
    echo 'key : '.$cd['k'].'<br/>'.PHP_EOL;
    echo 'path : '.$cd['path'].'<br/>'.PHP_EOL;
    echo '</div>'.PHP_EOL;
    echo '</div>'.PHP_EOL;
}

function walkArray_printValue ($cd) {
    echo '<pre style="background:green;color:white;border-radius:5px;padding:2px;margin-top:2px;">'.PHP_EOL;
    $indent = 20 * $cd['level'];
    echo '<div style="padding-left:'.$indent.'px">'.PHP_EOL;
    echo 'key : '.$cd['k'].'<br/>'.PHP_EOL;
    echo 'path : '.$cd['path'].'<br/>'.PHP_EOL;
    echo 'value : '.$cd['v'].'<br/>'.PHP_EOL;
    echo '</div>'.PHP_EOL;
    echo '</pre>'.PHP_EOL;
}


function &chaseToPath (&$wm, $path, $create=false) {
    //var_dump ($create); die();
    //echo '$wm=<pre>'; var_dump ($wm);echo '</pre>'; //die();
    //$path = str_replace ('/', '/d/', $path);
    //$path .= '/d';
    $nodes = explode ('/', $path);
    foreach ($nodes as $idx=>$node) {
        if (is_numeric($node) && is_string($node)) {
            if (strpos($node,'.')===false) {
                $nodes[$idx] = (int)$node;
            } else {
                $nodes[$idx] = (float)$node;
            }
        }
    }
    $chase = &chase ($wm, $nodes, $create);
    
    //echo '$wm=<pre>'; var_dump ($wm);echo '</pre>'; die();
    /*
    $dbg = array (
        '$path' => $path,
        '$nodes' => $nodes,
        '$wm' => $wm,
        '$chase' => $chase
    );
    echo '$dbg=<pre style="background:red;color:yellow;">'; var_dump ($dbg); echo '</pre>';
    */
    //die();
    
    
    $false = false;
    if (good($chase)) {
        $arr = &result($chase);	
        return $arr;
    } else return $false;
}		


function &chase (&$arr, $indexes, $create=false) {
        if (false) {
        echo 'sitewide/functions.php --- $arr=<pre>'; var_dump ($arr); echo '</pre>';
        echo 'sitewide/functions.php --- $indexes=<pre>'; var_dump ($indexes); echo '</pre>';
        echo 'sitewide/functions.php --- $create=<pre>'; var_dump ($create); echo '</pre>';
        }
	$r = &$arr;
	foreach ($indexes as $idx) {
            //echo 'sitewide/functions.php --- $idx=<pre>'; var_dump ($idx); var_dump (array_key_exists($idx,$r)); var_dump ($r); echo '</pre>';
            if (
                    is_array($r)
                    && (
                            $create===true 
                            || array_key_exists($idx,$r)
                    )
            ) {
                    if ($create===true && !array_key_exists($idx,$r)) $r[$idx]=array();
                    //echo 'sitewide/functions.php --- $idx=<pre>'; var_dump ($idx); echo '</pre>';
                    $r = &$r[$idx];
            } else {
                /*
                    $err = array(
                    'msg' => 'Could not walk the full tree',
                    'vars' => array(
                            '$idx--error'=>$idx,
                            '$indexes'=>$indexes,
                            '$arr'=>$arr
                            )
                    );
                    badResult (E_USER_NOTICE, $err);
                    */
                    $ret = false; // BUG #2 squashed
                    return $ret;
            }
	}
    
        //echo 'sitewide/functions.php --- $r=<pre>'; var_dump ($r); echo '</pre>';
	return goodResult($r);
}

function &chaseToReference (&$array, $path) {
	if (!empty($path)) {
		if (empty($array[$path[0]])) {
			$err = array(
				'msg' => 'Could not walk the full tree',
				'$path' => $path,
				'$array (possibly partially walked)' => $array
			);
			return badResult (E_USER_NOTICE, $err);
		} else return chaseToReference($array[$path[0]], array_slice($path, 1));
	} else {
		return goodResult($array);
	}	
}


?>
