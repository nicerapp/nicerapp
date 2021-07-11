<script type="text/javascript" src="/nicerapp/apps/nicerapp/webmail-2.0.0/naWebMail.2.0.0.source.js?c=<?php echo date('Ymd_His',filemtime(dirname(__FILE__).'/naWebMail.2.0.0.source.js'));?>"></script>


<div class="lds-facebook"><!-- thanks for allowing CC0 license usage : https://loading.io/css/ --><div></div><div></div><div></div></div>

<?php
    global $cms;
    $app = $cms->app;
    //$dat = json_encode($app);
    switch ($cms->app['webmail-2.0.0']['page']) {
        case 'index':
            $fn = 'index.php';
            break;
        case 'install' :
            $fn = 'install.php';
            break;
    }
    $dat = execPHP(dirname(__FILE__).'/../webmail-1.0.0/'.$fn, false);
    echo $dat;
?>
