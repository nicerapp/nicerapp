<?php
error_reporting (E_ALL);
require_once (dirname(__FILE__).'/functions.php');

	$url = $_SERVER['REQUEST_URI'];
	$deckp1 = strpos($url, 'deck/');
	$deckp2 = strpos($url, '/', $deckp1+strlen('deck/'));
	$deck = substr($url, $deckp1+strlen('deck/'), $deckp2-$deckp1-strlen('deck/'));
	$readingp1 = strpos($url, 'reading/');
	$readingp2 = strpos($url, '/', $readingp1+strlen('reading/'));
	$readingName = substr($url, $readingp1+strlen('reading/'), $readingp2-$readingp1-strlen('reading/'));
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

//	<!--<meta name="keywords" content="tarot, free, free tarot, free tarot reading, psychic, play, anation, consult, future, prediction, tarot consult, tarot reading, tarot game, tarot deck, tarot decks, tarot set, game, cards, card game, angel card">-->

?>
	<link type="text/css" rel="StyleSheet" media="screen" href="http://nicer.app/apps/cardgame_tarot/appContent/tarotSite/index.css">
	<script type="text/javascript" src="http://nicer.app/apps/cardgame_tarot/appContent/tarotSite/siteCode.source.js"></script>
	<script type="text/javascript">
		ts.globals.rootURL = 'http://nicer.app/';
		ts.globals.request_uri = '<?php echo $_SERVER['REQUEST_URI']?>';
		ts.globals.url = '<?php echo str_replace('content/cardgame_tarot/','', $_SERVER['REQUEST_URI'])?>';
		ts.current.reading = <?php echo json_encode($reading); ?>
	</script>
	<script type="text/javascript">
		ts.current.reading = <?php echo json_encode($reading); ?>
	</script>
	<div id="saZoomCard" style="display:none;z-index:10000000;text-align:center;"></div>
	
	<div id="saAppMenu__cardgame_tarot" class="vividMenu vividTheme__menu_006 saAppMenu saAppMenu_defaultDiv__siteContent" style="position:absolute; visibility:hidden; left:-420px; top:10px; width:400px; height:37px; z-index:990000">
		<ul style="display:none">
			<li><a class="appMenu menu__dontKeepSelected" href="#">Tarot Decks</a>
				<ul>
				<?php echo t2_html_menu_decks(); ?>
				</ul>
			</li>
			<li><a class="appMenu menu__dontKeepSelected" href="#">Readings</a>
				<ul>
					<?php echo t2_html_menu_readings(); ?>
				</ul>
			</li>
			<li><a class="appMenu" href="#">Misc</a>
				<ul>
					<li><a class="appMenu" href="javascript:tarotSite.setOptions('majors',true);">Major cards only</a></li>
					<li><a class="appMenu" href="javascript:tarotSite.setOptions('majors',false);">All cards</a></li>
					<li><a class="appMenu" href="javascript:ts.getNewReading();">New Reading</a></li>
				</ul>
			</li>
		</ul>
	</div>
	
	<div id="appGame" style="width:100%;height:100%;overflow:hidden;">
		<?php //getBadDecks(); ?>
		<div id="card" style="position:relative;float:right;display:none;"></div>
		<div id="cards" style="position:relative; float:right; height:<?php echo $reading['theme']['size']['y']?>px;width:<?php echo $reading['theme']['size']['x']?>px;">
			<?php echo t2_html_draw_cards($reading); ?>
		</div>
		<div id="intro" class="text" style="">
			<h1>Free Tarot Reading</h1>
			
			<p>
			Welcome to this completely free tarot web game :-)<br/>
			Here you can select any of <?php echo $numberOfDecks;?> different tarot decks  and <?php echo $numberOfReadings?> different types of readings, to play a game of tarot with.<br/>
			Use the menu at the top of this web game to select a different deck or reading type.
			</p>
			
			<p>
			If a card is upside down, that is the common notation for the opposite meaning of the card, also known as the "negative" or "reversed" meaning of the card.
			</p>
		</div>
		<div id="deckExplanation" class="text" style="display:none;">
			<?php echo t2_html_deck_info()?>
		</div>
		<div id="cardSpotInReadingTitle" class="text" style="display:none;"></div>
		<div id="cardSpotExplanation" class="text" style="display:none;">
		</div>
		<div id="cardExplanation" class="text" style="display:none;">
			<?php 
			foreach ($reading['cards'] as $idx => $card) {
				echo '<p>'.$card['readingSpotExplanation'].'</p>'."\n\r";
				echo $card['explanation'];
			}
			?>
		</div>
		<div id="readingExplanation" class="text" style="display:none;">
			<?php echo $reading['heading']; ?>
		</div>
	</div>
</body>
</html>
