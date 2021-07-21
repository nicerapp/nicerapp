		<table id="logoAndSiteTitle" border="0" bordercolor="blue">
            <tr>
                <td>
                    <table id="tableFor_saCompanyLogo" border="0" style="width:300px;">
                        <tr>
                            <td>
                                <div id="divFor_saCompanyLogo" style="width:200px;height:200px;background:rgba(0,0,0,0.7);border-radius:10px;border:solid rgba(0,0,0,0.8);padding:5px;box-shadow:4px 4px 2px rgba(0,0,0,0.7);">
                                    <canvas id="saCompanyLogo" width="200" height="200" onclick="event.data={element:'saCompanyLogo'}; na.logo.settings.stage.removeAllChildren(); na.logo.init_do_createLogo('saCompanyLogo','countryOfOriginColors');"></canvas><!-- this version can not actually be resized yet. hardcoded values in the drawing functions. -->
                                    <script type="text/javascript">
                                        $(document).ready(function() {
                                            if ($(window).width() < na.site.globals.reallySmallDeviceWidth) {
                                                var callback = function () {
                                                    $('#tableFor_saCompanyLogo').css({display:'none'});
                                                    $('#divFor_said_by_logo').css({width:70,height:70, marginLeft : 0});
                                                    $('#tableFor_said_by_logo').css({width:80});
                                                };
                                            } else if ($(window).width() < na.site.globals.smallDeviceWidth) {
                                                var callback = function () {
                                                    $('#tableFor_saCompanyLogo, #divFor_saCompanyLogo').css({width : 70, height : 70});
                                                    $('#saCompanyLogo').attr('width',70).attr('height',70);
                                                    $('#divFor_said_by_logo').css({width:70,height:70, marginLeft : 0});
                                                    $('#tableFor_said_by_logo').css({width:80});
                                                    $('#headerSite, #headerSite h1, #headerSite h2, #headerSite h3').css ({ fontSize : '84%', paddingLeft : 0 });
                                                    $('#headerSiteDiv').css ({ height : 70, width : 80 });
                                                    $('#headerSiteDiv div').css ({ height : 0, width : 80 });
                                                    startLogo('saCompanyLogo', 'countryOfOriginColors');
                                                };
                                            } else {
                                                var callback = function () {
                                                    startLogo('saCompanyLogo', 'countryOfOriginColors');
                                                };
                                            }
                                            na.m.waitForCondition('desktop ready', function () {
                                                return na.site.settings.desktopReady;
                                            }, callback, 200);
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
                                    <h1 id="pageTitle" style="padding-left:20px;font-family:Krona One;margin-block-start:0;margin-block-end:0.2em;text-shadow:4px 4px 2px rgba(0,0,0,0.7)">said.by</h1>
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
                                    Blogging platform<br/>
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
                <td class="td_spacer" style="width:5px;height:310px;">&nbsp;</td>
                <td>
                    <table id="tableFor_said_by_logo" border="0" style="width:300px;">
                        <tr>
                            <td>
                                <div id="divFor_said_by_logo" style="margin-left:40px;width:200px;height:200px;background:rgba(0,0,0,0.7);border-radius:10px;border:solid rgba(0,0,0,0.8);padding:5px;box-shadow:4px 4px 2px rgba(0,0,0,0.7);">
                                    <img src="/nicerapp/domainConfigs/said.by/—Pngtree—business people sitting at the_5189991.200x200.png" style="width:100%;"/>
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
            </tr>
        </table>
<?php 
    global $cms;
    $apps = array(
        'cms' => array (
            'meta' => array (
                'mustBeLoggedIn' => true
            ),
            'cms' => array (
                'page' => 'index'
            )
        ),
        'text_privacyPolicy' => array (
            'diskText' => array (
                'id' => 'privacyPolicy'
            )
        ),
        'text_termsOfUse' => array (
            'diskText' => array (
                'id' => 'termsOfUse'
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
    <h2 class="contentSectionTitle2">What is https://said.by?</h2>
    
    <p>said.by is a free-to-use blogging platform that allows for tiled, photo, and even video backgrounds to your content.</p>
    
    <p>You can <a href="javascript:na.site.newAccount();">register</a> or <a href="javascript:na.site.displayLogin();">login</a> to access the <a href="<?php echo $urls['cms'];?>">blogging features</a>.</p>
    
    <p>You can get short URLs (website addresses) for URLs of yours via <a href="https://zoned.at" target="zonedAt">https://zoned.at</a>.</p>
    
    <p><a href="<?php echo $urls['text_privacyPolicy'];?>">Privacy policy</a>.</p>
    <p><a href="<?php echo $urls['text_termsOfUse'];?>">Terms of use</a>.</p>

    <h2 class="contentSectionTitle2">Business plan</h2>
    
    <p>The software that runs on said.by is open-sourced (MIT-licensed) on <a href="https://nicer.app" target="nicerDotApp">https://nicer.app</a> and <a href="https://github.com/nicerapp/nicerapp" target="githubNicerApp">https://github.com/nicerapp/nicerapp</a> for a copy of the full sources and the documentation (scroll down for that on that page).
    </p>
    
    <p>I currently plan to keep said.by completely ads free, and *maybe*, eventually, start charging people a minor monthly fee (no more than 8 Euros per month probably) for new features beyond a fairly wide range of 'basic features'. These new features will be written later in 2021 or even later than that.
    </p>
    
    <p>How can i do this?<br/>
    Well, i have a stable but very meager government welfare budget due to prolonged and unavoidable, sometimes severe, sleep-deprivation and day-night-rythm stability "issues" in my life. In my country that makes me elligible for such a budget by laws that i hope will not change.
    </p>
