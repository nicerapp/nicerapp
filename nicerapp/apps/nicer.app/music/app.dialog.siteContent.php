<?php
//define ('SA_SHOW_CONSTANTS', true); //un-comment this to only show the define()s that my nicerapp framework exposes
//require_once ('nicerapp-2012/boot.php');
//require_once ('nicerapp-2012/com/userInterface/comments/saComments-1.0.0.php');
require_once (dirname(__FILE__).'/../../../boot.php');
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
if (getLocationBarInfo()['apps']['music']['set']==='index') {
    require_once(dirname(__FILE__).'/frontpage.php');
} else {
    $setPath = dirname(__FILE__).'/music/'.getLocationBarInfo()['apps']['music']['set'];
    //var_dump ($setPath); die();
    $files = getFilePathList ($setPath, true, FILE_FORMATS, array('file'));
    //var_dump ($files); die();
    foreach ($files as $idx => $filepath) {
        $files[$idx] = str_replace(realpath(dirname(__FILE__.'/../..')), '', $files[$idx]);
        $files[$idx] = str_replace('\\\\', '/', $files[$idx]);
        $files[$idx] = str_replace('\\', '/', $files[$idx]);
    }

$authorEmail = 'rene.veerman.netherlands@gmail.com';
$spacer = "\n\t\t\t\t";
$htmlIntro = file_get_contents ($setPath.'/index.html');
$htmlTitleMeta = file_get_contents ($setPath.'/index.title_meta.html');

	global $saFrameworkFolder;
?>
    <?php echo $htmlTitleMeta ?>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="content-language" content="en">
	<meta http-equiv="content-language" content="english">
	<link type="text/css" rel="StyleSheet" media="screen" href="/nicerapp/apps/nicer.app/music/index.css"/>
	<link type="text/css" rel="StyleSheet" media="screen" href="/nicerapp/3rd-party/jQuery/jPlayer-2.9.1/jplayer.vivid.css"/>
  
    <!--<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>-->
    <script src="/nicerapp/3rd-party/jQuery/jquery-ui-1.12.1/jquery-ui.js"></script>
	<script type="text/javascript" src="/nicerapp/apps/nicer.app/music/mp3site.source.js?changed=<?php echo date('Ymd-His', filectime(dirname(__FILE__).'/mp3site.source.js'));?>"></script>

	<div id="horizontalMover__containmentBox2" style="display:none;position:absolute;height:20px;border-radius:8px;background:black;opacity:0.2"></div>
	<div id="horizontalMover__containmentBox1" style="display:none;position:absolute;height:16px;top:2px;border-radius:4px;background:black;opacity:0.0"></div>
	<div id="horizontalMover" class="draggable ui-widget-content" style="display:none;position:absolute;top:4px;height:10px;width:730px;border-radius:4px;background:navy;border : 1px solid white;opacity:0.7"></div>
	<script type="text/javascript">
        var naLocationBarInfo = <?php echo json_encode(getLocationBarInfo()); ?>;
        setTimeout(function() {
            jQuery('#horizontalMover').draggable ({
                containment : '#horizontalMover__containmentBox1',
                axis : 'x',
                drag : function () {
                    mp3site.settings.masterLeftOffset = jQuery('#horizontalMover')[0].offsetLeft;
                    mp3site.onWindowResize();
                }
            });
            na.desktop.globals.divs.push ('#mp3s');
            na.desktop.globals.divs.push ('#player');
            na.desktop.globals.divs.push ('#playlist_wrapper');
            na.desktop.globals.divs.push ('#infoWindow_mp3desc');
        }, 250);
	</script>
	
	<div id="titlebar" class="vividDialog" style="opacity:0.0001;position:absolute;display:flex;background:rgba(0,0,0,0.4);border:1px solid white;border-radius:15px;height:2em;font-weight:bold;justify-content:center;vertical-align:middle;align-content: center;align-items : center;font-size:2em">
        <?php echo str_replace('_', ' ', getLocationBarInfo()['apps']['music']['set']) ?>
    </div>

	<div id="mp3s" class="vividDialog_mp3s vividScrollpane" theme="transparent" style="opacity:0.001;position:absolute;text-align:center;width:230px; color:yellow;font-weight:bold">
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
				echo "\t\t".'<div id="'.$id.'" file="'.basename($files[$idx]).'" class="mp3 vividButton" theme="dark" style="padding:0px;" onclick="mp3site.selectMP3(\''.$id.'\', \''.basename($files[$idx]).'\');">'.$fn.'</div>'."\n";
			}
?> 
	</div>
		
	<div id="player" class="vividDialog" theme="dark" style="overflow:visible;opacity:0.001;position:absolute; width:320px; height:120px; ">
        <audio id="audioTag">
        
            <?php 
            foreach ($filez as $idx=>$fn) {
                $id = 'mp3Source_'.$idx;
                echo '<source id="'.$id.'" src="/nicerapp/apps/nicer.app/music/music/'.getLocationBarInfo()['apps']['music']['set'].'/'.basename($files[$idx]).'" type="audio/mpeg">';
            }
            ?>
        </audio>
		<table id="player_table" style="padding:10px;padding-top:7px;width:100%;">
			<tr>
				<td style="width:220px">
					<div id="jplayer" class="jp-jplayer"></div>
					<div id="jp_container_1" class="jp-audio">
						<div class="jp-type-single">
							<div id="jp_interface_1" class="jp-gui jp-interface">
								<table border="0" class="jp-controls" cellspacing="5" style="width:100%">
									<tr>
										<td class="jp-button"><img id="btnPlayPause" src="/nicerapp/apps/nicer.app/music/pause_icon.png" onclick="mp3site.playpause();"></td>
										<td class="jp-button"><img id="btnMuteUnmute" src="/nicerapp/apps/nicer.app/music/mute_icon.png" onclick="mp3site.mute();"/></td>
										<td class="jp-button"><img id="btnRepeat" src="/nicerapp/apps/nicer.app/music/repeat_icon.png" onclick="mp3site.toggleRepeat();"/></td>
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

	<div id="playlist_wrapper" class="vividDialog" theme="dark" style="opacity:0.001;overflow:visible;position:absolute; width:300px;height:300px;">
		<ul id="playlist" style="padding:10px;padding-left:35px;width:100%;height:100%;"></ul>
	</div>
	
	<div id="infoWindow_mp3desc" class="vividDialog" theme="dark" style="opacity:0.001;overflow:visible;position:absolute;width:320px;height:300px;">
		<div id="mp3descText"></div>
		<div id="siteIntroText">
			<?php echo $htmlIntro?>
		</div>
	</div>
<?php
}
?>
