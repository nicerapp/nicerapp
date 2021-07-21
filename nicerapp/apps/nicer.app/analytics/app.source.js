na.an = na.analytics = {
    about : {
        whatsThis : 'a complete set of analytics routines, using couchdb as storage facility',
        firstCreated : '2020-09',
        lastModified : '2020-09',
        versionHistory : {
            '1.0.0' : '2020-09 : first release',
            '2.0.0' : 
                '2021-07 : largely rewritten to avoid pouchdb (and thus keep database login details secret, '
                +'and allow for the database server to run on LAN ip addresses only (192.168.178.*)'
        }
    },
    
    settings : { current : {} },
    
    onload : function () {
        var ac = {
            type : 'GET',
            url : '/nicerapp/apps/nicer.app/analytics/ajax_load_index.php',
            data : {
                username : na.account.settings.username,
                pw : na.account.settings.password,
                date : '2021-07-19'
            },
            success : function (data, ts, xhr) {
                $('#siteContent .vividDialogContent').html(data);
            },
            failure : function (xhr, ajaxOptions, errorThrown) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    dt2str : function (datetime) {
        var 
        m = datetime,
        dns = Date.locale.en.day_names,
        r = m.getFullYear() + "-" +
            ("0" + (m.getMonth()+1)).slice(-2) + "-" +
            ("0" + m.getDate()).slice(-2) + "(" + dns[m.getDay()] + ') ' +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2) + "." +
            na.m.padNumber(m.getMilliseconds(),4,'0');
        return r;
    },
    
    t2str : function (milliseconds) {
        // 1- Convert to seconds:
        var seconds = milliseconds / 1000;
        // 2- Extract hours:
        var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        //seconds = Math.round(seconds*1000)/1000;
        seconds = Math.floor(seconds);
        var r = hours+":"+minutes+":"+seconds+':'+((seconds-Math.floor(seconds))*1000);
        return r;
    },

    date2str : function (datetime) {
        var 
        m = datetime;
        
        if (typeof m!=='object') m = new Date(m);
        
        var
        r = m.getFullYear() + "-" +
            ("0" + (m.getMonth()+1)).slice(-2) + "-" +
            ("0" + m.getDate()).slice(-2);
        return r;
    },
    
    generateSessionID : function () {
        var 
        seed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        r = '';
        
        for (var i=0; i<30; i++) {
            r += seed.substr(Math.random()*seed.length, 1);
        };
        
        return r;        
    },
    
    hookEvents : function (rootElement) {
        jQuery('a', rootElement).each (function (idx, el) {
            if (!el.analytics) {
                el.analytics = true;
                na.analytics.hookEvent(el, 'click', na.analytics.logEvent, true, true);
            }
        });
        jQuery('img', rootElement).each (function(idx, el) {
            if (!el.analytics) {
                el.analytics = true;
                na.analytics.hookEvent(el, 'click', na.analytics.logEvent, true, true);
            }
        });
    },
    
 	hookEvent : function (el, eventName, handler, useCapture, add) {
		if (add) {
			if (el.addEventListener) {
			// Standards browsers
				el.addEventListener (eventName, handler, useCapture);
			} else if (el.attachEvent) {
			// IE < v9.0
				el.attachEvent ('on'+eventName, handler);
			}
		} else {
			if (el.removeEventListener) {
			// Standards browsers
				el.removeEventListener (eventName, handler, useCapture);
			} else if (el.detachEvent) {
				el.detachEvent ('on'+eventName, handler);
			}
		}
	},
    
    logEvent : function (evt) {
        //na.analytics.pouchdb.logEvent (evt);
        var
        s = na.analytics.settings,
        un = na.a.settings.username,
        unl = un.toLowerCase(),
        pw = na.a.settings.password,
        myip = na.site.globals.myip.replace(/_/g,'.'),
        datetime = new Date(),
        datetimeStr = na.analytics.dt2str (datetime),
        dateStr = na.analytics.date2str (datetime),
        doc = {
            _id : 'dt_'+datetime.getTime(),
            jsSessionID : s.jsSessionID,
            datetime : datetime.getTime(),
            datetimeStr : datetimeStr,
            date : dateStr,
            tzOffset : datetime.getTimezoneOffset(),
            userAgent : navigator.userAgent,
            username : un,
            ip : myip,
            htmlID : (
                evt.target
                ? typeof evt.target.id=='string' && evt.target.id !== ''
                    ? 'id='+evt.target.id
                    : typeof evt.target.href=='string' && evt.target.href !== ''
                        ? 'a href='+evt.target.href
                        : typeof evt.target.innerHTML=='string' && evt.target.innerHTML !== ''
                            ? 'innerHTML='+evt.target.innerHTML
                            : evt.srcElement 
                                ? typeof evt.srcElement.id=='string' && evt.srcElement.id !== ''
                                    ? 'id='+evt.srcElement.id
                                    : typeof evt.srcElement.href=='string' && evt.srcElement.href !== ''
                                        ? 'a href='+evt.srcElement.href
                                        : typeof evt.srcElement.innerHTML=='string' && evt.srcElement.innerHTML!==''
                                            ? 'innerHTML='+evt.srcElement.innerHTML
                                            : 'ERROR : Could not detect target element for HTML event = '+JSON.stringify (evt)
                                : 'ERROR : Could not detect target element for HTML event = '+JSON.stringify (evt)
                : 'ERROR : Could not detect target element for HTML event = '+JSON.stringify (evt)
            ),
            eventType : evt.type,
            msg : '[EVENT]'
        },
        ac = {
            type : 'POST',
            url : '/nicerapp/logEvent.php',
            data : {
                doc : JSON.stringify(doc)
            }
        };
        $.ajax(ac);
    },
    
    logMetaEvent : function (msg) {
        //na.analytics.pouchdb.logMetaEvent (msg);
        var 
        s = na.analytics.settings,
        un = na.a.settings.username,
        unl = un.toLowerCase(),
        pw = na.a.settings.password,
        myip = na.site.globals.myip.replace(/_/g,'.'),
        datetime = new Date(),
        datetimeStr = na.analytics.dt2str (datetime),
        dateStr = na.analytics.date2str (datetime),
        doc = {
            _id : 'dt_'+datetime.getTime(),
            jsSessionID : s.jsSessionID,
            datetime : datetime.getTime(),
            datetimeStr : datetimeStr,
            date : dateStr,
            tzOffset : datetime.getTimezoneOffset(),
            username : un,
            userAgent : navigator.userAgent,
            ip : myip,
            htmlID : '[NULL]',
            eventType : '[META]',
            msg : msg
        },
        ac = {
            type : 'POST',
            url : '/nicerapp/logEvent.php',
            data : { doc : JSON.stringify(doc) }
        };
        $.ajax(ac);
    },
    
    view : {
        prepare : function (rootElement) {
        },
        
        fillDates : function (rootElement) {
        },

        fillDateDetails : function (rootElement, date) {
        },
        
        fillDate : function (rootElement, jsSessionID, date) {
        }
    },

    datetimeConvertToOwnersTimezone : function (evt, tzOffset, datetimeInt) {
        na.analytics.settings.evt = evt;
        var 
        x = new Date(datetimeInt/* + (tzOffset * 60 * 1000)*/),
        dateStr = x.toLocaleString('nl-NL',{timeZone:'CET'}) + '.' + x.getMilliseconds(),
        html = '<div class="datetimeLocal" style="position:absolute;top:'+(evt.layerY+30)+'px;left:'+(evt.layerX+30)+'px;background:rgba(0,0,0,0.8);border:3px ridge white;border-radius:5px;">'+dateStr+'</div>';
        
        jQuery('#siteContent .vividDialogContent').prepend(html);
    },
    
    
    geoIP : function (evt, IP) {
        var 
        dataToServer = {
            IP : IP
        },
        ajaxCmd = {
            url : '/nicerapp/apps/nicerapp/analytics/geoIP.html.php',
            type : 'GET',
            data : dataToServer,
            async : true,
            success : function (data, ts) {
                var 
                evt = na.analytics.settings.evt,
                html = '<div class="geoIP" style="position:absolute;top:'+evt.layerY+'px;left:'+(evt.layerX+30)+'px;background:rgba(0,0,0,0.8);border:3px ridge white;border-radius:5px;z-index:1200;">'+data+'</div>';
                //var div = $.parseHTML(html);
                jQuery('#siteContent').prepend(html);
                //debugger;
            }
        };
        na.analytics.settings.evt = evt;
        jQuery.ajax (ajaxCmd);
    }
};
na.an.s = na.an.settings;
na.an.s.c = na.an.s.current;
