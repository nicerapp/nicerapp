<?php

global $durationData;
$durationData = array();

global $scriptBegin;
$scriptBegin = (float) array_sum(explode(' ',microtime()));

function startDuration ($id) {
  global $durationData;

  $timeBegin = (float) array_sum(explode(' ',microtime()));
  $durationData[$id] = $timeBegin;
}

function getTimeAsString() {
	return (float) array_sum(explode(' ',microtime()));
}

function getDuration ($id=null, $clear=true) {
  global $durationData;

  if (!is_null($id)) {
	  $clear = false;
      if (is_string($id) && array_key_exists($id,$durationData)) {
		  $timeBegin = $durationData[$id];
	  } else { 
		  $timeBegin = $id;
	  }      
      $timeEnd = (float) array_sum(explode(' ',microtime()));
      $r = sprintf("%.4f", ($timeEnd-$timeBegin));
      if (
		is_string($id) &&
		array_key_exists($id,$durationData) &&
		$clear
		) unset ($durationData[$id]);  
  } else {
      global $scriptBegin;
      $timeBegin = $scriptBegin;
      $timeEnd = (float) array_sum(explode(' ',microtime()));
      $r = sprintf("%.4f", ($timeEnd-$timeBegin));
  }
  return (float)$r;
}

?>
