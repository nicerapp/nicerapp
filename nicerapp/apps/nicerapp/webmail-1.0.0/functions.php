<?php 
/* LICENSE __FOR THIS FILE ONLY(!)__ : LGPL Lesser GNU Public License - free for all use including commercial use.
*/
require_once (dirname(__FILE__).'/../../../3rd-party/vendor/autoload.php');
require_once ('/usr/share/php/Mail.php');
require_once ('/usr/share/php/Mail/mime.php');


function webmail_get_current_datetime_stamp() {
    return date('Ymd_His');
}

function webmail_save_config ($data) {
    $f = fopen (dirname(__FILE__).'/config.json', 'w');
    if ($f!==false) {
        fwrite ($f, $data);
        fclose ($f);
        return true;
    } else return 'ERROR : could not open "'.dirname(__FILE__).'/config.json" for writing!';
}

function webmail_test_email_server ($config) {
    $c = json_decode ($config, true);
    $connectString = 
        '{'.$c['IMAP']['domain'].':'.$c['IMAP']['port']
        .($c['IMAP']['requiresSSL']?'/imap/ssl':'')
        .($c['IMAP']['sslCertificateCheck']?'':'/novalidate-cert')
        .'}';
    $mbox = imap_open($connectString, $c['userID'], $c['userPassword']);
    
    if ($mbox!==false) return 'SUCCESS'; else return 'FAIL';
}

function webmail_get_mailboxes ($config) {
    $c = $config;
    $connectString = 
        '{'.$c['IMAP']['domain'].':'.$c['IMAP']['port']
        .($c['IMAP']['requiresSSL']?'/imap/ssl':'')
        .($c['IMAP']['sslCertificateCheck']?'':'/novalidate-cert')
        .'}';
    //echo $connectString; var_dump ($c);
    $mbox = imap_open($connectString, $c['userID'], $c['userPassword']);
    if ($mbox===false) return array($connectString=>'FAIL:'.json_encode(imap_errors(),JSON_PRETTY_PRINT));
    return imap_list($mbox, $connectString, '*');
}

function webmail_get_mailbox_content ($serverConfig, $serverIdx, $mailboxes, $mailboxIdx, $pageIdx, $perPage) {
    $c = $serverConfig;
    $connectString = 
        '{'.$c['IMAP']['domain'].':'.$c['IMAP']['port']
        .($c['IMAP']['requiresSSL']?'/imap/ssl':'')
        .($c['IMAP']['sslCertificateCheck']?'':'/novalidate-cert')
        .'}'.$mailboxes[$mailboxIdx];
    $mbox = imap_open($connectString, $c['userID'], $c['userPassword']);
    if ($mbox===false) return 'FAIL - '.$connectString;
    
    $MC = imap_check($mbox);
    
    $lowerIdx = $MC->Nmsgs - (($pageIdx+1) * $perPage); if ($lowerIdx < 1) $lowerIdx = 1;
    $upperIdx = $MC->Nmsgs -  ($pageIdx * $perPage);

    // Fetch an overview for all messages in INBOX
    $result = imap_fetch_overview($mbox,$lowerIdx.':'.$upperIdx,0);
    //return json_encode(array('lowerIdx'=>$lowerIdx,'upperIdx'=>$upperIdx,'mc'=>$MC, 'result'=>$result));
    foreach ($result as $overview) {
        $overview->totalMsgs = $MC->Nmsgs;
        $overview->subject = imap_utf8($overview->subject);
        $overview->from = imap_utf8($overview->from);
        $overview->to = imap_utf8($overview->to);
    }
    /*
    $r = '';
    foreach ($result as $overview) {
        $r .= "#{$overview->msgno} ({$overview->date}) - From: {$overview->from}
        {$overview->subject}<br/>";
    }*/
    imap_close($mbox);
    return json_encode($result);
}

function webmail_get_mail_content ($serverConfig, $serverIdx, $mailboxes, $mailboxIdx, $mailIdx) {
    $c = $serverConfig;
    $connectString = 
        '{'.$c['IMAP']['domain'].':'.$c['IMAP']['port']
        .($c['IMAP']['requiresSSL']?'/imap/ssl':'')
        .($c['IMAP']['sslCertificateCheck']?'':'/novalidate-cert')
        .'}'.$mailboxes[$mailboxIdx];
    //return $connectString;
    $mbox = imap_open($connectString, $c['userID'], $c['userPassword']);
    if ($mbox===false) return 'FAIL - '.$connectString;
   
    $msg = '';
    $structure = imap_fetchstructure($mbox, $mailIdx);
    $flattenedParts = flattenParts($structure->parts);
    if (false) {
        echo 'structure='.str_replace("\r\n","<br/>\r\n",json_encode($structure, JSON_PRETTY_PRINT));
        echo 'flattenedParts='.str_replace("\r\n","<br/>\r\n",json_encode($flattenedParts, JSON_PRETTY_PRINT));
    };
    foreach($flattenedParts as $partNumber => $part) { // handle both text-only messages and html messages

        switch($part->type) {
            case 0:
                // the HTML or plain text part of the email
                $data = getPart($mbox, $mailIdx, $partNumber, $part->encoding);
                $isHTML = (
                    strpos($data,'/>')!==false
                    || stripos($data,'<body')!==false
                    || stripos($data,'<table')!==false
                    || stripos($data,'<link')!==false
                );
                if ($data!=='') {
                    if ($partNumber==1) {
                        $msg = $data;
                        if (!$isHTML) {
                            $msg = str_replace("\r\n",'<br/>',$msg);
                            $msg = str_replace("\r",'<br/>',$msg);
                            $msg = str_replace("\n",'<br/>',$msg);
                        }
                    } else {
                        $msg = $data;
                    }
                };
                // now do something with the message, e.g. render it
            break;
        
            case 1:
                // multi-part headers, can ignore
        
            break;
            case 2:
                // attached message headers, can ignore
            break;
        
            case 3: // application
            case 4: // audio
            case 5: // image
            case 6: // video
            case 7: // other
                $filename = getFilenameFromPart($part);
                if($filename) {
                    // it's an attachment
                    $attachment = getPart($mbox, $mailIdx, $partNumber, $part->encoding);
                    // now do something with the attachment, e.g. save it somewhere
                }
                else {
                    // don't know what it is
                }
            break;
        }
        //if ($msg!=='') break; // DON'T! ignores HTML when there's PLAIN 
    };
    if ($msg!=='') return $msg;
    
    switch ($structure->type) {
        case 0:
            $partNumber = 1;
            //  echo $structure->encoding; die();
            $data = getPart($mbox, $mailIdx, $partNumber, $structure->encoding);
            $isHTML = (
                strpos($data,'/>')!==false
                || stripos($data,'<body')!==false
                || stripos($data,'<table')!==false
                || stripos($data,'<link')!==false
            );
            if ($data!=='') {
                if ($partNumber==1) {
                    $msg = $data;
                    if (
                        !$isHTML
                    ) {
                        $msg = str_replace("\r\n",'<br/>',$msg);
                        $msg = str_replace("\r",'<br/>',$msg);
                        $msg = str_replace("\n",'<br/>',$msg);
                    }
                } else {
                    $msg = $data;
                }
            };
            return $msg;
    }
    
}

function flattenParts($messageParts, $flattenedParts = array(), $prefix = '', $index = 1, $fullPrefix = true) {

	foreach($messageParts as $part) {
		$flattenedParts[$prefix.$index] = $part;
		if(isset($part->parts)) {
			if($part->type == 2) {
				$flattenedParts = flattenParts($part->parts, $flattenedParts, $prefix.$index.'.', 0, false);
			}
			elseif($fullPrefix) {
				$flattenedParts = flattenParts($part->parts, $flattenedParts, $prefix.$index.'.');
			}
			else {
				$flattenedParts = flattenParts($part->parts, $flattenedParts, $prefix);
			}
			unset($flattenedParts[$prefix.$index]->parts);
		}
		$index++;
	}

	return $flattenedParts;
			
}


function getPart($connection, $messageNumber, $partNumber, $encoding, $useIConv = false) {
    setlocale(LC_CTYPE, 'nl_NL.utf8');          
	$header = imap_fetchheader($connection, $messageNumber);
	//return $header;
	$data = imap_fetchbody($connection, $messageNumber, $partNumber);
	if ($data == '') return $data;
	//echo json_encode($data); die();
	switch($encoding) {
		case 0: 
		case 3:
		case 4:
            if (is_base64($data)) $data = imap_base64($data);
            //echo $data;
            //echo json_encode(preg_match($data, '#((https?|ftp)://(\S*?\.\S*?))([\s)\[\]{},;"\':<]|\.\s|$)#i'));
            preg_match_all ('/href="(.*)"/i', $data, $matches);    
            $r = true;
            foreach ($matches[1] as $idx=>$m) {
                if ($r) $r = (filter_var($m, FILTER_VALIDATE_URL)!==false);
            }
            $data = quoted_printable_decode($data);
            if (
                stripos($data, '<body')!==false
                || stripos($data, '<table')!==false
                || stripos($data, '<link')!==false
            ) {
                $useIConv = true;
                $data = str_replace ("\r\n", " ", $data);
                $data = str_replace ("\r", " ", $data);
                $data = str_replace ("\n", " ", $data);
            }
            /*
            if ($r) {
                $useIConv = false;
            };
            */
            //echo json_encode(array('useIConv'=>$useIConv,'encoding'=>$encoding)); 
	        
	        //$useIConv = true;
            if ($useIConv) {
                $d = $data;
                $f = fopen ('temp/data.bin', 'w');
                if ($f!==false) {
                    fwrite ($f, $d);
                    fclose ($f);
                    $xec = 'chardet "'.dirname(__FILE__).'/temp/data.bin"';
                    exec ($xec, $output, $result);
                    preg_match_all('/: (.*) with/',$output[0],$chardet);
                    //return json_encode($output);
                    $chardetResult = $chardet[1][0];
                    if ($chardetResult=='utf-8') return $d;
                    $xec = 'iconv -f '.$chardetResult.' -t UTF-8 "'.dirname(__FILE__).'/temp/data.bin" > "'.dirname(__FILE__).'/temp/data.out"';
                    exec ($xec, $output, $result);
                    return file_get_contents(dirname(__FILE__).'/temp/data.out');
                } else {
                    echo 'Could not open temp/data.bin for detection and conversion of character set encoding :(<br/>Please check directory permissions on "'.dirname(__FILE__).'/temp"';
                };
            } else {
                return $data;
            }
            break;
        case 1: return imap_8bit($data); // 8BIT
		case 2: return $data; // BINARY
		case 5: return $data; // OTHER
	}
}

function is_base64($s) {
    if (($b = base64_decode($s, TRUE)) === FALSE) {
        return FALSE;
    }

    // now check whether the decoded data could be actual text
    $e = mb_detect_encoding($b);
    if (in_array($e, array('UTF-8', 'ASCII'))) { // YMMV
        return TRUE;
    } else {
        return FALSE;
    }
}

function getFilenameFromPart($part) {
	$filename = '';
	
	if($part->ifdparameters) {
		foreach($part->dparameters as $object) {
            if(strtolower($object->attribute) == 'filename') {
				$filename = $object->value;
			}
		}
	}

	if(!$filename && $part->ifparameters) {
		foreach($part->parameters as $object) {
			if(strtolower($object->attribute) == 'name') {
				$filename = $object->value;
			}
		}
	}
	
	return $filename;
}

/*
function webmail_send_mail ($serverConfig, $from, $to, $subject, $body) {
    $c = $serverConfig;
    $connectString = 
        '{'.$c['IMAP']['domain'].':'.$c['IMAP']['port']
        .($c['IMAP']['requiresSSL']?'/imap/ssl':'')
        .($c['IMAP']['sslCertificateCheck']?'':'/novalidate-cert')
        .'}INBOX.Sent';
    $mbox = imap_open($connectString, $c['userID'], $c['userPassword']);

    $envelope = array( //https://www.php.net/manual/en/function.imap-mail-compose.php
        'from' => $from,
        'to' => $to,
        'subject' => $subject
    );
    $body = array(
        array(),
        array(
            'type' => TYPETEXT,
            'subtype' => 'plain',
            'description' => $subject,
            'content.data' => $body
        )
    );
    $mail = str_replace("\r","",imap_mail_compose($envelope, $body));
    
    $headers = array();
    // To send HTML mail, the Content-type header must be set
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=iso-8859-1';

    // Additional headers
    $headers[] = 'To: '.$to.'';
    $headers[] = 'From: '.$from.'';

    // Mail it
    $r = imap_mail($to, $subject, $mail, implode("\r\n",$headers));    // TODO : NEVER ACTUALLY DELIVERS#@!!@!
    if (!$r) $r = error_get_last();
    // Put in Sent folder
    if ($r) { imap_append($mbox,$connectString,$mail ,"\\Seen"); };
    return json_encode($r);
}*/

function webmail_send_mail ($serverConfig, $from, $to, $subject, $body) {
    $c = $serverConfig;
    if (is_array($c) && array_key_exists ('SMTP', $c) && array_key_exists('usePEAR', $c['SMTP']) && $c['SMTP']['usePEAR']) {
        return webmail_send_mail_PEAR ($serverConfig, $from, $to, $subject, $body);
    } else {
        return webmail_send_mail_default ($serverConfig, $from, $to, $subject, $body);
    }
}

function webmail_send_mail_PEAR ($serverConfig, $from, $to, $subject, $body) {
// doesn't work for iRedMail->gmail
    $c = $serverConfig;
    $connectString = 
        '{'.$c['IMAP']['domain'].':'.$c['IMAP']['port']
        .($c['IMAP']['requiresSSL']?'/imap/ssl':'')
        .($c['IMAP']['sslCertificateCheck']?'':'/novalidate-cert')
        .'}INBOX.Sent';
    $mbox = imap_open($connectString, $c['userID'], $c['userPassword']);

    
    $params = array (
        'host' => $c['SMTP']['domain'],
        'port' => $c['SMTP']['port for TLS'],
        'auth' => true,
        'AUTH' => true,
        'socket_options' => array('ssl' => array('verify_peer'=>false,'verify_peer_name' => false, 'allow_self_signed' => true)),
        'username' => $c['userID'],//array_key_exists('userID_smtp',$c) ? $c['userID_smtp'] : $c['userID'],
        'password' => $c['userPassword'],
        'localhost' => 'smtp.nicer.app'
    );
    //echo json_encode($params, JSON_PRETTY_PRINT);
    $headers = array (
        'From' => $from,
        'To' => $to,
        'Subject' => $subject
    );
    $smtp = Mail::factory('smtp', $params);
    $crlf = "\r\n";
    
    // Creating the Mime message
    $mime = new Mail_mime($crlf);

    // Setting the body of the email
    $mime->setTXTBody(strip_tags($text));
    //$body = quoted_printable_encode($body); // message will bounce when sent from rene.veerman.netherlands@gmail.com to rene.veerman.netherlands@gmail.com
    $mime->setHTMLBody($body);

    $body = $mime->get();
    $headers = $mime->headers($headers);    
    $mail = $smtp->send ($to, $headers, $body);
    
    if (PEAR::isError($mail)) {
        echo 'FAIL : '.$mail->getMessage();
    } else {
        echo 'SUCCESS';
    }
}

function webmail_send_mail_default ($serverConfig, $from, $to, $subject, $body) {
    //$body = quoted_printable_encode($body); // message will bounce when sent from rene.veerman.netherlands@gmail.com to rene.veerman.netherlands@gmail.com
    $bodyWrapped = wordwrap ($body, 70, "\r\n");
    $headers = 
        'From: '.$from."\r\n"
        .'Reply-To: '.$from."\r\n"
        .'X-Mailer: PHP/'.phpversion()."\r\n"
        ."MIME-Version: 1.0" . "\r\n"
        ."Content-type:text/html;charset=utf-8" . "\r\n";
    $r = mail ($to, $subject, $bodyWrapped, $headers);
    if ($r === true) echo 'SUCCESS'; else echo 'FAIL webmail_send_mail_default';

/* doesn't work for iRedMail->gmail
$crlf = "\r\n";
$headers = array('From' => $from, 'Return-Path' => $from, 'Subject' => $subject, 'MIME-Version' => 1, 'Content-type' => 'text/html;charset=utf-8');

// Creating the Mime message
$mime = new Mail_mime($crlf);

// Setting the body of the email
$mime->setTXTBody(strip_tags($body));
$mime->setHTMLBody($body);

$body = $mime->get();
$headers = $mime->headers($headers);

// Sending the email
$mail =& Mail::factory('mail');
echo json_encode($mail->send($to, $headers, $body));
*/

}

/* doesn't work for iRedMail->gmail
function webmail_send_mail ($serverConfig, $from, $to, $subject, $body) {
    $c = $serverConfig;
    $connectString = 
        '{'.$c['IMAP']['domain'].':'.$c['IMAP']['port']
        .($c['IMAP']['requiresSSL']?'/imap/ssl':'')
        .($c['IMAP']['sslCertificateCheck']?'':'/novalidate-cert')
        .'}INBOX.Sent';
    $mbox = imap_open($connectString, $c['userID'], $c['userPassword']);
    
    date_default_timezone_set('Etc/UTC');

    //Create a new PHPMailer instance
    $mail = new PHPMailer();
    //Tell PHPMailer to use SMTP
    $mail->isSMTP();
    //Enable SMTP debugging
    // SMTP::DEBUG_OFF = off (for production use)
    // SMTP::DEBUG_CLIENT = client messages
    // SMTP::DEBUG_SERVER = client and server messages
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    //Set the hostname of the mail server
    $mail->Host = $c['SMTP']['domain'];
    //Set the SMTP port number - likely to be 25, 465 or 587
    $mail->Port = $c['SMTP']['port for TLS'];
    //Whether to use SMTP authentication
    $mail->SMTPAuth = true;
    //Username to use for SMTP authentication
    $mail->Username = $c['userID'];
    //Password to use for SMTP authentication
    $mail->Password = $c['userPassword'];
    //Set who the message is to be sent from
    $mail->setFrom($from, $from);
    //Set an alternative reply-to address
    //$mail->addReplyTo('replyto@example.com', 'First Last');
    //Set who the message is to be sent to
    $mail->addAddress($to, $to);
    //Set the subject line
    $mail->Subject = $subject;
    //Read an HTML message body from an external file, convert referenced images to embedded,
    //convert HTML into a basic plain-text alternative body
    $mail->msgHTML($body, __DIR__);
    //Replace the plain text body with one created manually
    $mail->AltBody = $body;
    //Attach an image file
    //$mail->addAttachment('images/phpmailer_mini.png');

    //send the message, check for errors
    if (!$mail->send()) {
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message sent!';
    }
    
}*/
?>
