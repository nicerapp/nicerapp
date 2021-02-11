<?php

function file_put_contents_ftp () {
// TODO : this is just an example from php.net

/* set the FTP hostname */ 
$user = "test"; 
$pass = "myFTP"; 
$host = "example.com"; 
$file = "test.txt"; 
$hostname = $user . ":" . $pass . "@" . $host . "/" . $file; 

/* the file content */ 
$content = "this is just a test."; 

/* create a stream context telling PHP to overwrite the file */ 
$options = array('ftp' => array('overwrite' => true)); 
$stream = stream_context_create($options); 

/* and finally, put the contents */ 
file_put_contents($hostname, $content, 0, $stream); 
}

function fgetsr ($filePath) {
	$blockSize = 4096;

	$f = fopen ($filePath, "a+");

	$end = ftell($f);
	fseek ($f, $end-1);
	$endChar = fread ($f, 1);
	$trailingNewLine = ($endChar == "\n");
	if ($endChar = "\n") {
		$end--;
		fseek ($f, $end);
	}

	$buf = "";
	while (true) {
		$pos = ftell ($f);
		$nlp = strrpos ($buf, "\n");
		if ($nlp !== false) {
			$line = substr ($buf, $nlp+1);
			//$buf = substr ($buf, 0, $nlp); //TODO if ur reading more than 1 line..
			if (($pos != 0) || ($nlp != 0) || ($trailingNewLine)) {
				$line.="\n";
			}
			return $line; 
		} else {
			if ($pos==0) {
				return false;
			} else {
				//need to fill buffer
				$ptr = ($blockSize < $pos) ? $blockSize : $pos;
				fseek ($f, $ptr);
				$buf = fread ($f, $blockSize) + $buf;
				fseek ($f, $ptr);
				if (($pos - $ptr) == 0) {
					$buf = "\n" + $buf;
				}
			}
		}
	}
}

if (!function_exists('filesizeHumanReadable')) {
// duplicated in webappObfuscator-1.0.0/functions.php
	function filesizeHumanReadable ($size) {
		$scale = "KMGT";
		$scaleIdx = -1;

                $result = '';
		$s = $size;
		while ($s / 1024 > 1) {
			$s = $s / 1024;
			$scaleIdx++;
			$result= round($s,2)."$scale[$scaleIdx]";
		}
		return $result."b";
	}
}

function zipExtractUnix ($filename, $targetDir) { //TODO: MB_PLATFORM define fix
	//$filename = str_replace (" ", "\ ", $filename);
	//$targetDir = str_replace (" ", "\ ", $targetDir);
	if (PLATFORM=="WINDOWS") { 
		$filename = str_replace('/',"\\",$filename);
		$targetDir = str_replace('/',"\\",$targetDir);
		$execstr = "cmd /c unzip \"$filename\" -d \"$targetDir\\\"";
	} else {
		$execstr = "nice -n 19 unzip \"$filename\" -d \"$targetDir\"";
	}
	file_put_contents (HD_ROOT.'unzip.txt', $execstr);

	exec ($execstr, $output, $result);
	if ($result==0) {
		return true;
	} else {
		return array (
			'cmd' => $execstr,
			'output' => $output,
			'result' => $result
		);
	}
}


function emptyFile ($filepath) { /* "delete" (the contents of a file), optimized for NFS storage */
	$f = fopen ($filepath, "w"); 
	if (!$f) return false;
	if (!fwrite ($f, "")) return false;
	fclose ($f);
	return true;
}

if (!function_exists('createDirectoryStructure')) {
// duplicated in webappObfuscator-1.0.0/1.0.0/functions.php
	function createDirectoryStructure ($filepath) {
	$fncn = "createDirectoryStructure";
	/*	Creates a directory structure. 
		Returns a boolean success value. False usually indicates illegal characters in the directories.

		If you supply a filename as part of $filepath, all directories for that filepath are created.
		If $filepath==only a directory, you TODO**MUST**TODO end $filepath with / or \
	*/
		//slash-direction doesn't matter for PHP4 file functions :-), so we even things out first;
		$filepath = strtr (trim($filepath), "\\", "/");
		if ($filepath[strlen($filepath)-1]!="/") $filepath.="/";	

		if (($filepath[1]!=':') && ($filepath[0]!='/')) trigger_error ("$fncn: $filepath is not from the root. results would be unstable. gimme a filepath with / as first character.", E_USER_ERROR);

		$directories = explode ("/", $filepath);
		$result = true;

		for ($i = count($directories); $i>0; $i--) {
			$pathToTest = implode ("/", array_slice($directories,0,$i+1));
			if (file_exists($pathToTest)) break;
		}

		if ( (($i+1) < count($directories)) ) {
			for ($j = $i+1; $j < (count($directories)-1); $j++) {
				$pathToCreate = implode ("/", array_slice($directories,0,$j+1));
				if (file_exists($pathToCreate)) {
					$result = true;
				} else {
					$result=mkdir($pathToCreate,0777);
	//				chown ($pathToCreate, 'Webserver');
				}
				if (!$result) {
					trigger_error ("$fncn : couldn't create directory $pathToCreate.", E_USER_ERROR);
					return false;
				}
			}
		}
		return true;
	}
	
	function evalDate ($nameOfTestFunction, $filepath, $operator, $testVariable, $nameOfTestVariable) {
	/* slave for getFilePathList(), below */
	$fncn = "/lib/misc.php:evalDate()";
		$toEval = "\$date = $nameOfTestFunction (\"$filepath\");";
		//htmlDump ($toEval);
		eval ($toEval);
		if (!$date) {
			trigger_error ("$fncn : a test for $nameOfTestVariable was requested, but I cannot access information that for file $filepath", E_USER_NOTICE);
			$result = "Couldn't test $nameOfTestVariable";
		} else {
			$toEval = "\$result = ($date $operator $testVariable);";
			//htmlDump ($toEval);
			$ds = "Y/m/d H:m:s";
			//htmlDump (date($ds,$date)." ".$operator." ".date($ds,$testVariable));
			eval ($toEval);
		}
		//htmlDump ($result);
		return $result;
	}
}

if (!function_exists('getFilePathList')) {
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

}

function readIniFile ($fileName) {
	$fncn = "lib_fileSystem.php::readIniFile";
	if (!file_exists($fileName)) return null;

	$lines = file($fileName);
	if ($lines == false) return null;

	$md = array();
	//	string ($sectionName)	=>	string ($propertyName)	=>	mixed ($propertyValue)

	$sectionName = "";
	foreach ($lines as $lineNo => $line) {
		//htmlDump ($line, "line 1");
			$line = trim ($line);
			//if ($line[strlen($line)]=='\n') $line = substr ($line, 0, strlen($line)-1);
			//if ($line[strlen($line)]=='\r') $line = substr ($line, 0, strlen($line)-1);
			//if ($line[strlen($line)]=='\n') $line = substr ($line, 0, strlen($line)-1);
			//htmlDump ($line, "line 2");

		if (substr_count ($line, "#") > 0) {
			$line = explode ("#", $line);
			$line = trim($line[0])."\r\n";
		}
		/*
		if (substr_count ($line, "//") > 0) {
			$line = explode ("//", $line);
			$line = trim($line[0])."\r\n";
		}
		*/
		if ($line[0]=="[") {
			$sectionName = substr($line, 1, strlen($line)-2);
		}

		$p = strpos($line,'=');
		if ($p!==false) {
			$fieldID = trim(substr($line,0,$p));
			$value = trim(substr($line,$p+1,strlen($line)-$p-1));

			if (substr_count($value,";")>0) {
				$vz = explode (";", $value);
				$value = Array();
				foreach ($vz as $i => $v) {
					$p = explode (":",$v);
					$value[$p[0]] = $p[1];
				}
			}
			$md[$sectionName][$fieldID] = $value;
		}
	}
	return $md;
}

function writeIniFile ($ini, $filePath) {
	if (is_string($ini)) {
		$t = $filePath;
		$filePath = $ini;
		$ini = $t;
	};
	
	$f = fopen ($filePath, 'w');
	if ($f===false) return false;
	foreach ($ini as $section => $values) {
		fwrite ($f, "\n[$section]\n");
		foreach ($values as $keyname => $value) {
			fwrite ($f, $keyname.'='.$value."\n");
		}
	}
	fclose ($f);
	return true;
}

function renameFile ($oldfn, $newfn) {
	if (MB_PLATFORM=="WINDOWS") {
		$cmd = "cmd /c move \"$oldfn\" \"$newfn\"";
	} else {
		$cmd = "nice -n 19 mv -v \"$oldfn\" \"$newfn\"";
	}
	exec ($cmd, $output, $result);
	//htmlDump ($result, "RESULT for ".$cmd);
	return ($result==0);	
}


function moveDirectoryStructure ($oldPath, $newPath) {
	$files = getFilePathList ($oldPath, true, '/.*/', array("file"));
	foreach ($files as $idx=>$file) {
	
		$relPath = str_replace ($oldPath, '', $file);
		
		$newPathForFile = $newPath.$relPath;
		
		if (!createDirectoryStructure (dirname($newPathForFile))) return array (
			'error' => 'Could not create "'.dirname($newPathForFile).'"'
		);
		
		if (!rename ($file, $newPathForFile)) return array (
			'error' => 'Could not create rename \n\t"'.$file.'"\nto\n\t"'.$newPathForFile.'"'
		);
	}
	
	return true;
}

?>
