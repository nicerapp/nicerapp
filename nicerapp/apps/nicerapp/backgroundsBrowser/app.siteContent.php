<?php 
$app = json_decode (base64_decode_url($_GET['apps']), true);

?>
<div id="site3D_backgroundsBrowser" class="na3D" theme="{$theme}">
</div>
<script type="module">
    import { na3D_fileBrowser } from '/nicerapp/vividComponents/na3D.source.js';
    setTimeout (function () {
        $('.na3D').each(function(idx,el){
            na.site.settings.na3D['#'+el.id] = new na3D_fileBrowser(el, $(el).parent()[0]);
            na.site.settings.na3D['#'+el.id].data = na.site.settings.backgrounds;
        });
    }, 1000);
</script>
