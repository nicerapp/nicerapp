<?php
set_time_limit (0);
require_once (dirname(__FILE__).'/../../../../../../../boot_stage_001a.php');
require_once (dirname(__FILE__).'/class.newsApp-2.php');

$newsApp2_factorySettings_fn = dirname(__FILE__).'/config.factorySettings.json';
$newsApp2_factorySettings = json_decode(file_get_contents($newsApp2_factorySettings_fn), true);

$newsApp2 = new newsApp2_class($newsApp2_factorySettings);
$newsApp2->deleteOldNews();
?>
