<?php 
$app = json_decode (base64_decode_url($_GET['apps']), true);

?>
<div id="site3D_backgroundsBrowser" class="na3D" theme="{$theme}">
</div>
<div id="site3D_label" class="vividDialog vividScrollpane" theme="{$theme}"></div>
<script type="module">
    import { na3D_fileBrowser, na3D_demo_models, na3D_demo_cube } from '/nicerapp/vividComponents/na3D.source.js';
    setTimeout (function () {
        $('.na3D').each(function(idx,el){
            //na.site.settings.na3D['#'+el.id] = new na3D_demo_cube (el, $(el).parent()[0]);
            //na.site.settings.na3D['#'+el.id] = new na3D_demo_models (el, $(el).parent()[0]);
            na.site.settings.na3D['#'+el.id] = new na3D_fileBrowser(el, $(el).parent()[0], na.site.settings.backgroundsRecursive);
        });
    }, 1000);
</script>
