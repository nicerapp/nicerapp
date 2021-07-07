<?php
$pi = pathinfo($_GET['file']);
if ($pi['dirname']!=='.' || $pi['extension']!=='mp3') {
	echo 'whahahahaha.. nice try, punk. no cigar though.';
	exit();
}
$file = $pi['basename'];

$filepath = 'music/DJ_FireSnake/'.$file;

header('Content-type: application/mp3');
header('Content-Disposition: attachment; filename="'.$file.'"');
header('Content-Length: '.filesize($filepath));
readfile_chunked($filepath);

function readfile_chunked($filename){ 
 $chunksize = 1*(1024*1024); // how many bytes per chunk 
 $buffer = ''; 
 $handle = fopen($filename, 'rb'); 
 if ($handle === false) { 
 return false; 
 } 
 while (!feof($handle)) { 
   $buffer = fread($handle, $chunksize); 
 print $buffer; 
 } 
 return fclose($handle); 
 } 
?>
