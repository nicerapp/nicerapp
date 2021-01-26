<?php
    global $cms;
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
{$cssFiles}
{$cssThemeFiles}
{$javascriptFiles}
<script type="text/javascript">
<?php echo dirname(__FILE__)?>
na.m.globals = {
    couchdb : <?php echo file_get_contents(dirname(__FILE__).'/couchdb.json');?> ,
    referer : '<?php echo $_SERVER['HTTP_REFERER'];?>',
    myip : '<?php echo str_replace('.','_',(array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']))?>',
    domain : '<?php echo $cms->domain?>'
};
na.settings = { serverHostName : '<?php echo str_replace('.','_',(array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['HTTP_HOST']))?>' };
</script>

    <title>nicer.app web apps framework</title>
</head>
<body onload="nas.onload(event);">
    <div id="siteBackground"> 
        <img class="bg_first" alt=""/>
        <img class="bg_last" alt=""/>
    </div>
    <div id="siteContent" class="vividDialog">
    <div class="vividDialogContent">
{$div_siteContent}    
    </div>
    </div>
    
    <div id="siteDateTime" class="vividDialog"></div>
    
    <img id="btnThemeSwitch" src="/nicerapp/siteMedia/btnThemeSwitch_icon.png" class="tooltip" title="Switch between light and dark theme" alt="Switch between light and dark theme" tooltipTheme="mainTooltipTheme" onclick="nas.themeSwitch()"/>
    <form id="siteSettings" action="/" method="POST" style="display:none;">
        <select id="siteTheme" name="siteTheme" form="siteSettings" onchange="this.form.submit()">
            <optgroup>
            <option value="dark" <?php echo $cms->cssTheme === 'dark' ? 'selected' : '';?>>Dark</option>
            <option value="light" <?php echo $cms->cssTheme === 'light' ? 'selected' : '';?>>Light</option>
            </optgroup>
        </select>
    </form>    
    
    <img id="btnChangeBackground" src="/nicerapp/siteMedia/btnBackground.png" class="tooltip" title="Choose a random background" alt="Choose a random background" tooltipTheme="mainTooltipTheme" onclick="nas.changeBackground()"/>
    
    <div id="siteMenu" class="vividMenu" theme="{$theme}">
{$div_siteMenu}
    </div>

    <!-- see fonts.google.com -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Architects+Daughter|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap" rel="stylesheet" onload="nas.startTooltips(event);"> <!-- see index.css and site.source.js (tinyMCE section) for where it's (primarily) used -->    
</body>
</html>
