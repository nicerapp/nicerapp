<?php 
$newsApp2_dataSources = array ();
global $newsApp2_dataSources;

// not yet used :
$newsApp2_dataSources['RSS_settings'] = array (
    'http://english.yonhapnews.co.kr/RSS/headline.xml' => array (
        'timezone' => '+0800'
    )
);

// short list used for testing :
/*
$newsApp2_dataSources['RSS_list'] = array (
    'English News' => array (
        'World Headlines' => array (
            'Google World Headlines' => 'https://news.google.com/news/rss/headlines/section/topic/WORLD?ned=us&hl=en&gl=US',
            'CNN Most Recent' => 'http://rss.cnn.com/rss/cnn_latest.rss'
        ),
        'News Topics' => array (
            'Business' => array (
                'Google Business News' => 'https://news.google.com/news/rss/headlines/section/topic/BUSINESS?ned=us&hl=en&gl=US',
                'CNN Money' => 'http://rss.cnn.com/rss/money_news_international.rss'
            ),
            'Travel' => array (
                'CNN Travel' => 'http://rss.cnn.com/rss/edition_travel.rss',
                'Fox News - Travel' => 'http://feeds.foxnews.com/foxnews/internal/travel/mixed?format=xml'
            )
        )
            
    )
);
*/


// not-yet completely tapped rss lists:

// India:
// http://www.newindianexpress.com/rss/
// http://www.dailypioneer.com/rss.php (slow)

// full list
$newsApp2_dataSources['RSS_list'] = array (
);
?>
