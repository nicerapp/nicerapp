<?php 
namespace Foo;
require_once realpath(dirname(__FILE__).'/../../../../').'/nicerapp/3rd-party/geoLite2/vendor/autoload.php';
use GeoIp2\Database\Reader;

if (!array_key_exists('geoIP',$_SESSION)) $_SESSION['geoIP'] = array();
if (!array_key_exists($_GET['IP'],$_SESSION['geoIP'])) {
    $reader = new Reader(realpath(dirname(__FILE__).'/../../../../').'/nicerapp/3rd-party/geoLite2/GeoLite2-City.mmdb');
    $record = $reader->city($_GET['IP']);
    $_SESSION['geoIP'][$_GET['IP']] = $record;        
};

$record = $_SESSION['geoIP'][$_GET['IP']];
if (!is_null($record->subdivisions)) {
$html = 
    '<table>'
        .'<tr><th>Continent</th><td>'.$record->continent->names['en'].'</td></tr>'
        .'<tr><th>Country</th><td>'.$record->country->names['en'].'</td></tr>'
        .'<tr><th>Province</th><td>'.$record->subdivisions[0]->names['en'].'</td></tr>'
        .'<tr><th>City</th><td>'.$record->city->names['en'].'</td></tr>'
    .'</table>';
} else {
$html = 
    '<table>'
        .'<tr><th>Continent</th><td>'.$record->continent->names['en'].'</td></tr>'
        .'<tr><th>Country</th><td>'.$record->country->names['en'].'</td></tr>'
    .'</table>';
}
//$html = '<pre style="font-size:70%">'.json_encode($record, JSON_PRETTY_PRINT).'</pre>';        

echo $html;
?>
