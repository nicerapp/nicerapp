<?php
error_reporting (E_ALL);
require_once ('functions.php');

header ('Access-Control-Allow-Origin: http://nicer.app');

$redirect = false;
if (!array_key_exists('deck', $_GET)) {
	$redirect = true;
	$_GET['deck'] = appURLencode('Original Rider Waite');
}
if (!array_key_exists('reading', $_GET)) {
	$redirect = true;
	$_GET['reading'] = appURLencode('3 Cards');
}


if ($redirect) {
	header ('Location: '.getSiteRootURL().'/deck/'.$_GET['deck'].'/reading/'.$_GET['reading'].'/');
	die();
}
//define ('SA_SHOW_CONSTANTS', true);


require_once (dirname(__FILE__).'/nicerapp/boot.php');
//require_once (dirname(__FILE__).'/nicerapp/com/ui/tools/htmlMicroscope/hm.php');
//require_once (dirname(__FILE__).'/nicerapp/com/logAndHandler/lah.php');


/*
no longer allowed to be used commercially:
	<script type="text/javascript" src="<?php echo getSiteRootURL();?>/nicerapp/lib/fancyapps-fancyBox-2.1.4/lib/jquery.mousewheel-3.0.6.pack.js"></script>
	<script type="text/javascript" src="<?php echo getSiteRootURL();?>/nicerapp/lib/fancyapps-fancyBox-2.1.4/source/jquery.fancybox.pack.js"></script>
	<link rel="stylesheet" type="text/css" href="<?php echo getSiteRootURL();?>/nicerapp/lib/fancyapps-fancyBox-2.1.4/source/jquery.fancybox.css" media="screen" />
*/

//lah_pageBegin();
//lah_resetSessionLog();
//saServiceLog_makeLogEntry_php();

$explanationID = 'blessedtarot';
$readingType = get_readingType();
$reading = draw_cards($readingType, $explanationID);
$reading = calculate_size_for_cards ($reading); 
$numberOfDecks = getNumberOfDecks();
$numberOfReadings = getNumberOfReadings();

//	<!--<meta name="keywords" content="tarot, free, free tarot, free tarot reading, psychic, play, anation, consult, future, prediction, tarot consult, tarot reading, tarot game, tarot deck, tarot decks, tarot set, game, cards, card game, angel card">-->
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;background:transparent;background-color:none;">
<head>
	<title>Free Tarot - Deck : <?php echo appURLdecode($_GET['deck']);?> - Reading : <?php echo appURLdecode($_GET['reading']);?></title>
	<meta name="description" content="Play a free game of tarot, get a free tarot reading, select any of <?php echo $numberOfDecks;?> different tarot decks and <?php echo $numberOfReadings?> different types of readings.">
	<meta name="keywords" content="<?php echo getKeywords($_SERVER['REQUEST_URI']);?>">
	<meta name="robots" content="all">
	<meta name="copyright" content="Owner of nicer.app">
	<meta name="author" content="Owner of nicer.app">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="content-language" content="en">
	<meta http-equiv="content-language" content="english">
	<link type="text/css" rel="StyleSheet" media="screen" href="<?php echo getSiteRootURL();?>/nicerapp/get_css.php?want=all"/>
	
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/jquery-2.0.3.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/jquery.animate-colors.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/jquery.easing.min.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/jquery-cookie/jquery.cookie.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/jquery.history/jquery.history.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/jquery.tubeplayer-1.1.6.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/createjs/events/Event.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/createjs/events/EventDispatcher.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/createjs/utils/IndexOf.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/createjs/utils/Proxy.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/preloadjs/AbstractLoader.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/preloadjs/LoadQueue.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/preloadjs/TagLoader.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/lib/PreloadJS-release_v0.4.1/src/preloadjs/XHRLoader.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/saCore-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/accounts/saAccounts-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/filesystem/saFilesystem-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/serviceLog/saServiceLog-2.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/forms/saForms-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/saBackgrounds-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/linkbase/linkbase-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/progressbar/vividProgressbar-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/comments/saComments-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/json/saJSON-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/colorGradients/saColorGradients-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/spinner/vividSpinner-1.1.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/controls/vividControls-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/button/vividButton-2.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/dialog/vividDialog-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/menu/vividMenu-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/saDesktop-2.1.1.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/scrollpane/vividScrollpane-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/tabs/vividTabs-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/vivid/text/vividText-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/tools/lucidLog/lucidLog-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/tools/lucidLog/lucidLog-php-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/saTrace-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/core/ultiCache/ultiCache-0.1.0.source.js"></script>
	<script type="text/javascript" src="<?php echo SA_SITE_WEB;?>nicerapp/com/ui/photoAlbum/photoAlbum-1.0.0.source.js"></script>
	<script type="text/javascript" src="<?php echo getSiteRootURL();?>/nicerapp/get_javascript.php?want=all"></script>

	<script type="text/javascript">
		na.site.globals.urls = {
			os : '<?php echo SA_WEB?>',
			app : '<?php echo SA_SITE_WEB?>',
			subURL : '<?php echo SA_SITE_SUBDIR?>'
		};
		na.site.globals.serverIsForDevelopment = <?php echo SA_DEVELOPMENT_SERVER?'true':'false'?>;
		na.site.globals.visitorIsDeveloper = <?php echo SA_VISITOR_IS_DEVELOPER?'true':'false'?>;

		Date.prototype.getMonthName = function(lang) {
			lang = lang && (lang in Date.locale) ? lang : 'en';
			return Date.locale[lang].month_names[this.getMonth()];
		};

		Date.prototype.getMonthNameShort = function(lang) {
			lang = lang && (lang in Date.locale) ? lang : 'en';
			return Date.locale[lang].month_names_short[this.getMonth()];
		};

		Date.locale = {
			en: {
			   month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			   month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			}
		};

		Date.prototype.stdTimezoneOffset = function() {
			var jan = new Date(this.getFullYear(), 0, 1);
			var jul = new Date(this.getFullYear(), 6, 1);
			return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		};

		Date.prototype.dst = function() {
			return (this.getTimezoneOffset() < this.stdTimezoneOffset());
		};	
	</script>
	
	
	
	
	<script type="text/javascript" src="<?php echo getSiteRootURL();?>/nicerapp/lib/jquery.history/jquery.history.js"></script> 
	<script type="text/javascript" src="<?php echo getSiteRootURL();?>/nicerapp/lib/jquery.QuickFlip2/jquery.quickflip.min.js"></script>
	<link type="text/css" rel="StyleSheet" media="screen" href="<?php echo getSiteRootURL();?>/index.css">
	<script type="text/javascript" src="<?php echo getSiteRootURL();?>/siteCode.source.js"></script>
	<script type="text/javascript">
		ts.globals.rootURL = '<?php echo getSiteRootURL();?>';
		ts.globals.url = '<?php echo $_SERVER['REQUEST_URI']?>';
		ts.current.reading = <?php echo json_encode($reading); ?>
	</script>
	
</head>
<body style="width:100%;height:100%;overflow:hidden;background:transparent;background-color:none;" onload="siteCode_nicerapp.onLoad();">
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-45629056-1', 'blessedtarot.info');
	  ga('send', 'pageview');

	</script>



	<div id="siteLoadingMsg" style="position:absolute; width:100%; font-size:larger; text-align:center;">
		This free web game may take up to 30 seconds to load,<br/>
		and requires you have javascript enabled in your browser.<br/>
	</div>
	<!--
	<div id="siteBootLog" style="position:absolute;width:100%;">
		<img src="<?php echo SA_WEB?>/com/ui/vivid/themes/mask_fadeToWhite_top.png" style="position:absolute;width:100%;z-index:10;"/>
		<a id="consoleMsg" style="position:absolute;width:100%;text-align:left;top:30px;height:300px; overflow:auto;z-index:9;"></a
		<img src="<?php echo SA_WEB?>/com/ui/vivid/themes/mask_fadeToWhite_bottom.png" style="position:absolute;width:100%;top:300px;z-index:10;"/>
	</div>
	-->
	<script type="text/javascript">
		var $slm = $('#siteLoadingMsg').css({color:'lime'}).html('This free web game will show soon.');
		$slm.css({
			top : (($(window).height() - $slm.height())/6) + 'px',
			left : (($(window).width() - $slm.width())/2) + 'px'
		});
		var $sbl = $('#siteBootLog');
		var $cm = $('#consoleMsg');
		$sbl.css({
			top : (($(window).height() - $cm.height())/2) + 'px',
			left : (($(window).width() - $cm.width())/2) + 'px'
		});
	</script>

	<div id="siteTools"  style="position:absolute;">
		<img id="siteBackground" src="<?php echo getSiteRootURL();?>/images/crystal-ball.jpg" style="position:absolute; display:none;"/>
		<script type="text/javascript">					
			if (self !== top) $('#siteBackground').remove();
		</script>

			
			
		<div id="siteLogo" class="vividButton vividTheme__tarot_siteLogo_003" style="position:absolute; visibility:hidden; left:-310px; left:10px; width:300px; height:80px; z-index:990000;">
			<a  href="javascript:ts.getNewReading();">&nbsp;</a>
		</div>
	
		<div id="siteMenu" class="vividMenu vividTheme__menu_002" style="position:absolute; visibility:hidden; left:-420px; top:10px; width:400px; height:50px; z-index:990000">
			<ul style="display:none">
				<li><a  href="#">Tarot Decks</a>
					<ul>
					<?php echo html_menu_decks(); ?>
					</ul>
				</li>
				<li><a  href="#">Readings</a>
					<ul>
						<?php echo html_menu_readings(); ?>
					</ul>
				</li>
				<li><a  href="#">Options</a>
					<ul>
						<li><a  href="javascript:tarotSite.setOptions('majors',true);">Major cards only</a></li>
						<li><a  href="javascript:tarotSite.setOptions('majors',false);">All cards</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
	
	<div id="siteContent" style="position:absolute;">
			<div id="dialog-content" class="vividDialog vividTheme__dialog_top_green_body_black_square vividScrollpane__scroll_black" style="position:absolute;visibility:hidden; top:48%;left:48%;width:4%;height:4%;">
				<div id="contentTools" class="animatedDialog__header" style="width:100%; height:50px;">
					<table><tr><td style="width:115px;">
					<form action="https://www.paypal.com/cgi-bin/webscr" method="post">
					<input type="hidden" name="cmd" value="_s-xclick">
					<input type="hidden" name="hosted_button_id" value="GME7ZPAQL6EDG">
					<input type="image" src="https://www.paypalobjects.com/en_US/NL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
					<img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1">
					</form>
					</td><td>
					<div id="contentMenu" class="vividMenu vividTheme__menu_004" style="position:relative;z-index:999999999999;">
						<ul style="display:none">
							<li><a  href="javascript:ts.getNewReading();">New Reading</a></li>
							<li><a  href="javascript:ts.showContentPage(2);">Reading Desc.</a></li>
							<li><a  href="javascript:ts.showContentPage(4);">Site News</a></li>
						</ul>
					</div>
					</td></tr>
					</table>
				</div>
				<table id="content_table" cellpadding="0" cellspacing="5" style="width:100%;height:100%;">
					<tr>
						<td>
							<div id="content" style="padding:10px;height:100%;overflow:hidden;">
								<?php //getBadDecks(); ?>
								<div id="cards" style="position:relative; float:right; height:<?php echo $reading['theme']['size']['y']?>px;width:<?php echo $reading['theme']['size']['x']?>px;">
									<?php echo html_draw_cards($reading); ?>
								</div>
								<div id="intro">
									<h1>Free Tarot Reading</h1>
									
									<p>
									Welcome to this completely free tarot web game :-)<br/>
									Here you can select any of <?php echo $numberOfDecks;?> different tarot decks  and <?php echo $numberOfReadings?> different types of readings, to play a game of tarot with.<br/>
									Use the menu at the top of this web game to select a different deck or reading type.
									</p>
									
									<p>
									Click once on a card to see it, <a  href="javascript:$('.quickflip').quickFlipper(); ts.showContentPage(2);">click here to flip all cards</a>, click another time on the card to see it enlarged and right-side-up.
									</p>
									
									<p>
									If a card is upside down, that is the common notation for the opposite meaning of the card, also known as the "negative" or "reversed" meaning of the card.
									</p>
								</div>
								<div id="news" style="display:none;">
									<?php readfile ('news.html'); ?>
									
									<hr>
									<p>
									<a  class="nomod" target="_new" href="<?php echo getSiteRootURL();?>/contract.html">Print Contract</a><br/>
									</p>
									<?php readfile ('contract.html'); ?>
								</div>								
								<div id="deckExplanation" style="display:none;">
									<?php echo html_deck_info()?>
								</div>
								
								<div id="readingExplanation" style="display:none;">
								<?php echo $reading['heading']; ?>
								</div>
								
								<div id="cardExplanation" style="display:none;">
								<?php
									foreach ($reading['cards'] as $idx => $card) {
										echo '<a id="cardExplanation_card_'.$card['title'].'">';
										echo $card['explanation'];
										echo '</a';	
									}
								?>
								</div>
							</div>
						</td>
					</tr>
				</table>
			</div>
	</div>
	
	<div id="siteAdsOnSide" style="position:absolute;">
		<div id="dialog-ads" class="vividDialog vividTheme__dialog_top_green_body_black_square vividScrollpane__hidden" style="position:absolute;visibility:hidden; right:-500px;top:10px;width:350px;height:500px;">
			<table style="width:100%;">
			<tr><td id="ads_side" style="vertical-align:middle;text-align:center; ">
				<iframe src="http://www.oranum.com/creatives/livefeed/liveFeed_40?s=1&p=6&w=101142&t=0&c=3310&volume=0&performerid=" width="300" height="250"></iframe>
				<br/><br/>	
				<script type="text/javascript"><!--
				google_ad_client = "ca-pub-6728357653811028";
				/* square_1 */
				google_ad_slot = "1818837617";
				google_ad_width = 250;
				google_ad_height = 250;
				//-->
				</script>
				<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
				<br/><br/>	
				<script type="text/javascript"><!--
				google_ad_client = "ca-pub-6728357653811028";
				/* square_1 */
				google_ad_slot = "1818837617";
				google_ad_width = 250;
				google_ad_height = 250;
				//-->
				</script>
				<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
				<script type="text/javascript">
					$('#aswift_0_anchor, #aswift_1_anchor').css({visibility:'hidden'});
				</script>
			</td></tr>
			</table>
		</div
	</div>

</body>
</html>
