<?php
require_once (dirname(__FILE__).'/../../../../../boot_stage_001a.php');

$outputFilepath = dirname(__FILE__).'/output.json';
$dir = dirname(__FILE__).'/img';
$files = getFilePathList($dir, true, '(.*\.png|.*\.gif|.*\.jpg|.*\.jpeg$)', array('file'));
$numIcons_horizontal = 14;
$json = array();
$jsonLine = array(array());

reportVariable ('$files', $files);
foreach ($files as $idx => $filepath) {
    $pi = pathinfo($filepath);
    
    if (count($jsonLine[0])<$numIcons_horizontal) {
        $jsonLine[0][] = $pi['basename'];
    } else {    
        $json = array_merge_recursive ($json, $jsonLine);
        $jsonLine = array(array());
    }
}

reportVariable ('$json', $json);
file_put_contents ($outputFilepath, json_encode($json));
?>
