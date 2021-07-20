<?php 
$root = realpath (dirname(__FILE__).'/../../../../');
require_once ($root.'/nicerapp/boot.php');
$app = json_decode (base64_decode_url($_GET['apps']), true);

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);
/*if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}*/


?>
<!--<div class="lds-facebook"><!-- thanks for allowing CC0 license usage : https://loading.io/css/ -- ><div></div><div></div><div></div></div> -->
<!--<pre><?php //echo json_encode($app, JSON_PRETTY_PRINT);?></pre>-->

<?php
global $cms;
$cms = new nicerAppCMS();
$cms->init();

/*
$couchdbConfigFilepath = realpath(dirname(__FILE__).'/../../../').'/domainConfigs/'.$cms->domain.'/couchdb.json';
//var_dump ($couchdbConfigFilepath); die();
$cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);

$cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
$cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
$cdb->useSSL($cdbConfig['useSSL']);
$cdb->login($cdbConfig['adminUsername'], $cdbConfig['adminPassword']);

$cdb->setDatabase(str_replace('_tree', '_documents', $app['cmsText']['database']),false);
try { $call = $cdb->get ($app['cmsText']['id']); } catch (Exception $e) { echo $e->getMessage(); die(); };

echo $call->body->document;
*/

$baseURL = '/nicerapp/siteData/'.$cms->domain.'/';
$baseDir = $root.'/nicerapp/siteData/'.$cms->domain.'/';
$targetDir = $baseDir.$app['cmsViewMedia']['basePath'].'/';
$targetURL = $baseURL.$app['cmsViewMedia']['basePath'].'/';
$fn = $app['cmsViewMedia']['filename'];

$dbg = array (
    'baseURL' => $baseURL,
    'baseDir' => $baseDir,
    'targetDir' => $targetDir,
    'targetURL' => $targetURL,
    'fn' => $fn
);
//echo '<pre>'.json_encode($dbg,JSON_PRETTY_PRINT).'</pre>';

define ("FILE_FORMATS", "/(.*\.png)|(.*\.gif)|(.*\.jpg)/");
$files = getFilePathList ($targetDir, false, FILE_FORMATS, array('file'));

foreach ($files as $idx => $file) {
    if (basename($file)===$fn) {
        $prev = $idx > 1 ? $files[$idx-1] : $files[count($files)-1];
        $next = $idx < count($files) - 1 ? $files[$idx+1] : $files[0];
    }
    $prevArr = array (
        'cmsViewMedia' => array (
            'basePath' => $app['cmsViewMedia']['basePath'],
            'filename' => basename($prev)
        )
    );
    $prevJSON = base64_encode_url (json_encode($prevArr));
    $nextArr = array (
        'cmsViewMedia' => array (
            'basePath' => $app['cmsViewMedia']['basePath'],
            'filename' => basename($next)
        )
    );
    $nextJSON = base64_encode_url (json_encode($nextArr));
}

//echo '<pre>'.json_encode($files,JSON_PRETTY_PRINT).'</pre>';
?>
<script type="text/javascript" src="/nicerapp/userInterface/photoAlbum/4.0.0/photoAlbum-4.0.0.source.js?c=<?php echo date('Ymd_His',filemtime(dirname(__FILE__).'/photoAlbum-4.0.0.source.js'));?>"></script>
<span class="helper"></span>
    <img id="viewMedia" src="<?php echo $targetURL.$fn;?>"/>
<img id="btnSetBackground" class="tooltip" tooltipTheme="mainTooltipTheme" title="Set as site background" src="/nicerapp/siteMedia/btnBackground.png" onclick="na.backgrounds.next ('#siteBackground', na.site.globals.backgroundSearchKey, '<?php echo $targetURL.$fn;?>');"/>
<img id="btnPrevious" src="/nicerapp/siteMedia/btnPrevious.png" onclick="na.site.loadContent('<?php echo $prevJSON?>');"/>
<img id="btnNext" src="/nicerapp/siteMedia/btnNext.png" onclick="na.site.loadContent('<?php echo $nextJSON?>');"/>
<div id="naPhotoAlbum__control" style="position:absolute;top:5%;width:200px;height:100px;right:1%;z-index:3200;">
    <div class="naPhotoAlbum_control__background" style="position:absolute;width:100%;height:100%;">&nbsp;</div>
	<div id="naPhotoAlbum__control__naturalWidth" class="naPhotoAlbum_control_element" style="position:absolute;top:1em;"></div>
    <div id="naPhotoAlbum__control__naturalHeight" class="naPhotoAlbum_control_element" style="position:absolute;top:2em;"></div>
	<div id="naPhotoAlbum__control__width" class="naPhotoAlbum_control_element" style="position:absolute;top:3em;"></div>
    <div id="naPhotoAlbum__control__height" class="naPhotoAlbum_control_element" style="position:absolute;top:4em;"></div>
	<div id="naPhotoAlbum__control__zoomPercentage" class="naPhotoAlbum_control_element" style="position:absolute;top:0em;"></div>
</div>
<script type="text/javascript">
    $(document).ready(function() {
    na.m.waitForCondition ('image load',
        function () {
            var
            nw = $('#viewMedia')[0].naturalWidth;
            return nw > 0 && na.site.settings.desktopReady;
        },
        function () {
            na.photoAlbum.onload();
        },
        100
    );
    });
</script>
