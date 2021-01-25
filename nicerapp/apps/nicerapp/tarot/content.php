<?php

function getContentSettings () {
	if (array_key_exists('section', $_GET)) {
		$section = $_GET['section'];
	} else {
		$section = 'blog';
	}
	
	if (array_key_exists('page',$_GET)) {
		$page = $_GET['page'];
	} else {
		$page = 'frontpage';
	}
	
	
	$def = json_decode(file_get_contents('siteMap.json'), true);
	if (is_null($def)) trigger_error ('Could not read or decode siteMap.json', E_USER_ERROR);
	
	$d = $def[$section][$page];
	
	$r = array (
		'url' => $d['innerURL']
	);
	return goodResult($r);
}
?>