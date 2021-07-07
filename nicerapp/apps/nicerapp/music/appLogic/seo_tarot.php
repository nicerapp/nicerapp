<?php
$url = $_SERVER['REQUEST_URI'];
//var_dump ($url);
$deckp1 = strpos($url, 'deck/');
if ($deckp1===false) $deckp1=strpos($url, 'deck=');
if ($deckp1===false) {

} else {
    $deckp2 = strpos($url, '/', $deckp1+strlen('deck/'));
    if ($deckp2===false) $deckp2=strpos($url,'&');
    $deck = substr($url, $deckp1+strlen('deck/'), $deckp2-$deckp1-strlen('deck/'));
    $readingp1 = strpos($url, 'reading/');
    if ($readingp1===false) $readingp1=strpos($url,'reading=');
    $readingp2 = strpos($url, '/', $readingp1+strlen('reading/'));
    if ($readingp2===false) $readingp2=strlen($url);
    $reading = substr($url, $readingp1+strlen('reading/'), $readingp2-$readingp1-strlen('reading/'));
    $_GET['deck'] = $deck;
    $_GET['reading'] = $reading;
    //var_dump ($_GET); die();
}


function t2_getKeywords ($url) {
	$urlData = t2_getKeywordsURLdata();
	if (array_key_exists($url, $urlData)) {
		return $urlData[$url];
	} else {
		$k = t2_getNewKeywords();
		$urlData[$url] = $k;
		t2_getKeywordsURLdataWrite($urlData);
		return $k;
	}
}

function t2_getKeywordsURLdataWrite($urlData) {
	$fp = dirname(__FILE__).'/keywords.urls.json';
	file_put_contents ($fp, json_encode($urlData));
}

function t2_getKeywordsURLdata () {
	$r = array();
	$fp = dirname(__FILE__).'/keywords.urls.json';
	if (file_exists($fp)) {
		$er = error_reporting(0);
		$r = json_decode (file_get_contents($fp), true);
		error_reporting($er);
	}
	return $r;
}

function t2_getNewKeywords () {
	$keywords = array (
		'always' => array ('tarot', 'tarot reading', 'free tarot reading', 'tarot decks', 'free', 'game', 'play', 'gratis tarot'),
		'random' => array('tarot daycard', 'tarot dagkaart', 'gratis online tarot', 'kaartleggen', 'tarot game', 'tarot spread', 'tarot cards', 'tarot deck', 'tarot dagkaart trekken', 'dagkaart tarot', 'gratis tarot', 'amusement', 'entertainment', 'pastime', 'passtime', 'examination', 'inspection', 'fun', 'distraction', 'free game', 'free games', 'free web game' ,'free web games', 'explanation', 'tarot explanation', 'tarot spread', 'tarot spreads', 'spread', 'spreads', 'tarot course', 'past', 'present', 'future', 'predict future', 'divination', 'love', 'love tarot', 'answers', 'tarot course', 'card', 'draw card', 'draw cards', 'draw tarot card', 'draw tarot cards', 'horoscope', 'online tarot', 'online free tarot', 'free online tarot', 'tarot card meaning', 'tarot card meanings', 'psychic', 'psychics', 'meditation', 'meditations', 'partner reading', 'love reading', 'cartomancy', 'runes', 'truth', 'truth-telling', 'truth telling', 'learning tarot', 'learn tarot', 'answers', 'life questions', 'questions')
	);
	$result = join (', ', $keywords['always']);
	$numKeywords = rand (18,20);
	$numRandomKeywords = $numKeywords - count($keywords['always']);
	$randomKeywordsAdded = array();
	for ($i=0; $i<=$numRandomKeywords; $i++) {
		$randomKeyword = rand (0, count($keywords['random'])-1);
		if (count($randomKeywordsAdded) >= count($keywords['random'])) break;
		while (array_search($keywords['random'][$randomKeyword], $randomKeywordsAdded)!==false) $randomKeyword = rand (0, count($keywords['random'])-1);
		$result .= ', '.$keywords['random'][$randomKeyword];
		$randomKeywordsAdded[] = $keywords['random'][$randomKeyword];
	}
	return $result;
}

?>