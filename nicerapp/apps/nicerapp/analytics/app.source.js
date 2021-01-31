na.analytics = {
    about : {
        whatsThis : 'a complete set of analytics routines, using couchdb as storage facility',
        firstCreated : '2020-09',
        lastModified : '2020-09',
        versionHistory : {
            '1.0.0' : 'first release'
        }
    },
    
    settings : {
        pouchdb : { }
    },
    
    pouchdb : { // pouchdb = 3rd-party javascript interface component towards couchdb no-sql/json-document database engine with CORS support installed (see /README-setup.txt)
        address : function (databaseName, username, password) {
            var r = 
                na.m.globals.couchdb.http
                +(typeof username=='string' && username!=='' ? username : na.a.settings.username)+':'
                +(typeof password=='string' && password!=='' ? password : na.a.settings.password)+'@'
                +na.m.globals.couchdb.domain
                +':'+na.m.globals.couchdb.port
                +'/'+na.m.globals.domain+'___'+databaseName;
            return r;
        },
        
        logEvent : function (evt) {
            var 
            s = na.analytics.settings,
            un = na.a.settings.username,
            unl = un.toLowerCase(),
            pw = na.a.settings.password,
            dbName = 'analytics',
            myip = na.m.globals.myip.replace(/_/g,'.');

            if (
                myip==='127.0.0.1' 
                || myip==='80.101.238.137'
                || myip==='::1'
                || myip.match (/^192/)
            ) dbName='analytics_self';
            
            if (dbName=='analytics_self') return false;
            
            if (!s.jsSessionID) s.jsSessionID = na.analytics.generateSessionID();            
            
            if (!s.pouchdb[dbName]) s.pouchdb[dbName] = new PouchDB(na.analytics.pouchdb.address(dbName,un,pw));
            
            var 
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
            };
            if (doc.htmlID.match('a href')) {
                var url = doc.htmlID;
                if (url.match(/pushState/) && url.match(/apps/)) {
                    var url2 = url.match (/.*(".*").*/)[1].replace(/"/g,'').replace(/apps/,'').replace(/\//g,'');
                    na.analytics.logMetaEvent ('browse to '+na.m.base64_decode_url (url2));
                }
            }
            
            //debugger;
            s.pouchdb[dbName].put (doc);
            na.m.log (1, doc);
        },
            
        logMetaEvent : function (msg) {
            var 
            s = na.analytics.settings,
            un = na.a.settings.username,
            unl = un.toLowerCase(),
            pw = na.a.settings.password,
            dbName = 'analytics',
            myip = na.m.globals.myip.replace(/_/g,'.');

            if (
                myip==='127.0.0.1' 
                || myip==='80.101.238.137'
                || myip==='::1'
                || myip.match (/^192/)
            ) dbName='analytics_self';
            
            if (dbName=='analytics_self') return false;
            
            if (!s.jsSessionID) s.jsSessionID = na.analytics.generateSessionID();            
            
            if (!s.pouchdb[dbName]) s.pouchdb[dbName] = new PouchDB(na.analytics.pouchdb.address(dbName,un,pw));
            
            var 
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
                ip : myip,
                htmlID : '[NULL]',
                eventType : '[META]',
                msg : msg
            };
            //debugger;
            s.pouchdb[dbName].put (doc); 
            na.m.log (1, doc);
        }
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
            (m.getMilliseconds());
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
        var r = hours+":"+minutes+":"+seconds;
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
        na.analytics.pouchdb.logEvent (evt);
    },
    
    logMetaEvent : function (msg) {
        na.analytics.pouchdb.logMetaEvent (msg);
    },
    
    view : {
        prepare : function (rootElement) {
            var 
            s = na.analytics.settings,
            un = na.a.settings.username,
            unl = un.toLowerCase(),
            pw = na.a.settings.password,
            dbName = 'analytics',
            myip = na.m.globals.myip.replace(/_/g,'.');

            /*
            if (
                myip==='127.0.0.1' 
                || myip==='80.101.238.137'
                || myip==='::1'
            ) dbName='analytics_self';
            */
            
            if (!s.pouchdb[dbName]) s.pouchdb[dbName] = new PouchDB(na.analytics.pouchdb.address(dbName,un,pw));
            
            if (!s.db) {
                s.db = {};
                s.dbSummary = {};
                s.dbSummary.byDate = {};
                s.pouchdb[dbName].allDocs ({ include_docs : true, attachments : true }).then(function(result) {
                    for (var i=0; i<result.rows.length; i++) {
                        var 
                        d = result.rows[i].doc,
                        date = na.analytics.date2str(d.datetime);
                        
                        //if (i>result.rows.length-10 && i<result.rows.length) debugger;
                        //if (d.ip.match (/^192/)) { continue;}; // when you're using NGINX as a gateway server, you must rely on PHP:(array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR'])
                        
                        
                        if (!s.db[d.jsSessionID]) s.db[d.jsSessionID] = [];
                        var l = s.db[d.jsSessionID].length;
                        s.db[d.jsSessionID][l] = d;
                        if (!s.dbSummary.byDate[date]) s.dbSummary.byDate[date] = {sessions : {}, success : 0, fail : 0}; // assume failure
                                                                                             
                        if (!s.dbSummary.byDate[date].sessions[d.jsSessionID]) {
                            //if (d.jsSessionID==='LDFYxv3Y3YHevxKy0P0txla07b9vdm') debugger;
                            s.dbSummary.byDate[date].sessions[d.jsSessionID] = { afterDesktopResize : false, backgroundChanges : 0 };
                            
                            for (var date2 in s.dbSummary.byDate) {
                                if (
                                    s.dbSummary.byDate[date2].sessions[d.jsSessionID]
                                    && s.dbSummary.byDate[date2].sessions[d.jsSessionID].afterDesktopResize
                                ) s.dbSummary.byDate[date].sessions[d.jsSessionID].afterDesktopResize = true;
                                
                                if (
                                    s.dbSummary.byDate[date2].sessions[d.jsSessionID]
                                ) {
                                    s.dbSummary.byDate[date].sessions[d.jsSessionID].backgroundChanges += s.dbSummary.byDate[date2].sessions[d.jsSessionID].backgroundChanges;
                                };
                            };
                        };
                        
                        if (d.msg.match(/startup : html and js fully loaded/)) {
                            //if (d.jsSessionID==='LDFYxv3Y3YHevxKy0P0txla07b9vdm') debugger;
                            s.dbSummary.byDate[date].sessions[d.jsSessionID].afterDesktopResize = true;
                            s.dbSummary.byDate[date].success++;
                        };
                        
                        if (d.msg.match(/selectionEngines.random.next/)) {
                            s.dbSummary.byDate[date].sessions[d.jsSessionID].backgroundChanges++;
                        }
                        
                        var m = d.msg.match(/browserWidth=(.*), browserHeight=(.*), referer=(.*), userAgent=(.*)/);
                        if (m && m[1]) {
                            var session = s.dbSummary.byDate[date].sessions[d.jsSessionID];
                            session.resolution = m[1] + 'x' + m[2];
                            session.referer = m[3];
                            session.userAgent = m[4];
                        }
                                                                                             
                    };
                    for (var date in s.dbSummary.byDate) {
                        for (var jsSessionID in s.dbSummary.byDate[date].sessions) {
                            var x = s.dbSummary.byDate[date].sessions[jsSessionID];
                            if (!x.afterDesktopResize) s.dbSummary.byDate[date].fail++;
                        }
                    }
                    
                    s.dbLoaded = true;
                });
            };
            
            na.analytics.view.fillDates (rootElement);

        },
        
        fillDates : function (rootElement) {
            na.m.waitForCondition ('db loaded', function () {
                return na.analytics.settings.dbLoaded;
            },
            function () {
                var 
                s = na.analytics.settings,
                html1 = '';
                
                html1 += '<table border="0" cellpadding="5" style=""><tr style="background:rgba(0,50,0,0.5);"><td>Day</td><td>Succesful views</td><td>Unsuccesful views</td></tr>';
                for (var date in s.dbSummary.byDate) {
                    var d = s.dbSummary.byDate[date];
                    
                    html1 += '<tr style="cursor:zoom-in;background:rgba(0,0,50,0.3)" onclick="javascript:na.analytics.view.fillDateDetails(jQuery(\'#siteContent .vividDialogContent\')[0], \''+date+'\');">'
                            + '<td style="text-align:center;">'+date+'</td>'
                            + '<td style="text-align:center;">'+d.success+'</td>'
                            + '<td style="text-align:center;">'+d.fail+'</td>'
                          + '</tr>';
                }
                html1 += '</table><br/><br/><br/><br/><br/><br/>';
                
                jQuery(rootElement).html (html1);
            },
            200);
        },

        fillDateDetails : function (rootElement, date) {
            na.m.waitForCondition ('db loaded', function () {
                return na.analytics.settings.dbLoaded;
            },
            function () {
                var 
                s = na.analytics.settings,
                html1 = '';
                
                html1 += '<table cellpadding="5" border="0" style="">'
                    + '<tr style="background:rgba(0,50,0,0.5);"><th>IP</th><th>date time</th><th>tzOffset</th><th>total time on site</th><th>background changes</th><th>resolution</th></tr>';
                for (var jsSessionID in s.dbSummary.byDate[date].sessions) {
                    var 
                    docs = s.db[jsSessionID],
                    d = docs[0],
                    session = s.dbSummary.byDate[date].sessions[jsSessionID],
                    entryDoc = docs[0],
                    totalTimeOnSite = docs[docs.length-1].datetime - entryDoc.datetime;                
                    
                    totalTimeOnSite = na.analytics.t2str (totalTimeOnSite);

                    html1 += 
                        '<tr onclick="javascript:na.analytics.view.fillDate(jQuery(\'#siteContent .vividDialogContent\')[0], \''+jsSessionID+'\', \''+date+'\');" '
                        +(session.afterDesktopResize
                            ?'class="dateDetails succesful" style="cursor:zoom-in;background:rgba(0,255,0,0.5);color:white;"'
                            :'class="dateDetails failed" style="cursor:zoom-in;background:rgba(255,0,0,0.5);color:yellow;"'
                        )+'>'
                            +'<td class="ip" style="text-align:center;" onmouseenter="na.analytics.geoIP(event,\''+d.ip+'\');" onmouseleave="jQuery(\'.geoIP\').remove();">'+d.ip+'</td>'
                            +'<td class="datetime" style="text-align:center;" onmouseenter="na.analytics.datetimeConvertToOwnersTimezone(event,'+d.tzOffset+','+d.datetime+');" onmouseleave="jQuery(\'.datetimeLocal\').remove();">'+d.datetimeStr+'</td>'
                            +'<td class="tzOffset" style="text-align:center;">'+d.tzOffset+'</td>'
                            +'<td class="totalTimeOnSite" style="text-align:center;">'+totalTimeOnSite+'</td>'                            
                            +'<td class="backgroundChanges" style="text-align:center;">'+session.backgroundChanges+'</td>'                            
                            +'<td class="resolution" style="text-align:center;">'+session.resolution+'</td>'                            
                        +'</tr>';
                };
                html1 += '</table><a href="javascript:na.analytics.view.fillDates(jQuery(\'#siteContent .vividDialogContent\')[0]);">Back</a><br/><br/><br/><br/><br/>';
                
                jQuery(rootElement).html (html1);
            },
            200);
        },
        
        fillDate : function (rootElement, jsSessionID, date) {
            na.m.waitForCondition ('db loaded', function () {
                return na.analytics.settings.dbLoaded;
            },
            function () {
                var 
                s = na.analytics.settings;
                html1 = '';
                
                html1 += '<a href="javascript:na.analytics.view.fillDates(jQuery(\'#siteContent .vividDialogContent\')[0]);">Back</a><br/><br/>';
                html1 += '<table cellpadding="5" border="0" style=""><tr style="background:rgba(0,50,0,0.5);"><th>IP</th><th>message</th><th>date time</th><th>tzOffset</th><th>time difference (milliseconds)</th><th>HTML</th><th>event type</th></tr>';
                var docs = s.db[jsSessionID];
                var startDateTime = null;
                for (var i=0; i<docs.length; i++) {
                    var d = docs[i];
                    if (!startDateTime) {
                        var 
                        startDateTime = new Date (parseInt(d._id.replace('dt_',''))),
                        startDoc = docs[i],
                        entryDoc = null;
                    } else {
                        var 
                        entryDateTime = new Date(parseInt(d._id.replace('dt_',''))),
                        entryDoc = docs[i];
                    }
                    if (!entryDoc) {
                        html1 += 
                            '<tr style="background:rgba(0,0,50,0.4);">'
                                +'<td style="text-align:center;" class="ip" onmouseenter="na.analytics.geoIP(event,\''+d.ip+'\');" onmouseleave="setTimeout(function(){jQuery(\'.geoIP\').remove();},1000);">'+d.ip+'</td>'
                                +'<td style="text-align:center;overflow-wrap:break-word;">'+d.msg+'</td>'
                                +'<td style="text-align:center;" class="datetime" onmouseenter="na.analytics.datetimeConvertToOwnersTimezone(event,'+d.tzOffset+','+d.datetime+');" onmouseleave="setTimeout(function(){jQuery(\'.datetimeLocal\').remove();},1000);">'+d.datetimeStr+'</td>'
                                +'<td style="text-align:center;" class="tzOffset">'+d.tzOffset+'</td>'
                                +'<td style="text-align:center;">0</td>'
                                +'<td style="text-align:center;">'+d.htmlID+'</td>'
                                +'<td style="text-align:center;">'+d.eventType+'</td>'
                            +'</tr>';
                        //html1 += '<tr><td class="ip">'+d.ip+'</td><td style="overflow-wrap:break-word;">'+d.msg+'</td><td class="datetime"><span class="tzOffsetStr" style="position:absolute;opacity:0.0001">'+d.tzOffset+'</span><span class="datetimeInt" style="float:left;opacity:0.0001;width:100%;">'+d.datetime+'</span><span "datetimeStr">'+d.datetimeStr+'</span></td><td class="tzOffset">'+d.tzOffset+'</td><td>0</td><td>'+d.htmlID+'</td><td>'+d.eventType+'</td></tr>';
                    } else {
                        html1 += 
                            '<tr style="background:rgba(0,0,50,0.4);">'
                                +'<td style="text-align:center;" class="ip" onmouseenter="na.analytics.geoIP(event,\''+d.ip+'\');" onmouseleave="setTimeout(function(){jQuery(\'.geoIP\').remove();},1000);">'+d.ip+'</td>'
                                +'<td style="text-align:center;overflow-wrap:break-word;">'+d.msg+'</td>'
                                +'<td style="text-align:center;" class="datetime" onmouseenter="na.analytics.datetimeConvertToOwnersTimezone(event,'+d.tzOffset+','+d.datetime+');" onmouseleave="setTimeout(function(){jQuery(\'.datetimeLocal\').remove();},1000);">'+d.datetimeStr+'</td>'
                                +'<td style="text-align:center;" class="tzOffset">'+d.tzOffset+'</td>'
                                +'<td style="text-align:center;">'+na.analytics.t2str(entryDateTime.getTime()-startDateTime.getTime())+'</td>'
                                +'<td style="text-align:center;">'+d.htmlID+'</td>'
                                +'<td style="text-align:center;">'+d.eventType+'</td>'
                            +'</tr>';
                        //html1 += '<tr><td class="ip">'+d.ip+'</td><td style="overflow-wrap:break-word;">'+d.msg+'</td><td class="datetime"><span class="tzOffsetStr" style="position:absolute;opacity:0.0001">'+d.tzOffset+'</span><span class="datetimeInt" style="float:left;opacity:0.0001;width:100%;">'+d.datetime+'</span><span "datetimeStr">'+d.datetimeStr+'</span></td><td class="tzOffset">'+d.tzOffset+'</td><td>'+(entryDateTime.getTime()-startDateTime.getTime())+'</td><td>'+d.htmlID+'</td><td>'+d.eventType+'</td></tr>';
                        
                    }
                };
                html1 += '</table>';
                html1 += '<a href="javascript:na.analytics.view.fillDateDetails(jQuery(\'#siteContent .vividDialogContent\')[0], \''+date+'\');">Back</a><br/><br/>';
//                 html1 += '<br/><br/><br/><br/><br/>';
                
                jQuery(rootElement).html (html1);
            },
            200);
        }
    },

    /*
    hookEvents_forTable : function (rootElement) {
        jQuery('.ip', rootElement).mouseover(function(evt){
            na.analytics.geoIP(evt.originalEvent, this.innerHTML);
        }).mouseout(function(evt){
            jQuery('.geoIP').remove();
        });
        jQuery('.datetimeInt', rootElement).mouseover(function(evt){
            debugger;
            na.analytics.datetimeConvertToOwnersTimezone(evt.originalEvent, parseInt(this.innerHTML), this);
        }).mouseout(function(evt){
            jQuery('.datetimeLocal').remove();
        });
    },
    */
    
    datetimeConvertToOwnersTimezone : function (evt, tzOffset, datetimeInt) {
        na.analytics.settings.evt = evt;
        var 
        x = new Date(datetimeInt/* + (tzOffset * 60 * 1000)*/),
        dateStr = x.toLocaleString('nl-NL',{timeZone:'CET'}) + '.' + x.getMilliseconds(),
        html = '<div class="datetimeLocal" style="position:absolute;top:'+evt.layerY+'px;left:'+evt.layerX+'px;background:rgba(0,0,0,0.8);border:3px ridge white;border-radius:5px;">'+dateStr+'</div>';
        
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
                html = '<div class="geoIP" style="position:absolute;top:'+evt.layerY+'px;left:'+evt.layerX+'px;background:rgba(0,0,0,0.8);border:3px ridge white;border-radius:5px;z-index:1200;">'+data+'</div>';
                jQuery('#siteContent').prepend(html);
                debugger;
            }
        };
        na.analytics.settings.evt = evt;
        jQuery.ajax (ajaxCmd);
    }
};
