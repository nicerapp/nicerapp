<?php
//require_once (dirname(__FILE__).'/../../../../boot.php');
require_once (dirname(__FILE__).'/../../../cms/boot.php');
require_once (dirname(__FILE__).'/../../../../boot_stage_001.php');


global $photoAlbums_globals;
$photoAlbums_globals = array (
	'pathAlbums' => realpath(dirname(__FILE__).'/../../../../../../../media.nicer.app/siteData/siteFramework/com/ui/photoAlbum/albums/'),
	'urlAlbums' => 'http://media.nicer.app/siteData/siteFramework/com/ui/photoAlbum/albums/',
	'pathImageMagick' => '',//'C:\\Program Files (x86)\\ImageMagick-6.6.7-Q16\\',
	'lowres' => array (
		'width' => 200,
		'height' => 200		
	)
);


if (false) {
	set_time_limit (0);
	$albumsList = photoAlbum_getAlbumsListFromFilesystem();
	$albumsNestedList = photoAlbum_getAlbumsNestedListCalculated($albumsList);
	$albumsContents = photoAlbum_getAlbumsContentsFromFilesystem($albumsList);
	photoAlbum_resizeAlbums ($albumsContents);
}

function photoAlbum_getImageSizes_recursive ($albumsList) {
	foreach ($albumsList as $path => $pathFilesList) {
		if (
			is_array($pathFilesList)
			&& ( count($pathFilesList) > 0 )
		) {
			$filesWithSizes = photoAlbum_getImageSizes ($pathFilesList);
			$albumsList[$path] = $filesWithSizes;
		}
	}
	//reportVariable ('$albumsList', $albumsList); die();
	return $albumsList;
}

function photoAlbum_getImageSizes ($files) {
	$r = array();
	//echo '<pre>';
	///var_dump ($files);
	
	$scroll = '<script type="text/javascript">window.scrollTo(0,document.body.scrollHeight);</script>';
	
	foreach ($files as $idx => $file) {
		
		global $saServerOperatingSystem;
		/*switch ($saServerOperatingSystem) { // problems arise that put the full path on the server (windows) into the database.
			case 'windows' : 
				$file = str_replace('/', '\\', $file); // imagemagick needs this. search google for 'imagemagick' to install your copy onto your PHP server
				break;
			default : 
				$file = str_replace('\\', '/', $file); // imagemagick needs this. search google for 'imagemagick' to install your copy onto your PHP server
				break;
		}*/
		$file = str_replace('\\', '/', $file); // imagemagick needs this. search google for 'imagemagick' to install your copy onto your PHP server
		
		$pi = pathinfo ($file);
//echo '<pre>$pi=';var_dump ($pi);echo '</pre>'; die();
		if (!array_key_exists('extension', $pi)) continue;
		$ext = $pi['extension'];
		
		if (
			$ext=='png'
			|| $ext=='jpg'
			|| $ext=='jpeg'
			|| $ext=='gif'
		) {
		
			$xec = 'identify -format "%[fx:w] %[fx:h]" "'.$file.'"';
			$output = array();
			$return_var = null;
			
			exec ($xec, $output, $return_var);
			
			$t = array (
				 '$xec' => $xec,
				 '$output' => $output,
				 '$return_var' => $return_var
			);
			if (!array_key_exists(0, $output)) continue;
			
			echo $idx.' of '.count($files).' cmd : '.$xec.' : '.$return_var.' '.json_encode($output).'<br/>'.$scroll; 
			ob_flush(); ob_end_flush(); flush(); ob_start();
			//die();
			
			//echo '<pre>';var_dump ($t);echo'</pre>'; 
			//reportVariable ('t', $t); ob_flush();
			//ob_flush(); ob_end_flush(); flush(); ob_start();
			
			$r[] = array (
				'f' => $file,
				's' => $output[0]
			);
			//return $r;
			//ssleep(2);
			
			//echo '<pre>imagemagick returns : '; var_dump ($t); echo '</pre>'; die();
		} else {
			$r[] = array (
				'f' => $file
			);
		}
		
		//var_dump ($t);/
	};
	
	return $r;
}


function photoAlbum_getAlbumsListFromFilesystem($photoAlbums_globals) {
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
				$cmd = '"'.$im.'convert.exe" "'.$original.'" -resize '.$w.'x'.$h.' "'.$lowres.'"';
				
				$f = fopen ($rootPath.'run.bat', 'a');
				fwrite ($f, $cmd."\r\n");
				fclose ($f);
			}
		}
	}
	
	// get all lowres filenames
	global $photoAlbums_globals;
	$bgs = getFilePathList ($photoAlbums_globals['pathAlbums'], true, '/(.*)/', array('file'));
	$bgs2 = array();
	foreach ($bgs as $idx=>$fp) {
		if (
			strpos($fp,'lowres')!==false
		) $bgs2[] = str_replace(SA_SITE_HD,'',$fp);
	}
	
	//check for lowres that no longer have a highres
	foreach ($bgs2 as $idx => $lowres) {
		$original = str_replace('lowres/','',$lowres);
		//$originalWindows = str_replace('/var/www/html/','z:/',$original);
		//$lowresWindows = str_replace('/var/www/html/','z:/',$lowres);
		if (!file_exists($original)) {
			$cmd = 'rm "'.$lowres.'"';
			$f = fopen ($rootPath.'run.bat', 'a');
			fwrite ($f, $cmd."\r\n");
			fclose ($f);
		}
	}
	
}


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
			//var_dump ('n : '.$n); var_dump ($v);
			$a = ($p!='' ?$p.'_'.$n :$n);
			if (count($v)===0) {
				$html.='<li><a href="'.SA_SITE_WEB.'album/'.photoAlbum_urlEncode($a).'">'.$n.'</a></li>';
			} else {
				//$html.='<li><a href="'.SA_SITE_WEB.'album/'.photoAlbum_urlEncode($a).'">'.$n.'</a>';
				$html.='<li><a href="#">'.$n.'</a>';
				$html.="\n<ul>\n\t";
				$html.= photoAlbum_html_menu_recurse ($v, $a);
				$html.='</ul>'."\n";
			}
		}
	}
	return $html;
}

function photoAlbum_html_viewAlbum ($album, $topLeftImageIndexInAlbumsContents) {
	global $photoAlbums_globals;
	global $cms;

	$rootURL = $photoAlbums_globals['urlAlbums'];
	$w = $photoAlbums_globals['lowres']['width'];
	$h = $photoAlbums_globals['lowres']['height'];
	$prevPageTopLeftAlbumsContentsIndex = ($topLeftImageIndexInAlbumsContents-100);
	$nextPageTopLeftAlbumsContentsIndex = ($topLeftImageIndexInAlbumsContents+100);
	
	global $cms;
	global $cmsSettings;
	$db = new saTreeDB($cmsSettings['photoAlbum']);

	$ac = $db->db['photoAlbum']['albumsContents'][$album];
	
	if ($prevPageTopLeftAlbumsContentsIndex<0) $prevPageTopLeftAlbumsContentsIndex = 0;
	if ($nextPageTopLeftAlbumsContentsIndex>count($ac)) $nextPageTopLeftAlbumsContentsIndex = null;
	
	
	$albumRelativePath = photoAlbum_urlDecode ($album);
?>
	<div id="saCrawlerAppMap_content__mediaAlbum" class="crawlerAppMap_content__mediaAlbumView" saNumThumbnailsToFullMediaViews="100">
	<?php
		if ($prevPageTopLeftAlbumsContentsIndex!==0) {
	?>
	<a id="saCrawlerAppMap_content__previousPage" class="crawlerAppMap_pagination__previousPage" href="<?php echo SA_SITE_WEB?>album/<?php echo $album?>--<?php echo ($topLeftImageIndexInAlbumsContents-100)?>" style="display:none;">Next Page</a>
	<?php } ?>
	<?php
		if (!is_null($nextPageTopLeftAlbumsContentsIndex)) {
	?>	
	<a id="saCrawlerAppMap_content__nextPage" class="crawlerAppMap_pagination__nextPage" href="<?php echo SA_SITE_WEB?>album/<?php echo $album?>--<?php echo ($topLeftImageIndexInAlbumsContents+100)?>" style="display:none;">Next Page</a>
	<?php } ?>
	<?php
		photoAlbum_html_albumPhotoList ($db, $album, $topLeftImageIndexInAlbumsContents, 100, $w, $h);		
	?>
	</div>
	<div id="saPhotoAlbum_outer" style="position:absolute;">
	</div>
	<script type="text/javascript">
		//function startApp() {
			//na.vcc.init (document.getElementById('scrollpane_content'));
			
		function resizeApp () { 
			na.photoAlbum.resize();
		}	
			
			
			var app = {
				resize : function () { // called by na.desktop.morphTo_animationOfElementDone()
					//debugger;
					if (app.photoAlbumSettings) resizeApp();
				}
			};


			na.m.waitForCondition ('db load',
				function () {
					//var r = typeof na.s.c.settings.db == 'object';
					var r = (
						typeof na.db.photoAlbum == 'object'
						&& na.m.settings.initialized.site 
						&& !na.desktop.settings.animating
					);
					return r;
				},
				function () {
					var photoAlbumSettings = {
						div : 'saPhotoAlbum_outer',
						album : '<?php echo $albumRelativePath;?>',
						topLeftImageIndexInAlbumsContents : <?php echo $topLeftImageIndexInAlbumsContents;?>,
						rootURL : '<?php echo $rootURL?>',
						db : na.db.photoAlbum, //na.s.c.settings.db.nicer.app.ui.photoAlbum --OBSOLETED_Dont_want_to_load_1.5MB_right_at_startup_do_we--,
						lowres : {
							width : <?php echo $w?>,
							height : <?php echo $h?>
						},
						transformLinks : na.s.c.transformLinks
					};
					app.photoAlbumSettings = photoAlbumSettings;
					
					na.vividControls.setOptions('pageMenu',{ level_0 : { orientation : 'horizontal', animspeed : 400 } });
					
					jQuery('#siteContent, #saPhotoAlbum_outer').css ({
						width : '100%',
						height : '100%'
					});
					setTimeout (function() {
						na.photoAlbum.init (photoAlbumSettings);
						setTimeout(resizeApp, 1000);
					}, 1000);
				},
				10
			)



		//};
	</script>
<?php	
}

function photoAlbum_html_albumPhotoList ($db, $album, $topLeftImageIndexInAlbumsContents, $howManyPhotosToShow, $w, $h) {
	
	//var_dump ($album); var_dump ($db); die();
	$ac = $db->db['photoAlbum']['albumsContents'][$album];
	//var_dump ($ac); 
	
	echo "\n\r";
	for ($i = (($topLeftImageIndexInAlbumsContents)); $i < ($topLeftImageIndexInAlbumsContents + $howManyPhotosToShow); $i++) {
		$rootPath = SA_SITE_WEB.'siteData/nicerapp/com/ui/photoAlbum/albums/';
		$photoPath = $rootPath.$ac[$i];
		//var_dump ($i);var_dump ($ac[$i]);die();
		$rPos = strrpos ($photoPath, '/');
		$thumbPath = substr($photoPath, 0, $rPos+1).'lowres/'.substr($photoPath, $rPos+1);
		$href = SA_SITE_WEB . 'photo/' . $ac[$i] . '--' . $i;
		//var_dump ($thumbPath);
		
		echo 
			"\t\t".'<a class="saMediaFullViewLink" href="'.$href.'" crawlerHint="SKIP_CRAWLING_INTO_THIS">'
			.'<img id="saLinkForCrawlers__mediaThumbnail" class="crawlerAppMap_content__mediaThumbnail" mediaAllocatedMaxWidth="'.$w.'" mediaAllocatedMaxHeight="'.$h.'" src="'.$thumbPath.'" style="display:none;">'
			.'<img id="saLinkForCrawlers__mediaFullRes" class="crawlerAppMap_content__mediaThumbnail"  src="'.$photoPath.'" style="display:none;">'
			.'</a>'."\n\r";
		
	}
}

function photoAlbum_html_viewImage ($image, $imageIndexInAlbumsContents) {
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

	<div id="saPhoto_outer" style="position:absolute;" about="the actual highest-resolution media file - not allowed to be rehosted elsewhere using the same filename. all copyrights to the media remain with the original creator of the media. my media files were found via google image search, but i spent significant numbers of hours renaming them to descriptive filenames, so i claim copyrights to the filenames but not for most of the media content itself, only the photos that i actually shot myself, and whether i shot a photo myself is not listed in my database at this time.">
		<img id="saLinkForCrawlers__mediaFullRes" class="crawlerAppMap_content__mediaFullRes" src__dont_load_at_this_stage_of_page_lifetime="<?php echo $rootURL.$imageRelativePath?>"/>
	</div>
	<img id="saPhotoAlbum_photo" style="position:relative;display:none;width:auto;height:auto;text-align:center;vertical-align:middle;"/>
	<a id="btnUp" href="#"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnUp.png" style="position:absolute;top:5px;left:49%;width:40px;"/></a>
	<a id="btnPrevious" href="#" style="position:absolute;top:50%;left:5px;z-index:10000;width:40px;"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnPrevious.png" style="width:40px;"/></a>
	<a id="btnNext" href="#" style="position:absolute;top:50%;right:5px;z-index:10000;width:40px;"><img src="<?php echo SA_SITE_WEB?>nicerapp/com/ui/photoAlbum/btnNext.png" style="width:40px;"/></a>
	<script type="text/javascript">
		//function startApp() {
//			na.vcc.init (document.body);
			var app = {
				resize : function () { // called by na.desktop.morphTo_animationOfElementDone()
					//debugger;
					if (app.photoSettings) resizeApp(app.photoSettings);
				}
			};
			
			/*jQuery(window).resize (function () {
				if (app.photoSettings) resizeApp(app.photoSettings);
			});*/

			na.m.waitForCondition ('db load',
				function () {
					/*var r = (
						typeof window.parent.window.na.s.c.settings.db == 'object'
					);*/
					var r = (
						typeof na.db.photoAlbum == 'object'
						&& na.m.settings.initialized.site 
						&& !na.desktop.settings.animating
						&& na.db.photoAlbum
					);
					return r;
				},
				function () {
					var
					photoSettings = {
						div : 'saPhoto_outer',
						image : '<?php echo $imageRelativePath;?>',
						imageIndexInAlbumsContents : <?php echo $imageIndexInAlbumsContents?>,
						rootURL : '<?php echo $rootURL?>',
						db : na.db.photoAlbum, //window.parent.window.na.s.c.settings.db.nicer.app.ui.photoAlbum,
						lowres : {
							width : <?php echo $w?>,
							height : <?php echo $h?>
						},
						transformLinks : window.parent.window.na.s.c.transformLinks
					};
					app.photoSettings = photoSettings;
					//debugger;
					na.photoAlbum.init (photoSettings);
					na.photoAlbum.setImageButtonLinks (photoSettings);
					resizeApp(photoSettings);
				},
				200
			)
		function resizeApp (photoSettings) { 
			jQuery('#siteContent').css ({
				width : '100%',
				height : '100%'
			});
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
