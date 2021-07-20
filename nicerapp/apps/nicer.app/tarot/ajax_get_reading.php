<?php
require_once(dirname(__FILE__).'/../../appLogic/seo_tarot.php');
require_once(dirname(__FILE__).'/../../appLogic/functions.php');

require_once ('functions.php');
define ('PROJECT_DIR', t2_getSiteRootURL());
require_once (dirname(__FILE__).'/nicerapp/boot.php');
header ('Access-Control-Allow-Origin: http://nicer.app');

$explanationID = 'blessedtarot';
$readingType = t2_get_readingType();
$reading = t2_draw_cards($readingType, $explanationID);
$reading = t2_calculate_size_for_cards ($reading); 

$r = array (
	'deck' => t2_html_deck_info(),
	'reading' => $reading,
	'html_cards' => 
		'<div id="cards" style="position:relative; float:right; height:'.$reading['theme']['size']['y'].'px; width:'.$reading['theme']['size']['x'].'px;">' . "\n\r"
		. t2_html_draw_cards($reading) . "\n\r"
		. '</div>'
);

echo json_encode($r);
?>
