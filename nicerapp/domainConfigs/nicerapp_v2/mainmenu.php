<?php
require_once (realpath(dirname(__FILE__).'/../..').'/boot.php');

if (is_array($_POST) && array_key_exists('na_js__screenWidth', $_POST)) {
    $_SESSION['na_js__screenWidth'] = $_POST['na_js__screenWidth'];
    $_SESSION['na_js__menuSpace'] = $_POST['na_js__menuSpace'];
    $_SESSION['na_js__menuItemWidth'] = $_POST['na_js__menuItemWidth'];
    $_SESSION['na_js__hasContentMenu'] = $_POST['na_js__hasContentMenu'];
}

if (is_array($_SESSION) && array_key_exists('na_js__screenWidth',$_SESSION)) {
    $browserWidth = (float)$_SESSION['na_js__menuSpace'];
    $menuItemWidth = (float)$_SESSION['na_js__menuItemWidth'];
    $hasContentMenu = $_SESSION['na_js__hasContentMenu']=='true'?true:false;
    $itemGap = 5;
    
    $menuStructure = 'forWidestScreen';
    
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
//var_dump ($menuStructure); die();
//var_dump ($_SERVER); 
//var_dump ($_SESSION); 
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
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
		<li class="contentMenu"><a href="-contentMenu-">-contentMenu-</a></li>
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
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
		<li class="contentMenu"><a href="-contentMenu-">-contentMenu-</a></li>
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
		<?php echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
		<li class="contentMenu"><a href="-contentMenu-">-contentMenu-</a></li>
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
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
            <?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
        </ul>
        </li>
		<li class="contentMenu"><a href="-contentMenu-">-contentMenu-</a></li>
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
                <?php echo require_return (dirname(__FILE__).'/mainmenu.items.new-background.php');?>
                <?php echo require_return (dirname(__FILE__).'/mainmenu.items.admin.php');?>		
            </ul>
		</li>
        <li class="contentMenu"><a href="-contentMenu-">-contentMenu-</a></li>
	</ul>
<?php
}
