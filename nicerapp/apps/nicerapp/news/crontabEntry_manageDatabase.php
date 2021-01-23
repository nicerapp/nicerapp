<?php
set_time_limit (0);
require_once (dirname(__FILE__).'/../../../boot.php');
require_once (dirname(__FILE__).'/class.newsApp-2.php');

$newsApp2_factorySettings_fn = dirname(__FILE__).'/config.factorySettings.json';
$newsApp2_factorySettings = json_decode(file_get_contents($newsApp2_factorySettings_fn), true);

$newsApp2 = new newsApp2_class($newsApp2_factorySettings);

$fnLock = dirname(__FILE__).'/crontabEntry_manageDatabase.lock.txt';
if (!file_exists($fnLock)) {
    file_put_contents ($fnLock, 'locked');
    echo 'nicerapp/apps/nicerapp/news/crontabEntry_manageDatabase.php : Reading data from disk'.PHP_EOL;
    $newsApp2->readFromDisk();
    $doo = file_exists($fnLock);
    while ($doo) {
        startDuration('fetch');
        echo 'Fetching news for '.file_get_contents(dirname(__FILE__).'/mainmenu.valueCount.txt').' RSS pages, '.file_get_contents(dirname(__FILE__).'/mainmenu.keyCount.txt').' menu-items.'.PHP_EOL;
        $newCount = $newsApp2->fetch();
        $doo = file_exists($fnLock);
        if ($doo) {
            $duration = getDuration('processing');
            $fetchIntervalInMinutes = 5;
            $waitTime = round((60*$fetchIntervalInMinutes)-$duration);
            $minutes = floor($waitTime/60);
            $secs = $waitTime - ($minutes * 60);
            $minutesSpent = floor($duration/60);
            $secondsSpent = round($duration - ($minutesSpent * 60));
            echo 'Processing news for '.file_get_contents(dirname(__FILE__).'/mainmenu.valueCount.txt').' RSS pages, '.file_get_contents(dirname(__FILE__).'/mainmenu.keyCount.txt').' menu-items, '.$newCount.' new news-items, took '.$minutesSpent.' minutes, '.$secondsSpent.' seconds.'.PHP_EOL;
        
            echo 'Writing data to disk'.PHP_EOL;
            startDuration('write');
            $newsApp2->writeToDisk();
            $newsApp2->deleteOldNewsFromRAM();
            //$newsApp2->deleteOldNews();
            
            $duration = getDuration('write');
            $fetchIntervalInMinutes = 5;
            $waitTime = round((60*$fetchIntervalInMinutes)-$duration);
            $minutes = floor($waitTime/60);
            $secs = $waitTime - ($minutes * 60);
            $minutesSpent = floor($duration/60);
            $secondsSpent = round($duration - ($minutesSpent * 60));
            echo 'Writing took '.$minutesSpent.' minutes, '.$secondsSpent.' seconds.'.PHP_EOL;

            $duration = getDuration('fetch');
            $fetchIntervalInMinutes = 5;
            $waitTime = round((60*$fetchIntervalInMinutes)-$duration);
            $minutes = floor($waitTime/60);
            $secs = $waitTime - ($minutes * 60);
            $minutesSpent = floor($duration/60);
            $secondsSpent = round($duration - ($minutesSpent * 60));
            echo 'Sleeping for '.$minutes.' minutes, '.$secs.' seconds, to fetch news about every '.$fetchIntervalInMinutes.' minutes.'.PHP_EOL;
            sleep ($waitTime);
        }
    }
}
?>
