<?php
require_once (dirname(__FILE__).'/../../boot_stage_001.php');
global $saSiteHTTP; global $saSiteDomain; global $saSiteRootFolder; global $saFrameworkFolder;
global $saSiteHD; global $saFrameworkHD; global $saSiteURL; global $saFrameworkURL;
global $saIsLocalhost; global $saHTDOCShd;
global $saServerOperatingSystem; global $saDeveloperMode;
//var_dump ($_SESSION); //die();
if (array_key_exists('sa_js__screenWidth',$_SESSION)) {
/*
    if (
        $_SERVER['HTTP_USER_AGENT']=='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36' // iPhone X and iPhoneX Plus
        || 
        $_SERVER['HTTP_USER_AGENT']=='Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' // iPhone 8 and iPhone 8 Plus
        || 
        $_SERVER['HTTP_USER_AGENT']=='Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' // iPhone 7 and iPhone 7 Plus
    ) {
        $browserWidth = (float)$_SESSION['sa_js__screenWidth'];
        $browserHeight = (float)$_SESSION['sa_js__screenHeight'];
    } else {
        $browserWidth = (float)$_SESSION['sa_js__browserWidth'];
        $browserHeight = (float)$_SESSION['sa_js__browserHeight'];
    }
    $browserWidth -= 500; // #siteVideo menu
    
*/    
    
    $browserWidth = (float)$_SESSION['sa_js__menuSpace'];
    $menuItemWidth = (float)$_SESSION['sa_js__menuItemWidth'];
    $hasContentMenu = $_SESSION['sa_js__hasContentMenu']=='true'?true:false;
    $itemGap = 5;
    
    //var_dump ($browserWidth); die();
    $menuStructure = 'forWidestScreen';
    
    //var_dump ($browserWidth); var_dump ((6 * $menuItemWidth) + (6 * $itemGap));
    
    // reserve one menu-item in #siteMenu for the apps menu
    
    $multiplier = $hasContentMenu ? 6 : 5;
    if ($browserWidth < ($multiplier * $menuItemWidth) + ($multiplier * $itemGap) ) $menuStructure = 'forMax5itemsWide';
    
    $multiplier = $hasContentMenu ? 5 : 4;
    if ($browserWidth < ($multiplier * $menuItemWidth) + ($multiplier * $itemGap) ) $menuStructure = 'forMax4itemsWide';
    
    
    $multiplier = $hasContentMenu ? 4 : 3;
    if ($browserWidth < ($multiplier * $menuItemWidth) + ($multiplier * $itemGap) ) $menuStructure = 'forMax3itemsWide';
    
    
    $multiplier = $hasContentMenu ? 3 : 2;
    if ($browserWidth < ($multiplier * $menuItemWidth) + ($multiplier * $itemGap) ) $menuStructure = 'forMax2itemsWide';
} else {
    $menuStructure = 'forWidestScreen';
}
//var_dump ($menuStructure);
//var_dump ($_SERVER); var_dump ($_SESSION); 
//var_dump ($menuStructure); die();

switch ($menuStructure) {
    case 'forWidestScreen':
        forWidestScreen();
        break;
    case 'forMax5itemsWide':
        forMax5itemsWide();
        break;
    case 'forMax4itemsWide':
        forMax4itemsWide();
        break;
    case 'forMax3itemsWide':
        forMax3itemsWide();
        break;
    case 'forMax2itemsWide':
        forMax2itemsWide();
        break;
}

function forWidestScreen() {
?>
	<ul style="display:none;">
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.apps-games.php');?>
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialog-configurations.php');?>
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialogs.php');?>
		<?php //echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
		<li class="saLinkpoint"><a href="-saLinkpoint-">-saLinkpoint-appMenu</a></li>
	</ul>
<?php
}

function forMax5itemsWide() {
?>
	<ul style="display:none;">
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.apps-games.php');?>
		<li><a href="#">Site</a>
		<ul>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialog-configurations.php');?>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialogs.php');?>
        </ul>
        </li>
		<?php //echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
		<li class="saLinkpoint"><a href="-saLinkpoint-">-saLinkpoint-appMenu</a></li>
	</ul>
<?php
}

function forMax4itemsWide () {
?>
	<ul style="display:none;">
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.apps-games.php');?>
		<li><a href="#">Site</a>
		<ul>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialog-configurations.php');?>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialogs.php');?>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
        </ul>
        </li>
		<?php //echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
		<li class="saLinkpoint"><a href="-saLinkpoint-">-saLinkpoint-appMenu</a></li>
	</ul>
<?php
}

function forMax3itemsWide () {
?>
	<ul style="display:none;">
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.apps-games.php');?>
		<li><a href="#">Site</a>
		<ul>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialog-configurations.php');?>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialogs.php');?>
            <?php //echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
        </ul>
        </li>
		<li class="saLinkpoint"><a href="-saLinkpoint-">-saLinkpoint-appMenu</a></li>
	</ul>
<?php
}

function forMax2itemsWide () {
?>
	<ul style="display:none;">
        <li><a href="#">Site</a>
            <ul>
                <?php echo require_return (dirname(__FILE__).'/mainmenu.items.apps-games.php');?>
                <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialog-configurations.php');?>
                <?php echo require_return (dirname(__FILE__).'/mainmenu.items.dialogs.php');?>
                <?php //echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
                <?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
            </ul>
		</li>
        <li class="saLinkpoint"><a href="-saLinkpoint-">-saLinkpoint-appMenu</a></li>
	</ul>
<?php
}
