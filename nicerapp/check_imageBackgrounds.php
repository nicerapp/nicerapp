<html>
    <head>
        <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
        <style>
            .fileWithoutErrors { color : green }
            .fileWithErrors { color : red }
            .duplicateFile { color : blue }
        </style>
    </head>
    <body>
        <h1>NicerApp image corruption check</h1>
        <div id="stats" style="left:10%;width:80%;top:10%;height:3em;"></div>
        <div id="checked" style="left:10%;width:80%;top:calc(10% + 4em);height:12em;"></div>
        <div id="errors" style="left:10%;width:80%;top:calc(10% + 18em);height:calc(80% - 18em);overflow:auto;"></div>
<?php 
require_once (dirname(__FILE__).'/boot.php');

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);
if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}


$root = realpath(dirname(__FILE__).'/siteMedia/backgrounds/');
$sidelinedRoot = realpath(dirname(__FILE__).'/siteMedia/backgrounds.offline');
$files = getFilePathList ($root, true, '/.jpg|*.png/', array('file'));
$checked = '';
$errors = '';
//var_dump ($files);
ob_start();

foreach ($files as $idx=>$file) {
    $stats = 'Processed '.$idx.' files of '.count($files).' total';
    
    $pi = pathinfo($file);
    if (
        $pi['extension']!=='jpg'
        && $pi['extension']!=='png'
        && $pi['extension']!=='gif'
    ) continue;
    
    
    foreach ($files as $idx2=>$file2) {
        if (
            ( strpos($file,'-')!==false && str_replace(' ', '_', str_replace('-', '_', $file))===$file2 )
            || ( strpos($file,' ')!==false && str_replace(' ', '_', $file)===$file2 )
        ) {
            $xec2 = 'rm "'.$file2.'"';
            $result = null;
            $output = null;
            exec ($xec2, $output, $result);
            $dbg = array (
                'xec' => $xec2,
                'result' => $result,
                'output' => $output
            );
            //var_dump ($dbg);
            $errors .= '<p class="duplicateFile">Deleted duplicate file '.$file2.'</p>';
        }
    }
    
    
    $xec = 'magick identify -regard-warnings "'.$file.'"';
    $result = null;
    $output = null;
    exec ($xec, $output, $result);
    $dbg = array (
        'xec' => $xec,
        'result' => $result,
        'output' => $output
    );
    //var_dump ($dbg);    
    if (strpos($output[0], '@ error')!==false) {
        $xec2 = 'rm "'.$file.'"';
        $result = null;
        $output = null;
        exec ($xec2, $output, $result);
        $dbg = array (
            'xec' => $xec2,
            'result' => $result,
            'output' => $output
        );
        //var_dump ($dbg);
        $errors .= '<p class="fileWithErrors">Deleted corrupted file '.$file.'</p>';
    } else {
        $checked .= '<p class="fileWithoutErrors">'.$file.'</p>';
    }
    ?>
    <script type="text/javascript" id="updateScript_<?php echo $idx?>" class="updateScript">
        $('.updateScript').not('updateScript_<?php echo $idx?>').remove();
        $('#stats').html('<?php echo $stats?>');
        $('#checked').html('<?php echo $checked?>')[0].scrollTop = 99999999999;
    </script>
    <?php 
    flush();
    ob_flush();
    ob_end_flush();
    ob_start();
    //var_dump ($idx/10); var_dump(round($idx/10));echo '<br/>';
    if ($idx / 10 == round($idx/10)) $checked = '';
}
?>
    </body>
</html>
