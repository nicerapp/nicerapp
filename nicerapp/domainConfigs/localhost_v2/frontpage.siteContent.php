    <h1 id="pageTitle">nicer.app web apps framework</h1>
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

