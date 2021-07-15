		<table id="logoAndSiteTitle" border="0" bordercolor="blue">
            <tr>
                <td>
                    <table id="tableFor_saCompanyLogo" border="0" style="width:300px;">
                        <tr>
                            <td>
                                <div id="divFor_saCompanyLogo" style="margin-left:40px;width:200px;height:200px;background:rgba(0,0,0,0.7);border-radius:10px;border:solid rgba(0,0,0,0.8);padding:5px;box-shadow:4px 4px 2px rgba(0,0,0,0.7);">
                                    <canvas id="saCompanyLogo" width="200" height="200" onclick="event.data={element:'saCompanyLogo'}; na.logo.settings.stage.removeAllChildren(); na.logo.init_do_createLogo('saCompanyLogo','countryOfOriginColors');"></canvas><!-- this version can not actually be resized yet. hardcoded values in the drawing functions. -->
                                    <script type="text/javascript">
                                        $(document).ready(function() {
                                            setTimeout(function() {
                                                startLogo('saCompanyLogo', 'countryOfOriginColors');
                                            }, 5000);
                                        });
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
                                    <h1 id="pageTitle" style="padding-left:20px;font-family:Krona One;margin-block-start:0;margin-block-end:0.2em;text-shadow:4px 4px 2px rgba(0,0,0,0.7)">nicer.app</h1>
                                    <script type="text/javascript">
                                    setTimeout(function() {
                                        var vividTextCmd = {
                                                el : jQuery('#pageTitle')[0],
                                                theme : na.cg.themes.saColorgradientSchemeOrangeYellow, 
                                                animationType : na.vividText.globals.animationTypes[0],
                                                animationSpeed : 4 * 1000
                                        };
                                        na.vividText.initElement (vividTextCmd);	
                                    }, 500);
                                    </script>
                                    <!--The web/pad/phone user-interface framework for bold new frontiers.-->
                                    <h2 id="tagline1" style="padding-left:20px;font-family:ABeeZee;text-shadow:2px 2px 1px rgba(0,0,0,0.7)">
                                    THE web/pad/phone/TV<br/>
                                    user-interface framework<br/>
                                    and apps platform
                                    </h2>
                                    <!--
                                    <h3 id="pageSubTitle" style="padding-left:20px;font-family:Krona One;text-shadow:4px 4px 2px rgba(0,0,0,0.7)">Beta phase</h3>
                                    <script type="text/javascript">
                                    setTimeout(function() {
                                    var vividTextCmd = {
                                            el : jQuery('#pageSubTitle')[0],
                                            theme : na.cg.themes.saColorgradientSchemeOrangeYellow, 
                                            animationType : na.vividText.globals.animationTypes[0],
                                            animationSpeed : 4 * 1000
                                    };
                                    na.vividText.initElement (vividTextCmd);	
                                    }, 1000);
                                    </script>
                                    -->
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
            'news' => array (
                'section' => 'English_News'
            )
        ),
        'newsHeadlines_englishNews_worldHeadlines' => array(
            //'#siteContent' => 'nicerapp/news/newsApp.siteContent.php?section=English%20News%20World%20Headlines',
            //'news' => array ('section' => 'English_News__World_Headlines')
            'news' => array (
                'section' => 'English_News__World_Headlines'
            )
        ),
        'newsHeadlines_nederlandsNieuws' => array (
            'news' => array (
                'section' => 'Nederlands_Nieuws'
            )
        ),
        'newsHeadlines_nederlandsNieuws_wereldNieuws' => array (
            'news' => array (
                'section' => 'Nederlands_Nieuws__Wereld'
            )
        ),
        'newsHeadlines_deutscheNachrichten' => array (
            'news' => array (
                'section' => 'Deutsche_nachrichten'
            )
        ),
        'newsHeadlines_arabic' => array (
            'news' => array (
                'section' => 'Arabic'
            )
        ),
        'analytics' => array (
            'analytics' => array()
        ),
        '3Dcube' => array (
            '3Dcube' => array()
        ),
        '3Dmodels' => array (
            '3Dmodels' => array()
        ),
        'backgroundsBrowser' => array (
            'backgroundsBrowser' => array()
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
        ),
        'cms' => array (
            'meta' => array (
                'mustBeLoggedIn' => true
            ),
            'cms' => array (
                'page' => 'index'
            )
        ),
        'webmail' => array (
            'webmail-2.0.0' => array (
                'page' => 'index'
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
    <script type="text/javascript">
    $(document).ready(function() {
        $('.contentSectionTitle2').each (function(idx,el) {
            setTimeout (function() {
                vividTextCmd = {
                        el : el,
                        theme : na.cg.themes.saColorgradientSchemeOrangeYellow, 
                        animationType : na.vividText.globals.animationTypes[0],
                        animationSpeed : 4 * 1000
                };
                na.vividText.initElement (vividTextCmd);	
            }, 20 * (idx + 1) );
        });
        
        $('.contentSectionTitle3').each (function(idx,el) {
            setTimeout (function() {
                vividTextCmd = {
                        el : el,
                        theme : na.cg.themes.saColorgradientSchemeGreenVividText, 
                        animationType : na.vividText.globals.animationTypes[0],
                        animationSpeed : 4 * 1000
                };
                na.vividText.initElement (vividTextCmd);	
            }, 20 * idx);
        });
        
    });
    </script>
    
    <h2 class="contentSectionTitle2">What is nicerapp?</h2>
    
    <p>
    Nicerapp embraces the latest web technologies to provide beautiful new views to your data and files.<br/>
    Page owners and end-users can select any tiled, photo or even <a href="https://youtube.com" target="yt">youtube</a> video backgrounds to the content or apps.<br/>
    </p>
    
    <p>
    It is also licensed to be completely free, under the <a href="https://opensource.org/licenses/MIT" target="MIT_LICENSE">MIT License</a>.<br/>
    Full sources are available at <a href="https://github.com/nicerapp/nicerapp_v2" target="naGithub">https://github.com/nicerapp/nicerapp_v2</a>.<br/>
    Documentation is available at <a href="https://github.com/nicerapp/nicerapp_v2#readme" target="naDocs">https://github.com/nicerapp/nicerapp_v2#readme</a>.
    </p>
    
    <p>2021/7jul/11sun 21:04 CET :</p>
    <p>
    If you now create an account on <a href="https://said.by" target="saidBy">https://said.by</a>,<br/>
    <em>you can now edit the look of a window/dialog on sites made with my nicerapp software package</em> per page and per site for yourself (per app comes a little later).<br/>
    You can also use the blogging features on that site to create articles which you can then, after publishing the article, get a very short and nice-looking URL for at my <a href="https://zoned.at" target="zonedAt">https://zoned.at</a>.<br/>
    </p>
    <p>
    Site backgrounds are now saved in a cookie in all of the browsers used by Guest accounts (password is also 'Guest')<br/>
    and in the database for anyone having his/her own account,<br/>
    and can be selected in the 'Site Window Settings' window, by hovering over the top-left part of any window (called a 'vividDialog' internally) on any nicerapp site, and clicking on the painters palette icon that then appears.<br/>
    </p>
    <p>
    Development will not stop here.<br/>
    I intend to improve a little more upon what i have so far for this complete rewrite called nicerapp_v2.
    </p>
    <p>
    I will focus as well in the coming days on completing the webmail features of nicerapp.<br/>
    I may however, have to rewrite the business logic code on the server for that, which could take a week, maybe even 2 weeks to complete.
    </p>

    <h2 class="contentSectionTitle2">Available Apps</h2>


    <a href="<?php echo $urls['webmail'];?>"><h3>Webmail</h3></a>
    
    <a href="<?php echo $urls['cms'];?>"><h3>Blogging features</h3></a>
    
    <a href="https://said.by" target="saidBy"><h3>Blogging features (on https://said.by)</h3></a>
    
    <a href="https://zoned.at" target="zonedAt"><h3>URL redirection (on https://zoned.at)</h3></a>
    
    <a href="<?php echo $urls['music'];?>"><h3>Music</h3></a>

    
    
    <h3 class="contentSectionTitle3">News</h3>
    Some of these can be further categorized through the menu that will load up at the top-right side of the site.<br/>
    
    <ul>
        <li><a href="<?php echo $urls['newsHeadlines_englishNews'];?>">English News</a></li>
        <li><a href="<?php echo $urls['newsHeadlines_englishNews_worldHeadlines'];?>">English News : World Headlines only</a></li>
        <li><a href="<?php echo $urls['newsHeadlines_nederlandsNieuws'];?>">Nederlands Nieuws</a></li>
        <li><a href="<?php echo $urls['newsHeadlines_nederlandsNieuws_wereldNieuws'];?>">Nederlands Nieuws : alleen internationale headlines</a></li>
        <li><a href="<?php echo $urls['newsHeadlines_deutscheNachrichten'];?>">Deutsche Nachrichten</a></li>
        <li><a href="<?php echo $urls['newsHeadlines_arabic'];?>">Arabic News (in English)</a></li>
    </ul>
    
    <a href="<?php echo $urls['tarot'];?>"><h3>Tarot game</h3></a>

    
    
    <h2 class="contentSectionTitle2" >Under development (but currently stalled)</h2>
    
    <a href="<?php echo $urls['backgroundsBrowser'];?>"><h3>3D file manager</h3></a>
    
    <h2 class="contentSectionTitle2" >Development direction</h2>
    <p>
        <ol>
            <li>(2021) Social media features : instant messaging, e-mail functionality, features similar to what facebook offers, and forum features.</li>
            <li>(2022) Webshop functionality.</li>
        </ol>
    </p>
    
    
    
    
    <h2 class="contentSectionTitle2" >Demos</h2>
    <a href="<?php echo $urls['3Dcube'];?>"><h3>3D demo : cube</h3></a>
    <a href="<?php echo $urls['3Dmodels'];?>"><h3>3D demo : loading of models (slow to start up)</h3></a>
