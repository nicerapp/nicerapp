<?php
require_once(dirname(__FILE__).'/seo_tarot.php');
require_once(dirname(__FILE__).'/functions2.php');

global $frameworkSecretFolder;
//require_once($frameworkSecretFolder.'/sitewide/lib_fileSystem.php');
//echo ($frameworkSecretFolder.'/sitewide/lib_fileSystem.php'); die();

function t2_init() {
	$url = $_SERVER['REQUEST_URI'];
	$deck = 'Original-Rider-Waite';
	$readingName = '3-Cards';
	$_GET['deck'] = $deck;
	$_GET['reading'] = $readingName;
	$explanationID = 'blessedtarot';
	$readingType = t2_get_readingType();
	//var_dump ($readingType); die();
	$reading = t2_draw_cards($readingType, $explanationID);
	//echo '<pre>';var_dump ($reading); die();
	$reading = t2_calculate_size_for_cards ($reading); 
	$numberOfDecks = t2_getNumberOfDecks();
	$numberOfReadings = t2_getNumberOfReadings();

	global $numberOfReadings;
	global $numberOfDecks;
	global $reading;
	global $readingType;
	global $explanationID;
}

function t2_getGameRootURL() {
	return "/tarot(deck'Original-Rider-Waite'reading'3-Cards')";
};

function t2_getGameURL() {
	$_GET['reading']='3-Cards';
	return "/tarot";
};


function t2_getSiteRootURL() {
	/*
	if (defined('SA_SITE_WEB')) {
		return SA_SITE_WEB;
	} else {
		if (array_key_exists("REAL_DOCUMENT_ROOT",$_SERVER)) 
			return ''; 
		else 
			return '/cardgame_tarot/';
	}
	*/
	return '/apps/nicerapp/cardgame_tarot/appContent/tarotSite/';
}

function t2_getDecksRootURL() {
	//return '/apps/nicerapp/cardgame_tarot/appContent/tarotSite/';
	return '/nicerapp/apps/nicerapp/tarot/';
}

function t2_getDecksFromFilesystem() {
	$p = getFilePathList (dirname(__FILE__).'/decks', TRUE, '/^back.*/', array('file'));
	//reportVariable('$p', $p); die();
	$r = array();
	$r1 = array();
	foreach ($p as $idx => $path) {
		//$path = str_replace('C:\data1\htdocs\localhost\nicerapp\apps\nicerapp\cardgame_tarot\appContent\tarotSite\decks\\', '', $path);
		$p[$idx] = $path;
		$path = str_replace('/back.jpg','',$path);
		$path = str_replace('/back.png','',$path);
		//var_dump($path);die();
		$path = str_replace('/home/rene/data1/htdocs/nicer.app/nicerapp/apps/nicerapp/tarot/decks/', '', $path);
		
		$pp = explode('\\', $path);
		//var_dump ($idx);var_dump ($pp); 
		$picName = $pp[count($pp)-1];
	
		if (array_key_exists(0,$pp)) {
			$name0 = $pp[0];
			$r[$name0] = array();
		}
		if (array_key_exists(1,$pp)) {
			$name1 = $pp[1];
			$r[$name0][$name1] = array();
		}
		if (array_key_exists(2,$pp)) {
			$name2 = $pp[2];
			$r[$name0][$name1][$name2] = array();
		}
		if (array_key_exists(3,$pp)) {
			$name3 = $pp[3];
			$r[$name0][$name1][$name2][$name3] = array();
		}
		if (array_key_exists(4,$pp)) {
			$name4 = $pp[4];
			$r[$name0][$name1][$name2][$name3][$name4] = array();
		}
		if (array_key_exists(5,$pp)) {
			$name5 = $pp[5];
			$r[$name0][$name1][$name2][$name3][$name4][$name5] = array();
		}
		
		$r1 = negotiateOptions ($r1, $r);
	}
	//reportVariable('$r1', $r1); die();
	return $r1;
}


global $decks;
$decks = null;

function t2_getDecks() {
	global $decks;
	if (false) {
	// re-scan the filesystem for any new decks;
		if (is_null($decks)) {
			$decks = t2_getDecksFromFilesystem();
			file_put_contents (dirname(__FILE__).'/tarot_decks.json', json_encode($decks)); // and cache as JSON data
		}
	} else {
	// use cached decks FAT;
		if (is_null($decks)) $decks = json_decode(file_get_contents(dirname(__FILE__).'/tarot_decks.json'), true);
	}
	
	//var_dump ($decks);die();
	
	return $decks;
}

function t2_getNumberOfDecks() {
	$decks = t2_getDecks();
	return t2_getNumberOfDecks_recurse($decks);
}

function t2_getNumberOfDecks_recurse ($d) {
	$r = 0;
	if (is_array($d) && count($d)>0) {
		foreach ($d as $n => $v) {
			if (!is_array($v)) {
				$r++;
			} else {
				$r += t2_getNumberOfDecks_recurse($v);
			}
		}
	}
	return $r;
}

function t2_html_deck_info () {
	$cd = t2_getCurrentDeck();
	
	$xmlFile = dirname(__FILE__).'/../../..'.'/apps/nicerapp/tarot/decks/'.$cd.'/packinfo.xml';
	if (file_exists($xmlFile)) {
		$xml = file_get_contents($xmlFile);
		//var_dump ($xmlFile);
	
		$name = t2_html_deck_info_preg ('/\<PackName\>(.*)\<\/PackName\>/', $xml, 'Could not find deck name..');
		$description = t2_html_deck_info_preg ('/\<Description\>(.*)\<\/Description\>/', $xml, 'Could not find a deck description in this deck\'s xml file');
	
		$r = 
			'<table>'
			.'<tr><td>'
			.'<h2>Deck : ' . $name . '</h2>'
			.'<p>' . $description . '</p>'
			.'</td><td style="vertical-align:bottom">';
		if (file_exists(dirname(__FILE__).'/../../..'.'/apps/nicerapp/cardgame_tarot/appContent/tarotSite/decks/'.$cd.'/box.jpg')) $r .= t2_html_deck_box('box.jpg',$cd);
		if (file_exists(dirname(__FILE__).'/../../..'.'/apps/nicerapp/cardgame_tarot/appContent/tarotSite/decks/'.$cd.'/box1.jpg')) $r .= t2_html_deck_box('box1.jpg',$cd);
		if (file_exists(dirname(__FILE__).'/../../..'.'/apps/nicerapp/cardgame_tarot/appContent/tarotSite/decks/'.$cd.'/box2.jpg')) $r .= t2_html_deck_box('box2.jpg',$cd);
		$r .= '</td></tr></table>';
	} else {
		$r = 'No Deck info available.';
	}
	
	return $r;
}

function t2_html_deck_box ($boxFilename,$deck) {
	return '<a href="'.t2_getSiteRootURL().'/decks/'.$deck.'/'.$boxFilename.'" rel="prettyPhoto" title="'.$boxFilename.'"><img style="width:60px;" src="'.t2_getSiteRootURL().'/decks/'.$deck.'/'.$boxFilename.'"/></a>';
}

function t2_html_deck_info_preg ($pattern, $subject, $default) {
	$r = $default;
	$matches = array();
	preg_match_all ($pattern, $subject, $matches);
	if (
		array_key_exists(1,$matches)
		&& array_key_exists(0, $matches[1])
	) $r = $matches[1][0];
	return $r;
}

function t2_html_menu_decks() {
	
	$decks = t2_getDecks();
	
	$html = t2_html_menu_decks_recurse ($decks);	
	
	return $html;
}	

function t2_html_menu_decks_recurse ($d) {
	$html='';

	if (is_array($d) && count($d)>0) {
		foreach ($d as $n => $v) {
			if (is_array($v) && count($v)===0) {
                $appSettings = array (
                    'deck' => appURLencode($n),
                    'reading' => $_GET['reading']
                );
                $hrefJSON = '{"tarot":'.json_encode($appSettings,true).'}';
                $href = '/apps/'.base64_encode_url($hrefJSON);
                $n = str_replace ('(','',$n);
                $n = str_replace (')','',$n);
				$html.='<li><a class="appMenu selectDeck" href="'.$href.'">'.$n.'</a></li>';
				//$html.='<li><a class="appMenu selectDeck" href="'.t2_getGameRootURL().'(deck\''.appURLencode($n).'\'reading\''.$_GET['reading'].'/">'.$n.'</a></li>';
			} else if (is_array($v)) {
				$html.='<li><a class="appMenu noPushState" href="javascript:return false;">'.$n.'</a>';
				$html.="\n<ul>\n\t";
				$html.=t2_html_menu_decks_recurse($v);
				$html.='</ul>'."\n";
			}
		}
	}
	return $html;
}

function t2_getNumberOfReadings () {
	$readings = getFilePathList(dirname(__FILE__),false,'/^tarot_reading_.*\.json$/',array('file'));
	return count($readings);
}

function t2_html_menu_readings() {
	$html = '';
	$readings = getFilePathList(dirname(__FILE__),false,'/^tarot_reading_.*\.json$/',array('file'));
	asort($readings);
	foreach ($readings as $idx=>$readingJSONfilepath) {
		$r = str_replace(dirname(__FILE__).'/tarot_reading_','',$readingJSONfilepath);
		$r = str_replace('.json','',$r);
                $appSettings = array (
                    'deck' => appURLencode(appURLdecode($_GET['deck'])),
                    'reading' => appURLencode($r)
                );
                $hrefJSON = '{"tarot":'.json_encode($appSettings,true).'}';
                $href = '/apps/'.base64_encode_url($hrefJSON);
		$html .= '<li><a class="appMenu selectReading" href="'.$href.'">'.$r.'</a></li>'."\n";
	}
	return $html;
}

function t2_draw_cards ($readingID, $explanationID) {
	$file = dirname(__FILE__).'/tarot_reading_'.$readingID.'.json';
	$reading = json_decode(file_get_contents($file),true);
	if (is_null($reading)) trigger_error ('Could not decode '.$file,E_USER_ERROR);

	$deck = t2_getCurrentDeck();
	
	$ciFile = dirname(__FILE__).'/tarot_card_index.json';
	if (!file_exists($ciFile)) $ciFile = 'tarot_card_index.json';
	$cardIndex = json_decode(file_get_contents($ciFile), true);
	if (is_null($cardIndex)) trigger_error ('Could not decode '.$ciFile, E_USER_ERROR);

	foreach ($reading['cards'] as $cardNo => $card) {
		if (
			stripos($deck,'majors')!==false 
			|| (
				array_key_exists('majors',$_GET)
				&& $_GET['majors']=='majors'
			)
		) $upperLimit=21; else $upperLimit=77;
		
		$cn = false;
		while ($cn===false || t2_haveCardInReading($reading, $cn)) {
			$cn = rand(0,$upperLimit);
		}
		$reading['cards'][$cardNo]['drawnCardNumber'] = $cn;
		$reversed = $reading['cards'][$cardNo]['reversed'] = (rand(0,1)==0?false:true);
		
		global $explanationID;
		$explanationID = 'blessedtarot';
		
		$file = dirname(__FILE__).'/explanations/'.$explanationID.'/'.$cardIndex[$cn]['explanation'].'.html';
		var_dump ($file); die();
		if (!file_exists($file)) $file = dirname(__FILE__).'/explanations/'.$explanationID.'/'.$cardIndex[$cn]['explanation'].'.html';
		$e = file_get_contents($file);
		$reading['cards'][$cardNo]['explanation'] = $e;
		
		$reading['cards'][$cardNo]['cardName'] = $cardIndex[$cn]['cardName'];
	}
	return $reading;
}

function t2_haveCardInReading ($reading, $cn) {
	foreach ($reading['cards'] as $cardNo => $cardRec) {
		if (array_key_exists('drawnCardNumber', $cardRec) && $cn===$cardRec['drawnCardNumber']) return true;
	}
	return false;
}

function t2_getBadDecks () {
	$deck = appURLdecode($_GET['deck']);
	$decks = t2_getDecks();

	t2_getBadDecks_recurse($decks, '');
}

function t2_getBadDecks_recurse ($d, $cd) {
	$found = false;
	if (is_array($d) && count($d)>0) {
		foreach ($d as $n => $v) {
			if (!is_array($v)) {
				//var_dump (array('$n'=>$n,'$wantedDeck'=>$wantedDeck,'result'=>($n==$wantedDeck)));
				if (strpos($n,'-')!==false) {
					echo $cd.'/'.$n."<br/>\r\n";
				}
			} else {
				$res = t2_getBadDecks_recurse ($v, $cd.'/'.$n);
			}
		}
	}
}


function t2_getCurrentDeck () {
	//echo '<pre>'; var_dump ($_GET); echo '</pre>'; die();
	global $locationBarInfo;
	//echo '<pre>'; //var_dump ($_SERVER);
	$locationBarInfo = getLocationbarInfo($_SERVER['QUERY_STRING']);
	//reportVariable ('t2_getCurrentDeck - $locationBarInfo', $locationBarInfo); die();
	//var_dump ($locationBarInfo);
	
	
	//deck = appURLdecode($_GET['deck']);
	$deck = appURLdecode($locationBarInfo['apps']['tarot']['deck']);
	//var_dump ($deck); 
	$decks = t2_getDecks();
	//echo '<pre>';var_dump ($decks); 

	$cda = t2_getCurrentDeck_recurse($decks, $deck, '');
	//var_dump ($cda); die();
	
	global $t2Folder; //var_dump ($t2Folder);
	//badResult (E_USER_WARNING, array ('$deck'=>$deck, '$decks'=>$decks,'$cd'=>$cd));
	
	//$cd = substr($cd['result'], 1);
	//var_dump ($cd); die();
	return $t2Folder; // 'Waite-Smith/Pam Colman Smith/Original Rider Waite Tarot';
}



function t2_getCurrentDeck_recurse ($d, $wantedDeck, $cd, $level=0) {
	$found = false;
	$res = array();
	//var_dump ($d); die();
	
	if (is_array($d) && count($d)>0) {
		foreach ($d as $n => $v) {
			if ($level = 0) $cd='';

			if (is_array($v) ) {
				//var_dump (array('$n'=>$n,'$wantedDeck'=>appURLdecode($wantedDeck),'result'=>($n==appURLdecode($wantedDeck))));
				if (
					$n==appURLdecode($wantedDeck)
				) {
					$found = true;
				}
				
				
				if ($found) {
					
					$r = array(
						'found' => $found,
						'result' => $cd.'/'.$wantedDeck				
					);
					global $t2Folder;
					$t2Folder = $cd.'/'.$wantedDeck;
					
					//var_dump ($r);
					return $r;
					
				} else {
					$res = t2_getCurrentDeck_recurse ($d[$n], $wantedDeck, $cd.'/'.$n, $level+1);
				}

		
			} else {

			}
		}
		$level--;

	}
}

function t2_html_draw_cards ($reading) {
	$html = '';
	$deck = t2_getCurrentDeck();
	foreach ($reading['cards'] as $cardNo => $card) {
		$html .= '<div id="card__'.$cardNo.'" class="quickflip card" style="position:absolute; z-index:999;right:'.$card['right'].'px; top:'.$card['top'].'px;width:'.$reading['theme']['cardWidth'].'px;height:'.$reading['theme']['cardHeight'].'px;text-align:center;">';
		//$html .= '	<div class="quickflip-front" style="width:100%;height:100%">';
		$html .= '		<img idx="'.$cardNo.'" style="top:15px; width:100%;height:100%;" id="backOfCard__'.$cardNo.'" class="backOfCard" src="'.t2_getDecksRootURL().'/decks/'.$deck.'/back.jpg"/>';
		//$html .= '	</div>';
		//$html .= '	<div class="quickflip-back" style="width:100%;height:100%">';
		//$html .= '		<!--<a href="'.t2_getDecksRootURL().'decks/'.$deck.'/'.($card['drawnCardNumber']<10?'0':'').$card['drawnCardNumber'].'.jpg" rel="saZoomPhoto" title="'.$card['cardName'].'">-->';
		$html .= '		<img id="frontOfCard__'.$cardNo.'" class="frontOfCard" idx="'.$cardNo.'" style="display:none;width:100%;height:100%;" src="'.t2_getDecksRootURL().'/decks/'.$deck.'/'.($card['reversed']?'r':'').($card['drawnCardNumber']<10?'0':'').$card['drawnCardNumber'].'.jpg"/>';
		//$html .= ' 		<!--</a>-->';
		//$html .= '		<div style="width:'.$reading['theme']['cardWidth'].'px;text-align:center;"><a href="javascript:ts.displayCardExplanation('.$cardNo.');">explanation</a></div>';
		//$html .= '	</div>';
		$html .= '</div>'."\n";
	}
	return $html;
}

function t2_make_goodFilenames () {
	$files = getFilePathList (dirname(__FILE__).'/decks/', true, '/back.*/i', array('file'));
	//var_dump ($files);
	foreach ($files as $idx => $fp) {
		$pi = pathinfo($fp);
		$filename = $pi['basename'];
		
		$execStr = 'cmd /c ren "'.$fp.'" "'.$pi['dirname'].'/back.jpg"';
		exec ($execStr, $output, $return);
		var_dump ($execStr);
		var_dump ($output);
		var_dump ($return);
	}
}

function t2_make_strangeFilesList () {
	$files = getFilePathList (getcwd().'/decks/', true, '/^\d\d\.jpg$/', array('file'));
	$notStrange = array (
		'/^\d\d.jpg$/',
		'/^r\d\d.jpg$/',
		'/^back.jpg$/',
		'/^CardData.xml$/',
		'/^packinfo.xml$/'
	);
	$r = '';
	foreach ($files as $idx => $fp) {
		$pi  = pathinfo($fp);
		$strange = true;
		foreach ($notStrange as $idx=>$ns) {
			if (preg_match($ns, $pi['basename'])) $strange=false;
		}
		if ($strange) $r.=$fp."\r\n";
	}
	file_put_contents('strange.lst', $r);
}

function t2_make_reverseCards () {
	$decks = t2_getDecks();
	$files = getFilePathList (getcwd().'/decks/Postmodern/', true, '/^\d\d\.jpg$/', array('file'));
	$execStr = '';	
	foreach ($files as $idx => $filepath) {
		$pi = pathinfo($filepath);
		$filename = $pi['basename'];
		
		$execStr .= 'convert "'.$filepath.'" -rotate 180 "'.$pi['dirname'].'/r'.$filename.'"'."\r\n";
	}
	file_put_contents ('img-convert.bat', $execStr);
}

function t2_html_explanation ($reading) {
	return '';
}

function t2_calculate_size_for_cards ($reading) {
	$top = 0; 
	$left = 0;
	foreach ($reading['cards'] as $idx => $card) {
		if ($card['top']>$top) $top = $card['top'];
		if ($card['left']>$left) $left = $card['left'];
	}
	$x = $left + $reading['theme']['cardWidth'] + 10;
	$y = $top + $reading['theme']['cardHeight'] + 10;
	$reading['theme']['size'] = array (
		'x' => $x,
		'y' => $y
	);
	return $reading;
}

function t2_get_readingType($appParams) {
	$readingType = appURLdecode($appParams['apps']['tarot']['reading']);
	if (!t2_valid_readingType($readingType)) {
		$readingType = '3 Cards';
	}
	return $readingType;
}

function t2_valid_readingType($readingType) {
//echo 'BUG_content_001 : defined functions =<pre>'; var_dump (get_defined_functions()); echo '</pre>'; 


	$rt = getFilePathList (dirname(__FILE__), false, '/tarot_reading_.*\.json/', array('file'));
	//var_dump ($rt); 
	$valid = false;
	foreach ($rt as $idx => $ret) {
		$reat = str_replace(dirname(__FILE__).'/tarot_reading_', '', $ret);
		$reat = str_replace('.json', '', $reat);
		if ($reat == $readingType) {
			$valid = true;
			break;
		}
	}
	return $valid;
}
?>
