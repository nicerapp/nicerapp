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
    'Deutsche nachrichten' => array (
        'tagesschau.de' => 'https://www.tagesschau.de/xml/rss2',
        'n-tv.de' => array (
            'homepage' => 'https://www.n-tv.de/rss',
            'politik' => 'https://www.n-tv.de/politik/rss',
            'wirtschaft' => 'https://www.n-tv.de/wirtschaft/rss',
            'videos' => 'https://www.n-tv.de/mediathek/videos/rss',
            'bilderderien' => 'https://www.n-tv.de/mediathek/bilderserien/rss'
        ),
        'focus online' => 'http://rss.focus.de/fol/XML/rss_folnews.xml',
        'Sport' => array (
            'Börse.ARD.de' => 'http://boerse.ard.de/index~rss.xml',
            'Sportschau.de' => array (
                'homepage' => 'http://www.sportschau.de/sportschauindex100_type-rss.feed',
                'Fußball' => 'http://www.sportschau.de/fussball/fussballindex100_type-rss.feed',
                'Fußball-Bundesliga' => 'http://www.sportschau.de/fussball/bundesliga/fussballbundesligaindex100_type-rss.feed',
                'Bundesliga' => 'http://www.sportschau.de/fussball/bundesliga2/fussball2bundesligaindex100_type-rss.feed',
                'Liga' => 'http://www.sportschau.de/fussball/bundesliga3/fussball3ligaindex100_type-rss.feed',
                'Nationalmannschaft' => 'http://www.sportschau.de/fussball/nationalmannschaft/fussballnationalmannschaftindex100_type-rss.feed',
                'DFB Pokal' => 'http://www.sportschau.de/fussball/dfbpokal/fussballdfbpokalindex100_type-rss.feed',
                'Champions League' => 'http://www.sportschau.de/fussball/championsleague/fussballchampionsleagueindex100_type-rss.feed',
                'Europe League' => 'http://www.sportschau.de/fussball/europaleague/fussballeuroleagueindex100_type-rss.feed',
                'Fußball International' => 'http://www.sportschau.de/fussball/international/fussballinternationalindex100_type-rss.feed',
                'Frauenfußball' => 'http://www.sportschau.de/fussball/fussballfrauenfussballindex102~_type-rss.feed',
                'Formel 1' => 'http://www.sportschau.de/formel1/formel1index100~_type-rss.feed',
                'DTM' => 'http://www.sportschau.de/dtmindex104~_type-rss.feed',
                'Mehr Sport' => 'http://www.sportschau.de/weitere/mehrsportindex100_type-rss.feed',
                'Behindertensport' => 'http://www.sportschau.de/weitere/behindertensport/behindertensportindex100_type-rss.feed',
                'Breitensport' => 'http://www.sportschau.de/weitere/breitensport/breitensportindex100_type-rss.feed'
            )
        )
    ),
    'Nederlands Nieuws' => array (
        'Wereld' => array (
            'Google Nieuws' => 'https://news.google.com/rss?hl=nl&gl=NL&ceid=NL%3Anl&oc=11',
            'NOS Algemeen' => 'http://feeds.nos.nl/nosnieuwsalgemeen?format=xml',
            'NOS Buitenland' => 'http://feeds.nos.nl/nosnieuwsbuitenland?format=xml',
            'NOS Opmerkelijk' => 'http://feeds.nos.nl/nosnieuwsopmerkelijk?format=xml',
            'NOS Nieuwsuur' => 'http://feeds.nos.nl/nieuwsuuralgemeen?format=xml',
            'NOS Journaal' => 'http://feeds.nos.nl/nosjournaal?format=xml',
            'NOS Nieuws in 60 seconden' => 'http://feeds.nos.nl/nos-nieuwsin60seconden?format=xml',
            'NOS Video Nieuws' => 'http://feeds.nos.nl/nosnieuwsvideo?format=xml',
            'NU.nl' => 'https://www.nu.nl/rss'
            //'NOS Met het oog op morgen' => 'http://feeds.nos.nl/MHOOM?format=xml',
            
        ),
        'Binnenland' => array (
            'NOS Binnenland' => 'http://feeds.nos.nl/nosnieuwsbinnenland?format=xml',
            'Trouw Voorpagina' => 'https://www.trouw.nl/home/rss.xml',
            'NOS Politiek' => 'http://feeds.nos.nl/nosnieuwspolitiek?format=xml',
            'Telegraaf' => 'https://www.telegraaf.nl/rss',
            'NOS Koningshuis' => 'http://feeds.nos.nl/nosnieuwskoningshuis?format=xml'
        ),
        'Sport' => array (
            'NOS Sport Algemeen' => 'http://feeds.nos.nl/nossportalgemeen?format=xml',
            'NOS Voetbal' => 'http://feeds.nos.nl/nosvoetbal?format=xml',
            'NOS Wielrennen' => 'http://feeds.nos.nl/nossportwielrennen?format=xml',
            'NOS Schaatsen' => 'http://feeds.nos.nl/nossportschaatsen?format=xml',
            'NOS Tennis' => 'http://feeds.nos.nl/nossporttennis?format=xml',
            'NOS Video Schaatsen' => 'http://feeds.nos.nl/nossportschaatsenvideo?format=xml',
            'NOS Video Wielrennen' => 'http://feeds.nos.nl/nossportwielrennenvideo?format=xml',
            'NOS Video Voetbal' => 'http://feeds.nos.nl/nossportvoetbalvideo?format=xml',
            'NOS Video Tennis' => 'http://feeds.nos.nl/nossporttennisvideo?format=xml'
            //'NOS Langs de Lijn' => 'http://feeds.nos.nl/ldlsportforum?format=xml',
        ),
        'Tech en Wetenschap' => array (
            'NOS Tech' => 'http://feeds.nos.nl/nosnieuwstech?format=xml'
            //'NOS Tech podcast' => 'http://feeds.nos.nl/nosop3-tech-podcast?format=xml'
        ),
        'Zakelijk' => array (
            'NOS Economie' => 'http://feeds.nos.nl/nosnieuwseconomie?format=xml',
            'NRC.NL' => 'https://www.nrc.nl/rss/'
        ),
        'Lifestyle' => array (
            'NOS Cultuur en Media' => 'http://feeds.nos.nl/nosnieuwscultuurenmedia?format=xml',
            'Sargasso' => 'http://sargasso.nl/feed/'
        )
    ),
    'English News' => array (
        'World Headlines' => array (
            'BBC News' => 'http://feeds.bbci.co.uk/news/rss.xml',
            'BBC World News' => 'http://feeds.bbci.co.uk/news/world/rss.xml', 
            'CBN World News' => 'http://www.cbn.com/cbnnews/world/feed/',
            'Reuters World News' => 'http://feeds.reuters.com/Reuters/worldNews',
            'West Australian International News' => 'https://thewest.com.au/news/world/rss',
            'WSJ' => 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
            'NPR News' => 'https://www.npr.org/rss/rss.php?id=1001',
            'World Culture Pictorial' => 'http://feeds.feedburner.com/WcpBlog-WorldCulturePictorial?format=xml',
            'Google World' => 'https://news.google.com/news/rss/headlines/section/topic/WORLD?ned=us&hl=en&gl=US',
            'CNN Most Recent' => 'http://rss.cnn.com/rss/cnn_latest.rss',
            'CNN Top Stories' => 'http://rss.cnn.com/rss/edition.rss',
            'CNN Video' => 'http://rss.cnn.com/rss/cnn_freevideo.rss',
            'CNN World' => 'http://rss.cnn.com/rss/edition_world.rss',
            'BBC Frontpage' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/front_page/rss.xml',
            'BBC World' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/world/rss.xml',
            'BBC Politics News' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/uk_politics/rss.xml',
            'BBC Video' => 'http://newsrss.bbc.co.uk/rss/newsplayer_uk_edition/front_page/rss.xml',
            'BBC Video World News' => 'http://newsrss.bbc.co.uk/rss/newsplayer_uk_edition/world/rss.xml',
            'Japan Times News' => 'https://www.japantimes.co.jp/news/feed/',
            'Japan Times World' => 'https://www.japantimes.co.jp/news/world/feed/',
            'Arab News frontpage' => 'http://www.arabnews.com/rss.xml',
            'MSNBC Latest Headlines' => 'http://www.msnbc.com/feeds/latest',
            'Fox News - World' => 'http://feeds.foxnews.com/foxnews/world?format=xml',
            'Fox News - Latest' => 'http://feeds.foxnews.com/foxnews/latest?format=xml',
            'Fox News - Popular News' => 'http://feeds.foxnews.com/foxnews/most-popular?format=xml',
            'Fox News - Politics' => 'http://feeds.foxnews.com/foxnews/politics?format=xml',
            'Fox News - Video' => 'http://feeds.foxnews.com/foxnews/video?format=xml',
            'Wall Street Journal World News' => 'http://www.wsj.com/xml/rss/3_7085.xml',
            'S-Korea Times World News' => 'http://www.koreatimes.co.kr/www/rss/world.xml',
            'NBC Top Stories' => 'http://feeds.nbcnews.com/feeds/topstories',
            'GlobalTimes China' => 'http://www.globaltimes.cn/rss/outbrain.xml',
            'Beijing Today' => 'https://beijingtoday.com.cn/feed/',
            'Tribune India World' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=8',
            'Tribune India Video' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=69',
            'Phillipines Inquirer' => 'https://www.inquirer.net/fullfeed',
            'The New Indian Express World' => 'http://www.newindianexpress.com/World/rssfeed/?id=171&getXmlFeed=true',
            'Daily Pioneer' => 'http://www.dailypioneer.com/rss-feed/main/MTAyNA/world.xml',
            'NBC World' => 'http://www1.cbn.com/app_feeds/rss/news/rss.php?section=world',
            'Reuters' => 'http://feeds.reuters.com/Reuters/worldNews',
            'Daily Telegraph (AU)' => 'http://www.dailytelegraph.com.au/news/world/rss',
            'Daily Telegraph Breaking' => 'http://www.dailytelegraph.com.au/news/breaking-news/rss',
            'Daily Telegraph National' => 'http://www.dailytelegraph.com.au/news/national/rss',
            'Moscow Times' => 'https://www.themoscowtimes.com/rss/news',
            'Tass (RU)' => 'http://tass.com/rss/v2.xml'
        ),
        'Forums' => array (
            'Defence.pk' => 'https://defence.pk/pdf/forums/-/index.rss',
            'USMessageBoard.com' => 'http://www.usmessageboard.com/forums/-/index.rss'
        ),
        'Social Media' => array (
            'US Politicians' => array (
                'Donald Trump' => 'https://rss.app/feeds/QzieZ16BVVow8uKI.xml'/*,
                'Kirsten Gillibrand' => 'https://rss.app/feeds/6hdEcNLzMgIkUc9q.xml',
                'Elizabeth Warren' => 'https://rss.app/feeds/79oIu2SgdZXBSY0y.xml',
                'Bernie Sanders' => 'https://rss.app/feeds/9tXHTSpDupKQuYUe.xml',
                'Cory Booker' => 'https://rss.app/feeds/CTWQbMrWzDMHTecd.xml',
                'Kamala Harris' => 'https://rss.app/feeds/D01NCeGUghI5FQgr.xml',
                'Alexandria Ocasio-Cortez' => 'https://rss.app/feeds/kjDKOlEqTdUJyfrK.xml',
                'Joe Biden' => 'https://rss.app/feeds/wbhEOoPIDDsCnhjL.xml',
                'Nancy Pelosi' => 'https://rss.app/feeds/5bxMdjzS6FIwitah.xml'*/
            ),
            /*'Political' => array (
                'The White House' => 'https://rss.app/feeds/6F70vnfrFXDeqYKv.xml'
                //'Secretary Pompeo' => 'https://rss.app/feeds/Zf6PbgHi74zaM7ck.xml',
                //'UK Conservatives' => 'https://rss.app/feeds/u49iibSlQP3buKc6.xml'
            )*/
        ),
        'Opinions' => array (
            'Fox News' => 'http://feeds.foxnews.com/foxnews/opinion?format=xml',
            'Wall Street Journal' => 'http://www.wsj.com/xml/rss/3_7041.xml',
            'WSJ' => 'https://feeds.a.dj.com/rss/RSSOpinion.xml',
            'S-Korea Times' => 'http://www.koreatimes.co.kr/www/rss/opinion.xml',
            'Tribune India' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=12',
            'Daily Pioneer' => 'http://www.dailypioneer.com/rss-feed/main/MTAyOQ/letters-to-the-editor.xml'
        ),
        'Regions' => array (
            'Countries' => array (
                'USA' => array(
                    'CBN US' => 'http://www.cbn.com/cbnnews/us/feed/',
                    'Reuters US' => 'http://feeds.reuters.com/Reuters/domesticNews',
                    'Google US' => 'https://rss.app/feeds/g5pB75ptqSoMgUi8.xml',
                    'Yahoo US' => 'http://news.yahoo.com/rss/',
                    'CNN US' => 'http://rss.cnn.com/rss/edition_us.rss',
                    'Fox News - US' => 'http://feeds.foxnews.com/foxnews/national?format=xml',
                    'Washington Asian News' => 'http://nwasianweekly.com/feed',
                    'NBC meet the press' => 'http://podcastfeeds.nbcnews.com/meetthepress',
                    'NPR National' => 'https://www.npr.org/rss/rss.php?id=1003',
                    'NPR Politics' => 'https://www.npr.org/rss/rss.php?id=1014',
                    'NPR Race and Culture' => 'https://www.npr.org/rss/rss.php?id=1015'
                ),
                'Canada' => array (
                    'Google Canada' => 'https://rss.app/feeds/DhNZqaXperZ2IMhW.xml'
                ),
                'India' => array (
                    'Tribune India' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=7',
                    'New Indian Express' => 'http://www.newindianexpress.com/Nation/rssfeed/?id=170&getXmlFeed=true',
                    'Jammu and Kashmir' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=5',
                    'Cities' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=11',
                    'Daily Pioneer' => 'http://www.dailypioneer.com/rss-feed/main/MTAyMg/nation.xml'
                ),
                'Japan' => array (
                    'News on Japan Top' => 'http://www.newsonjapan.com/rss/top.xml', // local time not as unix timestamp, not with timezone info.
                ),
                'Indonesia' => array (
                	'Antara News' => 'https://en.antaranews.com/rss/news.xml'
                ),
                'Australia' => array (
                    'West Australian Politics' => 'https://thewest.com.au/politics/rss',
                    'West Australian National' => 'https://thewest.com.au/news/australia/rss',
                    'West Australian WA' => 'https://thewest.com.au/news/wa/rss',
                    'Google AU' => 'https://rss.app/feeds/JIQchhxF79Opa0Ze.xml',
                    'ABC' => 'http://www.abc.net.au/news/feed/2942460/rss.xml',
                    '9NEWS' => 'http://www.9news.com.au/rss',
                    'SMH' => 'http://feeds.smh.com.au/rssheadlines/top.xml',
                    'News.com.au' => 'http://www.news.com.au/feed',
                    'The Australian' => 'http://www.theaustralian.com.au/feed/',
                    'Melbourne' => 'http://feeds.theage.com.au/rssheadlines/top.xml',
                    'SBS' => 'http://www.sbs.com.au/news/rss/Section/Top+Stories',
                    'Herald Sun' => 'http://www.heraldsun.com.au/rss',
                    'Huffington Post' => 'http://www.huffingtonpost.com.au/rss/index.xml',
                    //'The Courier Mail' => 'http://www.couriermail.com.au/feed',
                    'Brisbane Times' => 'http://feeds.brisbanetimes.com.au/rssheadlines/top.xml',
                    'Perth Now' => 'http://www.perthnow.com.au/feed',
                    'Western Australia' => 'http://feeds.watoday.com.au/rssheadlines/top.xml',
                    'Canberra Times' => 'http://www.canberratimes.com.au/rss.xml',
                    'Gold Coast Bulletin' => 'http://www.goldcoastbulletin.com.au/feed',
                    'Crikey' => 'https://www.crikey.com.au/feed/',
                    'Hobart and Tasmania' => 'http://www.themercury.com.au/feed',
                    'NT News' => 'http://www.ntnews.com.au/news/rss',
                    'Northern Star' => 'https://www.northernstar.com.au/feeds/rss/homepage',
                    'Independent Australia' => 'http://feeds.feedburner.com/IndependentAustralia',
                    'The Shovel' => 'http://www.theshovel.com.au/feed/rss',
                    'In Dialy' => 'http://indaily.com.au/feed',
                    'Townsville' => 'http://www.townsvillebulletin.com.au/news/rss',
                    'Coffs Coast Advocate' => 'https://www.coffscoastadvocate.com.au/feeds/rss/homepage',
                    'Daily Examiner' => 'https://www.dailyexaminer.com.au/feeds/rss/homepage',
                    'Australian NewsAgency Blog' => 'https://www.newsagencyblog.com.au/feed',
                    'Airlie Beach' => 'https://www.whitsundaytimes.com.au/feeds/rss/homepage',
                    'Australian Jewish News' => 'https://www.jewishnews.net.au/feed',
                    'Tasmanian Times' => 'https://pixelkey.biz/tasmaniantimes/feed/',
                    'Goulburn Post' => 'http://www.goulburnpost.com.au/rss.xml',
                    'Ballina Region' => 'https://www.ballinaadvocate.com.au/feeds/rss/homepage',
                    'Alice Springs' => 'http://www.alicespringsnews.com.au/feed',
                    'Sydney Sun' => 'http://feeds.sydneysun.com/rss/ae0def0d9b645403',
                    'Perth Herald' => 'http://feeds.perthherald.com/rss/12878be9fc2ca79c',
                    'Conservative News' => 'http://www.theconservative.com.au/feed/rss'
                ),
                /*'New Zealand' => array (
                    'Google NZ' => 'https://rss.app/feeds/HbVH8denkpNVXorX.xml'
                ),*/
                //'South-Korea' => 'http://english.yonhapnews.co.kr/RSS/headline.xml', // posts rss pubDate as local unix timestamp. would have to include timezone here in this config file (or in a linked config file) as shown above here. NOT YET IMPLEMENTED.
                //'North-Korea' => 'http://english.yonhapnews.co.kr/RSS/northkorea.xml'
                'North-Korea' => array (
                    'S-Korea Times - North Korea News' => 'http://www.koreatimes.co.kr/www/rss/northkorea.xml'
                ),
                'South-Korea' => array (
                    'S-Korea Times - National News' => 'http://www.koreatimes.co.kr/www/rss/nation.xml',
                    'S-Korea Times - Culture' => 'http://www.koreatimes.co.kr/www/rss/arts.xml'
                ),
                'Russia' => array (
                    'RT' => 'https://www.rt.com/rss/',
                    'Meduza.io' => 'https://meduza.io/rss/en/all',
                    'Russia Insider' => 'https://russia-insider.com/en/all-content/rss',
                    'TASS' => 'http://tass.com/rss/v2.xml',
                    'Moscow Times' => 'https://themoscowtimes.com/feeds/main.xml',
                    'Pravda Report' => 'https://themoscowtimes.com/feeds/main.xml',
                    'English Russia' => 'https://themoscowtimes.com/feeds/main.xml'
                ),
                'United Kingdom' => array (
                    //'Google UK' => 'https://rss.app/feeds/rnTE7ozb49Vhv4oo.xml',
                    'Asian Express' => 'https://www.asianexpress.co.uk/feed'
                ),
                'Ireland' => array (
                    //'Google Ireland' => 'https://rss.app/feeds/qUd1P7TP4FsfYdND.xml'
                ),
                'United Arab Emirates' => array (
                    'Gulf News UAE' => 'http://gulfnews.com/cmlink/1.446094'
                )
            ),        
            'Americas' => array (
                'CNN Americas' => 'http://rss.cnn.com/rss/edition_americas.rss'
            ),
            'Africa' => array (
                'CNN Africa' => 'http://rss.cnn.com/rss/edition_africa.rss'
            ),
            'Europe' => array (
                'CNN Europe' => 'http://rss.cnn.com/rss/edition_europe.rss',
                'EuroNews' => 'http://feeds.feedburner.com/euronews/en/home/',
                'Politico Europe' => 'http://www.politico.eu/feed',
                //'Trend News' => 'http://en.trend.az/feeds/index.rss',
                'Radio Free Europe' => 'http://www.rferl.org/z/645/rss/feeds/posts/default',
                'EURACTIV' => 'http://beta.euractiv.com/feed',
                'EU Observer' => 'https://xml.euobserver.com/rss.xml',
                'The Local Spain' => 'https://www.thelocal.es/feeds/rss.php',
                'New Europe' => 'https://www.neweurope.eu/feed',
                'Vox Europe' => 'http://www.voxeurop.eu/en/feed/rss/all.xml',
                'The Baltic Times' => 'http://feeds.feedburner.com/TheBalticTimesNews',
                'News of the EU' => 'http://news.ofthe.eu/feed'
            ),
            'Middle East' => array (
                'CNN Middle East' => 'http://rss.cnn.com/rss/edition_meast.rss',
                'Arab News Middle East' => 'http://www.arabnews.com/cat/2/rss.xml',
                'AlJazeera' => 'https://www.aljazeera.com/xml/rss/all.xml',
                'Gulf News' => 'http://gulfnews.com/cmlink/1.446084'
            ),
            'Asia' => array (
                'CNN Asia' => 'http://rss.cnn.com/rss/edition_asia.rss',
                'BBC Asia' => 'http://feeds.bbci.co.uk/news/world/asia/rss.xml',
                'Radio Free Asia' => 'https://www.rfa.org/english/RSS',
                'The Diplomat' => 'https://thediplomat.com/feed',
                'Asian Correspondent' => 'http://asiancorrespondent.com/feed',
                'Asia Times' => 'http://www.atimes.com/feed',
                'WION' => 'http://www.wionews.com/rss/topstories-home.xml?section=topstories-home',
                'Asian Age' => 'http://www.asianage.com/rss_feed',
                'New Mandala' => 'http://www.newmandala.org/feed',
                'Asia Sentinel' => 'https://www.asiasentinel.com/feed',
                'Asia Today' => 'http://www.asiatoday.com/event/rss.xml',
                'South China' => 'http://www.scmp.com/rss/91/feed',
                'Channel News Asia' => 'https://www.channelnewsasia.com/rssfeeds/8395986',
                'ANI News' => 'https://www.aninews.in/rss/feed/category/national/general-news.xml',
                'Asean' => 'http://asean.org/rss',
                'East Asia Forum' => 'http://www.eastasiaforum.org/feed/',
                'Asian Tribune' => 'http://www.asiantribune.com/index.php?q=rss.xml',
                'South-East Asia Globe Magazine' => 'http://sea-globe.com/feed',
                'South Asia Analysis Group' => 'http://www.southasiaanalysis.org/rss.xml',
                'Asian Military Review' => 'https://asianmilitaryreview.com/feed',
                'NewsIn.Asia' => 'https://newsin.asia/feed',
                'Asia Samachar' => 'http://asiasamachar.com/feed',
                'Weird Asia News' => 'https://www.weirdasianews.com/feed',
                'Voice of South Asia' => 'http://www.vona.tv/feed'                    
            )
        ),
        'Topics' => array (
            'Art' => array (
                'Blog with a view' => 'http://cruelanimal.blogspot.com/rss.xml'
            ),
            'Business' => array (
                'BBC Business' => 'http://feeds.bbci.co.uk/news/business/rss.xml',
                'West Australian Business' => 'https://thewest.com.au/business/rss',
                'WSJ Business' => 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml',
                'WSJ Markets News' => 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
                'NPR Business' => 'https://www.npr.org/rss/rss.php?id=1006',
                'Google Business News' => 'https://news.google.com/news/rss/headlines/section/topic/BUSINESS?ned=us&hl=en&gl=US',
                'CNN Money' => 'http://rss.cnn.com/rss/money_news_international.rss',
                'BBC Business News' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/business/rss.xml',
                'BBC Business Videos' => 'http://newsrss.bbc.co.uk/rss/newsplayer_uk_edition/business/rss.xml',
                'Japan Times Business News' => 'https://www.japantimes.co.jp/news/business/feed/',
                'The Australian Business News' => 'https://www.theaustralian.com.au/content-feeds/business/',
                'ABC Business News' => 'http://www.abc.net.au/news/feed/51892/rss.xml',
                'Wall Street Journal US Business News' => 'http://www.wsj.com/xml/rss/3_7014.xml',
                'Wall Street Journal Markets News' => 'http://www.wsj.com/xml/rss/3_7031.xml',
                'South-Korean Economy News' => 'http://www.koreatimes.co.kr/www/rss/biz.xml',
                'South-Korean Biz+Tech News' => 'http://www.koreatimes.co.kr/www/rss/tech.xml',
                //'South-Korean Business News' => 'http://english.yonhapnews.co.kr/RSS/business.xml',
                'Arab Business News' => 'http://www.arabnews.com/cat/4/rss.xml',
                'Gulf News Business News' => 'http://gulfnews.com/cmlink/1.446098',
                'Tribune India' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=10',
                'Daily Pioneer' => 'http://www.dailypioneer.com/rss-feed/main/MTAyMw/business.xml',
                'Int Businesss Times AU' => 'http://www.ibtimes.com.au/rss',
                'Western Australia' => 'http://www.businessnews.com.au/rssfeed/latest.rss',
                'Asia Startups' => 'https://e27.co/feed',
                'Nikkey Asian Review' => 'https://asia.nikkei.com/rss/feed/nar',
                'Campaign Asia' => 'http://www.campaignasia.com/RSS/rss.ashx?type=Category&ID=718',
                'Asia Pacific Economic Cooperation' => 'https://www.apec.org/RssFeed/RSS.aspx/feed',
                'Eurasia Daily Monitor' => 'https://jamestown.org/feed',
                'splash247' => 'http://splash247.com/category/region/asia/feed',
                'Digital News Asia' => 'https://www.digitalnewsasia.com/rss.xml',
                'Retail News Asia' => 'https://www.retailnews.asia/feed',
                'Asian Insurance News' => 'http://www.asiainsurancereview.com/desktopmodules/rssedaily',
                'Coin News Asia' => 'http://www.coinnewsasia.com/feed',
                'Digital Market Asia' => 'http://www.digitalmarket.asia/feed',
                'HRM Asia' => 'http://www.hrmasia.com/rss.xml',
                'Invest Vine' => 'http://investvine.com/feed',
                'Finance Asia' => 'http://www.financeasia.com/RSS/rss.ashx?type=Category&ID=46',
                'Tyre Asia' => 'http://tyre-asia.com/feed',
                'Industrial Automation Asia' => 'http://www.iaasiaonline.com/feed',
                'InterMET Asia' => 'http://www.intermet.asia/1/feed',
                'Trans Asia News' => 'https://transasianews.com/rss.xml',
                'Daily Telegraph (AU)' => 'http://www.dailytelegraph.com.au/business/rss',
                'Daily Telegraph (AU) Breaking' => 'http://www.dailytelegraph.com.au/business/breaking-news/rss'                
            ),
            'Careers' => array (
                'Los Angeles Acting Blog' => 'http://feeds.davidaugust.com/LosAngelesActingBlogByDavidAugust',
                'Singing Basics' => 'http://www.singingbasics.com/feed/',
                'Artist legal advice' => 'https://artistscope.com/rss.xml',
                'Copywriting Blog' => 'https://www.abccopywriting.com/blog/feed'
            ),
            'Cybersecurity' => array (
                'Spywarenews.org' => 'http://feeds.feedburner.com/SpywareAlert?format=xml',
                //'Hacker News newest' => 'https://hnrss.org/newest', // BS
                //'Hacker News latest comments' => 'https://hnrss.org/newcomments', // also BS
                'Hacker News front page' => 'https://hnrss.org/frontpage'
            ),
            'Entertainment' => array (
                'West Australian Entertainment' => 'https://thewest.com.au/entertainment/rss',
                'CNN Entertainment News' => 'http://rss.cnn.com/rss/edition_entertainment.rss',
                'BBC Entertainment News' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/entertainment/rss.xml',
                'BBC Entertainment Videos' => 'http://newsrss.bbc.co.uk/rss/newsplayer_uk_edition/entertainment/rss.xml',
                'Fox News - Entertainment' => 'http://feeds.foxnews.com/foxnews/entertainment?format=xml',
                'Google Entertainment News' => 'https://news.google.com/news/rss/headlines/section/topic/ENTERTAINMENT?ned=us&hl=en&gl=US',
                'NPR Arts &amp; Culture' => 'http://www.npr.org/rss/rss.php?id=1008',
                'New Yorker Humor' => 'http://www.newyorker.com/feed/humor',
                'The Daily Puppy' => 'http://feeds.feedburner.com/TheDailyPuppy',
                'David Kleinert Photography' => 'http://davidkphotography.com/index.php?x=rss',
                'Animal of the Day' => 'http://feeds.feedburner.com/animals',
                'S-Korea Times Entertainment' => 'http://www.koreatimes.co.kr/www/rss/entertainment.xml',
                'Gulf News Entertainment' => 'http://gulfnews.com/cmlink/1.446095',
                'Tribune India' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=13',
                'New Indian Express - Books' => 'http://www.newindianexpress.com/Life-Style/Books/rssfeed/?id=216&getXmlFeed=true',
                'New Indian Express' => 'http://www.newindianexpress.com/Entertainment/English/rssfeed/?id=194&getXmlFeed=true',
                'Daily Pioneer - Books' => 'http://www.dailypioneer.com/rss-feed/main/MTAzOA/book-reviews.xml',
                'Daily Telegraph (AU) Entertainment' => 'http://www.dailytelegraph.com.au/entertainment/sydney-confidential/rss',
                'Daily Telegraph (AU) Celebrity' => 'http://www.dailytelegraph.com.au/entertainment/celebrity/rss',
                'Daily Telegraph (AU) Music' => 'http://www.dailytelegraph.com.au/entertainment/music/rss'
            ),
            'Education' => array (
                'BBC' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/education/rss.xml',
                'New Indian Express Edex' => 'http://www.newindianexpress.com/Education/Edex/rssfeed/?id=229&getXmlFeed=true',
                'New Indian Express Auto' => 'http://www.newindianexpress.com/Auto/rssfeed/?id=210&getXmlFeed=true',
                'New Indian Express Indulge' => 'http://www.newindianexpress.com/Indulge/rssfeed/?id=230&getXmlFeed=true'
            ),
            'Health' => array(
                'NPR Health' => 'https://www.npr.org/rss/rss.php?id=1128',
                'NPR Health Science' => 'https://www.npr.org/rss/rss.php?id=1007',
                'Google Health News' => 'https://news.google.com/news/rss/headlines/section/topic/HEALTH?ned=us&hl=en&gl=US',
                'BBC Health News' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/health/rss.xml',
                'BBC Health Videos' => 'http://newsrss.bbc.co.uk/rss/newsplayer_uk_edition/health/rss.xml',
                'Fox News - Health' => 'http://feeds.foxnews.com/foxnews/health?format=xml',
                'New Indian Express' => 'http://www.newindianexpress.com/Life-Style/Health/rssfeed/?id=213&getXmlFeed=true',
                'Pioneer Health' => 'http://www.dailypioneer.com/rss-feed/main/MTA0Mw/pioneer-health.xml',
                'Dialy Pioneer' => 'http://www.dailypioneer.com/rss-feed/main/MTAzNQ/health-and-fitness.xml'
            ),
            'Lifestyle' => array(
                'West Australian Lifestyle' => 'https://thewest.com.au/lifestyle/rss',
                'Fox News - Lifestyle' => 'http://feeds.foxnews.com/foxnews/section/lifestyle?format=xml',
                'Wall Street Journal - Lifestyle' => 'http://www.wsj.com/xml/rss/3_7201.xml',
                'WSJ - Lifestyle' => 'https://feeds.a.dj.com/rss/RSSLifestyle.xml',
                'New Indian Express - Food' => 'http://www.newindianexpress.com/Life-Style/Food/rssfeed/?id=215&getXmlFeed=true',
                'Asia 361' => 'http://asia361.com/feed',
                'Daily Telegraph (AU)' => 'http://www.dailytelegraph.com.au/lifestyle/rss'
            ),
            'New Age' => array (
                'New Indian Express - Spirituality' => 'http://www.newindianexpress.com/Life-Style/Spirituality/rssfeed/?id=217&getXmlFeed=true',
                'New Indian Express - Astrology' => 'http://www.newindianexpress.com/Life-Style/Spirituality/Astrology/rssfeed/?id=218&getXmlFeed=true'
            ),   
            'Real Estate Business' => array (
                'European Real Estate Blog' => 'http://www.eurobrix.com/blog/syndication.axd',
                'Fredrick Real Estate Online' => 'http://feeds.feedburner.com/FrederickRealEstateOnline?format=xml'
            ),
            'Small Business' => array (
                'The Pay Simple Blog' => 'http://feeds.feedburner.com/ThePaySimpleBlog?format=xml',
                'Your Sales Management Guru' => 'http://feeds.feedburner.com/YourSalesManagementGuru?format=xml',
                'SEO tips' => 'https://moretargeted-websitetraffic.blogspot.com/feeds/posts/default?alt=rss'
            ),
            'Sports' => array (
                'USA' => array(
                    'ESPN NFL' => 'https://www.espn.com/espn/rss/nfl/news',
                    'ESPN NBA' => 'https://www.espn.com/espn/rss/nba/news',
                    'ESPN MLB' => 'https://www.espn.com/espn/rss/mlb/news',
                    'ESPN NHL' => 'https://www.espn.com/espn/rss/nhl/news',
                    'ESPN College Basketball' => 'https://www.espn.com/espn/rss/ncb/news',
                    'ESPN College Football' => 'https://www.espn.com/espn/rss/ncf/news'
                ),
                'West Australian Sport' => 'https://thewest.com.au/sport/rss',
                'West Australian AFL' => 'https://thewest.com.au/sport/afl/rss',
                'ESPN Top Headlines' => 'https://www.espn.com/espn/rss/news',
                'ESPNU' => 'https://www.espn.com/espn/rss/espnu/news',
                'ESPN Action Sports' => 'https://www.espn.com/espn/rss/action/news',
                'ESPN Poker' => 'https://www.espn.com/espn/rss/poker/master',
                'Google Sports' => 'https://news.google.com/news/rss/headlines/section/topic/SPORTS?ned=us&hl=en&gl=US',
                'CNN World Sport' => 'http://rss.cnn.com/rss/edition_sport.rss',
                'CNN Football' => 'http://rss.cnn.com/rss/edition_football.rss',
                'CNN Golf' => 'http://rss.cnn.com/rss/edition_golf.rss',
                'CNN Motorsport' => 'http://rss.cnn.com/rss/edition_motorsport.rss',
                'ESPN Motorsport' => 'https://www.espn.com/espn/rss/rpm/news',
                'ESPN Soccer' => 'http://soccernet.espn.com/rss/news',
                'CNN Tennis' => 'http://rss.cnn.com/rss/edition_tennis.rss',
                'AP Top Sports News' => 'http://hosted.ap.org/lineups/SPORTSHEADS-rss_2.0.xml?SITE=VABRM&SECTION=HOME',
                'New York Times Sports' => 'http://feeds1.nytimes.com/nyt/rss/Sports',
                'Fox News Sports' => 'http://feeds.foxnews.com/foxnews/sports?format=xml',
                'S-Korea Times Sports News' => 'http://www.koreatimes.co.kr/www/rss/sports.xml',
                
                //'South Korean Sports News' => 'http://english.yonhapnews.co.kr/RSS/culture.xml',
                'Arab Sports News' => 'http://www.arabnews.com/cat/5/rss.xml',
                'Gulf News Sports News' => 'http://gulfnews.com/cmlink/1.446096',
                'Tribune India' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=9',
                'Tribune India Photos' => 'http://www.tribuneindia.com/rss/feed.aspx?cat_id=55',
                'New Indian Express - Cricket' => 'http://www.newindianexpress.com/Sport/Cricket/rssfeed/?id=188&getXmlFeed=true',
                'New Indian Express - Tennis' => 'http://www.newindianexpress.com/Sport/Tennis/rssfeed/?id=189&getXmlFeed=true',
                'New Indian Express - Football' => 'http://www.newindianexpress.com/Sport/Football/rssfeed/?id=190&getXmlFeed=true',
                'New Indian Express - Sports' => 'http://www.newindianexpress.com/Sport/Other/rssfeed/?id=191&getXmlFeed=true',
                'Daily Pioneer' => 'http://www.dailypioneer.com/rss-feed/main/MTAzMg/sports-bytes.xml',
                'Asian Golf' => 'http://www.asiantour.com/feed'
            ),
            'Stock Trading' => array (
                'Futures Day Trading Strategies' => 'http://feeds.feedburner.com/optimusfutures?format=xml',
                'Commodity and Derivatives Trading' => 'http://blog.commodityandderivativeadv.com/feed/'
            ),
            'Travel' => array (
                'West Australian Travel' => 'https://thewest.com.au/travel/rss',
                'CNN Travel' => 'http://rss.cnn.com/rss/edition_travel.rss',
                'Fox News - Travel' => 'http://feeds.foxnews.com/foxnews/internal/travel/mixed?format=xml',
                'New Indian Express' => 'http://www.newindianexpress.com/Life-Style/Travel/rssfeed/?id=214&getXmlFeed=true',
            ),
            'Technology' => array(
                'BBC Technology' => 'http://feeds.bbci.co.uk/news/technology/rss.xml',
                'WSJ Technology' => 'https://feeds.a.dj.com/rss/RSSWSJD.xml',
                'NPR Technology' => 'https://www.npr.org/rss/rss.php?id=1019',
                'Google Technology News' => 'https://news.google.com/news/rss/headlines/section/topic/TECHNOLOGY?ned=us&hl=en&gl=US',
                'CNN Technology News' => 'http://rss.cnn.com/rss/edition_technology.rss',
                'BBC Technology News' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/technology/rss.xml',
                'BBC Science &amp; Technology' => 'http://newsrss.bbc.co.uk/rss/newsplayer_uk_edition/sci-tech/rss.xml',
                'Wired.com Top Stories' => 'https://www.wired.com/feed',
                'Wired FB' => 'https://rss.app/feeds/cyOkpwtbYAEtjf1A.xml',
                'NYTimes Technology News' => 'http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
                'NPR Technology News' => 'https://www.npr.org/rss/rss.php?id=1019',
                'Mac World' => 'https://www.macworld.com/index.rss',
                'PC World' => 'http://feeds.pcworld.com/pcworld/latestnews',
                'Tech World' => 'http://www.techworld.com/news/rss',
                'Fox News - Tech' => 'http://feeds.foxnews.com/foxnews/tech?format=xml',
                'Wall Street Journal - Tech' => 'http://www.wsj.com/xml/rss/3_7455.xml',
                'New Indian Express' => 'http://www.newindianexpress.com/Life-Style/Tech/rssfeed/?id=212&getXmlFeed=true'
            ),
            'Science' => array (
                'Google Science News' => 'https://news.google.com/news/rss/headlines/section/topic/SCIENCE?ned=us&hl=en&gl=US',
                'CNN Science &amp; Space' => 'http://rss.cnn.com/rss/edition_space.rss',
                'BBC Science &amp; Nature' => 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/sci/tech/rss.xml',
                'Fox News - Science' => 'http://feeds.foxnews.com/foxnews/science?format=xml',
                'Asian Scientist Magazine' => 'https://www.asianscientist.com/feed/?x=1'
            )
        )
    ),
    'Arabic' => array (
        'Business' => array (
            'Egypt Stock Exchange' => 'http://feeds.mubasher.info/en/EGX/news',
            'Saudi Stock Exchange' => 'http://feeds.mubasher.info/en/TDWL/news',
            'Dubai Financial Market' => 'http://feeds.mubasher.info/en/DFM/news',
            'Abu Dhabi Securities Exchange' => 'http://feeds.mubasher.info/en/ADX/news',
            'Kuwait Stock Exchange' => 'http://feeds.mubasher.info/en/KSE/news',
            'Amman Stock Exchange' => 'http://feeds.mubasher.info/en/ASE/news',
            'Bahrain Stock Exchange' => 'http://feeds.mubasher.info/en/BB/news',
            'Qatar Exchange' => 'http://feeds.mubasher.info/en/QE/news',
            'Muscat Stock Exchange' => 'http://feeds.mubasher.info/en/MSM/news',
            'Palestine Securities Exchange' => 'http://feeds.mubasher.info/en/PEX/news',
            'Iraq Stock Exchange' => 'http://feeds.mubasher.info/en/ISX/news',
            'Bourse de Tunis' => 'http://feeds.mubasher.info/en/BDT/news',
            'Casablanca Stock Exchange' => 'http://feeds.mubasher.info/en/CSE/news'
        )
    )
);
?>
