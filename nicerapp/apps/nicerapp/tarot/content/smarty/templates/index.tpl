<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<title>{$title_root}</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="imagetoolbar" content="no" />
	<link rel="StyleSheet" type="text/css" href="{$FWA_APP_WEB}/index.css" media="screen"/>
	<link rel="shortcut icon" href="{$FWA_APP_WEB}/images/icon.ico"/>
	<link rel="StyleSheet" type="text/css" href="{$FWA_WEB}/get_css.php?want=all" media="screen"/>
	<script type="text/javascript" src="{$FWA_WEB}/get_javascript.php?want=all"></script>
	<script type="text/javascript" src="{$FWA_WEB}/lib/jquery.history/jquery.history.js"></script> 
	<script type="text/javascript" src="{$FWA_WEB}/lib/jquery.fancybox-1.3.4/fancybox/jquery.mousewheel-3.0.4.pack.js"></script>
	<script type="text/javascript" src="{$FWA_WEB}/lib/jquery.fancybox-1.3.4/fancybox/jquery.fancybox-1.3.4.pack.js"></script>
	<link rel="stylesheet" type="text/css" href="{$FWA_WEB}/lib/jquery.fancybox-1.3.4/fancybox/jquery.fancybox-1.3.4.css" media="screen" />
	<script type="text/javascript" src="{$FWA_WEB}/lib/tinymce-3.5b3/jscripts/tiny_mce/tiny_mce.js"></script>
	<script type="text/javascript" src="{$FWA_APP_WEB}/siteDebugCode.source.js"></script>
	<?php echo_googleAnalyticsTrackingCode (thisSiteGoogleAnalyticsTrackingID());?>
</head>
<body onload="as.startApp();" style="overflow:hidden;margin:0px;padding:0px;">
	<div id="siteLoadingMsg" style="position:absolute; width:100%;text-align:center;font-size:200%;font-weight:bold;">
		<span id="javascriptEnabledTest" style="color:red">This art gallery requires javascript enabled in your browser.</span>
	</div>
	<!--
	<?php //un-comment this section to show your visitors exactly what happens during startup of this website, but might be too distracting for most; ?>
	<div id="siteBootLog" style="position:absolute;width:100%;">
		<img src="{$FWA_WEB}/com/animatedJavascriptThemes/mask_fadeToWhite_top.png" style="position:absolute;width:100%;z-index:10;"/>
		<div id="consoleMsg" style="position:absolute;width:100%;text-align:left;top:20px;height:300px; overflow:auto;z-index:9;"></div>
		<img src="{$FWA_WEB}/com/animatedJavascriptThemes/mask_fadeToWhite_bottom.png" style="position:absolute;width:100%;top:280px;z-index:10;"/>
	</div>
	-->
	<script type="text/javascript" src="{$FWA_APP_WEB}/siteBootCode.source.js"></script>

	<div id="siteTools" style="position:absolute;">
		<div id="siteBackground">
			<img id="siteBackground_img1" src="{$backgroundImage}" style="position:absolute; visibility:hidden;z-index:1"/>
			<img id="siteBackground_img2" src="" style="position:absolute; visibility:hidden;z-index:2"/>
		</div>

		<div id="siteMenu" class="animatedJavascriptMenu animatedTheme__menu_002" style="position:absolute; visibility:hidden; left:10px; top:48px; width:160px; height:30px; z-index:99000">
			{$definition_mainMenu}
		</div>

		<div id="siteLogo" class=""  style="position:absolute; visibility:hidden; top:10px; left:10px; width:555px; height:99px; z-index:99000;">
					<img src="images/logo.png"/>
		</div>
		
	</div>
	
	<div id="siteContent" class="animatedJavascriptDialog animatedTheme__dialog_002" style="position:absolute;visibility:hidden;color:white;top:10px;left:10px; min-width:300px; width:300px;height:auto;z-index:3;">
		{$content_site}
	</div>

	<!--
	<div id="siteAds" class="animatedJavascriptDialog animatedTheme__dialog_010" style="position:absolute;visibility:hidden;top:120px;color:white;right:10px; min-width:240px; width:340px;height:auto;z-index:3;">
	</div>
	-->

	<div id="ultiCache_data" style="display:none">
	<!-- caching features turned off while content is developed -->
		<?php //echo ultiCache_printSubscription ('index.php', 'ultiCache_data');?>
	</div>
</body>
</html>