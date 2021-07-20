/*
{ 
    "IMAP" : {
        "domain" : "imap.gmail.com",
        "port" : 993,
        "mailbox" : "/Inbox",
        "requiresSSL" : true,
        "sslCertificateCheck" : true
    },
    "SMTP" : {
        "domain" : "smtp.gmail.com",
        "requires SSL" : true,
        "requires TLS" : true,
        "requires authentication" : true,
        "port for SSL" : 465,
        "port for TLS" : 587
    },
    "Display Name" : "Rene AJM Veerman",
    "Email Address" : "rene.veerman.netherlands",
    "password" : "djeZa83.482-sj"
}


*/

var cm = {
    install : {
        settings : {
                pouchdb : {},
                focusServer : false,
                displayedAnimationLoopCount : {}
        },

        pouchdb : { // pouchdb = 3rd-party javascript interface component towards couchdb no-sql/json-document database engine with CORS support installed (see /README-setup.txt)
            address : function (databaseName) {
                var r = jQuery('#input_couchdb_server').val()+databaseName;
                return r;
            },
            
            testServer : function (evt) {
                var 
                s = cm.install.settings,
                dbName = '';
                
                s.pouchdb[dbName] = new PouchDB(cm.install.pouchdb.address(dbName));
                s.pouchdb[dbName].info().then(function(info){
                    if (info.couchdb=='Welcome') cm.install.highlightField_change_success ('#input_couchdb_server'); else cm.install.highlightField_fail ('#input_couchdb_server');
                });
            }
        },
        
        testEmailServer : function (field) {
            try {
                var 
                emailSettings = JSON.parse(jQuery(field).val());
            } catch (err) {
                cm.install.highlightField_fail (field);
                cm.install.tempShow (field+'__msg', 'Not valid JSON.', 'ERROR');
                return false;
            }

            jQuery.ajax({
                type : 'POST',
                url : 'ajax_test_email_server.php',
                data : {
                    config : JSON.stringify(emailSettings)
                },
                success : function (data, ts, xhr) {
                    if (data=='SUCCESS') {
                        cm.install.highlightField_change_success (field);
                    } else {
                        cm.install.highlightField_fail (field);
                        cm.install.tempShow (field+'__msg', data, 'ERROR');
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    cm.install.highlightField_fail (field);
                    cm.install.tempShow (field+'__msg', 'Server check failed.', 'ERROR');
                }
            });
        },
        
        losefocus : function () {
            //cm.install.settings.focusServer = false;
        },
        
        focusServer : function () {
            setTimeout (function() {
                debugger;
                if (cm.install.settings.focusServer[0]) cm.install.testEmailServer ('#'+cm.install.settings.focusServer[0].id);
                cm.install.settings.focusServer = jQuery('textarea:focus');
            }, 200);
        },
        
        serverAltered : function () {
            if (cm.install.settings.focusServer[0]) cm.install.testEmailServer ('#'+cm.install.settings.focusServer[0].id);
        },
        
        addServer : function () {
            var id = 0;
            jQuery('#td_mail_servers textarea').each(function(idx,el) {
                id = idx;
            });
            jQuery('#td_mail_servers')[0].innerHTML 
                += '<textarea id="textarea_mail_server__'+(id+1)+'" class="secondary_server mail_server" style="width:100%;height:10em;border-radius:5px;margin-bottom:5px;" onfocus="cm.install.focusServer();" onchange="cm.install.serverAltered()"></textarea>'
                + '<div id="textarea_mail_server__'+(id+1)+'__msg" style="display:none;padding:3px;"></div>';
        },
        
        deleteServer : function () {
            var s = cm.install.settings;
            if (s.focusServer && !s.focusServer.is('.primary_server'))
                s.focusServer.remove();
        },
        
        readConfig : function (configName) {
            jQuery.ajax({
                type : 'GET',
                url : configName,
                success : function (data, ts, xhr) {
                    //load existing configuration into page's form
                    jQuery('#input_couchdb_server').val(data.couchdbServer);
                    for (var i=0; i<data.mailServers.length; i++) {
                        if (!jQuery('#textarea_mail_server__'+i)[0]) {
                            cm.install.addServer();
                        };
                    };
                    for (var i=0; i<data.mailServers.length; i++) {
                        jQuery('#textarea_mail_server__'+i).val(JSON.stringify(data.mailServers[i], null, 4));
                    };
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    if (typeof thrownError.message=='string') {
                        // ./config.json contains invalid data.
                        var 
                        text = xhr.responseText,
                        pos = parseInt(thrownError.message.match(/position (\d+)/)[1]),
                        html = text.substr(0,pos)+'<span style="color:red;font-weight:bold;">__'+text.substr(pos,1)+'__</span>'+text.substr(pos+1, text.length-pos-1);
                        cm.install.displayErrorMsg('Could not read ./'+configName+' :(<br/>'+thrownError+'<br/>'+html);
                    } else {
                        cm.install.displayErrorMsg('Error retrieving ./'+configName+'<br/>HTTP error code : '+xhr.status);
                        cm.install.readConfig ('config.example.json');
                    };
                }
            });
        },
        
        writeConfig : function () {
            var configData = cm.install.getConfigFromUI();
            jQuery.ajax({
                type : 'POST',
                url : 'ajax_write_config.php',
                data : {
                    config_data : JSON.stringify( configData )
                },
                success : function (data, ts, jqXHR) {
                    if (data=='SUCCESS') {
                        cm.install.displayStatusMsg('Config successfully saved!');
                    } else {
                        cm.install.displayErrorMsg(data);
                    }
                }
            });
        },
        
        getConfigFromUI : function () {
            var data = {
                couchdbServer : jQuery('#input_couchdb_server').val(),
                mailServers : []
            };
            jQuery('textarea.mail_server').each (function(idx,el) {
                var x = parseInt(el.id.match(/__(\d+)/)[1]);
                data.mailServers[x] = JSON.parse(jQuery(el).val());
            });
            return data;
        },
        
        displayStatusMsg : function (msg) {
            jQuery('#msg').html(msg);
            
            var s = cm.install.settings;
            s.displayMsg = msg;
            
            jQuery('#msg').animate ({
                color : 'blue',
                backgroundColor : '#7F7',
                border : '2px solid black'
            }, 'slow', function() {
                
                jQuery('#msg').animate ({
                    color : 'green',
                    backgroundColor : '#7F7',
                    border : '2px solid yellow'
                }, 'slow', function () {
                    var s = cm.install.settings;
                    if (s.displayedAnimationLoopCount[field] < 4) {
                        s.displayedAnimationLoopCount[field]++;
                        cm.install.displayStatusMsg (s.displayMsg);
                    } else {
                        s.displayedAnimationLoopCount[field] = 0;                    
                        cm.install.statusMsgRevertToDefaultColors();
                    }
                });
                
            });
        },
        
        displayErrorMsg : function (msg) {
            jQuery('#msg').html(msg);
            
            var 
            field = '#msg',
            s = cm.install.settings;
            s.displayMsg = msg;
            
            jQuery(field).animate ({
                color : '#FF0000',
                backgroundColor : '#00FFFF',
                borderColor : '#000'
            }, 'slow', function() {
                
                jQuery(field).animate ({
                    color : '#770000',
                    backgroundColor : '#ceab00', // orange
                    borderColor : '#0FF'
                }, 'slow', function () {
                    var s = cm.install.settings;
                    if (s.displayedAnimationLoopCount[field] < 4) {
                        s.displayedAnimationLoopCount[field]++;
                        cm.install.displayErrorMsg (s.displayMsg);
                    } else {
                        s.displayedAnimationLoopCount[field] = 0;
                        cm.install.statusMsgRevertToDefaultColors();
                    }
                });
                
            });
        },
        
        statusMsgRevertToDefaultColors : function () {
            jQuery('#msg').animate ({
                color : '#000',
                backgroundColor : '#FFF',
                borderColor : '#000'
            }, 'slow');
        },
        
        tempShow : function (field, msg, colorTemplate) {
            if (typeof msg=='string') jQuery(field).html(msg);
            jQuery(field).css({
                display : 'block',
                height : 0,
                color : (colorTemplate!=='ERROR' ? '#000' : '#FFF')
            }).animate({
                height : '1em',
                backgroundColor : (colorTemplate!=='ERROR' ? '#0F0' : '#F00')
            }, 'slow', function () {
                setTimeout (function() {
                    jQuery(field).animate ({
                        height : 0,
                        backgroundColor : '#FFF'
                    }, 'slow', function () {
                        jQuery(field).css({display:'none'});
                    });
                }, 2000);
            });
        },
        
        highlightField_doesntNeedChanging : function (field) {
            var s = cm.install.settings;
            
            if (typeof s.animatedFieldIsReadonly=='undefined') {
                switch (jQuery(field)[0].id) {
                    case 'input_login':
                        cm.install.tempShow('#explanation__input_login__dontNeedChanging');
                        break;
                    case 'input_login_1':
                        cm.install.tempShow('#explanation__input_login_1__dontNeedChanging');
                        break;
                    default:
                        break;
                };
                s.animatedFieldIsReadonly = jQuery(field).attr('readonly');
            };
            
            if (s.animatedFieldIsReadonly=='readonly') jQuery(field).prop('disabled', true); 
            
            jQuery(field)
                .prop('disabled', false)
                .animate ({
                    color : '#0F0',
                    backgroundColor : '#00F',
                    borderColor : '#000'
                }, 'slow', function() {
                    
                    jQuery(field).animate ({
                        color : '#FFF',
                        backgroundColor : '#0F0', 
                        borderColor : '#0FF'
                    }, 'slow', function () {
                        var s = cm.install.settings;
                        if (s.displayedAnimationLoopCount[field] < 1) {
                            s.displayedAnimationLoopCount[field]++;
                            cm.install.highlightField_doesntNeedChanging (field);
                        } else {
                            s.displayedAnimationLoopCount[field] = 0;
                            cm.install.highlightField_doesntNeedChanging_revertToDefaultColors(field, s.animatedFieldIsReadonly);
                        }
                    });
                    
                });
        },
        
        highlightField_doesntNeedChanging_revertToDefaultColors : function (field, animatedFieldIsReadonly) {
            jQuery(field)
                .attr('readonly', animatedFieldIsReadonly)
                .animate ({
                    color : '#000',
                    backgroundColor : '#CCC',
                    borderColor : '#000'
                }, 'normal');
            delete cm.install.settings.animatedFieldIsReadonly;
        },
        
        highlightField_change_success : function (field) {
            jQuery(field).animate ({
                color : '#0F0',
                backgroundColor : '#00F',
                borderColor : '#000'
            }, 'slow', function() {
                
                jQuery(field).animate ({
                    color : '#FFF',
                    backgroundColor : '#0F0', 
                    borderColor : '#0FF'
                }, 'slow', function () {
                    var s = cm.install.settings;
                    if (s.displayedAnimationLoopCount[field] < 2) {
                        s.displayedAnimationLoopCount[field]++;
                        cm.install.highlightField_change_success (field);
                    } else {
                        s.displayedAnimationLoopCount[field] = 0;
                        cm.install.highlightField_change_revertToDefaultColors(field);
                    }
                });
                
            });
        },
        
        highlightField_change_revertToDefaultColors : function (field) {
            jQuery(field).animate ({
                color : '#000',
                backgroundColor : '#FFF',
                borderColor : '#000'
            }, 'slow');
        },
        
        highlightField_fail : function (field) {
            jQuery(field).animate ({
                color : '#FFF',
                backgroundColor : '#F00',
                borderColor : '#000'
            }, 'slow', function() {
                
                jQuery(field).animate ({
                    color : '#700',
                    backgroundColor : '#ceab00', // orange
                    borderColor : '#0FF'
                }, 'slow', function () {
                    var s = cm.install.settings;
                    if (s.displayedAnimationLoopCount[field] < 1) {
                        s.displayedAnimationLoopCount[field]++;
                        cm.install.highlightField_fail (field);
                    } else {
                        s.displayedAnimationLoopCount[field] = 0;
                        cm.install.highlightField_fail_revertToDefaultColors(field);
                    }
                });
                
            });
        },
        
        highlightField_fail_revertToDefaultColors : function (field) {
            jQuery(field).animate ({
                color : '#000',
                backgroundColor : '#FFF',
                borderColor : '#000'
            }, 'slow');
        },
        
        passwordChangeEntered : function () {
            var 
            pw = jQuery('#input_password'),
            pw1 = jQuery('#input_password_1'),
            pw2 = jQuery('#input_password_2'),
            newPassword = pw1.val();
            
            if (pw1.val()===pw2.val()) {            
                pw.val(newPassword);
                cm.install.highlightField_change_success(pw);
            } else {
                cm.install.highlightField_fail ('#input_password_1');
                cm.install.highlightField_fail ('#input_password_2');
                cm.install.tempShow ('#explanation__passwordChange__error', 'The passwords do not match.', 'ERROR');
            }
        }
    }
};
