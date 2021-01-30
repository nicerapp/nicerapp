		<table id="logoAndSiteTitle" border="0" bordercolor="blue">
            <tr>
                <td>
                    <table id="tableFor_saCompanyLogo" border="0" style="width:300px;">
                        <tr>
                            <td>
                                <div id="divFor_saCompanyLogo" style="margin-left:40px;width:200px;height:200px;background:rgba(0,0,0,0.7);border-radius:10px;border:solid rgba(0,0,0,0.8);padding:5px;box-shadow:4px 4px 2px rgba(0,0,0,0.7);">
                                    <canvas id="saCompanyLogo" width="200" height="200" onclick="event.data={element:'saCompanyLogo'}; na.logo.settings.stage.removeAllChildren(); na.logo.init_do_createLogo('saCompanyLogo','countryOfOriginColors');"></canvas><!-- this version can not actually be resized yet. hardcoded values in the drawing functions. -->
                                    <script type="text/javascript">
                                        setTimeout (function () {
                                            startLogo('saCompanyLogo', 'countryOfOriginColors');
                                        }, 500);
                                    </script> 
                                    
                                </div>
                            </td>
                        </tr>
                        <!--
                        <tr class="tr_spacer" style="height:20px;">
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="vertical-align:middle;font-family:Krona One;font-size:100%;height:1em;">
                                <div style="background:rgba(0,0,0,0.7);border-radius:10px;border:solid rgba(0,0,0,0.8);padding:5px;box-shadow:4px 4px 2px rgba(0,0,0,0.7);">
                                    <br/>
                                    <h1 id="pageLogoTitle" style="padding-left:10px;font-family:Krona One;font-size:100%;text-shadow:4px 4px 2px rgba(0,0,0,0.7)">country of origin colors</h1>
                                    <script type="text/javascript">
                                    var vividTextCmd = {
                                            el : jQuery('#pageLogoTitle')[0],
                                            theme : na.cg.themes.saColorgradientSchemeOrangeYellow_netherlands, 
                                            animationType : na.vividText.globals.animationTypes[0],
                                            animationSpeed : 4 * 1000
                                    };
                                    na.vividText.initElement (vividTextCmd);	
                                    </script>
                                </div>
                            </td>
                        </tr>
                        -->
                    </table>
                </td>
                <td class="td_spacer" style="width:5px;height:310px;">&nbsp;</td>
                <td>
                    <table id="headerSite" border="0" bordercolor="red">
                        <tr>
                            <td>
                                <div id="headerSiteDiv" style="height:200px;width:320px;background:rgba(0,0,0,0.7);border-radius:10px;border:solid rgba(0,0,0,0.8);padding:5px;box-shadow:4px 4px 2px rgba(0,0,0,0.7)">
                                    <div style="height:10px;">&nbsp;</div>
                                    <h1 id="pageTitle" style="padding-left:20px;font-family:Krona One;margin-block-start:0;margin-block-end:0.2em;font-size:200%;text-shadow:4px 4px 2px rgba(0,0,0,0.7)">nicer.app</h1>
                                    <script type="text/javascript">
                                    var vividTextCmd = {
                                            el : jQuery('#pageTitle')[0],
                                            theme : na.cg.themes.saColorgradientSchemeOrangeYellow, 
                                            animationType : na.vividText.globals.animationTypes[0],
                                            animationSpeed : 4 * 1000
                                    };
                                    na.vividText.initElement (vividTextCmd);	
                                    </script>
                                    <!--The web/pad/phone user-interface framework for bold new frontiers.-->
                                    <h2 id="tagline1" style="padding-left:20px;font-family:ABeeZee;font-size:140%;text-shadow:2px 2px 1px rgba(0,0,0,0.7)">
                                    THE web/pad/phone/TV<br/>
                                    user-interface framework<br/>
                                    and apps platform
                                    </h2>
                                    <h3 id="pageSubTitle" style="padding-left:20px;font-family:Krona One;text-shadow:4px 4px 2px rgba(0,0,0,0.7)">Beta phase</h3>
                                    <script type="text/javascript">
                                    var vividTextCmd = {
                                            el : jQuery('#pageSubTitle')[0],
                                            theme : na.cg.themes.saColorgradientSchemeOrangeYellow, 
                                            animationType : na.vividText.globals.animationTypes[0],
                                            animationSpeed : 4 * 1000
                                    };
                                    na.vividText.initElement (vividTextCmd);	
                                    </script>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
<?php 
    global $cms;
    $apps = array(
        'newsHeadlines_englishNews' => array(
            //'#siteContent' => 'nicerapp/news/newsApp.siteContent.php?section=English%20News',
            //'news' => array ('section' => 'English_News')
            'news' => 'English_News'
        ),
        'newsHeadlines_englishNews_worldHeadlines' => array(
            //'#siteContent' => 'nicerapp/news/newsApp.siteContent.php?section=English%20News%20World%20Headlines',
            //'news' => array ('section' => 'English_News__World_Headlines')
            'news' => 'English_News__World_Headlines'
        ),
        'analytics' => array (
            'analytics' => array()
        ),
        'tarot' => array (
            'tarot' => array (
                'reading' => '3-Cards',
                'deck' => 'Original-Rider-Waite'
            )
        ),
        'music' => array (
            'music' => array (
                'set' => 'index'
            )
        )
    );
    $json = array();
    $urls = array();
    foreach ($apps as $appName => $appSettings) {
        $json[$appName] = json_encode($appSettings);
        $urls[$appName] = '/apps/'.base64_encode_url($json[$appName]);
    };
?>
    <h2>Available Apps</h2>
    
    <h3>News</h3>
    <ul>
        <li><a href="<?php echo $urls['newsHeadlines_englishNews'];?>">English News</a></li>
        <li><a href="<?php echo $urls['newsHeadlines_englishNews_worldHeadlines'];?>">English News : World Headlines only</a></li>
    </ul>
    
    <a href="<?php echo $urls['tarot'];?>"><h3>Tarot game</h3></a>
    
    <a href="<?php echo $urls['music'];?>"><h3>Music</h3></a>

