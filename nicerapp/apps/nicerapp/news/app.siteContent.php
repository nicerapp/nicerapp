<?php
require_once (dirname(__FILE__).'/functions.php');
require_once (dirname(__FILE__).'/sources-list.php');
//$appParams = getLocationbarInfo($_SERVER['QUERY_STRING']);
$appParams = array (
    'apps' => array (
        'news' => $_GET
    )
);
$app = json_decode (base64_decode_url($_GET['apps']), true);
echo '<pre>'.json_encode($app,JSON_PRETTY_PRINT); die();
//$newsApp_content = getNewsAppContent ($appParams);

	global $saSiteHTTP; global $saSiteDomain; global $saSiteRootFolder; global $saFrameworkFolder;
	global $saSiteHD; global $saFrameworkHD; global $saSiteURL; global $saFrameworkURL;
	global $saIsLocalhost; global $saHTDOCShd;
	global $saServerOperatingSystem; global $saDeveloperMode;
	
	global $saUpstreamRootURL; global $locationbarInfo;
	global $saUIdefaults;

    $pageTitle = str_replace('__', '&nbsp;', $appParams['apps']['news']['section']);
    $pageTitle = str_replace('_', '&nbsp;', $pageTitle);
?>
        <link type="text/css" rel="StyleSheet" media="screen" href="/nicerapp/apps/nicerapp/news/index.css?changed=<?php echo date('Ymd-His', filectime(dirname(__FILE__).'/index.css'));?>"/>
        <script type="text/javascript" src="/nicerapp/apps/nicerapp/news/app.siteContent.source-2.4.0.js?changed=<?php echo date('Ymd-His', filectime(dirname(__FILE__).'/app.siteContent.source-2.4.0.js'));?>"></script>
        <style>
        </style>

    
            <div id="siteContent__header" class="saHeaderInDialog" style="position:absolute;width:100%;height:2em">
                <table id="newsApp_title_table" style="width:100%;">
                    <tr>
                        <td id="td_newsApp_title" style="width:1%;white-space:nowrap;margin:5px;vertical-align:middle;">
                        <h1 id="newsApp_title" class="newsApp_header" style="font-family:'Architects Daughter';display:none;padding:0px;margin:0px;vertical-align:middle;"><?php echo $pageTitle;?></h1> 
                        </td>
                        <!--<td style="width:20px;">&nbsp;</td>-->
                        <td id="td_newsApp_searchbar" style="vertical-align:middle;display:none;">
                        <input id="newsApp_searchbar" style="display:none; font-family:'Architects Daughter';background:rgba(255,255,255,1); border-radius:7px; border : 1px solid black;vertical-align:middle" onchange="na.apps.loaded.newsApp.onSearch(event)"/>
                        <img id="newsApp_searchbar__enterQuery" title="search the entire news database (up to 14 days into the past)" src="/nicerapp/siteMedia/na.question-mark.svg.png" style="display:none;height:2em;vertical-align:middle" onclick="na.apps.loaded.newsApp.onSearch(event)"/>
                        <img id="newsApp_searchbar__abandonQuery" title="abandon the current search query and display the very latest news again" src="/nicerapp/siteMedia/na.reset.png" style="display:none;height:2em;vertical-align:middle" onclick="na.apps.loaded.newsApp.clearSearch(event)"/>
                        </td>
                        <!--<td style="width:20px;">&nbsp;</td>
                        <td style="text-align:left"><span id="newsApp_info" style="font-family:'Architects Daughter';font-size:120%;font-weight:bold;text-align:left;display:none;">This app will load up older news-items whenever needed</span></td>
                        <td><span id="newsApp_debug" class="newsApp_header" style="font-weight:bold;"></span></td>
                        <td style="text-align:right"><span id="newsApp_timer" class="newsApp_header" style="display:none;font-weight:bold;"></span></td>-->
                        <td style="width:70px;" id="newsApp_header_buttons">
                        <img id="newsApp_search" src="/nicerapp/apps/nicerapp/news/btnSearch.png" style="vertical-align:middle;height:2em" onclick="na.apps.loaded.newsApp.viewSearchbar()" title="Search for specific news" alt="Search for specific news"/>
                        <img id="newsApp_lock" class="btn" src="/nicerapp/apps/nicerapp/news/btnLock_off.png" onclick="na.apps.loaded.newsApp.toggleLock();" style="vertical-align:middle;height:2em;display:none;z-index:9999999999999;" title="[SPACE] pauses" alt="SPACE key pauses"/>
                        <img id="newsApp_next" class="btn" src="/nicerapp/apps/nicerapp/news/btnNext.png" onclick="na.apps.loaded.newsApp.gotoNextPage();" style="vertical-align:middle;height:2em;display:none;z-index:9999999999999;" title="[ALT] goes to next page" alt="ALT key goes to next page"/>
                        </td>
                    </tr>
                </table>
                
                <script type="text/javascript">
                /*
                var vividTextCmd = {
                        el : jQuery('#newsApp_info')[0],
                        theme : na.cg.themes.saColorgradientSchemeOrangeYellow_netherlands, 
                        animationType : na.vividText.globals.animationTypes[0],
                        animationSpeed : 4 * 1000
                };
                na.vividText.initElement (vividTextCmd);	*/
                </script>                
                <div id="app_mainmenu" class="vividMenu" theme="dark" style="position:absolute;width:200px;height:35px;opacity:0.0001;display:none;">
                    <?php echo file_get_contents(dirname(__FILE__).'/mainmenu.php');
                    ?>
                </div>
            </div>
            <!--
            <div id ="siteContent__sidebar__left" class="saSidebarLeftInDialog" style="position:absolute;top:0px;left:0px;width:30px;height:10px;background:yellow;z-index:200;"></div>
            <div id ="siteContent__sidebar__right" class="saSidebarRightInDialog" style="position:absolute;top:0px;left:0px;width:30px;height:10px;background:yellow;z-index:200;"></div>
            -->
            
<div class="loading">
         <div class="loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="loaderAfter">
        Now Loading
        </div>
</div>            
            <div id ="siteContent__content" class="saContent" style="position:absolute;top:0px;left:0px;width:100%;height:100%;">
                <div id="newsApp_content_shadow" class="" style="position:absolute;width:100%;height:100%;opacity:0.0001;z-index:-1"></div>
                <div id="newsApp_content" class="" style="position:absolute;width:100%;height:100%;z-index:10"></div>
            </div> 
            <div id="siteContent__textarea" style="display:none;position:relative;opacity:0">
                <textarea id="siteContent__textareaCopy"></textarea>
            </div>
                
            
            <!--
            <div id="newsApp_content" class="saContent" style="width:100%;height:auto">
                Under construction.
            </div>
            -->
            <!--
            <div id ="siteContent__footer" class="saFooterInDialog" style="position:absolute;height:40px;background:green;z-index:200;"></div>
            -->
        
