<?php 
require_once(dirname(__FILE__).'/functions.php');
require_once(dirname(__FILE__).'/selfHealer/class.selfHealer.php');
require_once(dirname(__FILE__).'/3rd-party/sag/src/Sag.php');

class nicerAppCMS {
    public $version = '2.0.0';
    public $about = array(
        'whatsThis' => 'NicerApp Content Management System PHP class',
        'version' => '2.0.0',
        'history' => array (
            '1.y.z' => 'Compatible with older browsers',
            '2.y.z' => 'Compatible with browsers released after 2015, but much more efficient'
        ),
        'created' => 'Sunday, 10 January 2021 11:45 CET',
        'lastModified' => 'Thursday, 18 March 2021 12:05 CET',
        'copyright' => 'Copyright (c) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    );
    
    public $domain;
    public $basePath;
    public $cssTheme = 'dark';
    public $selfHealer;
    public $app;
    
    public function init () {
        $this->basePath = realpath(dirname(__FILE__).'/..');
        //echo $this->basePath; die();
        $this->cssTheme = 'dark';
        if (array_key_exists ('siteTheme', $_POST)) $this->cssTheme = $_POST['siteTheme'];
        if (array_key_exists ('siteTheme', $_COOKIE)) $this->cssTheme = $_COOKIE['siteTheme'];
        $p1 = realpath(dirname(__FILE__).'/../..');
        $p2 = realpath(dirname(__FILE__).'/..');
        $this->domain = str_replace($p1.'/','', $p2);
        $this->domainName = $this->domain; // i do recommend you use only this variant : domainName.
    }
    
    public function getSite() {
        $templateFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/index.template.php');

        if (array_key_exists('apps', $_GET)) {
            $app = json_decode (base64_decode_url($_GET['apps']), true);
            $this->app = $app;
            //var_dump ($app); die();
            //$files = getFilePathList (realpath(dirname(__FILE__)).'/apps', true, '/app.site.*.php/', array('file'), 3);
            $folders = getFilePathList (realpath(dirname(__FILE__)).'/apps', true, '/.*/', array('dir'), 1);
            //echo '<pre>'; var_dump ($folders); die();
            foreach ($folders as $idx => $folder) {
                foreach ($app as $appName => $appSettings) {
                    $filename = '/apps/'.basename($folder).'/'.$appName.'/app.title.site.php';
                    if (file_exists(dirname(__FILE__).$filename)) $titleFile = dirname(__FILE__).$filename;
                }
            }
        } else {    
            $app = null;
            $titleFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/index.title.php');
        }
        if (!isset($app) && !file_exists($titleFile)) {
            trigger_error ('app.title.site.php missing for app=frontpage_of_site, $titleFile="'.$titleFile.'"', E_USER_ERROR);
        } elseif (!isset($titleFile)) {
            trigger_error ('app.title.site.php missing for app='.json_encode($app), E_USER_ERROR);
        }
        
        $getAsIndividualLinks = $this->domain==='localhost_v2';
        if ($getAsIndividualLinks) {
            $cssFiles = $this->getFiles_asIndividualLinks('css', 'css');
            $cssThemeFiles = $this->getFiles_asIndividualLinks('css', 'cssTheme');
            $javascriptFiles = $this->getFiles_asIndividualLinks('js', 'javascripts');
        } else {
            $cssFiles = $this->getFiles('css', 'css');
            $cssThemeFiles = $this->getFiles('css', 'cssTheme');
            $javascriptFiles = $this->getFiles('js', 'javascripts');
        }
        
        //$div_siteContent = $this->getDivSiteContent();
        $div_siteMenu = $this->getSiteMenu();
        $replacements = array (
            //'{$app}' => ( is_array($app) ? json_encode($app, JSON_PRETTY_PRINT) : '{}' ),
            '{$title}' => execPHP($titleFile),
            '{$domain}' => $this->domain,
            '{$cssFiles}' => $cssFiles,
            '{$cssThemeFiles}' => $cssThemeFiles,
            '{$pageSpecificCSS}' => $this->getPageCSS(),
            '{$javascriptFiles}' => $javascriptFiles,
            '{$div_siteMenu}' => $div_siteMenu,
            '{$theme}' => $this->cssTheme,
            '{$viewport}' => $this->getMetaTags_viewport()
        );
        $content = $this->getContent();
        foreach ($content as $divName=>$contentForDiv) {
            $arr = array ( '{$div_'.$divName.'}' => $contentForDiv );
            $replacements = array_merge ($replacements, $arr);
        }
        $search = array_keys($replacements);
        $replace = array_values($replacements);
        $html = str_replace ($search, $replace, execPHP($templateFile));
        
        return $html;
    }
    
    public function getFiles($type = null, $indexPrefix = null) {
        switch ($indexPrefix) {
            case 'cssTheme': $indexPrefix2 = $indexPrefix; $filenamePrefix = '.'.$this->cssTheme; break;
            case 'css' : $indexPrefix2 = ''; $filenamePrefix = ''; break;
            default: $indexPrefix2 = ''; $filenamePrefix = ''; break;
        };
        $filename = realpath(dirname(__FILE__).'/domainConfigs').'/'.$this->domain.'/index.'.$indexPrefix.$filenamePrefix.'.json';
        $files = json_decode(file_get_contents($filename), true);
        switch ($type) {
            case 'css': $lineSrc = "\t".'<link type="text/css" rel="StyleSheet" href="{$src}?c={$changed}">'."\r\n"; break;
            case 'js': $lineSrc = "\t".'<script type="text/javascript" src="{$src}?c={$changed}"></script>'."\r\n"; break;
        };
        $lines = '';
        $c = '';
        $newest = strtotime ('1970-01-01');
        foreach ($files as $idx => $file) {
            $file = str_replace ('{$domain}', $this->domain, $file);
            $c .= file_get_contents($this->basePath.$file).PHP_EOL.PHP_EOL;
            $fdt = filectime($this->basePath.'/'.$file);
            if ($fdt > $newest) $newest = $fdt;
        };
        if ($indexPrefix2!=='') {
            $cacheFilename = realpath(dirname(__FILE__).'/domainConfigs').'/'.$this->domain.'/index.combined.'.$indexPrefix2.$filenamePrefix.'.'.$type;
        } else {
            $cacheFilename = realpath(dirname(__FILE__).'/domainConfigs').'/'.$this->domain.'/index.combined.'.$type;
        }
        //echo $cacheFilename; die();
        //var_dump(file_put_contents ($cacheFilename, $c));die();
        file_put_contents ($cacheFilename, $c);
        $url = str_replace ($this->basePath, '', $cacheFilename);
        $lastModified = date('Ymd_His', $newest);
        $search = array ('{$src}', '{$changed}');
        $replace = array ($url, $lastModified);
        $lines .= str_replace ($search, $replace, $lineSrc);
        return $lines;
    }

    public function getFiles_asIndividualLinks($type = null, $indexPrefix = null) {
        switch ($indexPrefix) {
            case 'cssTheme': $filenamePrefix = '.'.$this->cssTheme; break;
            default: $filenamePrefix = '';
        };
        //var_dump ($this->domain); die();
        $filename = realpath(dirname(__FILE__).'/domainConfigs').'/'.$this->domain.'/index.'.$indexPrefix.$filenamePrefix.'.json';
        $files = json_decode(file_get_contents($filename), true);
        switch ($type) {
            case 'css': $lineSrc = "\t".'<link type="text/css" rel="StyleSheet" href="{$src}?c={$changed}">'."\r\n"; break;
            //case 'css': $lineSrc = "\t".'<link type="text/css" rel="StyleSheet" href="{$src}">'."\r\n"; break;
            case 'js': $lineSrc = "\t".'<script type="text/javascript" src="{$src}?c={$changed}"></script>'."\r\n"; break;
            //case 'js': $lineSrc = "\t".'<script type="text/javascript" src="{$src}"></script>'."\r\n"; break;
        };
        $lines = '';    
        foreach ($files as $idx => $file) {
            $file = str_replace ('{$domain}', $this->domain, $file);
            $url = str_replace ($this->basePath,'',$file);
            $search = array ('{$src}', '{$changed}');
            $replace = array ($url, date('Ymd_His', filectime($this->basePath.'/'.$file)));
            $lines .= str_replace ($search, $replace, $lineSrc);
            //$lines .= str_replace ('{$src}', $url, $lineSrc);
        };
        return $lines;
    }
    
    public function getContent() {
        $contentFetcher = realpath(dirname(__FILE__).'/../').'/ajax_get_content.php';
        $r = execPHP ($contentFetcher);
        $r = json_decode ($r, true);
        return $r;
    }
    
    public function getSiteMenu() {
        $contentFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/mainmenu.php');
        $content = execPHP($contentFile);
        return $content;
    }
    
    public function getMetaTags_viewport() {
    
        //return '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">';    
    
    
        // the 'safe option' for nicerapp plus android5 / iPad6 / iPhone6 / iPhone6-plus (and beyond perhaps)
        $r = '';
        // potential alternatives : 
        // 1a - shows potential coz it might be used to allow a user to zoom into a nicerapp page on a smartphone:
            // $r = '<meta name=viewport content="width=device-width, initial-scale=1, user-scalable=yes">';
        // 1b - perhaps a good industry standard : 
            // $r = '<meta name="viewport" content="width=device-width">';

        // for android 5 and iPad6 and iPhone6 and iPhone6-plus and beyond
        //var_dump ($_SERVER['HTTP_USER_AGENT']); die();
        if (array_key_exists('HTTP_USER_AGENT', $_SERVER)) {
                if (
                    strpos($_SERVER['HTTP_USER_AGENT'], 'Android')!==false 
                ) {
                    $r = '<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no">';
                    
                } else if (
                    strpos($_SERVER['HTTP_USER_AGENT'], 'iPad3C1')!==false
                    || strpos($_SERVER['HTTP_USER_AGENT'], 'iPad3C2')!==false
                    || strpos($_SERVER['HTTP_USER_AGENT'], 'iPad4C1')!==false
                    || strpos($_SERVER['HTTP_USER_AGENT'], 'iPad4C2')!==false
                ) { // iPads without retina display
                    $r = '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes">';
                
                } else if (
                    strpos($_SERVER['HTTP_USER_AGENT'], 'iPad3C3')!==false
                    || strpos($_SERVER['HTTP_USER_AGENT'], 'iPad3C3')!==false
                    || strpos($_SERVER['HTTP_USER_AGENT'], 'iPad4C4')!==false
                    || strpos($_SERVER['HTTP_USER_AGENT'], 'iPad4C5')!==false
                
                ) { // iPads with retina displays
                    $r = '<meta name="viewport" content="width=device-width, initial-scale=2, maximum-scale=2, user-scalable=yes">';
                
                } else if (
                    strpos($_SERVER['HTTP_USER_AGENT'], 'iPhone OS 8_')!==false // iPhone 6 + iPad (May 2015)
                ) {
                    $r = '<meta name="viewport" content="width=device-width, initial-scale=1.2, maximum-scale=1.05, user-scalable=yes">';
                    
                } else if (
                    $_SERVER['HTTP_USER_AGENT']=='Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' // iPhone 7 and iPhone 7 Plus
                ) {
                    $r = '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">';
                } else if (
                    $_SERVER['HTTP_USER_AGENT'] == 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' // iPhone 8 Plus
                ) {
                    $r = '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">';
                } else if (
                    $_SERVER['HTTP_USER_AGENT']=='Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' // iPhone X and iPhoneX Plus
                ) {
                    $r = '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">';                
                }
        }  

        return $r;
    }
    
    public function getPageCSS() {
        if (is_array($_GET) && array_key_exists('apps',$_GET) && is_string($_GET['apps'])) {
            $url = '/apps/'.$_GET['apps'];
        } else {
            $url = '/';
        }
        $selectors = array (
            0 => array (
                'url' => '[default]'
            ),
            1 => array (
                'url' => $url
            ),
        
            2 => array (
                'url' => '[default]',
                'role' => 'Guests'
            ),
            3 => array (
                'url' => $url,
                'role' => 'Guests'
            )
        );
        $selectorNames = array ( 
            0 => 'site',
            1 => 'page',
            2 => 'site role Guests',
            3 => 'page role Guests'
        );
        
        //var_dump ($this->app); die();
        
        if (
            is_array($_COOKIE) && array_key_exists('loginName', $_COOKIE) && is_string($_COOKIE['loginName'])
            && isset($this->app)
            && array_key_exists('cmsText', $this->app) 
            && array_key_exists('user', $this->app['cmsText'])
            && $this->app['cmsText']['user'] == $_COOKIE['loginName']
        ) {
            $selectors[] = array (
                'url' => '[default]',
                'user' => $_COOKIE['loginName']
            );
            $selectorNames[] = 'site user '.$_COOKIE['loginName'];
            $selectors[] = array (
                'url' => $url,
                'user' => $_COOKIE['loginName']
            );
            $selectorNames[] = 'page user '.$_COOKIE['loginName'];
        };
        
        
        $selectors2 = array_reverse($selectors, true);
        $selectorNames2 = array_reverse($selectorNames, true);
        
        foreach ($selectors2 as $idx => $selector) {
            $css = $this->getPageCSS_specific($selector);
            if ($css!==false) {
                $r = '<script id="jsPageSpecific" type="text/javascript">'.PHP_EOL;
                $r .= 'na.site.globals = $.extend(na.site.globals, {'.PHP_EOL;
                $r .= "\tbackground : '".$css['background']."',".PHP_EOL;
                $r .= "\tcosmeticsSpecificityName : '".$selectorNames[$idx]."',".PHP_EOL;
                $r .= "\tcosmeticsSpecificityNames : ".json_encode($selectorNames).",".PHP_EOL;
                $r .= "\tcosmeticsDBkeys : ".json_encode($selectors).",".PHP_EOL;
                $r .= "\tapp : ".json_encode($this->app).PHP_EOL;
                $r .= '});'.PHP_EOL;
                $r .= '$(document).ready(function() {'.PHP_EOL;
                $r .= "\tsetTimeout(function() {".PHP_EOL;
                $r .= "\t\tna.site.setSpecificity();".PHP_EOL;
                $r .= "\t\tna.ds.onload(na.ds.settings.current.forDialogID);".PHP_EOL;
                $r .= "\t}, 250);".PHP_EOL;
                $r .= '});'.PHP_EOL;
                $r .= '</script>'.PHP_EOL;
                $r .= '<style id="cssPageSpecific">'.PHP_EOL;
                $r .= css_array_to_css($css['dialogs']).PHP_EOL;
                $r .= '</style>'.PHP_EOL;
                return $r;
            }
        };
    }
    
    public function getPageCSS_specific($selector) {
        $debug = false;
        if ($debug) echo '<pre>';
        //var_dump ($_COOKIE);  
        
        $cdbDomain = str_replace('.','_',$this->domain);
        $exampleConfigFilepath = realpath(dirname(__FILE__)).'/domainConfigs/'.$this->domain.'/couchdb.EXAMPLE.json';
        $couchdbConfigFilepath = realpath(dirname(__FILE__)).'/domainConfigs/'.$this->domain.'/couchdb.json';
        if (!file_exists($couchdbConfigFilepath)) {
            $msg = 'Fatal error : file "'.$couchdbConfigFilepath.'" missing - please use file "'.$exampleConfigFilepath.'" as a template to create it in a text editor, and then run .../setPermissions.sh from the linux commandline in the root folder of your nicerapp file tree to set the correct filesystem permissions.<br/>'.PHP_EOL;
            global $naDebugAll;
            if ($naDebugAll) {
                trigger_error ($msg, E_USER_ERROR);
            } else {
                echo $msg;
                die();
            }
        }
        $cdbConfig = json_decode(file_get_contents($couchdbConfigFilepath), true);
        //var_dump ($couchdbConfigFilepath); var_dump($cdbConfig); die();

        $cdb = new Sag($cdbConfig['domain'], $cdbConfig['port']);
        $cdb->setHTTPAdapter($cdbConfig['httpAdapter']);
        $cdb->useSSL($cdbConfig['useSSL']);
        
        $username = array_key_exists('loginName',$_COOKIE) ? $_COOKIE['loginName'] : $cdbConfig['username'];
        $username = str_replace(' ', '__', $username);
        $username = str_replace('.', '_', $username);
        
        $pw = array_key_exists('pw', $_COOKIE) ? $_COOKIE['pw'] : $cdbConfig['password'];
        
        try {
            //var_dump ($username); var_dump ($pw);
            $cdb->login($username, $pw);
        } catch (Exception $e) {
            if ($debug) { echo 'status : Failed : Login failed (username : '.$username.', password : '.$pw.').<br/>'.PHP_EOL; die(); }
        }
        if ($debug) { echo 'info : Login succesful (username : '.$username.', password : '.$pw.').<br/>'.PHP_EOL;  }
        
        
        $dbName = $cdbDomain.'___cms_vdsettings';
        try {
            $cdb->setDatabase($dbName, false);
        } catch (Exception $e) {
            if ($debug) { echo 'status : Failed : could not open database '.$dbName.'<br/>'.PHP_EOL; die(); }
        }
        
        $findCommand = array (
            'selector' => $selector,
            'fields' => array( '_id', 'user', 'role', 'url', 'dialogs', 'background', 'backgroundSearchKey' )
        );
        try {
            $call = $cdb->find ($findCommand);
        } catch (Exception $e) {
            $msg = 'while trying to find in \''.$dbName.'\' : '.$e->getMessage();
            echo $msg;
            die();
        }
        if ($debug) {
            echo 'info : $findCommand='; var_dump ($findCommand); echo '.<br/>'.PHP_EOL;
            echo 'info : $call='; var_dump ($call); echo '.<br/>'.PHP_EOL;
            //die();
        }
        
        $hasRecord = false;
        if ($call->headers->_HTTP->status==='200') {
            foreach ($call->body->docs as $idx => $d) {
                $hasRecord = true;
                $ret = array (
                    'dialogs' => $d->dialogs,
                    'background' => ( isset($d->background) ? $d->background : ''),
                    'backgroundSearchKey' => ( isset($d->backgroundSearchKey) ? $d->backgroundSearchKey : '')
                );
                return json_decode(json_encode($ret),true);
            }
        }
        return false;        
    }
  
}

?>
