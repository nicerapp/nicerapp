<?php
require_once (dirname(__FILE__).'/../../../../globals.php');

	global $saSiteHTTP; global $saSiteDomain; global $saSiteRootFolder; global $saFrameworkFolder;
	global $saSiteHD; global $saFrameworkHD; global $saSiteURL; global $saFrameworkURL;
	global $saIsLocalhost; global $saHTDOCShd;
	global $saServerOperatingSystem; global $saDeveloperMode;
	
	global $saUpstreamRootURL; global $locationbarInfo;

	global $locationBarInfo;
	$_SESSION['locationBarInfo'] = $locationBarInfo;
        //var_dump ($locationBarInfo); die();
	
?>
<script type="text/javascript">

    var stepDelay = 250; 
	na.m.waitForCondition ('sa initialized',
		function () { return na.m.settings.initialized.site },
		app__musicPlayer__placeIframe,
		stepDelay
	);
	
	function app__musicPlayer__placeIframe () {
        na.vcc.settings['siteContent'].canAutoHeight = false;
        <?php
        if ($locationBarInfo['apps']['musicPlayer']['set']==='index') {
        ?>
            var 
            iframe =
                '<iframe id="siteContent__iframe" scrolling="no" src="<?php echo $saFrameworkURL?>/apps/nicerapp/musicPlayer/appContent/musicPlayer/frontpage.php" style="width:100%;height:100%;position:relative" onload="var cdim = jQuery(\'#siteContent__contentDimensions\')[0]; jQuery(\'#siteContent\').css ({ top : cdim.offsetTop, left : cdim.offsetLeft, width : cdim.offsetWidth, height : cdim.offsetHeight });"></iframe>'
                //+'<center style="color:red;background:white;opacity:0.8;font-weight:bold;">Initialization of this app takes about 10 seconds at the moment.</center>';

        <?php
        } else {
        ?>
            var 
            iframe =
                '<iframe id="siteContent__iframe" scrolling="no" src="<?php echo $saFrameworkURL?>/apps/nicerapp/musicPlayer/appContent/musicPlayer/index.php" style="width:100%;height:100%" onload="var cdim = jQuery(\'#siteContent__contentDimensions\')[0]; jQuery(\'#siteContent\').css ({ top : cdim.offsetTop, left : cdim.offsetLeft, width : cdim.offsetWidth, height : cdim.offsetHeight });app__musicPlayer__initApp()"></iframe>'
                //+'<center style="color:red;background:white;opacity:0.8;font-weight:bold;">Initialization of this app takes about 10 seconds at the moment.</center>';
        <?php
        }
        ?>
        //alert (iframe);
        jQuery('#siteContent').html(iframe);
	}
	
	function app__musicPlayer__initApp () {
		var 
		iframe = jQuery('#siteContent__iframe')[0],
		iframe = iframe.contentWindow || iframe.contentDocument; // thanks go to https://www.w3schools.com/jsref/prop_frame_contentdocument.asp
		iframe.siteCode_nicerapp.onLoad(); // that's the way to do it.
	}
	
	function app__musicPlayer__resizeContent () { // gets called via na.vcc.settings['siteContent'].afterDesktopResize() 
		jQuery('#siteContent').css ({
			top : jQuery('#siteContent__scrollpane')[0].offsetTop,
			left : jQuery('#siteContent__scrollpane')[0].offsetLeft, 
			width : jQuery('#siteContent__scrollpane')[0].offsetWidth,
			height : jQuery('#siteContent__scrollpane')[0].offsetHeight
		});
		
		setTimeout (app__musicPlayer__resizeIframe, stepDelay);
	}

	function app__musicPlayer__resizeIframe () {
		jQuery('#siteContent__iframe').css ({
			top : jQuery('#siteContent__contentDimensions')[0].offsetTop,
			left : jQuery('#siteContent__contentDimensions')[0].offsetLeft, 
			width : jQuery('#siteContent__contentDimensions')[0].offsetWidth,
			height : jQuery('#siteContent__contentDimensions')[0].offsetHeight
		});
		
		setTimeout (app__musicPlayer__resizeApp, stepDelay);
	}	
	
	function app__musicPlayer__resizeApp () {
		var 
		iframe = jQuery('#siteContent__iframe')[0],
		iframe = iframe.contentWindow || iframe.contentDocument; // thanks go to https://www.w3schools.com/jsref/prop_frame_contentdocument.asp
		
		iframe.siteCode_nicerapp.onResize(); // that's the way to do it.
	}

	/*
	function mustResizeIframe() { 
		if (
			jQuery("#siteContent__contentDimensions").length==1
			&& jQuery("#siteContent__contentDimensions")[0].offsetWidth
		) {
			resizeIframe();
		} else {
			setTimeout (mustResizeIframe, 20);
		}
	}
	
	mustResizeIframe();*/
	
</script>
