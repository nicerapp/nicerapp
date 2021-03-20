<?php

function cdb_error ($errCode, $e, $msg) {
    switch ($errCode) {
        case 404:
            header ('HTTP/1.0 404: Not Found', true, 404);
            break;
        case 403:
            header ('HTTP/1.0 403: Forbidden', true, 403);
            break;
        case 500:
        default:
            header ('HTTP/1.0 500: Internal Server Error', true, 500);
            break;
    }
    $dbg = array (
        'error' => $e ? $e->getMessage() : 'generic error',
        'msg' => $msg
    );
    echo json_encode ($dbg, JSON_PRETTY_PRINT);
    //echo 'Something went wrong. Please check again later.';
}

function cdb_randomString ($length) {
    $seed = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $r = '';
    for ($i=0; $i<$length; $i++) {
        $r .= substr ($seed, rand(0,strlen($seed)), 1);
    };
    return $r;
}

?>
