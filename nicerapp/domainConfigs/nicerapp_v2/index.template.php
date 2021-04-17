<?php
    global $cms;
    //echo '<pre>';var_dump ($_SERVER);
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="HandheldFriendly" content="true" />
{$cssFiles}
{$cssThemeFiles}
{$javascriptFiles}
    <!--<script type="module" src="/nicerapp/userInterface/na3D.source.js"></script>-->

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
    <link rel="apple-touch-icon" sizes="180x180" href="/nicerapp/favicon.said.by/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/nicerapp/favicon.said.by/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/nicerapp/favicon.said.by/favicon-16x16.png">
    <link rel="manifest" href="/nicerapp/favicon.said.by/site.webmanifest">
    <link rel="mask-icon" href="/nicerapp/favicon.said.by/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/nicerapp/favicon.said.by/favicon.ico">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-config" content="/nicerapp/favicon.said.by/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <title>{$title}</title>
</head>
<body onload="na.site.onload(event);">
    <div id="siteBackground"> 
        <div id="siteBackground_bg"></div>
        <div id="siteBackground_bg2"></div>
        <img class="bg_first" alt=""/>
        <img class="bg_last" alt=""/>
    </div>
    <div id="siteContent" class="vividDialog">
    <div class="vividDialogContent vividScrollpane">
{$div_siteContent}    
    </div>
    </div>

    <div id="siteVideo" class="vividDialog" style="display:flex;justify-content:center;align-items:center;text-align:center;">
        {$div_siteVideo}
    </div>

    <div id="siteVideoSearch" class="vividDialog" style="display:flex;justify-content:center;align-items:center;text-align:center;">
        {$div_siteVideoSearch}
    </div>

    
    <div id="siteComments" class="vividDialog" style="display:flex;justify-content:center;align-items:center;text-align:center;">
        {$div_siteComments}
    </div>
    
    <div id="siteToolbarTop" class="vdToolbar vividDialog">
    <div class="vividDialogContent vividScrollpane">
        {$div_siteToolbarTop}
    </div>
    </div>

    <div id="siteToolbarLeft" class="vdToolbar vividDialog">
    <div class="vividDialogContent vividScrollpane">
        {$div_siteToolbarLeft}
    </div>
    </div>
    
    <div id="siteToolbarDialogSettings" class="vdToolbar vividDialog">
    <div class="vividDialogContent vividScrollpane">
        to be filled in
    </div>
    </div>
    
    <div id="siteToolbarRight" class="vdToolbar vividDialog">
    <div class="vividDialogContent vividScrollpane">
        {$div_siteToolbarRight}
    </div>
    </div>

    
    <div id="siteStatusbar" class="vividDialog"><div class="vividDialogContent vividScrollpane"></div></div>
    
    <div id="siteDateTime" class="vividDialog"><div class="vividDialogContent vividScrollpane"></div></div>
    
    <div id="btnOptions" class="vividButton_icon" style="width:50px;height:50px;" onclick="na.site.onclick_btnOptions()">
        <div class="cvbBorderCSS"></div>
        <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
        <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
        <img class="cvbImgButton" src="/nicerapp/siteMedia/btnOptions2.png"/>
    </div>

    <div id="btnLoginLogout" class="vividButton_icon" style="width:50px;height:50px;" onclick="na.site.displayLogin()">
        <div class="cvbBorderCSS"></div>
        <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
        <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
        <img class="cvbImgButton" src="/nicerapp/siteMedia/btnLogin2.png"/>
    </div>
    
    <div id="btnChangeBackground" class="vividButton_icon" onclick="na.site.changeBackground()">
        <div class="cvbBorderCSS"></div>
        <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
        <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
        <img class="cvbImgButton" src="/nicerapp/siteMedia/btnBackground.png"/>
    </div>

    
    <div id="siteMenu" class="vividMenu" theme="{$theme}">
{$div_siteMenu}
    </div>
    
    <div id="siteRegistration" class="vividDialogPopup vividScrollpane">
        <div id="siteRegistrationContainer">
            <form id="siteRegistrationForm" name="siteRegistrationForm" action="/register.php" method="POST">
                <label for="srf_loginName">Name</label>
                <input id="srf_loginName" name="srf_loginName" type="text"/><br/>
                
                <!--<label for="srf_email" class="tooltip" tooltipTheme="mainTooltipTheme" title="We'll be sending you a confirmation link to this address">E-mail</label>
                <input id="srf_email" name="srf_email" type="text" class="tooltip" tooltipTheme="mainTooltipTheme" title="We'll be sending you a confirmation link to this address"/><br/>-->
                <label for="srf_email">E-mail</label>
                <input id="srf_email" name="srf_email" type="text"/><br/>
                
                <label for="srf_pw1">Password</label>
                <input id="srf_pw1" name="srf_pw1" type="password"/><br/>
                
                <label for="srf_pw2">Repeat password</label>
                <input id="srf_pw2" name="srf_pw2" type="password"/><br/>
            </form>
            <p id="siteRegistrationError"></p>
            <br/>
            <button id="btnSrfSubmit" type="button" class="button" onclick="na.site.register();"><span>Register! <img src="/nicerapp/3rd-party/tinymce-4/plugins/naEmoticons/img/happy.gif"/></span></div>
        </div>
        
    </div>

    <div id="siteLogin" class="vividDialogPopup vividScrollpane">
        <div id="siteLoginContainer">
            <form id="siteLoginForm" name="siteLoginForm" action="/login.php" method="POST" autocomplete="on">
                <label for="slf_loginName">Name</label>
                <input id="slf_loginName" name="slf_loginName" type="text" required placeholder="User Name" autocomplete="username"/><br/>

                <label for="slf_pw">Password</label>
                <input id="slf_pw" name="slf_pw" type="password" required autocomplete="current-password"/><br/>
                
                <input type="submit" style="opacity:0.0001"/>
            </form>
            <div class="buttonHolder">
                <button id="btnNewAccount" type="button" class="button" onclick="na.site.newAccount();"><span>New account</span></button>
                <button id="btnLogin" type="button" class="button" onclick="na.site.login();"><span>Log in</span></button>
            </div>
        </div>
    </div>

    <div id="siteLoginSuccessful" class="vividDialogPopup vividScrollpane">Login Successful! <img src="/nicerapp/3rd-party/tinymce-4/plugins/naEmoticons/img/happy.gif"/></div>
    
    <div id="siteLoginFailed" class="vividDialogPopup vividScrollpane">Login failed..</div>
    
    <!-- see fonts.google.com -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Architects+Daughter|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap" rel="stylesheet" onload="$(document).ready(function(){na.site.startTooltips(event);});">
    <!--<link href="https://fonts.googleapis.com/css?family=Krona+One|Open+Sans|Architects+Daughter&display=swap" rel="stylesheet" onload="$(document).ready(function(){nas.startTooltips(event);});">-->

</body>
</html>
