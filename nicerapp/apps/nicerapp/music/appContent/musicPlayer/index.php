<?php
//define ('SA_SHOW_CONSTANTS', true); //un-comment this to only show the define()s that my nicerapp framework exposes
//require_once ('nicerapp-2012/boot.php');
//require_once ('nicerapp-2012/com/userInterface/comments/saComments-1.0.0.php');
require_once (dirname(__FILE__).'/../../../../../../boot_stage_001.php');
global $saCMS;

//lah_resetSessionLog();
//saServiceLog_makeLogEntry_php();

$p = array(
	'saAppParams' => array (
		'musicPlayer' => array()
	)
);

global $locationBarInfo;
//var_dump ($_SESSION['locationBarInfo']); die();
define ("FILE_FORMATS", "/(.*\.mp3$)/");
global $saHTDOCShd;
global $saSiteURL;
$setPath = dirname(__FILE__).'/music/'.$_SESSION['locationBarInfo']['apps']['musicPlayer']['set'];
$files = getFilePathList ($setPath.'/', true, FILE_FORMATS, array('file'));
/*
reportVariable ('$saHTDOCShd', $saHTDOCShd);
reportVariable ('$saSiteURL', $saSiteURL);
die();
*/

foreach ($files as $idx => $filepath) {
	$files[$idx] = str_replace($saHTDOCShd, $saSiteURL, $files[$idx]);
	$files[$idx] = str_replace('\\\\', '/', $files[$idx]);
	$files[$idx] = str_replace('\\', '/', $files[$idx]);
}
//reportVariable ('f', $files); die();

$authorEmail = 'rene.veerman.netherlands@gmail.com';
$spacer = "\n\t\t\t\t";
$htmlIntro = file_get_contents ($setPath.'/index.html');
$htmlTitleMeta = file_get_contents ($setPath.'/index.title_meta.html');

	global $saFrameworkFolder;
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <?php echo $htmlTitleMeta ?>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="content-language" content="en">
	<meta http-equiv="content-language" content="english">
	<link type="text/css" rel="StyleSheet" media="screen" href="index.css"/>
  
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>    
	<?php echo $saCMS->resolveJavascriptHead(); ?>
    <!--<script type="text/javascript" src="<?php echo $saFrameworkFolder?>/lib/jQuery.jPlayer-2.9.1/dist/jplayer/jquery.jplayer.min.js"></script> <! -- Music-file playback code; originally from http://jplayer.org/ -->
	<script type="text/javascript" src="<?php echo $saFrameworkFolder?>/apps/nicerapp/musicPlayer/appContent/musicPlayer/mp3site.source.js?changed=<?php echo date('Ymd-His', filectime(dirname(__FILE__).'/mp3site.source.js'));?>"></script> <!-- The opensourced application code for this website that may be used commercially without cost-->
	<link type="text/css" rel="StyleSheet" media="screen" href="<?php echo $saFrameworkFolder;?>/lib/jQuery.jPlayer-2.9.1/jplayer.vivid.css"/>
</head>


<body style="overflow:hidden;width:100%;height:100%;" >

<script style="text/javascript">

    
    var naLocationBarInfo = <?php echo json_encode($_SESSION['locationBarInfo']); ?>;
    jQuery(document).ready(function() {
        na.m.waitForCondition ('main site bootup for mp3site', function () {
            //debugger;
            return (
                window.top.na.m.settings.initialized.site === true
                && window.top.na.desktop.settings.animating === false
               // && jQuery('#siteContent__iframe', jQuery('#siteContent',window.top)[0])[0]
               // && jQuery('#siteContent__iframe', jQuery('#siteContent',window.top)[0])[0].contentWindow.document.getElementsByTagName('body')[0]
            );
        }, function () {
            //siteCode_nicerapp.onLoad();
            window.top.na.vcc.settings['siteContent'].containsIframe = true;
            window.top.na.sp.containerSizeChanged (jQuery('#siteContent__scrollpane')[0], true);
            //debugger;
            window.top.na.apps.loaded.mp3site.settings.loadedIn['#siteContent'].onload();
        }, 50);
    });
</script>

	<div id="siteLoadingMsg" style="position:absolute; width:100%;text-align:center;">
		<span id="javascriptEnabledTest" style="color:red">This free music mixtapes website requires javascript enabled in your browser.</span>
	</div>
	<!-- <?php //un-comment this section to show your visitors exactly what happens during startup of this website, but might be too distracting for most; ?>
	<div id="siteBootLog" style="position:absolute;width:100%;">
		<img src="<?php echo SA_WEB?>/com/vividThemes/mask_fadeToWhite_top.png" style="position:absolute;width:100%;z-index:10;"/>
		<div id="consoleMsg" style="position:absolute;width:100%;text-align:left;top:20px;height:300px; overflow:auto;z-index:9;"></div>
		<img src="<?php echo SA_WEB?>/com/vividThemes/mask_fadeToWhite_bottom.png" style="position:absolute;width:100%;top:280px;z-index:10;"/>
	</div>
	-->
	<script type="text/javascript">
		jQuery('#javascriptEnabledTest').css({color:'lime'}).html ('You have javascript enabled, this free music mixtapes site will show soon<br/>(after loading a few megabytes worth of artwork).');

		// position on the screen the boot-up message and possibly the #siteBootLog as well:
		var $slm = $('#siteLoadingMsg');
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

		// show spinning icon while artwork loads and site initializes:
		/*
		var loaderIconTheme = {
			centerGapRadius: 30,
			stripes: [
				na.m.globals.urls.framework + '/siteMedia/vividThemes/spinner/transGreenOuter/stripe_1.png', 
				na.m.globals.urls.framework + '/siteMedia/vividThemes/spinner/transGreenOuter/stripe_2.png', 
				na.m.globals.urls.framework + '/siteMedia/vividThemes/spinner/transGreenOuter/stripe_3.png',
			]
		};
		mp3site.settings.loaderIcon = na.vividSpinner.addIcon(
			true, //whether or not to absolutely position
			document.body, //parent element to stick icon to (will be positioned in the middle of the parent element)
			180, 180, //width and height in pixels
			loaderIconTheme, //see var theme above
			true //start running immediately
		);
		*/
		
		// the rest of the site initialization code will start to initalize in window.onload by calling mp3site.source.js::mp3site.startApp()
	</script>

	<!--
	<div id="siteBackground" style="position:absolute; z-index:-1">
		<img id="siteBackground_img" src="<?php //echo SA_APP_WEB?>/images/bg1.jpg" style="z-index:-1; display:none;">
	</div>
	<script type="text/javascript">					
		if (self !== top) $('#siteBackground').remove();
	</script>
	--> 
	
	<!--
	<div id="heading_wrapper" style="visibility:hidden">
		<table id="heading_table" border="0" width="100%" cellpadding="5" cellspacing="5">
			<tr>
				<td valign="top" style="text-align:right; width:350px;">
					
				</td>
				<td> </td>
				<td style="width:120px;">
					<div id="siteMenu" class="vividDialog ajsd_relative vividTheme__dialog_black_simple_square vividScrollpane__hidden" style="overflow:visible;position:relative; width:110px;height:60px;">
						<table style="z-index:1000;">
							<tr>
								<td style="width:50px;">
									<div id="menu_info" class="vividButton vividTheme__question_001" style="position:absolute;"><a href="javascript:mp3site.toggleView('menu_info', 'infoWindow_info');"> </a></div>
								</td>
								<td>
									<div id="menu_tools" class="vividButton vividTheme__tools_001" style="position:absolute;"><a href="javascript:mp3site.toggleView('menu_tools', 'infoWindow_tools');"> </a></div>
								</td>
							</tr>
						</table>
					</div>
				</td>
			</tr>
		</table>
	</div>
	
	<div id="infoWindow_info" class="vividDialog vividTheme__dialog_black_simple_square vividScrollpane__scroll_black" style="overflow:visible; visibility:hidden; position:absolute; visibility:hidden; width:450px; height:600px; z-index:10000;">
		<div id="infoWindow_info_content" style="padding:5px;z-index:10;">
			<?php //echo $htmlIntro?>
		</div>
	</div>

	<div id="infoWindow_tools" class="vividDialog vividTheme__dialog_black_simple_square vividScrollpane__hidden" style="overflow:visible; visibility:hidden; position:absolute; visibility:hidden; width:350px; height:480px;margin : 5px; z-index:11000;">
		<div id="infoWindow_tools_content" style="padding:5px; display:none;">
		</div>
	</div>
	-->
	
	<div id="horizontalMover__containmentBox2" style="display:none;position:absolute;height:20px;border-radius:8px;background:black;opacity:0.2"></div>
	<div id="horizontalMover__containmentBox1" style="display:none;position:absolute;height:16px;top:2px;border-radius:4px;background:black;opacity:0.0"></div>
	<div id="horizontalMover" class="draggable ui-widget-content" style="display:none;position:absolute;top:4px;height:10px;width:730px;border-radius:4px;background:navy;border : 1px solid white;opacity:0.7"></div>
	<script type="text/javascript">
		jQuery('#horizontalMover').draggable ({
			containment : '#horizontalMover__containmentBox1',
			axis : 'x',
			drag : function () {
				mp3site.settings.masterLeftOffset = jQuery('#horizontalMover')[0].offsetLeft;
				mp3site.onWindowResize();
			}
		});
	</script>

	<div id="mp3s" class="vividDialog vividTheme__dialog_transparent vividScrollpane__scroll_black_left animatedOptions__noXbar vividTheme__scroll_black_left" style="visibility:hidden;position:absolute;text-align:center;width:230px; color:yellow;font-weight:bold">
<?php
			$filez = array();
			foreach ($files as $idx=>$file) {
				$fn = basename($file);
				$filez[$idx] = str_replace (' - DJ FireSnake.mp3', '', $fn);
				$filez[$idx] = str_replace ('.mp3', '', $filez[$idx]);
			}
			asort ($filez);
			foreach ($filez as $idx=>$fn) {
				$id = 'mp3_'.$idx;
				echo "\t\t".'<div id="'.$id.'" file="'.basename($files[$idx]).'" class="mp3 vividButton vividTheme__lava_002" style="padding:0px;"><a href="javascript:mp3site.selectMP3(\''.$id.'\', \''.basename($files[$idx]).'\');">'.$fn.'</a></div>'."\n";
			}
?> 
	</div>
		
	<div id="player" class="vividDialog vividTheme__dialog_black_simple_square vividScrollpane__hidden" style="overflow:visible; visibility:hidden;position:absolute; width:320px; height:120px; padding-left:35px;">
        <audio id="audioTag">
            <?php 
			foreach ($filez as $idx=>$fn) {
                $id = 'mp3Source_'.$idx;
                echo '<source id="'.$id.'" src="music/'.$_SESSION['locationBarInfo']['apps']['musicPlayer']['set'].'/'.basename($files[$idx]).'" type="audio/mpeg">';
            }
            ?>
        </audio>
		<table id="player_table" style="width:100%; visibility:hidden;">
			<tr>
				<td>
					<div id="jplayer" class="jp-jplayer"></div>
					<div id="jp_container_1" class="jp-audio">
						<div class="jp-type-single">
							<div id="jp_interface_1" class="jp-gui jp-interface">
								<table border="0" class="jp-controls" cellspacing="5" style="width:100%">
									<tr>
										<td class="jp-button"><div id="btn_playpause" title="Toggle play / pause" class="vividButton vividTheme__playpause_002"><a href="javascript:mp3site.playpause();" class="jp-play" tabindex="1"></a></div></td>
										<!--<td class="jp-button"><div id="btn_stop" title="Stop" class="vividButton vividTheme__stop_001"><a href="javascript:mp3site.stop();" class="jp-pause" tabindex="2"></a></div></td>-->
										<td class="jp-button"><div id="btn_mute" title="Mute / un-mute"class="vividButton vividTheme__shuffle_001"><a href="javascript:mp3site.shuffle();" class="jp-pause" tabindex="3"></a></div></td>
										<td class="jp-button"><div id="btn_repeat" title="Toggle repeating of playlist" class="vividButton vividTheme__repeat_002"><a href="javascript:mp3site.toggleRepeat();" tabindex="4"></a></div></td>
									</tr>
									<tr>
										<td style="vertical-align:top;">
											<div class="jp-volume-bar" title="Volume" onclick="mp3site.setVolume(event);">
												<div class="jp-volume-bar-value"></div>
											</div>
										</td>
										<td colspan="3" style="vertical-align:top;">
											<div class="jp-progress" title="Position in track">
												<div class="jp-seek-bar" onclick="mp3site.seek(event);">
													<div class="jp-play-bar"></div>
												</div>
											</div>
											<div class="jp-time-holder">
												<div class="jp-current-time"></div>
												<div class="jp-duration"></div>
											</div>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</td>
			</tr>
		</table>
	</div>

	<div id="playlist_wrapper" class="vividDialog vividTheme__dialog_black_simple_square vividScrollpane__hidden" style="overflow:visible; visibility:hidden; position:absolute; width:300px;height:300px;">
		<ul id="playlist" style="padding:10px;padding-left:50px;width:100%;"></ul>
	</div>
	
	<div id="infoWindow_mp3desc" class="vividDialog vividScrollpane__scroll_black vividTheme__dialog_black_simple_square" style="overflow:visible;visibility:hidden; position:absolute;width:320px;height:300px;">
		<div id="mp3descText"></div>
		<div id="siteIntroText" style="visibility:hidden;">
			<?php echo $htmlIntro?>
		</div>
	</div>
	
	<!--
	<div id="infoWindow_comments" class="vividDialog vividTheme__dialog_black_simple_square vividScrollpane__hidden" style="overflow:visible; visibility:hidden;position:absolute;width:400px;height:300px;">
		<table id="comments_table" style="width:100%;height:100%;">
			<tr>
				<td style="vertical-align:top">	
					<div id="comments" class="vividScrollpane vividTheme__scroll_black" style="margin:10px;visibility:hidden; width:100%;height:100%;">
					<?php
						//saComments_echoSubscription ('DJ_FireSnake');
					?>
					</div>
				</td>
			</tr><tr>
				<td id="newCommentShowEditor_td" colspan="2" style="height:	40px;padding-left:80px;">
					<div id="newCommentShowEditor" class="vividButton vividTheme__menu_001"><a href="javascript:mp3site.showCommentsEditor();">Enter New Comment</a></div>
				</td>
			</tr><tr>
				<td style="height:1px;">
					<div id="comment_editor" style="display:none">
						<form>
							<table style="padding-left:10px;width:350px;padding-left:10px;">
								<tr>
									<td colspan="2">
										<span style="font-size:9px; color:red;background:white;">
										Comments can only be removed by the IP address they were posted from..
										</span>
									</td>
								</tr>
								<tr>
									<td>From : </td>
									<td><input id="newCommentFrom" name="newCommentFrom" style="width:100%;"/></td>
								</tr>
								<tr><td colspan="2">
									<textarea id="newComment" name="newComment" style="width:350px; height:300px;"> </textarea>
								</td></tr>
							</table>
							<table>
								<tr><td style="width:20px">&nbsp;</td><td>
									<div id="newCommentSubmit" class="vividButton vividTheme__menu_002"><a href="javascript:mp3site.enterNewComment();">Make Comment</a></div>
								</td><td>
									<div id="cancelCommentSubmit" class="vividButton vividTheme__menu_002"><a href="javascript:mp3site.hideCommentsEditor();">Cancel</a></div>
								</td></tr>
							</table>
						</form>
					</div>
				</td>
			</tr>
		</table>
	</div>-->
</body>
</html>
