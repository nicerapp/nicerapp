<?php
	global $saSiteHTTP; global $saSiteDomain; global $saSiteRootFolder; global $saFrameworkFolder;
	global $saSiteHD; global $saFrameworkHD; global $saSiteURL; global $saFrameworkURL;
	global $saIsLocalhost; global $saHTDOCShd;
	global $saServerOperatingSystem; global $saDeveloperMode;
	
	$url = 'http://localhost/nicerapp/ui/jsonViewer/jsonViewer_sample_data.json.php?url=jsonViewer_sample_data.json';
?>
<li><a class="menu__dontKeepSelected" href="<?php echo $saSiteRootFolder?>">Apps &amp; Games</a>
<ul>
    <li><a class="menu__dontKeepSelected" href="javascript:na.s.c.pushState(null,'nicer.app', '/ ');" alt="nicer.app frontpage">Front page</a></li>
    <li><a href="/apps/eyJnb29nbGVTZWFyY2giOltdfQ" alt="Google Search on nicer.app">Google Search</a></li>
    <li><a href="/apps/eyJuZXdzIjp7InNlY3Rpb24iOiJFbmdsaXNoX05ld3MifX0" alt="News gathered by nicer.app">News</a></li>
    <li><a href="/apps/eyJ0YXJvdCI6eyJkZWNrIjoiT3JpZ2luYWwtUmlkZXItV2FpdGUiLCJyZWFkaW5nIjoiMy1DYXJkcyJ9fQ" alt="Free Tarot Reading" alt="Get insights into your own psychology under your past, present and future circumstances with this Free Tarot Reading">Tarot</a></li>
    <li><a href="/apps/eyJtdXNpY1BsYXllciI6eyJzZXQiOiJpbmRleCJ9fQ" alt="Music Player">Music Player</a></li>
    <li><a href="<?php echo $saSiteRootFolder?>jsonViewer(url'base64<?php echo base64_encode($url);?>')" alt="jsonViewer homepage">JSON validator</a></li> <?php // <?php echo base64_encode($url);?> 
    <!--<li><a href="#">Desktop Backgrounds</a>
        <ul>
            <li><a href="#">Temporarily disabled</a></li>
        <?php //echo photoAlbum_html_menu(); ?>
        </ul>
    </li>
    <li><a href="#">Blog articles</a>
        <ul>
        <li><a href="/articles/tech/nicerappOpenBugs">Open bugs</a></li>
        <li><a href="/articles/tech/nicerappTodo">To-do list</a></li>
        <li><a href="/articles/tech/nicerappDone">Change log</a></li>
        <li><a href="/articles/tech/the-best_and-cheaper_smartphones-of-2015">Cheaper smartphones</a></li>
        <li><a href="/articles/tech/converting-youtube-to-MP3">Converting Youtube to MP3</a></li>
        <li><a href="/articles/tech/download-movies-music-ebooks-safely-using-torrents">Free music &amp; movies</a></li>
        </ul>
    </li>
    <li><a href="#">Opensourced</a>
        <ul>
        <li><a href="/tools/webappObfuscator">webapp obfuscator</a></li>
        <li><a href="/articles/tech/slashing-development-and-debug-time">Slashing Dev Time</a></li>
        </ul>
    </li>
    <li><a href="#">Linkbase</a>
        <ul>
        <li><a href="<?php echo $saSiteRootFolder?>url/www.babynames.com/">Baby names</a></li>
        <li><a href="#">Cat Breed Selectors</a>
            <ul>
            <li><a href="<?php echo $saSiteRootFolder?>url/www.animalplanet.com/breedselector/catselectorindex.do">Animal Planet</a></li>
            <li><a href="<?php echo $saSiteRootFolder?>url/www.purina.com.au/owning-a-cat/breed-selector">Purina</a></li>
            </ul>
        </li>
        <li><a href="#">Dog Breed Selectors</a>
            <ul>
            <li><a href="<?php echo $saSiteRootFolder?>url/www.animalplanet.com/breed-selector/dog-breeds.html">Animal Planet</a></li>
            <li><a href="<?php echo $saSiteRootFolder?>url/www.iams.com/dog-breed-selector">iams.com</a></li>
            </ul>
        </li>
        <li><a href="#">Movies</a>
            <ul>
            <li><a href="<?php echo $saSiteRootFolder?>url/www.imdb.com/">imdb.com</a></li>
            <li><a href="<?php echo $saSiteRootFolder?>url/www.allmovie.com/">allmovie.com</a></li>
            </ul>
        <li><a href="<?php echo $saSiteRootFolder?>linkbase/news/">News</a></li>
        <li><a href="<?php echo $saSiteRootFolder?>linkbase/recipes/">Recipes</a></li>
        <li><a href="<?php echo $saSiteRootFolder?>linkbase/tool/">Tools</a></li>
        <li><a href="<?php echo $saSiteRootFolder?>url/www.bing.com/">Web Search (Bing.com)</a></li>
        </ul>
        
    </li>-->
</ul>
</li>
