<?php 
$app = json_decode (base64_decode_url($_GET['apps']), true);

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);
/*if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}*/


?>
<div class="lds-facebook"><!-- thanks for allowing CC0 license usage : https://loading.io/css/ --><div></div><div></div><div></div></div> 
<link rel="stylesheet" href="/nicerapp/3rd-party/jsTree-3.2.1/dist/themes/default-dark/style.css" /> <!-- has style.min.css -->
<script type="text/javascript" src="/nicerapp/3rd-party/jsTree-3.2.1/dist/jstree.js"></script> <!-- has jstree.min.js -->
<div id="jsTree"></div>
<script type="text/javascript">
    $(document).ready(function() {
        $('#jsTree').jstree();
    });
</script>
