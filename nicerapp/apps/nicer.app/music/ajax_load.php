<?php
	$fp = $_GET['file'];
	$pi = pathinfo($fp);
	if ($pi['extension']!=='.php') {
		echo file_get_contents ($fp);
	}
?>
