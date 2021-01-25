<?php
require_once ('fancywebapps/sitewide/boot.php');
require_once ('fancywebapps/com/authentication/authentication-1.0.0.php');
require_once (dirname(__FILE__).'/fancywebapps/com/miniCMS/boot.php');
$cmsSettings = array (
	'copyright' => 'the owner of fancywebapps.com',
	'frontpage' => main(3, 4)
);
$cms = new miniCMS($cmsSettings);
$cms->outputSite();

function main() {
	ob_end_flush();
	ob_start();
	set_time_limit(300);
	fwaAuthentication_init();
	global $fwaAuthentication;
	$db = $fwaAuthentication->db;
	$fwaAuthenticationSettings = array();//$fwaAuthentication->getBrowserSettings();
	hm ($fwaAuthenticationSettings, '$fwaAuthenticationSettings --&gt; fwa.auth.settings.login');
	hm ($db->db, "database storage on server");
?>
<script type="text/javascript">
	fwa.auth.settings.login = <?php echo json_encode($fwaAuthenticationSettings)?>;
</script>
<div id="output">
</div>
<?php	
	$r = ob_get_clean();
	return $r;
}

?>