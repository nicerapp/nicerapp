<?php
require_once (dirname(__FILE__).'/seo_tarot.php');
require_once (dirname(__FILE__).'/functions.php');

global $frameworkSecretFolder;
//require_once ($frameworkSecretFolder.'/sitewide/lib_fileSystem.php');

function getURLtranslationForLocationBarInfo__4app__tarot ($appName, $param) {
    $ret = array (
        'apps' => array (
            $appName => array (
                'deck' => $param[0],
                'reading' => $param[1]
            )
        )
    );
    return $ret;
}


function getDialogContent__4app__cardgame_tarot ($p) {
	//reportVariable ('$p', $p,true); die();
	$saAppParams = $p['saAppParams'];
	foreach ($saAppParams as $appName => $appParams) {
		if ($appName==='tarot-reading') {
			$relInstallPath = 'SA_SITE_HD/apps/nicerapp/cardgame_tarot/appContent/';
			$r = array (
				'url' => $relInstallPath.'index.content.php'
			);
			return $r;
		}
	}
}

/*
function getDialogContent__4app__cardgame_tarot__OLD ($p) {
	$u = explode('/', $p['url']);
	global $saDebug_urlResolver;
	
	//$saDebug_urlResolver = true;
	
	if ($saDebug_urlResolver) {
		echo '/apps/nicerapp/cardgame_tarot/appLogic/functions.php::getContentSettings_4app_tarot().1 - '; 
		var_dump ($u);
	}
	
	$relInstallPath = 'SA_SITE_HD/apps/nicerapp/cardgame_tarot/appContent/';
	
	//var_dump ($u); 
	
	if ($u[0]!=='tarot-reading') return false;
	$_GET['saApp']='tarot-reading';
	
	$r = array (
		'url' => $relInstallPath.'index.content.php'
	);

	global $saDebug_urlResolver;
	if ($saDebug_urlResolver) {
		echo '/apps/nicerapp/cardgame_tarot/appLogic/functions.php::getContentSettings_4app_tarot().1 - '; 
		var_dump ($r);
	}
	
	return $r;
}*/

/* DONE ALREADY FROM appContent/tarotSite/index.php
function getHead_4app_cardgame_tarot ($p) {
	$url = $_SERVER['REQUEST_URI'];
	$u = explode('/', $url);
	//var_dump ($u);die();
	if ($u[1]!=='tarot-reading') return false;
	
	$r = 
		'<link type="text/css" rel="StyleSheet" media="screen" href="http://nicer.app/apps/nicerapp/cardgame_tarot/appContent/tarotSite/index.css">'
		.'<script type="text/javascript" src="http://nicer.app/apps/nicerapp/cardgame_tarot/appContent/tarotSite/siteCode.source.js"></script>'
		.'<script type="text/javascript">'
		.'ts.globals.rootURL = "http://nicer.app/";'
		.'ts.globals.request_uri = "'.$_SERVER['REQUEST_URI'].'";'
		.'ts.globals.url = "'.str_replace("content/cardgame_tarot/","", $_SERVER["REQUEST_URI"]).'";'
		.'</script>';
	return $r;
};
*/


function getCacheDirs__4app__cardgame_tarot ($p) {
	$r = array (
		'SA_SITE_WEB/apps/cardgame_tarot/appData/treeDB/DBs' => '|.*|'
	);
	return $r;
}

function getMeta__4app__cardgame_tarot ($p) {
	$url = $_SERVER['REQUEST_URI'];
	$u = explode('/', $url);
	//var_dump ($u);die();
	if (substr($u[1],0,5)!=='tarot') return false;
	
	$r = array (
		'description' => 'Free tarot reading, choose from among 191 tarot decks and 9 types of readings.',
		'keywords' => t2_getKeywords($url)
	);
	//var_dump ($r); die();
	
	return $r;
}

function getTitle__4app__cardgame_tarot ($p) {
	//var_dump ($_GET);die();
	
	if (is_null($p)) {
		$p = array();
	}
	
	if (!array_key_exists($p, 'url') || $p['url']=='') {
		$urlComplete = $_GET['htaURL'];
		$url = str_replace ('tarot(','',$urlComplete);
		//$url = preg_replace (|\?.*|, '', $url);
		$p['url'] = $url;
	} else {
		$urlComplete = $p['url'];
	}
	//var_dump ($p);
	if ($_GET['saApp']==='tarot') {
		$p1 = split('reading\'',$p['url']);
		$deck = str_replace ('deck\'','',$p1[0]);
		$deck = str_replace ('\'', '', $deck);
		$reading = str_replace('\'', '', $p1[1]);
		$_GET['deck'] = $deck;
		$_GET['reading'] = $reading;
		
		if (!array_key_exists('deck',$_GET) || !is_string($_GET['deck'])) return false; else return 'Free Tarot Reading (191 decks, 9 reading types) (Deck: '.appURLdecode($_GET['deck']).', Reading: '.appURLdecode($_GET['reading']).')';
	}
}
function appURLencode ($str) {
	return str_replace(' ','-',$str);
}

function appURLdecode ($str) {
	$r = str_replace ('-',' ',$str);
	return str_replace ('\\\'', '\'', $r);
}


?>
