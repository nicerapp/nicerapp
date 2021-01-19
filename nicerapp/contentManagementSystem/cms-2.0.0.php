<?php 
require_once(dirname(__FILE__).'/../functions.php');
require_once(dirname(__FILE__).'/../selfHealer/1.0.0/selfHealer-1.0.0.php');

class nicerAppCMS {
    public $version = '2.0.0';
    public $about = array(
        'whatsThis' => 'NicerApp Content Management System PHP class',
        'version' => '2.0.0',
        'history' => array (
            '1.y.z' => 'Compatible with older browsers',
            '2.y.z' => 'Compatible with browsers released after 2015'
        ),
        'created' => 'Sunday, 10 January 2021 11:45 CET',
        'lastModified' => 'Sunday, 10 January 2021 11:51 CET',
        'copyright' => 'Copyright (c) and All Rights Reserved (r) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    );
    
    public $domain;
    public $basePath;
    public $cssTheme = 'dark';
    public $selfHealer;
    
    public function init () {
        $this->basePath = realpath(dirname(__FILE__).'/../..');
        $this->cssTheme = array_key_exists ('siteTheme', $_POST) ? $_POST['siteTheme'] : 'dark';
        $p1 = realpath(dirname(__FILE__).'/../../..');
        $p2 = realpath(dirname(__FILE__).'/../..');
        $this->domain = str_replace($p1.'/','', $p2);
        $this->selfHealer = new selfHealer();
    }
    
    public function getSite() {
        $templateFile = realpath(dirname(__FILE__).'/../domainConfigs/'.$this->domain.'/index.template.html');
        $cssFiles = $this->getFiles_asIndividualLinks('css', 'cssFiles');
        $cssThemeFiles = $this->getFiles_asIndividualLinks('css', 'cssThemeFiles');
        $javascriptFiles = $this->getFiles_asIndividualLinks('javascript', 'javascriptFiles');
        $div_siteContent = $this->getDivSiteContent();
        $div_siteMenu = $this->getSiteMenu();
        $replacements = array (
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
        $html = str_replace ($search, $replace, file_get_contents($templateFile));
        return $html;
    }
    
    public function getFiles($type = null, $indexPrefix = null) {
        switch ($indexPrefix) {
            case 'cssThemeFiles': $filenamePrefix = '.'.$this->cssTheme; break;
            default: $filenamePrefix = '';
        };
        $filename = realpath(dirname(__FILE__).'/../domainConfigs/'.$this->domain.'/index.'.$indexPrefix.$filenamePrefix.'.json');
        $files = json_decode(file_get_contents($filename), true);
        switch ($type) {
            case 'css': $lineSrc = "\t".'<link type="text/css" rel="StyleSheet" href="{$src}?c={$changed}">'."\r\n"; break;
            case 'javascript': $lineSrc = "\t".'<script type="text/javascript" src="{$src}?c={$changed}"></script>'."\r\n"; break;
        };
        $lines = '';
        $c = '';
        $newest = strtotime ('1970-01-01');
        foreach ($files as $idx => $file) {
            $file = str_replace ('{$domain}', $this->domain, $file);
            $c .= file_get_contents($file);
            $fdt = filectime($this->basePath.'/'.$file);
            if ($fdt > $newest) $newest = $fdt;
        };
        $cacheFilename = realpath(dirname(__FILE__).'/../domainConfigs').'/'.$this->domain.'/index.'.$indexPrefix.$filenamePrefix.'.'.$type;
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
            case 'cssThemeFiles': $filenamePrefix = '.'.$this->cssTheme; break;
            default: $filenamePrefix = '';
        };
        $filename = realpath(dirname(__FILE__).'/../domainConfigs/'.$this->domain.'/index.'.$indexPrefix.$filenamePrefix.'.json');
        $files = json_decode(file_get_contents($filename), true);
        switch ($type) {
            case 'css': $lineSrc = "\t".'<link type="text/css" rel="StyleSheet" href="{$src}?c={$changed}">'."\r\n"; break;
            case 'javascript': $lineSrc = "\t".'<script type="text/javascript" src="{$src}?c={$changed}"></script>'."\r\n"; break;
        };
        $lines = '';
        foreach ($files as $idx => $file) {
            $file = str_replace ('{$domain}', $this->domain, $file);
            $url = str_replace ($this->basePath,'',$file);
            $search = array ('{$src}', '{$changed}');
            $replace = array ($url, date('Ymd_His', filectime($this->basePath.'/'.$file)));
            $lines .= str_replace ($search, $replace, $lineSrc);
        };
        return $lines;
    }
    
    public function getDivSiteContent() {
        $contentFile = realpath(dirname(__FILE__).'/../domainConfigs/'.$this->domain.'/frontpage.siteContent.php');
        $content = execPHP($contentFile);
        return $content;
    }
    
    public function getSiteMenu() {
        $contentFile = realpath(dirname(__FILE__).'/../domainConfigs/'.$this->domain.'/mainmenu.php');
        $content = execPHP($contentFile);
        return $content;
    }
    
    public function runSelfHealer() {
        echo "\t\t".'<h2 class="selfHealerMsg">Nicer.App selfHealer now running</h2>'."\r\n";
        $httpRoot = realpath(dirname(__FILE__).'/../../');
        $folders = array(
            '/etc/nginx',
            '/etc/apache2',
            '/etc/php/7.4',
            $httpRoot
        );
        
        $r = array();
        foreach ($folders as $idx => $folder) {
            $folderRP = realpath($folder);
            if ($folderRP!=='' && file_exists($folderRP)) {
                $r[] = $this->selfHealer->checkFolderContents($folderRP);
            } else {
                echo "\t\t".'<p class="selfHealerMsg selfHealerWarning">Warning : "'.$folder.'" does not exist!</p>'."\r\n";
            }
        }
        //echo '<pre style="color:lime;">';var_dump ($r);echo '</pre>';
        
        $r = in_array (false, $r, true);
        return !$r;
    }
}

?>
