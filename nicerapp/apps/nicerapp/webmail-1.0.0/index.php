<?php 
    require_once (dirname(__FILE__).'/functions.php');
    
    $theme = 'default';
    if (array_key_exists('theme',$_POST)) $theme = $_POST['theme'];
    if (array_key_exists('theme',$_GET)) $theme = $_GET['theme'];
?>
<!--<html>
<head>-->
    <link type="text/css" rel="stylesheet" media="screen" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <!--<link type="text/css" rel="stylesheet" media="screen" href="/nicerapp/index.css">-->
    <link type="text/css" rel="StyleSheet" media="screen" href="/nicerapp/apps/nicerapp/webmail-1.0.0/webmail-<?php echo $theme?>.css?changed=<?php echo webmail_get_current_datetime_stamp();?>">
    <!-- see fonts.google.com -->
    <link href="https://fonts.googleapis.com/css?family=ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Architects+Daughter|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap" rel="stylesheet"> <!-- see index.css and na.site.code.source.js (tinyMCE section) for where it's (primarily) used -->
    <script type="text/javascript"  src="/nicerapp/apps/nicerapp/webmail-1.0.0/tinymce-4.8.0/js/tinymce/tinymce.min.js"></script>
    <link rel="stylesheet" href="/nicerapp/apps/nicerapp/webmail-1.0.0/tinymce-4/themes/whiteTransparent/editor.na.css">
    <script src="/nicerapp/apps/nicerapp/webmail-1.0.0/jquery-ui-1.12.1/jquery-ui.js"></script>
    <script src="/nicerapp/apps/nicerapp/webmail-1.0.0/pouchdb/pouchdb-7.2.1.js"></script>
    <script type="text/javascript"  src="/nicerapp/apps/nicerapp/webmail-1.0.0/webmail.js?changed=<?php echo webmail_get_current_datetime_stamp();?>"></script>
    <script src="https://smtpjs.com/v3/smtp.js"></script>
<!--</head>
<body onload="$(document).ready(function() { debugger; nawm.onload()});" onresize="webmail.onresize(event);">-->
    <table id="wmOuter" cellpadding="10">
    <tr id="tr_top" style="max-height:50%;">
        <td id="td_left" rowspan="2">
            <div id="wmLeft" onscroll="webmail.bgMailboxNameScroll(event);"></div>
        </td>
        <td id="td_right_top">
            <div id="wmWriteMail">
                <table id="wmWriteMail_header_table">
                <tr>
                    <th style="padding-top:10px;">From : <select id="select_mailFrom"></select></th>
                    <th>To : <input id="input_mailTo"></input></th>
                    <th>Subject : <input id="input_mailSubject"></input></th>
                </tr>
                </table>
                <textarea id="tinymce" name="tinymce"></textarea>
            </div>
            <div id="wmThreadInfo" style="position:absolute;"></div>
            <div id="wmMails_header">
                <table id="wmMails_header_table" style="width:100%;">
                <thead>
                    <tr>
                        <td class="pictogramButton__td">
                            <img id="btnWriteMail" src="/nicerapp/apps/nicerapp/webmail-1.0.0/images/writeMail6.png" title="Write mail" onclick="webmail.writeMail()" class="btn pictogramButton pictogramButton__onoff"/>
                        </td>
                        <td class="pictogramButton__td">
                            <img id="btnSendMail" src="/nicerapp/apps/nicerapp/webmail-1.0.0/images/sendMail.png" title="Send mail" onclick="webmail.sendMail()" class="btn pictogramButton pictogramButton__onoff pictogramButton__off"/>
                        </td>
                        <td class="pictogramButton__td">
                            <img id="btnReplyMail" src="/nicerapp/apps/nicerapp/webmail-1.0.0/images/replyMail.png" title="Reply to mail" onclick="webmail.replyMail()" class="btn pictogramButton pictogramButton__onoff pictogramButton__off"/>
                        </td>
                        <td class="pictogramButton__td">
                            <img id="btnForwardMail" src="/nicerapp/apps/nicerapp/webmail-1.0.0/images/forwardMail.png" title="Forward mail" onclick="webmail.forwardMail()" class="btn pictogramButton pictogramButton__onoff pictogramButton__off"/>
                        </td>
                        <td class="pictogramButton__td">
                            <img src="/nicerapp/apps/nicerapp/webmail-1.0.0/images/btnUp.png" title="Show later mails" onclick="webmail.getMailboxContent_nextPage()" class="btn btnUp btnShowNextEmails pictogramButton"/>
                        </td>
                        <td class="pictogramButton__td">
                            <img src="/nicerapp/apps/nicerapp/webmail-1.0.0/images/btnDown.png" title="Show older mails" onclick="webmail.getMailboxContent_prevPage()" class="btn btnDown btnShowPreviousEmails pictogramButton"/>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </thead>
                </table>
                <table id="wmMails_header_table2" cellpadding="4">
                <thead>
                    <tr>
                        <th class="mailFrom">From</th>
                        <th class="mailSubject">Subject</th>
                        <th class="mailDate">Date</th>
                        <th class="totalMsgsInThread">Total Msgs</th>
                    </tr>
                </thead>
                </table>                    
            </div>
            <div id="wmMails" onscroll="webmail.bgMailInfoScroll(event);">
                <table id="wmMails_table" style="width:100%">
                <tbody>
                </tbody>
                </table>                    
            </div>
        </td>
    </tr>
    <tr style="min-height:50%;">
        <td id="td_right_bottom" cellpadding="5">
        <iframe id="wmEmail" style="width:97%;height:100%;"></iframe>
        </td>
    </tr>
    </table>
<!--</body>
</html>-->
