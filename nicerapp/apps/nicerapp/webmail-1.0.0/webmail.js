if (!webmail) var webmail = {};

webmail.settings = {
    config : false,
    mailboxes : [],
    mails : [],
    perPage : 50
};

webmail.init = function () {
    //webmail.onresize();
    //window.top.na.s.c.grayscale ('pictogramButton__off', 50, true, document);
    //window.top.na.s.c.bindPictogramEvents (document.body);
    na.desktop.registerCallback ('webmail.onresize', webmail.onresize);
    /*
    $(window).resize(function() {
        setTimeout(webmail.onresize, 3000);
    });*/
    
    $('#siteToolbarLeft').css({
        background : $('#siteToolbarLeft .vdBackground').css('background')
    });
    $('#siteToolbarLeft .vdBackground').css({ background : 'none' });
    
    webmail.readConfig();
};

webmail.onresize = function (evt) {
    //clearTimeout (webmail.settings.onresizeTimeout);
     //webmail.settings.onresizeTimeout = setTimeout (function() {
        $('#siteContent .vividDialogContent').css({
            margin : 0,
            padding : 0,
            paddingLeft : 10,
            width : $('#siteContent').width() - 14
        });
        
        $('#siteToolbarLeft .vividDialogContent, #siteToolbarLeft .vdBackground').css({
            top : ($('#siteToolbarLeft .header').position().top*3) + $('#siteToolbarLeft .header').outerHeight(),
            height : $('#siteToolbarLeft').height() - $('#siteToolbarLeft .header').outerHeight() - ($('#siteToolbarLeft .header').position().top*6)
        });
    
        jQuery('#wmMails_header_table .pictogramButton__td').css({
            width : 46, height : 46
        });
        jQuery('.pictogramButton__td').css({
            width : 46
        });
        jQuery('.pictogramButton__td img').css({
            marginLeft : 2, marginTop : 2
        });
        jQuery('.pictogramButton').css ({
            width : 40, height : 40
        });
        
        $('#wmOuter, #td_right_top, #td_right_bottom, #wmMails, #wmEmail, #bgMailInfo, #wmMails_header').css ({ 
            padding : 0,
            margin : 0,
            width : $('#siteContent').width() - 40
        });
        $('#wmMails, #td_right_bottom').css({
            boxShadow : '2px 2px 2px 2px rgba(0,0,0,0.5), inset 2px 2px 2px 2px rgba(0,0,0,0.5)'
        });
        /*
        if (false) window.top.na.m.log (1, {msg : 'heights 1',
            tr_top : jQuery('#tr_top').height(),
            wmMails : jQuery('#wmMails').height(),
            td_right_top : jQuery('#td_right_top').height(),
            wmMails_header_table : jQuery('#wmMails_header_table').height(),
            td_right_top : jQuery('#td_right_top').position().top,
            wmOuter : jQuery('#wmOuter').position().top,
            td_right_bottom : jQuery('#td_right_bottom').height()
        });
        */
        var xyz = jQuery('#tr_top').height();
        //debugger;
        jQuery('#wmMails').css({
            height : jQuery('#tr_top').height() - (jQuery('#wmMails_header_table').outerHeight()*2) - (jQuery('#wmMails_header_table').position().top*2)- (jQuery('#td_right_top').position().top*2) - (jQuery('#wmOuter').position().top *2)
        });
        var xyz = jQuery('#tr_top').height();
        //debugger;
        /*
        if (false)  window.top.na.m.log (1, {msg : 'heights 2',
            tr_top : jQuery('#tr_top').height(),
            wmMails : jQuery('#wmMails').height(),
            td_right_top : jQuery('#td_right_top').height(),
            wmMails_header_table : jQuery('#wmMails_header_table').height(),
            td_right_top : jQuery('#td_right_top').position().top,
            wmOuter : jQuery('#wmOuter').position().top,
            td_right_bottom : jQuery('#td_right_bottom').height()
        });*/
        jQuery('#wmEmail, #td_right_bottom').css({
            marginTop : 10,
            marginBottom : 10
        });
        jQuery('#td_right_bottom').css({
            //paddingRight : 20
        });
        var
        mailFrom = jQuery('td.mailFrom').width(),
        mailSubject = jQuery('td.mailSubject').width(),
        mailDate = jQuery('td.mailDate').width(),
        mailTotalMsgsInThread = 50;
        
        jQuery('.mailFrom').css ({
            width : mailFrom
        });
        jQuery('.mailSubject').css ({
            width : mailSubject
        });
        jQuery('.mailDate').css ({
            width : mailDate
        });
        jQuery('.totalMsgsInThread').css({
            width : 88
        });
    //}, 100);
};

webmail.readConfig = function () {
    jQuery.ajax({
        type : 'GET',
        url : '/nicerapp/apps/nicerapp/webmail-1.0.0/config.php',
        success : function (data, ts, xhr) {
            webmail.settings.config = JSON.parse(data);
            if (webmail.settings.config.ERROR) {
                alert (webmail.settings.config.ERROR);
            } else {
                var s = webmail.settings, config = s.config, html = '';
                jQuery('#wmLeft').html('');
                
                for (var i=0; i<config.mailServers.length; i++) {
                    html += '<div id="mailserver__'+i+'"><div class="mailserverName">'/*+config.mailServers[i].IMAP.domain+' '*/+config.mailServers[i].userID+'</div></div>';
                }
                
                jQuery('#wmLeft').html(html);
                setTimeout(function(){
                    for (var i=0; i<config.mailServers.length; i++) {
                        s.mailboxes[i] = webmail.getMailboxes(config, i);
                        var
                        domain = config.mailServers[i].SMTP.domain.replace(/smtp./,''),
                        userID = config.mailServers[i].userID.replace(/@.*/,'');
                        html = '<option domain="'+domain+'" value="'+userID+'@'+domain+'">'+userID+'@'+domain+'</option>';
                        jQuery('#select_mailFrom').append (html);
                    }
                }, 100);
            }
        },
        error : function (xhr, ajaxOptions, thrownError) {
            debugger;
        }
    });
};

webmail.getMailboxes = function (config, serverIdx) {
    var serverConfig = config.mailServers[serverIdx];
    jQuery.ajax({
        type : 'POST',
        url : '/nicerapp/apps/nicerapp/webmail-1.0.0/ajax_get_mailboxes.php',
        data : {
            config : serverConfig
        },
        success : function (data, ts, xhr) {
            var 
            d = JSON.parse(data),
            sc = serverConfig,
            html = '';
            
            for (var i=0; i<d.length; i++) {
                d[i] = d[i].replace(/{.*}/,'');
                html += '<div id="mailbox__'+serverIdx+'__'+i+'" class="mailboxName" onclick="webmail.highlightNoMailboxes(); webmail.highlightMailbox(event); webmail.getMailboxContent('+serverIdx+', '+i+', 0, '+webmail.settings.perPage+');">'+d[i]+'</div>';
            };
            jQuery('#mailserver__'+serverIdx)[0].innerHTML += html;
            webmail.settings.mailboxes[serverIdx] = d;
            
            if (serverIdx === config.mailServers.length-1) {
                $('.lds-facebook').fadeOut('normal', 'swing');
                webmail.onresize();
            };
            
        },
        error : function (xhr, ajaxOptions, thrownError) {
            debugger;
        }
    });
};

webmail.getMailboxContent = function (serverIdx, mailboxIdx, pageIdx, perPage) {
    var config = webmail.settings.config;
    webmail.settings.view = {
        serverIdx : serverIdx,
        mailboxIdx : mailboxIdx,
        pageIdx : pageIdx
    };
    jQuery.ajax ({
        type : 'POST',
        url : '/nicerapp/apps/nicerapp/webmail-1.0.0/ajax_get_mailbox_content.php',
        data : {
            serverConfig : config.mailServers[serverIdx],
            serverIdx : serverIdx,
            mailboxes : webmail.settings.mailboxes[serverIdx],
            mailboxIdx : mailboxIdx,
            pageIdx : pageIdx,
            perPage : perPage   
        },
        success : function (data, ts, xhr) {
            var html = '', d = JSON.parse(data), merge = true;
            if (!webmail.settings.mails[serverIdx]) webmail.settings.mails[serverIdx] = [];
            if (!webmail.settings.mails[serverIdx][mailboxIdx]) webmail.settings.mails[serverIdx][mailboxIdx] = [];
            for (var i=0; i<webmail.settings.mails[serverIdx][mailboxIdx].length; i++) {
                if (webmail.settings.mails[serverIdx][mailboxIdx][i].message_id === d[0].message_id) merge = false;
            };
            if (merge) {
                for (var i=0; i<d.length; i++) {
                    webmail.settings.mails[serverIdx][mailboxIdx].push (d[i]);
                }
            };
            for (var i=0; i<webmail.settings.mails[serverIdx][mailboxIdx].length; i++) {
                if (!webmail.settings.mails[serverIdx][mailboxIdx][i].totalMsgsInThread) webmail.settings.mails[serverIdx][mailboxIdx][i].totalMsgsInThread = 1;
                for (var j=0; j<d.length; j++) {
                    if (
                        typeof d[j].references == 'string' 
                        && d[j].references!==''
                        && d[j].references.indexOf (webmail.settings.mails[serverIdx][mailboxIdx][i].message_id)!==-1
                    ) {
                        webmail.settings.mails[serverIdx][mailboxIdx][i].totalMsgsInThread++;
                        d[j].referenceIdx = i;
                    }
                }
            };
            
            jQuery('.mailInfo').remove();
            for (var i=d.length-1; i>=0; i--) {
                if (!d[i].references && !d[i].in_reply_to)
                html += '<tr class="mailInfo" onclick="webmail.highlightNoMails(); webmail.highlightMail(event); webmail.showEmail(event, '+serverIdx+', '+mailboxIdx+', '+d[i].msgno+', true);">'
                    + '<td class="mailFrom" title="To : '+d[i].to+'">'+d[i].from+'</td>'
                    //+ '<td class="mailSubject" onmouseover="webmail.showDetails(event, '+serverIdx+', '+mailboxIdx+', '+i+');" onmouseout="webmail.hideDetails();">'+d[i].subject+'</td>'
                    + '<td class="mailSubject">'+d[i].subject+'</td>'
                    + '<td class="mailDate">'+d[i].date+'</td>'
                    + '<td class="totalMsgsInThread">'+d[i].totalMsgsInThread+'</td>'
                    + '</tr>';
            };
            jQuery('#wmMails_table > tbody')[0].innerHTML += html;

            webmail.highlightNoMails();
            jQuery('#wmThreadInfo').fadeOut('normal');
            
            jQuery('#btnReplyMail, #btnForwardMail').addClass('pictogramButton__changing');
            //window.top.na.s.c.grayscale ('pictogramButton__changing', 50, true, document);
            setTimeout (function() {
                jQuery('#btnReplyMail, #btnForwardMail').addClass ('pictogramButton__off').removeClass('pictogramButton__changing');
            }, 2500);           
            

            jQuery('.mailInfo .pictogramButton__td').css ({
                width : 46
            });
            jQuery('.mailFrom, .mailSubject, .mailDate').css ({
                width : 'auto'//Math.round((((jQuery('#wmMails_header_table').width() - (3 * 46)) / 4) / 100) * 85)
            });
            jQuery('.totalMsgsInThread').css ({
                width : 50//Math.round((((jQuery('#wmMails_header_table').width() - (3 * 46)) / 4) / 100 ) * 5)
            });
            webmail.onresize();
            jQuery('#wmMails_header_table').animate({opacity:1},'slow');
            
            //jQuery('#wmMails_table_header').fadeIn('slow');
            if (pageIdx===0) { 
                jQuery('.btnUp').addClass('pictogramButton__off').addClass('pictogramButton__changing2'); 
                //window.top.na.s.c.grayscale('pictogramButton__changing2',50,true,document);
            } else { 
                jQuery('.btnUp').removeClass('pictogramButton__off').addClass('pictogramButton__changing2'); 
                //window.top.na.s.c.grayscale('pictogramButton__changing2',50,false,document); 
                setTimeout (function() {
                    jQuery('.btnUp').removeClass('pictogramButton__changing2'); 
                }, 1000);
            };
            if (d[0] && pageIdx===d[0].totalMsgs/perPage) {
                jQuery('.btnDown').addClass('pictogramButton__off').addClass('pictogramButton__changing3'); 
                //window.top.na.s.c.grayscale('pictogramButton__changing3',50,true,document);
            } else { 
                jQuery('.btnDown').removeClass('pictogramButton__off').addClass('pictogramButton__changing3'); 
                //window.top.na.s.c.grayscale('pictogramButton__changing3',50,false,document); 
                setTimeout (function() {
                    jQuery('.btnDown').removeClass('pictogramButton__changing3'); 
                }, 1000);
            };
        },
        error : function (xhr, ajaxOptions, thrownError) {
            debugger;
        }
    });
};

webmail.getMailboxContent_prevPage = function () {
    var v = webmail.settings.view;
    v.pageIdx++;
    webmail.getMailboxContent (v.serverIdx, v.mailboxIdx, v.pageIdx, webmail.settings.perPage);
};

webmail.getMailboxContent_nextPage = function () {
    var v = webmail.settings.view;
    v.pageIdx--;
    webmail.getMailboxContent (v.serverIdx, v.mailboxIdx, v.pageIdx, webmail.settings.perPage);
};

webmail.showDetails = function (evt, serverIdx, mailboxIdx, mailIdx) {
    var html = 
        '<div class="mailDetails">'
        + JSON.stringify (webmail.settings.mails[serverIdx][mailboxIdx][mailIdx], null, 4).replace(/\n/g,'<br/>').replace(/ /g,'&nbsp;')
        + '</div>';
    jQuery ('body').append (html);
    jQuery ('.mailDetails').css ({
        top : evt.layerY,
        left : evt.layerX
    });
};

webmail.hideDetails = function () {
    jQuery ('.mailDetails').remove();
};

webmail.showEmail = function (evt, serverIdx, mailboxIdx, mailIdx, updateThreadInfo) {
    var config = webmail.settings.config;
    
    if (updateThreadInfo) {
        var html = '<table cellpadding="5"><tr><th>From</th><th>Date</th></tr>';
        for (var i=0; i<webmail.settings.mails[serverIdx][mailboxIdx].length; i++) {
            var 
            m = webmail.settings.mails[serverIdx][mailboxIdx][i]
            if (m.msgno===mailIdx) {
                var 
                j = i,
                doUpdateThreadInfo = m.totalMsgsInThread > 1;
                break;
            };
        };
        //debugger;
        if (doUpdateThreadInfo) {
            for (var i=j; i<webmail.settings.mails[serverIdx][mailboxIdx].length; i++) {
                var 
                m = webmail.settings.mails[serverIdx][mailboxIdx][i]
                mOrig = webmail.settings.mails[serverIdx][mailboxIdx][j];
                if (m.references && m.references.indexOf(mOrig.message_id)!==-1) {
                    html += '<tr class="mailThreadInfo" onclick="webmail.highlightNoMailThreads(); webmail.highlightMailThread(event); webmail.showEmail(event, '+serverIdx+', '+mailboxIdx+', '+m.msgno+', false);"><td>'+m.from+'</td><td>'+m.date+'</td></tr>';
                };
            };
            html += '</table>';
            jQuery('#wmThreadInfo').html(html).css({
                display : 'block',
                opacity : 0.0001,
                left : evt.layerX,
                top : evt.layerY + jQuery('#wmMails_header_table').height() + jQuery(evt.currentTarget).height()  
            }).animate({ opacity : 1}, 'slow');
        } else {
            jQuery('#wmThreadInfo').fadeOut('normal');
        }
    };    
    
    webmail.settings.currentMailData = webmail.settings.mails[serverIdx][mailboxIdx][j];
    jQuery.ajax ({
        type : 'POST',
        url : '/nicerapp/apps/nicerapp/webmail-1.0.0/ajax_get_mail_content.php',
        data : {
            serverConfig : config.mailServers[serverIdx],
            serverIdx : serverIdx,
            mailboxes : webmail.settings.mailboxes[serverIdx],
            mailboxIdx : mailboxIdx,
            mailIdx : mailIdx
        },
        success : function (data, ts, xhr) {
            //jQuery('#wmEmail').html(JSON.stringify(webmail.settings.mails[serverIdx][mailboxIdx][mailIdx], null, 4));
            //var d = JSON.parse(data);
            webmail.settings.currentMail = data;
            jQuery('#wmEmail').css({display:'none'});
            jQuery('#wmEmail')[0].contentDocument.open();
            jQuery('#wmEmail')[0].contentDocument.write(data);
            jQuery('#wmEmail')[0].contentDocument.close();
            jQuery('#wmEmail').contents().find('body,table,td,div,span,center').css({color:'black',background:'rgba(255,255,255,0)',textShadow:'1px 1px 1px rgba(0,0,0,0.4)'});
            jQuery('#wmEmail').contents().find('a').css({color:'rgb(0,50,0)'});
            jQuery('#wmEmail').css({display:'block'});
        },
        error : function (xhr, ajaxOptions, thrownError) {
            debugger;
        }
    });

    jQuery('#btnReplyMail, #btnForwardMail').addClass('pictogramButton__changing');
    //window.top.na.s.c.grayscale ('pictogramButton__changing', 50, false, document);
    setTimeout (function() {
        jQuery('#btnReplyMail, #btnForwardMail').removeClass ('pictogramButton__off').removeClass('pictogramButton__changing');
    }, 2500);
    
};

webmail.highlightNoMailboxes = function () {
    jQuery('#td_left div.selected').removeClass('selected');
    jQuery('.bgMailboxName').remove();
}

webmail.highlightMailbox = function (evt) {
    if (!jQuery('.bgMailboxName')[0]) {
        var bgHTML = '<div class="bgMailboxName" style="position:absolute;width:97%;height:'+jQuery(evt.currentTarget).height()+'px;z-index:-1">&nbsp;</div>';
        jQuery('#wmLeft').append (bgHTML);
    }
        
    var t = evt.currentTarget;
    jQuery(t).addClass ('selected');
    jQuery('.bgMailboxName').css ({
        top : jQuery(t).position().top + jQuery('#td_left').position().top,
        left : jQuery(t).position().left
    });
}

webmail.highlightNoMails = function () {
    jQuery('#td_right_top tr.selected').removeClass('selected');
    jQuery('.bgMailInfo').remove();
}

webmail.highlightMail = function (evt) {
    if (!jQuery('.bgMailInfo')[0]) {
        var bgHTML = '<div class="bgMailInfo" style="position:absolute;width:'+($('#siteContent .vividDialogContent').width() -20)+'px;height:'+jQuery(evt.currentTarget).height()+'px;z-index:-1">&nbsp;</div>';
        jQuery('#wmMails').append (bgHTML);
    }
        
    var t = evt.currentTarget;
    jQuery(t).addClass ('selected');
    jQuery('.bgMailInfo').css ({
        top : jQuery(t).position().top + jQuery('#wmMails_table').position().top + 14,
        left : jQuery(t).position().left + jQuery('#td_right').position.left
    });
}

webmail.highlightNoMailThreads = function () {
    jQuery('#wmMailThreads tr.selected').removeClass('selected');
    jQuery('.bgMailInfo').remove();
}

webmail.highlightMailThread = function (evt) {
    if (!jQuery('.bgMailThreadInfo')[0]) {
        var bgHTML = '<div class="bgMailThreadInfo" style="position:absolute;width:100%;height:'+jQuery(evt.currentTarget).height()+'px;z-index:-1">&nbsp;</div>';
        jQuery('#wmThreadInfo').append (bgHTML);
    }
        
    var t = evt.currentTarget;
    jQuery(t).addClass ('selected');
    jQuery('.bgMailThreadInfo').css ({
        top : jQuery(t).position().top + 10,
        left : jQuery(t).position().left 
    });
}

webmail.bgMailInfoScroll = function (evt) {
    var 
    t = jQuery('.mailInfo.selected')[0], 
    top = jQuery(t).position().top + jQuery('#wmMails_table').position().top + 10;
    
    if (t) jQuery('.bgMailInfo').animate({opacity : top > $(t).height() && top < $('#wmMails').height() - $(t).height() ? 1 : 0.001});
};

webmail.bgMailboxNameScroll = function (evt) {
    var t = jQuery('.mailboxName.selected')[0];
    if (t) jQuery('.bgMailboxName').css ({
        top : jQuery(t).position().top + jQuery('#td_left').position().top,
        left : jQuery(t).position().left + jQuery('#td_left').position.left
    });
};

webmail.replyMail = function () {
    var
    mail = webmail.settings.currentMail,
    md = webmail.settings.currentMailData,
    mail = 
        'In reply to '+md.from+' dated '+md.date+' :<br/>\r\n'
        +'| '+mail.replace('\r\n','\r\n| ');
    
    jQuery('#btnForwardMail').addClass('pictogramButton__changing7');
    //window.top.na.s.c.grayscale ('pictogramButton__changing7', 50, true, document);
    setTimeout (function() {
        jQuery('#btnForwardMail').addClass ('pictogramButton__off').removeClass('pictogramButton__changing7');
    }, 1000);
        
    webmail.writeMail (null, mail);
};

webmail.forwardMail = function () {
    var
    mail = webmail.settings.currentMail,
    md = webmail.settings.currentMailData,
    mail = 
        'Forwarded message, from '+md.from+' dated '+md.date+' :<br/>\r\n'
        +'| '+mail.replace('\r\n','\r\n| ');
        
    jQuery('#btnReplyMail').addClass('pictogramButton__changing7');
    //window.top.na.s.c.grayscale ('pictogramButton__changing7', 50, true, document);
    setTimeout (function() {
        jQuery('#btnReplyMail').addClass ('pictogramButton__off').removeClass('pictogramButton__changing7');
    }, 1000);
    
    webmail.writeMail (null, mail);
};


webmail.writeMail = function (evt, editorData) {
    var 
    s = webmail.settings,
    pathTiny = '/nicerapp/businessLogic/webmail/tinymce-4/',
    tinyMCEid = 'tinymce';
    jQuery('#wmWriteMail').css ({ 
        height : jQuery('#td_right').height() - (jQuery('#menubar').height()/2) - jQuery('#siteMessages__dialog', window.top.document).position().top,
        width : jQuery('#td_right').width() 
    });
    
    jQuery('#wmMails, #wmThreadInfo, #td_right_bottom').fadeOut('fast', function () {
        jQuery('#td_right_top').css ({height:'100%'});
        jQuery('th.mailFrom, th.mailSubject, th.mailDate, th.totalMsgsInThread').fadeOut('normal');
        jQuery('#wmWriteMail').fadeIn('fast').css({ width : jQuery('#td_right_top').width()-10, height : jQuery('#wmOuter').height()-jQuery('#wmMails_header_table').height()-90, top : jQuery('#wmMails_header_table').height() });
    });

    jQuery('#btnWriteMail, .btnUp, .btnDown').addClass('pictogramButton__changing4');
    //window.top.na.s.c.grayscale ('pictogramButton__changing4', 50, true, document);
    setTimeout (function() {
        jQuery('#btnWriteMail, .btnUp, .btnDown').addClass ('pictogramButton__off').removeClass('pictogramButton__changing4');
    }, 1000);
    
    jQuery('#btnSendMail').addClass('pictogramButton__changing5');
    //window.top.na.s.c.grayscale ('pictogramButton__changing5', 50, false, document);
    setTimeout (function() {
        jQuery('#btnSendMail').removeClass ('pictogramButton__off').removeClass('pictogramButton__changing5');
    }, 1000);
    

    
    var postTinyInit = function () {
        tinymce.get(tinyMCEid).setContent (editorData);
    };
    
    if (!s.tmce && jQuery('#'+tinyMCEid)[0]) {
    s.tmce = tinymce.init({
        selector: '#'+tinyMCEid,
        //init_instance_callback : na.s.c.HTMLeditorInitialized,
        init_instance_callback : postTinyInit,
        allow_script_urls : true,
        height: '100%',
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor textcolor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code help'
        ],
        external_plugins : {
            'emoticons' : pathTiny+'plugins/saEmoticons/plugin.min.js'
        },
        toolbar: 'insert | undo redo | cut copy | formatselect | fontselect | fontsizeselect | emoticons | bold italic backcolor forecolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        toolbar_items_size: 'small',
        content_css: [
            pathTiny+'themes/whiteTransparent/content.min.css',
            'https://fonts.googleapis.com/css?family=ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Architects+Daughter|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap',
            //'http://www.tinymce.com/css/codepen.min.css',
            pathTiny+'themes/whiteTransparent/content.na.css'
        ],
        font_formats: 'ABeeZee=ABeeZee;Aclonica=Aclonica;Actor=Actor;Advent Pro=Advent Pro;Akronim=Akronim;Alex Brush=Alex Brush;Architects Daughter=Architects Daughter;Archivo Black=Archivo Black;Baloo=Baloo;Bebas Neue=Bebas Neue;Caveat=Caveat;Chewy=Chewy;Cookie=Cookie;Cormorant=Cormorant;Courgette=Courgette;Covered By Your Grace=Covered By Your Grace;Dancing Script=Dancing Script;El Messiri=El Messiri;Exo=Exo;Exo 2=Exo 2;Galada=Galada;Great Vibes=Great Vibes;Kalam=Kalam;Kaushan Script=Kaushan Script;Khula=Khula;Knewavel=Knewavel;Krona One=Krona One;Lacquer=Lacquer;Lemonada=Lemonada;Lusitana=Lusitana;M PLUS 1p=M PLUS 1p;Marck Script=Marck Script;Merienda One=Merienda One;Modak=Modak;Montserat Alternates=Montserrat Alternates;Mr Dafoe=Mr Dafoe;Nanum Pen Script=Nanum Pen Script;Noto Serif JP=Noto Serif JP;Odibee Sans=Odibee Sans;Oleo Script=Oleo Script;Orbitron=Orbitron;PT Sans=PT Sans;Parisienne=Parisienne;Pathway Gothic One=Pathway Gothic One;Permanent Marker=Permanent Marker;Playball=Playball;Pridi=Pridi;Quattrocento Sans=Quattrocento Sans;Rock Salt=Rock Salt;Sacramento=Sacramento;Saira Condensed=Saira Condensed;Saira Extra Condensed=Saira Extra Condensed;Saira Semi Condensed=Saira Semi Condensed;Satisfy=Satisfy;Shadows Into Light=Shadows Into Light;Shadows Into Light Two=Shadows Into Light Two;Sigmar Once=Sigmar One;Signika Negative=Signika Negative;Slabo 27px=Slabo 27px;Source Code Pro=Source Code Pro;Special Elite=Special Elite;Spectral=Spectral;Spinnaker=Spinnaker;Sriracha=Sriracha;Unica One=Unica One;Acme=Acme;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Fjalla One=Fjalla One;Georgia=georgia,palatino;Gloria Hallelujah=Gloria Hallelujah;Helvetica=helvetica;Impact=impact,chicago;Indie Flower=Indie Flower;Montserrat=Montserrat;Mukta Malar=Mukta Malar;Pacifico=Pacifico;Raleway=Raleway;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Ubuntu=Ubuntu;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;Work Sans=Work Sans',
        editor_css : pathTiny+'themes/whiteTransparent/editor.na.css',
        skin_url: pathTiny + 'themes/whiteTransparent',
        //link_list : na.tree.settings.tinyMCE_link_list,
        relative_urls : false
    }); } else postTinyInit();
};

webmail.sendMail = function (editorData) {
    var
    config = webmail.settings.config,
    mboxes = webmail.settings.mailboxes,
    mails = webmail.settings.mails,
    view = webmail.settings.view;
    
    mailFrom = jQuery('#select_mailFrom'),
    mailFromDomain = mailFrom.val().replace(/.*@/,''),
    mailTo = jQuery('#input_mailTo'),
    mailSubject = jQuery('#input_mailSubject');
    
    for (var i=0; i<config.mailServers.length; i++) {
        var ms = config.mailServers[i];
        if (ms.SMTP.domain.indexOf(mailFromDomain)!==-1) break;
    };

    if (i!==config.mailServers.length) {
        jQuery.ajax ({
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/webmail-1.0.0/ajax_send_mail.php',
            data : {
                serverConfig : ms,
                mailFrom : mailFrom.val(),
                mailTo : mailTo.val(),
                mailSubject : mailSubject.val(),
                mailBody : webmail.mailHTML (tinymce.get('tinymce').getContent())
            },
            success : function (data, ts, xhr) {
                if (data!=='SUCCESS') alert (data);
            },
            error : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        });
    };
};

webmail.mailHTML = function (bodyHTML) {
    var utf8 = 
        '<link href="https://fonts.googleapis.com/css?family=Architects+Daughter|ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap" rel="stylesheet">\r\n'
        +bodyHTML;
    return utf8;
}

/*
webmail.sendMail = function () {
    var
    config = webmail.settings.config,
    mboxes = webmail.settings.mailboxes,
    mails = webmail.settings.mails,
    view = webmail.settings.view,
    
    mailFrom = jQuery('#select_mailFrom'),
    mailFromDomain = mailFrom.val().replace(/.*@/,''),
    mailTo = jQuery('#input_mailTo'),
    mailSubject = jQuery('#input_mailSubject');
    
    for (var i=0; i<config.mailServers.length; i++) {
        var ms = config.mailServers[i];
        if (ms.SMTP.domain.indexOf(mailFromDomain)!==-1) break;
    };

    debugger;
    if (i!==config.mailServers.length) {
        Email.send({
            Host : ms.SMTP.domain,
            Username : ms.userID,
            Password : ms.userPassword,
            To : mailTo.val(),
            From : mailFrom.val(),
            Subject : mailSubject.val(),
            Body : tinymce.get('tinymce').getContent()
        }).then(
            message => alert(message)
        );    
    };
};
*/
