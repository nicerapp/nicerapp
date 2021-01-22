<?php 
    require_once(dirname(__FILE__).'/class.selfHealer.php');
    require_once(dirname(__FILE__).'/../functions.php');
    
    if (!isLocalHost()) {
        echo 'Access denied.';
        die();
    }
?>
<!DOCTYPE html>
<html>
<head>
    <link type="text/css" rel="StyleSheet" href="/nicerapp/domainConfigs/nicerapp_v2/index.css">
    <link type="text/css" rel="StyleSheet" href="/nicerapp/domainConfigs/nicerapp_v2/index.dark.css">
    <script type="text/javascript" src="/nicerapp/3rd-party/jQuery/jquery-3.5.1.min.js?c=20210121_222709"></script>
	<script type="text/javascript" src="/nicerapp/3rd-party/jQuery/tooltipster/dist/js/tooltipster.bundle.min.js?c=20210121_222709"></script>
	<script type="text/javascript">
        var nas = {
            onload : function(evt){
                $(window).resize(function() {
                    $('#siteBackground img').css({
                        width : $(window).width(),
                        height : $(window).height()
                    });
                });
                
                $('#siteBackground img').css({
                    width : $(window).width(),
                    height : $(window).height(),
                    zIndex : -1
                }).fadeIn('normal');
                $('#siteContent').addClass('started').fadeIn('slow');

                setTimeout(function(){
                    setInterval (nas.reloadReport, 2000);
                }, 2000);
                
            },
            reloadReport : function(){
                var ac = {
                    method : 'GET',
                    url : '/nicerapp/selfHealer/ajax_getReport.php',
                    success : function(data, ts, xhr){
                        $('#siteContent').html(data);
                        if (data.match('failed')) {
                            $('#alarm1')[0].play();
                        } else {
                            $('#alarm1')[0].pause();
                        }                        
                    },
                    error : function(xhr, ajaxOptions, thrownError){
                        debugger;
                    }
                }
                $.ajax(ac);
            }
        }
	</script>
</head>
<body onload="nas.onload(event);">
    <audio id="alarm1" src="/nicerapp/selfHealer/sounds/zapsplat_emergency_alarm_siren_004_26610.mp3" loop preload></audio>
    <div id="siteBackground">
        <img class="bg_first" src="/nicerapp/siteMedia/backgrounds/portrait/70920644_541967329908947_186500115786104832_n.jpg"/>
    </div>
    
    <div id="siteContent" class="vividDialog">
        <?php echo file_get_contents(dirname(__FILE__).'/report.html'); ?>
    </div>
</body>
</html>
