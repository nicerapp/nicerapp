<?php
require_once (dirname(__FILE__).'/boot.php');

set_time_limit(0);

$root = realpath(dirname(__FILE__).'/siteMedia/backgrounds/');
$sidelinedRoot = realpath(dirname(__FILE__).'/siteMedia.thumbs/backgrounds/');
$files = getFilePathList ($root, true, '/.*\.gif|.*\.jpg|.*\.png/', array('file'));
 sort ($files);
//echo '<pre style="color:orange;">'; var_dump ($files); echo '</pre>';
ob_start();

foreach ($files as $idx => $original) {
    echo '<p style="color:green;">'.$idx.' of '.count($files).' : '.$original.'</p>';
    /*if (strpos(basename($original),'_')!==false) {
        $o2 = dirname($original).str_replace ('_', ' ', basename($original));
        $xec = 'mv "'.$original.'" "'.$o2.'"';
        exec ($xec, $output, $result);
        $dbg = array (
            'exec' => $xec,
            'output' => $output,
            'result' => $result
        );
        echo '<pre>';var_dump($dbg); echo '</pre>';
        $original = $o2;
    }*/
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
        echo '<pre>';var_dump($dbg); echo '</pre>';
        ?>
        <script type="text/javascript">
            document.scrollTop = 999999999999;
        </script>
        <?php
        ob_flush();
        ob_end_flush();
        flush();
        ob_start();
    }
    //die();
}
?>
