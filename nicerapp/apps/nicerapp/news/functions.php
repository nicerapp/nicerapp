<?php 

function memAvailable() {

}



/*
function &chaseToPath (&$wm, $path, $create=false) {
    //var_dump ($create); die();
    //echo '$wm=<pre>'; var_dump ($wm);echo '</pre>'; //die();
    //$path = str_replace ('/', '/d/', $path);
    //$path .= '/d';
    $nodes = explode ('/', $path);
    $chase = &chase ($wm, $nodes, $create);
    
    //echo '$wm=<pre>'; var_dump ($wm);echo '</pre>'; die();
    $dbg = array (
        '$path' => $path,
        '$nodes' => $nodes,
        '$wm' => $wm,
        '$chase' => $chase
    );
    echo '$dbg=<pre style="background:red;color:yellow;">'; var_dump ($dbg); echo '</pre>';
    
    //die();
    
    
    $false = false;
    if (good($chase)) {
        $arr = &result($chase);	
        return $arr;
    } else return $false;
}		


function &chase (&$arr, $indexes, $create=false) {
        if (false) {
        echo 'sitewide/functions.php --- $arr=<pre>'; var_dump ($arr); echo '</pre>';
        echo 'sitewide/functions.php --- $indexes=<pre>'; var_dump ($indexes); echo '</pre>';
        echo 'sitewide/functions.php --- $create=<pre>'; var_dump ($create); echo '</pre>';
        }
	$r = &$arr;
	foreach ($indexes as $idx) {
            //echo 'sitewide/functions.php --- $idx=<pre>'; var_dump ($idx); echo '</pre>';
            if (
                    is_array($r)
                    && (
                            $create===true 
                            || array_key_exists($idx,$r)
                    )
            ) {
                    if ($create===true && !array_key_exists($idx,$r)) $r[$idx]=array();
                    //echo 'sitewide/functions.php --- $idx=<pre>'; var_dump ($idx); echo '</pre>';
                    $r = &$r[$idx];
            } else {
                    $err = array(
                    'msg' => 'Could not walk the full tree',
                    'vars' => array(
                            '$idx--error'=>$idx,
                            '$indexes'=>$indexes,
                            '$arr'=>$arr
                            )
                    );
                    badResult (E_USER_NOTICE, $err);
                    $ret = false; // BUG #2 squashed
                    return $ret;
            }
	}
    
        //echo 'sitewide/functions.php --- $r=<pre>'; var_dump ($r); echo '</pre>';
	return goodResult($r);
}

function &chaseToReference (&$array, $path) {
	if (!empty($path)) {
		if (empty($array[$path[0]])) {
			$err = array(
				'msg' => 'Could not walk the full tree',
				'$path' => $path,
				'$array (possibly partially walked)' => $array
			);
			return badResult (E_USER_NOTICE, $err);
		} else return chaseToReference($array[$path[0]], array_slice($path, 1));
	} else {
		return goodResult($array);
	}	
}
*/

?>
