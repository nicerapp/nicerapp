<?php
    global $cms;
    //echo '<pre>';var_dump ($_SERVER);
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<!--<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />-->
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
{$viewport}
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
na.site.globals = $.extend(na.site.globals, {
    couchdb : <?php echo $couchdbSettingsStr?>,
    referer : '<?php echo (array_key_exists('HTTP_REFERER',$_SERVER)?$_SERVER['HTTP_REFERER']:'');?>',
    myip : '<?php echo str_replace('.','_',(array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']))?>',
    domain : '{$domain}',
    app : {$app}
});
</script>
{$pageSpecificCSS}

    <link rel="apple-touch-icon" sizes="180x180" href="/nicerapp/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/nicerapp/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/nicerapp/favicon/favicon-16x16.png">
    <link rel="manifest" href="/nicerapp/favicon/site.webmanifest">
    <link rel="mask-icon" href="/nicerapp/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/nicerapp/favicon/favicon.ico">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-config" content="/nicerapp/favicon/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <title>{$title}</title>
</head>
<body onload="na.site.onload(event);" onresize="na.site.onresize({reloadMenu:true})">
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
    
    <div id="siteToolbarRight" class="vdToolbar vividDialog">
    <div class="vividDialogContent vividScrollpane">
        {$div_siteToolbarRight}
    </div>
    </div>

    <div id="siteToolbarDialogSettings" class="vdToolbar vividDialog">
    <div class="vividDialogContent vividScrollpane">
        <div class="navbar">
            <!--<img src="/nicerapp/siteMedia/btnSettingsBorder.png"/>-->
            <div id="btnViewResult" class="vividButton_icon tooltip" title="View result" alt="View result" style="position:absolute;width:50px;height:50px;" onclick="if (!$(this).is('.disabled')) { if (!na.desktop.settings.visibleDivs.includes('#siteContent')) na.desktop.settings.visibleDivs.push('#siteContent'); na.site.settings.activeDivs=['#siteContent']; na.desktop.resize();}">
                <div class="cvbBorderCSS"></div>
                <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
                <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
                <img class="cvbImgButton" src="/nicerapp/siteMedia/btnZoomIncrease.png"/>
            </div>
            <div id="btnSelectBorderSettings" class="vividButton_icon tooltip" title="Select border settings" alt="Select border settings" style="position:absolute;left:65px;width:50px;height:50px;" onclick="if (!$(this).is('.disabled')) na.dialogSettings.selectBorderSettings()">
                <div class="cvbBorderCSS"></div>
                <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
                <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
                <img class="cvbImgButton" src="/nicerapp/siteMedia/btnSettingsBorder.png"/>
            </div>
            <div id="btnSelectBackgroundColor" class="vividButton_icon tooltip" title="Select background color" alt="Select background color" style="position:absolute;left:120px;width:50px;height:50px;" onclick="if (!$(this).is('.disabled')) na.dialogSettings.selectBackground_color()">
                <div class="cvbBorderCSS"></div>
                <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
                <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
                <img class="cvbImgButton" src="/nicerapp/siteMedia/btnColorPicker.png"/>
            </div>
            <div id="btnSelectBackgroundFolder" class="vividButton_icon tooltip" title="Select background image folder" alt="Select background image folder" style="position:absolute;left:175px;width:50px;height:50px;" onclick="if (!$(this).is('.disabled')) na.dialogSettings.selectBackground_folder()">
                <div class="cvbBorderCSS"></div>
                <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
                <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
                <img class="cvbImgButton" src="/nicerapp/siteMedia/tree.png"/>
            </div>
            <div id="btnSelectBackgroundImage" class="vividButton_icon tooltip" title="Select background image" alt="Select background image" style="position:absolute;left:235px;width:50px;height:50px;" onclick="if (!$(this).is('.disabled')) na.dialogSettings.selectBackground_image()">
                <div class="cvbBorderCSS"></div>
                <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
                <img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>
                <img class="cvbImgButton" src="/nicerapp/siteMedia/btnBackground.png"/>
            </div>
            <div id="btnSelectTextSettings" class="vividButton_icon tooltip" title="Select text settings" alt="Select text settings" style="position:absolute;left:290px;width:50px;height:50px;" onclick="if (!$(this).is('.disabled')) na.dialogSettings.selectTextSettings()">
                <div class="cvbBorderCSS"></div>
                <img class="cvbImgBorder" src="/nicerapp/siteMedia/btnCssVividButton_outerBorder.png"/>
                <!--<img class="cvbImgTile" src="/nicerapp/siteMedia/btnCssVividButton.png"/>-->
                <img class="cvbImgButton" src="/nicerapp/siteMedia/btnSettingsText.png"/>
            </div>
        </div>
        <div class="flexBreak"></div>
        <div id="specificitySettings" class="dialogSettingsComponent_alwaysVisible">
            <label id="labelSpecificity" for="specificity" class="specificityLabel">Specificity</label>
            <select id="specificity" onchange="na.ds.specificitySelected(event)">
            </select>
        </div>
        <div class="flexBreak"></div>
        <div id="borderSettings" class="dialogSettingsComponent" style="top:128px;">
            <input id="borderColorpicker" class="dialogSettingsComponent" style="position:absolute;top:110px;"></input>
            <div class="flexBreak" style="height:5px;"></div>
            
            <label id="labelBorderType" for="borderType" class="boxSettingsLabel">Type :</label>
            <select id="borderType" onchange="na.ds.borderSettingsSelected()">
                <option value="dotted">Dotted</option>
                <option value="dashed">Dashed</option>
                <option value="solid">Solid</option>
                <option value="double">Double</option>
                <option value="groove">3D Groove</option>
                <option value="ridge" selected>3D Ridge</option>
                <option value="inset">3D Inset</option>
                <option value="outset">3D Outset</option>
                <option value="none">None</option>
                <option value="hidden">Hidden</option>
            </select>
            <div class="flexBreak"></div>

            <label id="labelBorderWidth" for="borderWidth" class="boxSettingsLabel">Width :</label>
            <input id="borderWidth" type="range" min="1" max="20" value="3" class="sliderOpacityRangeBorderSettings" onchange="na.ds.borderSettingsSelected();"/>
            <div class="flexBreak"></div>
            
            <label id="labelBorderRadius" for="borderRadius" class="boxSettingsLabel">Radius :</label>
            <input id="borderRadius" type="range" min="0" max="50" value="20" class="sliderOpacityRangeBorderSettings" onchange="na.ds.borderSettingsSelected();"/>
            <div class="flexBreak"></div>
            
            <label id="labelBoxShadow" class="boxSettingsLabel">Box shadow :</label>
            <div id="boxShadow">
                <img src="/nicerapp/siteMedia/iconCreate.png" onclick="na.ds.addBoxShadow()"/>
                <img src="/nicerapp/siteMedia/iconDelete.png" onclick="na.ds.deleteBoxShadow()"/>
                <div id="boxShadow_0" class="boxShadow" style="background:rgba(200,200,200,1);border:1px solid lime; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.5); border-radius:10px; margin : 5px; padding : 5px;" onclick="na.ds.boxSettingsSelected(event);">ABC XYZ</div>
            </div>
            <div class="flexBreak"></div>
            
            <label id="labelBoxShadowInset" class="boxSettingsLabel" for="boxShadowInset">Box shadow inset :</label>
            <input id="boxShadowInset" type="checkbox" onchange="na.ds.boxSettingsChanged();"/>
            <span id="boxShadowInsetClear">&nbsp;</span>
            <div class="flexBreak"></div>
            
            <label id="labelBoxShadowXoffset" class="boxSettingsLabel" for="boxShadowXoffset">Box shadow horizontal offset :</label>
            <input id="boxShadowXoffset" type="range" min="-10" max="10" value="2" class="sliderOpacityRangeBorderSettings" onchange="na.ds.boxSettingsChanged();"/>
            <div class="flexBreak"></div>

            <label id="labelBoxShadowYoffset" class="boxSettingsLabel" for="boxShadowYoffset">Box shadow vertical offset :</label>
            <input id="boxShadowYoffset" type="range" min="-10" max="10" value="2" class="sliderOpacityRangeBorderSettings" onchange="na.ds.boxSettingsChanged();"/>
            <div class="flexBreak"></div>

            <label id="labelBoxShadowSpreadRadius" class="boxSettingsLabel" for="boxShadowSpreadRadius">Box shadow spread radius :</label>
            <input id="boxShadowSpreadRadius" type="range" min="0" max="10" value="2" class="sliderOpacityRangeBorderSettings" onchange="na.ds.boxSettingsChanged();"/>
            <div class="flexBreak"></div>

            <label id="labelBoxShadowBlurRadius" class="boxSettingsLabel" for="boxShadowBlurRadius">Box shadow blur radius :</label>
            <input id="boxShadowBlurRadius" type="range" min="0" max="10" value="2" class="sliderOpacityRangeBorderSettings" onchange="na.ds.boxSettingsChanged();"/>
            <div class="flexBreak"></div>

            <label id="labelBoxShadowColor" class="boxSettingsLabel" for="boxShadowColor">Box shadow color :</label>
            <input id="boxShadowColorpicker" class="dialogSettingsComponent" style="position:absolute;top:95px;"></input>
            <div class="flexBreak"></div>
            
        </div>
        <input id="colorpicker" class="dialogSettingsComponent dialogSettings_colorPicker" style="position:absolute;top:110px;"></input>
        <div id="dialogSettings_jsTree" class="dialogSettingsComponent" style="position:absolute;top:110px;display:none;"></div>
        <div class="dialogSettingsComponent">
            <label id="label_dialogSettings_photoOpacity" class="labelDialogSettings" for="dialogSettings_photoOpacity">Opacity :</label>
            <input id="dialogSettings_photoOpacity" type="range" min="1" max="100" value="50" class="dialogSettingsComponent sliderOpacityRangeDialogSettings" style="top:110px;"/>
            <div class="flexBreak"></div>
            <label id="label_dialogSettings_photoScale" class="labelDialogSettings" for="dialogSettings_photoScale">Scale :</label>
            <input id="dialogSettings_photoScale" type="range" min="25" max="200" value="100" class="dialogSettingsComponent sliderOpacityRangeDialogSettings" style="top:140px;"/>
            <div class="flexBreak"></div>
        </div>
        <iframe id="dialogSettings_photoAlbum" class="dialogSettingsComponent" style="position:absolute;top:175px;display:none;border:0px"></iframe>
        <div id="textSettings" class="dialogSettingsComponent" style="position:absolute;top:110px;display:none;">
            <label id="labelTextFontFamily" class="textSettingsLabel" for="textFontFamily">Font :</label>
            <select id="textFontFamily" onchange="na.ds.textSettingsSelected_updateDialog()">
                <option value="ABeeZee">ABeeZee</option>
                <option value="Aclonica">Aclonica</option>
                <option value="Acme">Acme</option>
                <option value="Actor">Actor</option>
                <option value="Advent Pro">Advent Pro</option>
                <option value="Akronim">Akronim</option>
                <option value="Alex Brush">Alex Brush</option>
                <option value="Architects Daughter">Architects Daughter</option>
                <option value="Archivo Black">Archivo Black</option>
                <option value="Baloo">Baloo</option>
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Caveat">Caveat</option>
                <option value="Chewy">Chewy</option>
                <option value="Cookie">Cookie</option>
                <option value="Cormorant">Cormorant</option>
                <option value="Courgette">Courgette</option>
                <option value="Covered By Your Grace">Covered By Your Grace</option>
                <option value="Dancing Script">Dancing Script</option>
                <option value="El Messiri">El Messiri</option>
                <option value="Exo">Exo</option>
                <option value="Exo 2">Exo 2</option>
                <option value="Fjalla One">Fjalla One</option>
                <option value="Galada">Galada</option>
                <option value="Gloria Hallelujah">Gloria Hallelujah</option>
                <option value="Great Vibes">Great Vibes</option>
                <option value="Handlee">Handlee</option>
                <option value="Indie Flower">Indie Flower</option>
                <option value="Kalam">Kalam</option>
                <option value="Kaushan Script">Kaushan Script</option>
                <option value="Khula">Khula</option>
                <option value="Knewave">Knewave</option>
                <option value="Krona One">Krona One</option>
                <option value="Lacquer">Lacquer</option>
                <option value="Lato:300,300i,400,400i">Lato</option>
                <option value="Lemonada">Lemonada</option>
                <option value="Lusitana">Lusitana</option>
                <option value="M PLUS 1p">M PLUS 1p</option>
                <option value="Marck Script">Marck Script</option>
                <option value="Merienda One">Merienda One</option>
                <option value="Modak">Modak</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Montserrat Alternates">Montserrat Alternates</option>
                <option value="Mr Dafoe">Mr Dafoe</option>
                <option value="Mukta Malar">Mukta Malar</option>
                <option value="Nanum Pen Script">Nanum Pen Script</option>
                <option value="Noto Serif JP">Noto Serif JP</option>
                <option value="Odibee Sans">Odibee Sans</option>
                <option value="Oleo Script">Oleo Script</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Orbitron">Orbitron</option>
                <option value="Pacifico">Pacifico</option>
                <option value="Parisienne">Parisienne</option>
                <option value="Pathway Gothic One">Pathway Gothic One</option>
                <option value="Permanent Marker">Permanent Marker</option>
                <option value="Playball">Playball</option>
                <option value="Pridi">Pridi</option>
                <option value="PT Sans">PT Sans</option>
                <option value="Quattrocento Sans">Quattrocento Sans</option>
                <option value="Raleway">Raleway</option>
                <option value="Rock Salt">Rock Salt</option>
                <option value="Sacramento">Sacramento</option>
                <option value="Saira Condensed">Saira Condensed</option>
                <option value="Saira Extra Condensed">Saira Extra Condensed</option>
                <option value="Saira Semi Condensed">Saira Semi Condensed</option>
                <option value="Satisfy">Satisfy</option>
                <option value="Shadows Into Light">Shadows Into Light</option>
                <option value="Shadows Into Light Two">Shadows Into Light Two</option>
                <option value="Sigmar One">Sigmar One</option>
                <option value="Signika Negative">Signika Negative</option>
                <option value="Slabo 27px">Slabo 27px</option>
                <option value="Source Code Pro">Source Code Pro</option>
                <option value="Special Elite">Special Elite</option>
                <option value="Spectral">Spectral</option>
                <option value="Spinnaker">Spinnaker</option>
                <option value="Sriracha">Sriracha</option>
                <option value="Unica One">Unica One</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Work Sans">Work Sans</option>
            </select>
            <div class="flexBreak"></div>

            <label id="labelFontFamily" class="textSettingsLabel" for="fontFamily">Font color :</label>
            <input id="textColorpicker" class="dialogSettingsComponent" style="position:absolute;top:95px;"></input>
            <div class="flexBreak"></div>
            
            <label id="labelTextShadow" class="textSettingsLabel">Text shadow :</label>
            <div id="textShadow">
                <img src="/nicerapp/siteMedia/iconCreate.png" onclick="na.ds.addTextShadow()"/>
                <img src="/nicerapp/siteMedia/iconDelete.png" onclick="na.ds.deleteTextShadow()"/>
                <div class="flexBreak"></div>
                <div id="textShadow_0" class="textShadow" style="background:navy;border:1px solid white; border-radius:10px; margin : 5px; padding : 5px;">ABC XYZ</div>
            </div>
            <div class="flexBreak"></div>
            
            <label id="labelTextShadowXoffset" class="textSettingsLabel" for="textShadowXoffset">Text shadow horizontal offset :</label>
            <input id="textShadowXoffset" type="range" min="-10" max="10" value="2" class="sliderOpacityRangeBorderSettings" onchange="na.ds.textSettingsSelected();"/>
            <div class="flexBreak"></div>

            <label id="labelTextShadowYoffset" class="textSettingsLabel" for="textShadowYoffset">Text shadow vertical offset :</label>
            <input id="textShadowYoffset" type="range" min="-10" max="10" value="2" class="sliderOpacityRangeBorderSettings" onchange="na.ds.textSettingsSelected();"/>
            <div class="flexBreak"></div>

            <label id="labelTextShadowBlurRadius" class="textSettingsLabel" for="textShadowBlurRadius">Text shadow blur radius :</label>
            <input id="textShadowBlurRadius" type="range" min="0" max="10" value="2" class="sliderOpacityRangeBorderSettings" onchange="na.ds.textSettingsSelected();"/>
            <div class="flexBreak"></div>

            <label id="labelTextShadowColor" class="textSettingsLabel" for="textShadowColor">Text shadow color :</label>
            <input id="textShadowColorpicker" class="dialogSettingsComponent" style="position:absolute;top:95px;"></input>
            <div class="flexBreak"></div>
        </div>
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
