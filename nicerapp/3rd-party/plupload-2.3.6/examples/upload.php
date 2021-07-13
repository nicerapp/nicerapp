<?php
require_once (dirname(__FILE__).'/../../../boot.php');
/**
 * upload.php
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

#!! IMPORTANT: 
#!! this file is just an example, it doesn't incorporate any security checks and 
#!! is not recommended to be used in production environment as it is. Be sure to 
#!! revise it and customize to your needs.


// Make sure file is not cached (as it happens for example on iOS devices)
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

/* 
// Support CORS
header("Access-Control-Allow-Origin: *");
// other CORS headers if any...
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	exit; // finish preflight CORS requests here
}
*/

// 5 minutes execution time
@set_time_limit(5 * 60);

// Uncomment this one to fake upload time
// usleep(5000);

global $cms;
$cms = new nicerAppCMS();
$cms->init();

global $filePerms_ownerUser; 
global $filePerms_ownerGroup;
global $filePerms_perms;

$debug = false;

// Settings
//$relPath = $_POST['relativePath'];
//echo $relDir; die();
//$relPath = preg_replace($relDir, '/\/.*/', '');
$targetDir = 
    realpath( //MESSES THINGS UP
        dirname(__FILE__).DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'
        .'/siteData/'.$cms->domain.DIRECTORY_SEPARATOR.$_GET['basePath']
    );
    
//echo '1::$targetDir='; var_dump ($targetDir); echo PHP_EOL.PHP_EOL;
    
//echo $targetDir; die();
$fileName = $_POST['name'];
$filePath = $targetDir.DIRECTORY_SEPARATOR.$fileName;
$thumbPath = $targetDir.DIRECTORY_SEPARATOR.'thumbs'.DIRECTORY_SEPARATOR . $fileName;
if ($debug) var_dump ($thumbPath);
//try {
    createDirectoryStructure (dirname($filePath), $filePerms_ownerUser, $filePerms_ownerGroup, $filePerms_perms);
    //chgrp ($filePath, $filePerms_ownerGroup);
    //chown ($filePath, $filePerms_ownerUser);
/*} catch (ErrorException $e) }
    echo 'Could not create filepath "'.realpath($filePath).'".';
    echo $e->getMessage();
    echo json_encode ($e, JSON_PRETTY_PRINT);
    debug_print_backtrace();
    die();
} catch (Exception $e) {
    // createDirectoryStructure will fail for existing paths, so ignore it..
    echo 'Could not create filepath "'.realpath($filePath).'".';
    echo $e->getMessage();
    debug_print_backtrace();
    die();
} */
//try {
    createDirectoryStructure (dirname($thumbPath), $filePerms_ownerUser, $filePerms_ownerGroup, $filePerms_perms);
    //chgrp ($thumbPath, $filePerms_ownerGroup);
    //chown ($thumbPath, $filePerms_ownerUser);
/*} catch (ErrorException $e) }
    echo 'Could not create filepath "'.realpath($filePath).'".';
    echo $e->getMessage();
    echo json_encode ($e, JSON_PRETTY_PRINT);
    debug_print_backtrace();
    die();
} catch (Exception $e) {
    // createDirectoryStructure will fail for existing paths, so ignore it..
    echo 'Could not create filepath "'.realpath($thumbPath).'".';
    echo $e->getMessage();
    debug_print_backtrace();
    die();
} */

//$targetDir = 'uploads';
$cleanupTargetDir = true; // Remove old files
$maxFileAge = 5 * 3600; // Temp file age in seconds


// Create target dir
if (!file_exists($targetDir)) {
	@mkdir($targetDir);
}

// Get a file name
if (isset($_REQUEST["name"])) {
	$fileName = $_REQUEST["name"];
} elseif (!empty($_FILES)) {
	$fileName = $_FILES["file"]["name"];
} else {
	$fileName = uniqid("file_");
}

// Chunking might be enabled
$chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
$chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0;


// Remove old temp files	
if ($cleanupTargetDir) {
    //echo '$targetDir='; var_dump ($targetDir); echo PHP_EOL.PHP_EOL;
	if (!is_dir($targetDir) || !$dir = opendir($targetDir)) {
		die('{"jsonrpc" : "2.0", "error" : {"code": 100, "message": "Failed to open temp directory."}, "id" : "id"}');
	}

	while (($file = readdir($dir)) !== false) {
		$tmpfilePath = $targetDir . DIRECTORY_SEPARATOR . $file;

		// If temp file is current file proceed to the next
		if ($tmpfilePath == "{$filePath}.part") {
			continue;
		}

		// Remove temp file if it is older than the max age and is not the current file
		if (preg_match('/\.part$/', $file) && (filemtime($tmpfilePath) < time() - $maxFileAge)) {
			@unlink($tmpfilePath);
		}
	}
	closedir($dir);
}	


// Open temp file
if ($debug) { var_dump ("{$filePath}.part"); echo PHP_EOL.PHP_EOL; }
if (!$out = @fopen("{$filePath}.part", $chunks ? "ab" : "wb")) {
	die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
}

if (!empty($_FILES)) {
	if ($_FILES["file"]["error"] || !is_uploaded_file($_FILES["file"]["tmp_name"])) {
		die('{"jsonrpc" : "2.0", "error" : {"code": 103, "message": "Failed to move uploaded file."}, "id" : "id"}');
	}

	// Read binary input stream and append it to temp file
	if (!$in = @fopen($_FILES["file"]["tmp_name"], "rb")) {
		die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
	}
} else {	
	if (!$in = @fopen("php://input", "rb")) {
		die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
	}
}

while ($buff = fread($in, 4096)) {
	fwrite($out, $buff);
}

@fclose($out);
@fclose($in);
echo '$chunk='; var_dump ($chunk); echo PHP_EOL;
echo '$chunks='; var_dump ($chunks); echo PHP_EOL;
// Check if file has been uploaded
if (!$chunks || $chunk == $chunks - 1) {
	// Strip the temp .part suffix off 
	$oldname = $filePath.'.part';
	$newname = $filePath;
	$dbg = array (
        'f1' => file_exists($oldname),
        'f2' => !file_exists($newname),
        'f3' => is_writable($newname)
    );
    echo '$dbg='; var_dump ($dbg); echo PHP_EOL;
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
    error_reporting (E_ALL);
	if (
        file_exists($oldname) && 
        (!file_exists($newname) || is_writable($newname))
    ) {
        $x = rename($oldname, $newname);
        echo '$x='; var_dump ($x); echo PHP_EOL;
	}
	
	$exec = 'convert "'.$filePath.'" -resize 200x100 "'.$thumbPath.'"';
	$output = array(); $result = -1;
	exec ($exec, $output, $result);

    if (is_string($filePerms_ownerUser)) $x = chown ($thumbPath, $filePerms_ownerUser);
    if (is_string($filePerms_ownerGroup)) $y = chgrp ($thumbPath, $filePerms_ownerGroup);
    if (is_numeric($filePerms_perms)) $z = chmod ($thumbPath, $filePerms_perms);
}



// Return Success JSON-RPC response
die('{"jsonrpc" : "2.0", "result" : null, "id" : "id"}');
