<?php 
    require_once (dirname(__FILE__).'/class.selfHealer.php');
    require_once (dirname(__FILE__).'/../functions.php');
    
    global $selfHealer;
    global $sh;
    $selfHealer = $sh = new selfHealer();
    $report = '';
    
    while (true!==false) {
        $r = $selfHealer->run($report);
        $RAMdisk = realpath(dirname(__FILE__).'/../../../RAM_disk');
        //$reportFilename = $RAMdisk.'/'.date('Ymd_His').'_report.html';
        $reportFilename = $RAMdisk.'/report.html';
        file_put_contents ($reportFilename, $report);
        sleep (2);
    }
    
?>
