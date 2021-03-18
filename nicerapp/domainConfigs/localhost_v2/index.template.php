<?php
    global $cms;
    //echo '<pre>';var_dump ($_SERVER);
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
{$cssFiles}
{$cssThemeFiles}
{$javascriptFiles}
    <script type="module" src="/nicerapp/vividComponents/na3D.source.js"></script>

<?php 
    $couchdbSettings = json_decode(file_get_contents(dirname(__FILE__).'/couchdb.json'), true);
    unset ($couchdbSettings['adminUsername']);
    unset ($couchdbSettings['adminPassword']);
    $couchdbSettingsStr = json_encode($couchdbSettings, JSON_PRETTY_PRINT);
    $couchdbSettingsStr = str_replace("\n    ", "\n\t\t", $couchdbSettingsStr);
    $couchdbSettingsStr = str_replace("}", "\t}", $couchdbSettingsStr);    
?>
<script type="text/javascript">
na.site.globals = {
    couchdb : <?php echo $couchdbSettingsStr?>,
    referer : '<?php echo (array_key_exists('HTTP_REFERER',$_SERVER)?$_SERVER['HTTP_REFERER']:'');?>',
    myip : '<?php echo str_replace('.','_',(array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']))?>',
    domain : '{$domain}'
};
</script>
    <link rel="apple-touch-icon" sizes="180x180" href="/nicerapp/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/nicerapp/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/nicerapp/favicon/favicon-16x16.png">
    <link rel="manifest" href="/nicerapp/favicon/site.webmanifest">
    <link rel="mask-icon" href="/nicerapp/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <title>{$title}</title>
</head>
<body onload="nas.onload(event);">
    <div id="siteBackground"> 
        <div id="siteBackground_bg"></div>
        <img class="bg_first" alt=""/>
        <img class="bg_last" alt=""/>
    </div>
    <div id="siteContent" class="vividDialog" theme="{$theme}">
    <div class="vividDialogContent vividScrollpane">
{$div_siteContent}    
    </div>
    </div>

    <div id="siteVideo" class="vividDialog" style="display:flex;justify-content:center;align-items:center;text-align:center;" theme="{$theme}">
        {$div_siteVideo}
    </div>

    <div id="siteVideoSearch" class="vividDialog" style="display:flex;justify-content:center;align-items:center;text-align:center;" theme="{$theme}">
        {$div_siteVideoSearch}
    </div>

    
    <div id="siteComments" class="vividDialog" style="display:flex;justify-content:center;align-items:center;text-align:center;" theme="{$theme}">
        {$div_siteComments}
    </div>
    
    <div id="siteToolbarTop" class="vdToolbar vividDialog" theme="{$theme}">
    <div class="vividDialogContent vividScrollpane">
        {$div_siteToolbarTop}
    </div>
    </div>

    <div id="siteToolbarRight" class="vdToolbar vividDialog" theme="{$theme}">
    <div class="vividDialogContent vividScrollpane">
        {$div_siteToolbarRight}
    </div>
    </div>

    
    <div id="siteStatusbar" class="vividDialog" theme="{$theme}">
    <div class="vividDialogContent vividScrollpane">
    </div>
    </div>
    
    <div id="siteDateTime" class="vividDialog" theme="{$theme}"></div>
    
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
    
    <div id="siteRegistration" class="vividDialog vividScrollpane" theme="{$theme}">
        <div id="siteRegistrationContainer">
            <form id="siteRegistrationForm" name="siteRegistrationForm" action="/register.php" method="POST">
                <label for="srf_loginName">Name</label><br/>
                <input id="srf_loginName" name="srf_loginName" type="text"/><br/>
                
                <label for="srf_email" class="tooltip" tooltipTheme="mainTooltipTheme" title="We'll be sending you a confirmation link to this address">E-mail</label><br/>
                <input id="srf_email" name="srf_email" type="text" class="tooltip" tooltipTheme="mainTooltipTheme" title="We'll be sending you a confirmation link to this address"/><br/>
                
                <label for="srf_pw1">Password</label><br/>
                <input id="srf_pw1" name="srf_pw1" type="password"/><br/>
                
                <label for="srf_pw2">Repeat password</label><br/>
                <input id="srf_pw2" name="srf_pw2" type="password"/><br/>
            </form>
            <br/>
            <div id="btnSrfSubmit" class="vividButton" theme="{$theme}">Register! <img src="/nicerapp/3rd-party/tinymce-4/plugins/naEmoticons/img/happy.gif"/></div>
        </div>
        
    </div>

    <div id="siteLogin" class="vividDialog vividScrollpane" theme="{$theme}">
    </div>

    
    
    <!-- see fonts.google.com -->
    <!--<link href="https://fonts.googleapis.com/css?family=Open+Sans|ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Architects+Daughter|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap" rel="stylesheet" onload="$(document).ready(function(){nas.startTooltips(event);});"> -->
    <link href="https://fonts.googleapis.com/css?family=Krona+One|Open+Sans|Architects+Daughter&display=swap" rel="stylesheet" onload="$(document).ready(function(){nas.startTooltips(event);});"> 

</body>
</html>
