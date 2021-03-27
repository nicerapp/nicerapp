<?php
require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/../../../com/cms/boot.php');

global $photoAlbums_globals;
$photoAlbums_globals = array (
	'pathAlbums' => SA_SITE_HD.'siteData/nicerapp/com/ui/photoAlbum/albums/',
	'urlAlbums' => SA_SITE_WEB.'siteData/nicerapp/com/ui/photoAlbum/albums/',
	'pathImageMagick' => 'C:\\Program Files (x86)\\ImageMagick-6.6.7-Q16\\',
	'lowres' => array (
		'width' => 200,
		'height' => 200		
	)
);

/*
set_time_limit (0);
$albumsList = photoAlbum_getAlbumsListFromFilesystem();
$albumsNestedList = photoAlbum_getAlbumsNestedListCalculated($albumsList);
$albumsContents = photoAlbum_getAlbumsContentsFromFilesystem($albumsList);
photoAlbum_resizeAlbums ($albumsContents);
*/
function photoAlbum_getAlbumsListFromFilesystem() {
	global $photoAlbums_globals;
	
	$rootPath = $photoAlbums_globals['pathAlbums'];
	
	$folders = getFilePathList ($rootPath, true, '/(.*)/', array('dir'));
	
	$foldersUse = array();
	foreach ($folders as $idx=>$folder) {
		if (
			strpos($folder, 'inactive')===false
			&& strpos($folder, 'lowres')===false
			&& strpos($folder, '.rar')===false
		) {
			$foldersUse[] = str_replace($rootPath, '', substr($folder,0,strlen($folder)-1));
		}
	}
	
	return $foldersUse;
}

function photoAlbum_getAlbumsNestedListCalculated($albumsList) {
	global $photoAlbums_globals;
	
	$albumsNestedList = array();
	foreach ($albumsList as $idx => $albumRelativePath) {
		$a = explode ('/', $albumRelativePath);
		$p = &$albumsNestedList;
		foreach ($a as $idx2 => $folder) {
			if (!array_key_exists($folder, $p)) $p[$folder] = array();
			$p = &$p[$folder];
		}
	}
	
	return $albumsNestedList;
}

function photoAlbum_getAlbumsContentsFromFilesystem($albumsList) {
	global $photoAlbums_globals;

	$rootPath = $photoAlbums_globals['pathAlbums'];
	
	$albumsContent = array();
	foreach ($albumsList as $idx => $albumRelativePath) {
		$albumContent = getFilePathList ($rootPath.$albumRelativePath, false, '/(.*)/', array('file'));
		$albumsContent[$albumRelativePath] = array();
		foreach ($albumContent as $idx2 => $file) {
			//var_dump ($file);
			//var_dump ($rootPath.'/');
			if (
				strpos ($file, '.rar')===false
			) {
			
				$albumsContent[$albumRelativePath][] = str_replace($rootPath, '', $file);
			}
		}
	}
	
	
	return $albumsContent;
}

function photoAlbum_updateAlbumsFolders ($albumsContents) {
	global $photoAlbums_globals;

	$rootPath = $photoAlbums_globals['pathAlbums'];
	$im = $photoAlbums_globals['pathImageMagick'];
	$w = $photoAlbums_globals['lowres']['width'];
	$h = $photoAlbums_globals['lowres']['height'];
	
	unlink ($rootPath.'run.bat');
	
	foreach ($albumsContents as $albumRelativePath => $files) {
		createDirectoryStructure ($rootPath.$albumRelativePath.'/lowres');
		//echo $albumRelativePath;
		
		foreach ($files as $idx => $filename) {
			$original = $rootPath.$albumRelativePath.'/'.$filename;
			$pi = pathinfo($original);
			$original = $rootPath.$albumRelativePath.'/'.$pi['basename'];
			$lowres = $rootPath.$albumRelativePath.'/lowres/'.$pi['basename'];
			
			$originalWindows = str_replace('/var/www/html/', 'z:/', $original);
			$lowresWindows = str_replace('/var/www/html/', 'z:/', $lowres);
			
			if (!file_exists($lowres)) {
				$cmd = '"'.$im.'convert.exe" "'.$originalWindows.'" -resize '.$w.'x'.$h.' "'.$lowresWindows.'"';
				
				$f = fopen ($rootPath.'run.bat', 'a');
				fwrite ($f, $cmd."\r\n");
				fclose ($f);
			}
		}
	}
	
	// get all lowres filenames
	$bgs = getFilePathList (SA_SITE_HD.'siteData/nicerapp/com/ui/photoAlbum/albums', true, '/(.*)/', array('file'));
	$bgs2 = array();
	foreach ($bgs as $idx=>$fp) {
		if (
			strpos($fp,'lowres')!==false
		) $bgs2[] = str_replace(SA_SITE_HD,'',$fp);
	}
	
	//check for lowres that no longer have a highres
	foreach ($bgs2 as $idx => $lowres) {
		$original = str_replace('lowres/','',$lowres);
		$originalWindows = str_replace('/var/www/html/','z:/',$original);
		$lowresWindows = str_replace('/var/www/html/','z:/',$lowres);
		if (!file_exists($original)) {
			$cmd = 'del "'.$lowresWindows.'"';
			$f = fopen ($rootPath.'run.bat', 'a');
			fwrite ($f, $cmd."\r\n");
			fclose ($f);
		}
	}
	
}

/*
function photoAlbum_resizeAlbums ($albumsContents) {
	global $photoAlbums_globals;

	$rootPath = $photoAlbums_globals['pathAlbums'];
	$im = $photoAlbums_globals['pathImageMagick'];
	$w = $photoAlbums_globals['lowres']['width'];
	$h = $photoAlbums_globals['lowres']['height'];
	
	unlink ($rootPath.'run.bat');
	
	foreach ($albumsContents as $albumRelativePath => $files) {
		createDirectoryStructure ($rootPath.$albumRelativePath.'/lowres');
		//echo $albumRelativePath;
		
		foreach ($files as $idx => $filename) {
			$original = $rootPath.$albumRelativePath.'/'.$filename;
			$pi = pathinfo($original);
			$original = $rootPath.$albumRelativePath.'/'.$pi['basename'];
			$lowres = $rootPath.$albumRelativePath.'/lowres/'.$pi['basename'];
			
			if (!file_exists($lowres)) {
				$cmd = '"'.$im.'convert.exe" "'.$original.'" -resize '.$w.'x'.$h.' "'.$lowres.'"';
				
				$f = fopen ($rootPath.'run.bat', 'a');
				fwrite ($f, $cmd."\r\n");
				fclose ($f);
			}
			
			//if (!file_exists($lowres)) safe_exec ($cmd);
		}
	}
}
*/
function photoAlbum_html_menu () {
	global $photoAlbums_globals;
	global $cms;
	$rootPath = $photoAlbums_globals['pathAlbums'];
	$albumsNestedList = $cms->dbMain->get ('nicerapp/com/ui/photoAlbum/albumsNestedList', true);
	$html = photoAlbum_html_menu_recurse ($albumsNestedList, '');
	
	//$html = $rootPath;
	return $html;
}

function photoAlbum_html_menu_recurse ($d, $p) {
	$html='';
	if (is_array($d) && count($d)>0) {
		foreach ($d as $n => $v) {
			$a = ($p!='' ?$p.'_'.$n :$n);
			if (!is_array($v)) {
				$html.='<li><a href="'.SA_SITE_WEB.'album/'.photoAlbum_urlEncode($a).'">'.$n.'</a></li>';
			} else {
				$html.='<li><a href="'.SA_SITE_WEB.'album/'.photoAlbum_urlEncode($a).'">'.$n.'</a>';
				$html.="\n<ul>\n\t";
				$html.= photoAlbum_html_menu_recurse ($v, $a);
				$html.='</ul>'."\n";
			}
		}
	}
	return $html;
}

function photoAlbum_html_viewAlbum ($album, $page) {
	global $photoAlbums_globals;
	global $cms;

	$rootURL = $photoAlbums_globals['urlAlbums'];
	$w = $photoAlbums_globals['lowres']['width'];
	$h = $photoAlbums_globals['lowres']['height'];
	
	$albumRelativePath = photoAlbum_urlDecode ($album);
?>
	<script type="text/javascript">
		//function startApp() {
			na.vcc.init (document.getElementById('scrollpane_content'));
			jQuery(window).resize (resizeApp);
			
			na.m.waitForCondition ('db load',
				function () {
					var r = typeof window.parent.window.na.s.c.settings.db == 'object';
					return r;
				},
				function () {
					var photoAlbumSettings = {
						div : 'scrollpane_content',
						iframe : 'iframeContent',
						album : '<?php echo $albumRelativePath;?>',
						page : <?php echo $page;?>,
						rootURL : '<?php echo $rootURL?>',
						db : window.parent.window.na.s.c.settings.db.nicer.app.ui.photoAlbum,
						lowres : {
							width : <?php echo $w?>,
							height : <?php echo $h?>
						},
						transformLinks : window.parent.window.na.s.c.transformLinks
					};
					na.vividControls.setOptions('pageMenu',{ level_0 : { orientation : 'horizontal', animspeed : 400 } });

					na.photoAlbum.init (photoAlbumSettings);
					resizeApp();
				},
				10
			)



		//};
		function resizeApp () { 
			na.photoAlbum.resize();
		}	
	</script>
<?php	
}

function photoAlbum_html_viewImage ($image, $page) {
	global $photoAlbums_globals;
	global $cms;

	$rootURL = $photoAlbums_globals['urlAlbums'];
	$w = $photoAlbums_globals['lowres']['width'];
	$h = $photoAlbums_globals['lowres']['height'];
	
	$imageRelativePath = photoAlbum_urlDecode ($image);

/*
	<a id="btnUp" href="#" style="position:absolute;top:1%;left:49%;z-index:10000;"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnUp.png" style="width:40px;" style="width:40px;"/></a>
	<a id="btnPrevious" href="#" style="position:absolute;top:50%;z-index:10000;width:40px;"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnPrevious.png" style="width:40px;"/></a>
	<a id="btnNext" href="#" style="position:absolute;top:50%;right:0px;z-index:10000;width:40px;"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnNext.png" style="width:40px;"/></a>
	<img src="<?php echo $rootURL.$imageRelativePath?>" style="width:98%;"/>

	<table style="width:100%;height:100%;">
		<tr><td style="text-align:center"><a id="btnUp" href="#"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnUp.png" style="width:40px;"/></a></td></tr>
		<tr style="height:*"><td style="width:*">&nbsp;</td></tr>
		<tr><td style="text-align:center;vertical-align:middle;"><img id="saPhotoAlbum_photo" src="<?php echo $rootURL.$imageRelativePath?>" style="width:auto;height:auto;text-align:center;"/></td></tr>
		<tr style="height:*"><td style="width:*">&nbsp;</td></tr>
	</table>
*/	
?>
	<img id="saPhotoAlbum_photo" style="position:relative;display:none;width:auto;height:auto;text-align:center;vertical-align:middle;"/>
	<a id="btnUp" href="#"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnUp.png" style="position:absolute;top:5px;left:49%;width:40px;"/></a>
	<a id="btnPrevious" href="#" style="position:absolute;top:50%;left:5px;z-index:10000;width:40px;"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnPrevious.png" style="width:40px;"/></a>
	<a id="btnNext" href="#" style="position:absolute;top:50%;right:5px;z-index:10000;width:40px;"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnNext.png" style="width:40px;"/></a>
	<script type="text/javascript">
		//function startApp() {
//			na.vcc.init (document.body);
			var app = {};
			
			jQuery(window).resize (function () {
				if (app.photoSettings) resizeApp(app.photoSettings);
			});

			na.m.waitForCondition ('db load',
				function () {
					var r = (
						typeof window.parent.window.na.s.c.settings.db == 'object'
					);
					return r;
				},
				function () {
					var
					photoSettings = {
						div : 'scrollpane_content',
						iframe : 'iframeContent',
						image : '<?php echo $imageRelativePath;?>',
						page : <?php echo $page?>,
						rootURL : '<?php echo $rootURL?>',
						db : window.parent.window.na.s.c.settings.db.nicer.app.ui.photoAlbum,
						lowres : {
							width : <?php echo $w?>,
							height : <?php echo $h?>
						},
						transformLinks : window.parent.window.na.s.c.transformLinks
					};
					app.photoSettings = photoSettings;
					na.photoAlbum.init (photoSettings);
					na.photoAlbum.setImageButtonLinks (photoSettings);
					resizeApp(photoSettings);

				},
				200
			)
		function resizeApp (photoSettings) { 
			na.photoAlbum.setImageDimensions (photoSettings);
		}	


			
		//};
	</script>
<?php	
}



function photoAlbum_html_viewAlbumContent ($album) {
	
	global $photoAlbums_globals;
	global $cms;

	$rootPath = $photoAlbums_globals['pathAlbums'];
	$rootURL = $photoAlbums_globals['urlAlbums'];
	$w = $photoAlbums_globals['lowres']['width'];
	$h = $photoAlbums_globals['lowres']['height'];

	$albumRelativePath = photoAlbum_urlDecode ($album);
	$albumsContents = $cms->dbMain->get ('nicerapp/com/ui/photoAlbum/albumsContents', true);
	//var_dump ($albumsContents);
	$albumsContent = $albumsContents[$albumRelativePath];
	//var_dump ($albumRelativePath);
	//var_dump ($albumsContent);
	$html = '';	
	foreach ($albumsContent as $idx => $imageRelativePath) {
		$pi = pathinfo ($imageRelativePath);
		
		$hires = SA_SITE_WEB.'photo/'.$album;
		$thumbnail = $rootURL.$pi['dirname'].'/lowres/'.$pi['basename'];
		
		$html .= '<a class="saPhotoAlbum_linkToImage" href="'.$hires.'" style="float:right"><img class="saPhotoAlbum_thumbnail" src="'.$thumbnail.'"/></a>'."\n";
	}
	$html .= '<hr/>';
	
	return $html;
}

function photoAlbum_urlEncode ($u) {
	$r = $u;
	$r = str_replace ('/', '_', $r);
	return $r;
}

function photoAlbum_urlDecode ($ue) {
	$r = $ue;
	$r = str_replace ('_', '/', $r);
	return $r;
}

function safe_exec ($cmd) {
	exec ($cmd);
}


?>
