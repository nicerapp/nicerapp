<?php
require_once (dirname(__FILE__).'/boot.php');

set_time_limit(0);

$root = realpath(dirname(__FILE__).'/siteMedia/backgrounds/');
$sidelinedRoot = realpath(dirname(__FILE__).'/siteMedia.thumbs/backgrounds/');
$files = getFilePathList ($root, true, '/.*\.gif|\.jpg|\.png/', array('file'));
ob_start();

foreach ($files as $idx => $original) {
    if (strpos($original,' ')!==false) {
        $o2 = str_replace (' ', '_', $original);
        $xec = 'mv "'.$original.'" "'.$o2.'"';
        exec ($xec, $output, $result);
        $original = $o2;
    }
    $thumb = str_replace('siteMedia', 'siteMedia.thumbs', $original);
    createDirectoryStructure (dirname($thumb));
    if (!file_exists($thumb)) {
        $xec = 'convert "'.$original.'" -resize 100 "'.$thumb.'"';
        exec ($xec, $output, $result);
        $dbg = array (
            'idx' => $idx,
            'count' => count($files),
            'exec' => $xec,
            'output' => $output,
            'result' => $result
        );
        echo '<pre>'.json_encode($dbg,JSON_PRETTY_PRINT).'</pre>';
        ob_flush();
        ob_end_flush();
        flush();
        ob_start();
    }
    //die();
}
?>
