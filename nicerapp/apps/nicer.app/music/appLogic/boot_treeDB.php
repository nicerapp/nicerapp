<?php
require_once (dirname(__FILE__).'/../../../nicerapp/boot.php');
require_once (dirname(__FILE__).'/boot.php');

global $nicerapp_infoHarvester;
$db = $nicerapp_infoHarvester->db;

ob_start('ob_gzhandler');
//error_reporting (E_ALL);

echo json_encode ($db->get());
?>
