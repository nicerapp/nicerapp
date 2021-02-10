<?php 
require_once(dirname(__FILE__).'/functions.php');
require_once(dirname(__FILE__).'/selfHealer/class.selfHealer.php');

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
        'lastModified' => 'Sunday, 22 January 2021 14:14 CET',
        'copyright' => 'Copyright (c) and All Rights Reserved (r) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    );
    
    public $domain;
    public $basePath;
    public $cssTheme = 'dark';
    public $selfHealer;
    
    public function init () {
        $this->basePath = realpath(dirname(__FILE__).'/..');
        //echo $this->basePath; die();
        $this->cssTheme = 'dark';
        if (array_key_exists ('siteTheme', $_POST)) $this->cssTheme = $_POST['siteTheme'];
        if (array_key_exists ('siteTheme', $_COOKIE)) $this->cssTheme = $_COOKIE['siteTheme'];
        $p1 = realpath(dirname(__FILE__).'/../..');
        $p2 = realpath(dirname(__FILE__).'/..');
        $this->domain = str_replace($p1.'/','', $p2);
    }
    
    public function getSite() {
        $templateFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/index.template.php');

        
        if (array_key_exists('apps', $_GET)) {
            $app = json_decode (base64_decode_url($_GET['apps']), true);
            //echo '<pre>'; var_dump ($app); 
            $files = getFilePathList (realpath(dirname(__FILE__)).'/apps', true, '/app.title.sit.*.php/', array('file'), 2);
            //echo '<pre>'; var_dump ($files); die();
            foreach ($files as $idx => $file) {
                foreach ($app as $appName => $appSettings) {
                    if (strpos($file,$appName)!==false) {
                        $titleFile = $file;
                    }
                }
            }
        } else {    
            //$contentFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/frontpage.siteContent.php');
            $titleFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/index.title.php');
        }
        
        
        $getAsIndividualLinks = true;//$this->domain==='localhost_v2';
        if ($getAsIndividualLinks) {
            $cssFiles = $this->getFiles_asIndividualLinks('css', 'css');
            $cssThemeFiles = $this->getFiles_asIndividualLinks('css', 'cssTheme');
            $javascriptFiles = $this->getFiles_asIndividualLinks('js', 'javascripts');
        } else {
            $cssFiles = $this->getFiles('css', 'css');
            $cssThemeFiles = $this->getFiles('css', 'cssTheme');
            $javascriptFiles = $this->getFiles('js', 'javascripts');
        }
        
        $div_siteContent = $this->getDivSiteContent();
        $div_siteMenu = $this->getSiteMenu();
        $replacements = array (
            '{$title}' => execPHP($titleFile),
            '{$domain}' => $this->domain,
            '{$cssFiles}' => $cssFiles,
            '{$cssThemeFiles}' => $cssThemeFiles,
            '{$javascriptFiles}' => $javascriptFiles,
            '{$div_siteContent}' => $div_siteContent,
            '{$div_siteMenu}' => $div_siteMenu,
            '{$theme}' => $this->cssTheme
        );
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
            $c .= file_get_contents($this->basePath.$file);
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
            $replace = array ($url, date('Ymd_His', filemtime($this->basePath.'/'.$file)));
            $lines .= str_replace ($search, $replace, $lineSrc);
            //$lines .= str_replace ('{$src}', $url, $lineSrc);
        };
        return $lines;
    }
    
    public function getDivSiteContent() {
        if (array_key_exists('apps', $_GET)) {
            $app = json_decode (base64_decode_url($_GET['apps']), true);
            //var_dump ($app); 
            $files = getFilePathList (realpath(dirname(__FILE__)).'/apps', true, '/app.site.*.php/', array('file'), 2);
            //echo '<pre>'; var_dump ($files); die();
            foreach ($files as $idx => $file) {
                foreach ($app as $appName => $appSettings) {
                    if (strpos($file,$appName)!==false) {
                        $contentFile = $file;
                    }
                }
            }
        } else {    
            $contentFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/frontpage.siteContent.php');
        }
        
        $content = execPHP($contentFile);
        return $content;
    }
    
    public function getSiteMenu() {
        $contentFile = realpath(dirname(__FILE__).'/domainConfigs/'.$this->domain.'/mainmenu.php');
        $content = execPHP($contentFile);
        return $content;
    }
}

?>
