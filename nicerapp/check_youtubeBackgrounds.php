<?php
require_once (dirname(__FILE__).'/boot.php');

$root = realpath(dirname(__FILE__).'/siteMedia/backgrounds/iframe/youtube');
$sidelinedRoot = realpath(dirname(__FILE__).'/siteMedia/backgrounds.offline');
$files = getFilePathList ($root, true, '/.*/', array('file'));
//echo '<pre>'; var_dump ($files);
ob_start();

$APIkey = trim(file_get_contents(dirname(__FILE__).'/key.youtube.txt'));
$cOffline = 0;
$cOnline = 0;

foreach($files as $idx => $file) {
    $url = file_get_contents ($file);
    if (strpos($url,'?')===false) $url.='?'; else $url.='&';
    $url .= 'wmode=transparent&enablejsapi=1&html5=1&origin=https://nicer.app';
    
    $header = "\r\n\r\n".'<h1>'.$file.' ('.$idx.'of'.count($files).')</h1>'."\r\n\r\n";
    echo $header; ob_flush();
    

    if (preg_match('/embed\/(.*)\?/', $url, $matches)===1) {
        $vidID = $matches[1];
    } else if (preg_match('/watch\?v\=(.*)\&/', $url, $matches)===1) {
        $vidID = $matches[1];
    }
    $header2 = '<h2>'.$vidID.'</h2>';
    //echo $header2;
    
    $dataURL = 'https://www.googleapis.com/youtube/v3/videos?id='.$vidID.'&key='.$APIkey.'&part=snippet,contentDetails,statistics,status';
    echo '<h3>'.$dataURL.'</h3>';
    
    $opts = array(
        'http'=>array(
            'method'=>"GET",
            'header'=>"Origin: http://nicer.app"
        )
        );

    $data = file_get_contents(
        $dataURL,
        false,
        stream_context_create($opts)
    );
    $dataDecoded = json_decode($data, true);
    if ($dataDecoded['pageInfo']['totalResults']===0) {
        $xec = 'mv "'.$file.'" "'.$sidelinedRoot.'/'.basename($file).'"';
        exec ($xec, $output, $result);
        echo '<h4 style="color:red">Offline</h4>';
        $cOffline++;
    } else {
        echo '<h4 style="color:green">Online</h4>';
        $cOnline++;
    }
    //echo '<pre style="font-size:55%">'.json_encode($dataDecoded, JSON_PRETTY_PRINT).'</pre>';
    
    $output = $header.$data;
    sleep (1);
}
echo 'Results : '.count($files).' files, '.$cOffline.' offline' ;
?>
