<?php

require_once (dirname(__FILE__).'/nicerapp/functions.php');

$fc = file_get_contents(dirname(__FILE__).'/.htaccess.build.part1.txt');
$fc .= "\n\r"."\n\r";

$lineEnding = ' [R,L]';

$url = '^music$';
$json = '{"musicPlayer":{"set":"index"}}';
$line = 'RewriteRule '.$url.' /apps/'.base64_encode_url($json).$lineEnding;
$fc .= $line."\n\r";

$url = '^music__chill$';
$json = '{"musicPlayer":{"set":"Beautiful_Chill_Mixes"}}';
$line = 'RewriteRule '.$url.' /apps/'.base64_encode_url($json).$lineEnding;
$fc .= $line."\n\r";

$url = '^music__deep_house$';
$json = '{"musicPlayer":{"set":"Deep_House"}}';
$line = 'RewriteRule '.$url.' /apps/'.base64_encode_url($json).$lineEnding;
$fc .= $line."\n\r";

$url = '^music__dj_firesnake$';
$json = '{"musicPlayer":{"set":"DJ_FireSnake"}}';
$line = 'RewriteRule '.$url.' /apps/'.base64_encode_url($json).$lineEnding;
$fc .= $line."\n\r";

$url = '^tarot$';
$json = '{"tarot":{"deck":"Original-Rider-Waite","reading":"3-Cards"}}';
$line = 'RewriteRule '.$url.' /apps/'.base64_encode_url($json).$lineEnding;
$fc .= $line."\n\r";

$url = '^news$';
//$json = '{"news":{"section":"English_News"}}';
$json = '{"#siteContent":"nicerapp/news/newsApp.siteContent.php?section=English%20News"}';
$line = 'RewriteRule '.$url.' /apps/'.base64_encode_url($json).$lineEnding;
$fc .= $line."\n\r";

$fc .= "\n\r"."\n\r";
$fc .= file_get_contents (dirname(__FILE__).'/.htaccess.build.partLast.txt');

file_put_contents (dirname(__FILE__).'/.htaccess', $fc);
?>
