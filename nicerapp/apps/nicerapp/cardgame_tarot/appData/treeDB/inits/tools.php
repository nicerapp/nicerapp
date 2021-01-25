<?php
/*
global $config4app_recipes;
$db = $config4app_recipes['db'];



// start a new transaction ($tid) in treeDB of nicerapp
$tid = $db->trStart();

$appDir = str_replace('\\','/', realpath(dirname(__FILE__).'/../../../'));

$recipeMediaFilesRaw = getFilePathList ($appDir.'/appData/recipeMedia/', true, '/(.*)/', array('file'));
$recipeMediaFiles = array();
foreach ($recipeMediaFilesRaw as $idx=>$fp) {
	$fp = str_replace('\\','/', $fp);
	if (strpos($fp,'inactive')===false) $recipeMediaFiles[] = str_replace($appDir.'/appData/recipeMedia/','',$fp);
}

$recipeFilesAll = getFilePathList ($appDir.'/appData/recipes/', true, '/(\.recipe\.json$)/', array('file'));
$recipeFiles = array();
foreach ($recipeFilesAll as $idx=>$fp) {
	$fp = str_replace('\\','/', $fp);
	if (strpos($fp,'inactive')===false) $recipeFiles[] = str_replace('.recipe.json', '', str_replace($appDir.'/appData/recipes/','',$fp));
}

$recipes = array();
foreach ($recipeFiles as $idx => $fp) {
	$recipe = json_decode (file_get_contents($appDir.'/appData/recipes/'.$fp.'.recipe.json'), true);
	$recipe = (is_null($recipe)?'null':$recipe);
	//$db->trSet ($tid, 'recipes/loadResults', $idx, $recipe);
	
	if (
		!is_array($recipe)
		|| $recipe['name']!==$fp
	) {
		badResult (E_USER_WARNING, array(
			'msg' => 'invalid recipe "'.$fp.'"; .name!=$fp',
			'$recipe' => $recipe,
			'$fp' => $fp
		));
	} else {
		
		
		$recipes[$fp] = $recipe;
	}
}

$db->trSet ($tid, 'recipes', 'all', $recipes);
//$db->trSet ($tid, 'recipes', 'recipeFilesAll', $recipeFilesAll);
//$db->trSet ($tid, 'recipes', 'recipeFiles', $recipeFiles);
$db->trSet ($tid, 'recipeMedia', 'all', $recipeMediaFiles);

// save all the data set by the transaction
$db->trDo ($tid);
*/
?>
