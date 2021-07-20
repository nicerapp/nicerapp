<?php
    $ip = array_key_exists('X-Forwarded-For',apache_request_headers())
        ? apache_request_headers()['X-Forwarded-For'] 
        : $_SERVER['REMOTE_ADDR'];
        
    switch ($ip) {
        case '::1':
        case '127.0.0.1':
        case '192.168.178.30':
        case '80.101.238.137':
            echo file_get_contents('config.json');
            break;
        default:
            echo '{"ERROR":"IP '.$ip.' is not whitelisted."';
            break;
    }
?>
