//$(document).ready(function() { // NEVER AGAIN!!

//na.analytics.logMetaEvent ('newsApp : init-stage-0');

na.m.waitForCondition (
	'na.s.c.settings.loaded',
	function () {
		var r = (
			typeof na === 'object'
			&& typeof na.site === 'object'
			//&& typeof na.site.code === 'object'
			//&& typeof na.apps === 'object'
			//&& typeof na.apps.loaded === 'object'
		);
        return r;
	},
	function () {
        na.analytics.logMetaEvent ('newsApp : init-stage-1');
        delete na.apps.loaded.newsApp;
na.apps.loaded.newsApp = {
	about : {
		whatsThis : 'Application code for this news app (RSS reader)',
		copyright : 'Copyrighted (c) and All Rights Reserved (r) 2011-2021 by Rene AJM Veerman, Amsterdam, Netherlands',
		license : 'May only be used on https://nicer.app',
		firstCreated : '2018',
		lastModified : '2020',
        version : '2.4.0'
	},
	globals : {
        dtIntervalSeconds : 60,
        contentOpacity : 0,
        contentBorder : '0px solid black',
        contentBoxShadow : '0px 0px 0px 0px rgba(0,0,0,0)'
	},
	settings : {
		loadedIn : {
			'#siteContent' : {
				settings : {
					initialized : false 
				},
				saConfigUpdate : function (settings) {
					nicerapp.site.globals.desktop.configUpdate();
				},

                mergeMenu : function () {
                        var
                        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
                        loadedIn = s.loadedIn['#siteContent'],
                        mainmenu = $('#newsApp_mainmenu')[0];
                        //na.apps.loaded.newsApp.transformLinks ($('#newsApp_mainmenu')[0]);
                        
                        if (!mainmenu.linksTransformedAlready) {
                            na.menu.preprocess('newsApp_mainmenu');
                            window.top.na.s.c.transformLinks ($('#newsApp_mainmenu')[0]);
                            mainmenu.linksTransformedAlready = true;
                        }
                        $('#newsApp_mainmenu').css({display:'none'});
                        na.menu.merge ('siteMenu', 'na.site.code.transformLinks', '-saLinkpoint-appMenu', $('#newsApp_mainmenu')[0], undefined, false);
                        setTimeout (function() {
                            na.menu.onresize('siteMenu');
                        }, 350);
                        na.desktop.onresize({reloadMenu : false});
                },
                
				onload : function (settings) {
                    //na.analytics.logMetaEvent ('newsApp : init-stage-2');
                    na.m.waitForCondition ('newsApp start', function() {
                        /*
                        var r = (
                            na.m.settings.initialized.site === true
                            && na.desktop.settings.animating === false
                            && na.m.settings.initialized.site 
                            && !na.desktop.settings.animating
                            && !na.s.c.settings.updatingMenu
                            && $('#newsApp_mainmenu')[0]
                            && $('#siteMenu').children('div').length > 0
                            //&& na.s.c.settings.afterFirstBoot
                        );*/
                        //debugger;
                        return true;
                    }, function () {
                        var
                        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
                        loadedIn = s.loadedIn['#siteContent'];
                        //debugger;
                        settings.onHold = true;
                        //na.analytics.logMetaEvent ('newsApp : init-stage-3');
                        
                        na.apps.loaded.newsApp.settings.current.db = {};
                        
                        /*
                        c.oldContentOpacity = $('#siteContent__CSS3').css('opacity');
                        c.oldContentBorder = $('#siteContent__dialog').css('border');
                        c.oldContentBoxShadow = $('#siteContent__dialog').css('boxShadow');
                        */

                        //$('#siteContent').removeClass('vividScrollpane__scroll_black').addClass('vividScrollpane__hidden');
                        na.m.waitForCondition('siteContent dialog reappearance', function () {
                            
                            return (
                                $('#siteContent__content')[0]
                                //&& na.m.settings.initialized.site
                            );
                            //return true;
                        }, function () {
                            //na.analytics.logMetaEvent ('newsApp : init-stage-4');

                            /*
                            var vividTextCmd = {
                                    el : $('#newsApp_info')[0],
                                    theme : na.cg.themes.saColorgradientSchemeOrangeYellow_netherlands, 
                                    animationType : na.vividText.globals.animationTypes[0],
                                    animationSpeed : 4 * 1000
                            };
                            na.vividText.initElement (vividTextCmd);	
                            */
                            
                            //s.hasAnimatedScrollpane = na.vcc.settings['siteContent'].hasAnimatedScrollpane;
                            //na.vcc.settings['siteContent'].hasAnimatedScrollpane = false;
                            
                            $('.btn').fadeIn('normal');
                            //na.dialog.changeTheme ($('#siteContent')[0], undefined, function () {
                                /*$('#siteContent__CSS3').css({
                                    opacity : g.contentOpacity
                                });
                                $('#siteContent__dialog').css({
                                    border : g.contentBorder,
                                    boxShadow : g.contentBoxShadow
                                });*/
                                
                                //$('#siteContent').addClass ('saZeroTopLeft');
                            na.apps.loaded['newsApp'].settings.loadedIn['#siteContent'].settings.initialized = true;
                            na.apps.loaded['newsApp'].settings.loadedIn['#siteContent'].settings.ready = true;
                                
                                //loadedIn.mergeMenu();
                                
                            document.addEventListener ('keyup', na.apps.loaded.newsApp.onkeyup);

                            na.apps.loaded.newsApp.nestedStartApp();
                            //na.analytics.logMetaEvent ('newsApp : init-stage-5');
                            
                            settings.onHold = false;
                            //});
                        }, 200);

                    }, 200);
				},
                ondestroy : function (settings) {
                    var
                    na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db;
                    clearInterval(na.apps.loaded.newsApp.settings.countDownInterval);
                    clearTimeout (na.apps.loaded.newsApp.settings.refreshTimer);                    
                    clearTimeout (c.adsTimer1);
                    clearTimeout (c.adsTimer2);
                    clearInterval(c.adsInterval1);
                    clearTimeout (c.timerDisplayNews_loop);
                    clearTimeout (c.timerLoadNews_read_loop);
                    clearTimeout (c.timerDisplayNewsItem);
                    clearTimeout (c.timerDisplayItem);
                    clearTimeout (c.timerAnimateItemIn);
                    clearTimeout (c.timerCheck);
                    clearInterval (c.newItemsInterval);
                    clearInterval (c.intervalMailLogCountdown);
                    na.vcc.settings['siteContent'].hasAnimatedScrollpane = s.hasAnimatedScrollpane;
        na.vcc.settings['siteContent'].canAutoHeight = s.canAutoHeight;
        na.vcc.settings['siteContent'].canResize = s.canResize;
        na.vcc.settings['siteContent'].containsIframe = s.containsIframe;

                    if (typeof settings=='undefined') settings = {};
                    c.settings = settings;
                    
                    settings.onHold = true;
                    //$('#siteContent').removeClass ('saZeroTopLeft');
                    //na1.vcc.applyTheme ('siteContent');
                    
                    //$('#siteContent').addClass('vividScrollpane__scroll_black').removeClass('vividScrollpane__hidden');
                    na.m.waitForCondition('siteContent dialog reappearance', function () {
                        return $('#siteContent__dialog')[0];
                    }, function () {
                        //na.dialog.changeTheme ($('#siteContent')[0], undefined, function () {
                            /*$('#siteContent__CSS3').css({
                                opacity : c.oldContentOpacity
                            });
                            $('#siteContent__dialog').css({
                                border : c.oldContentBorder,
                                boxShadow : c.oldContentBoxShadow
                            });*/
                            c.settings.onHold = false;
                        //});
                    }, 100);   

                    document.removeEventListener ('keyup', na.apps.loaded.newsApp.onkeyup);
                    $(na.apps.loaded.newsApp.settings.loaderIcon).remove();
                    //while (!$('#siteContent__dialog')[0]) {};
                    // never put any asynchronous calls in an ondestroy handler, except for this statement here :
                    // as this can mess up na.s.c.loadContent()'s work.
                    //setTimeout (function () {
                        delete na.apps.loaded.newsApp;
                    //}, 10);
                },
				onresize : function (settings) {
					// TODO : what's settings.isManualResize ???
					//if ($('#appGame').css('display')=='none') $('#appGame').fadeIn('slow');
					na.apps.loaded.newsApp.onresize();
				}
			}
		},
		current : {
            idx : 0,
            db : {}, // as of version 2.1.0, we store news as it comes in via ajax_get_items.php, as a recursive array only.
            its3 : [],
            tries : 0,
            maxDisplayCount : 0,
            onScreen : 30,
            locked : false
        }
	},
	
	nestedStartApp : function () {
        na.m.waitForCondition ('siteContent dialog.changeTheme()', function () {
            return $('#siteContent')[0];
        }, na.apps.loaded.newsApp.startApp, 100);
	},
    
    startApp : function () {
        var
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        dtBegin = new Date(),
        //dtQuit = new Date(dtBegin.getTime() - 1000 * 60 * 60 * 1.5), //(na.m.userDevice.isPhone ? 2.5 : 24.5)),
        urlp = na1.getURLparameters(location.href),
        settings = urlp[0];

        na.analytics.logMetaEvent ('startApp : news');
        /*
        var loaderIconTheme = na.s.c.globals.loaderIconTheme('appLoading');
        na.apps.loaded.newsApp.settings.loaderIcon = na.acs.addIcon(
            true, //whether or not to absolutely position
            $('#siteContent__dialog')[0], //parent element to stick icon to (will be positioned in the middle of the parent element)
            180, 180, //width and height in pixels
            loaderIconTheme, //see var theme above
            true //start running immediately
        );*/
        
        na1.onresize();

        c.dtCurrent = new Date(new Date().getTime() - (1000 * 60 * 10));
        c.dtEnd = new Date();
        c.lastCurrentGet = new Date();
        

        if (!c.dtStart) c.dtStart = new Date();
        if (!c.intervalMailLogCountdown) c.intervalMailLogCountdown = setInterval (na1.intervalMailLogCountdown, 250);

        if (!c.read_loop_minutesIntoPast) c.read_loop_minutesIntoPast = 10;
        if (!c.read_loop_millisecondsToDoNext) c.read_loop_millisecondsToDoNext = 1000 * .5;
        
        c.firstRun = true;
        na1.loadNews_read_loop ();
    },
    
    onkeyup : function (evt) {
        //debugger;
        if (evt.code=='AltRight' || evt.code=='AltLeft') na.apps.loaded.newsApp.gotoNextPage();
        if (evt.key==' ') na.apps.loaded.newsApp.toggleLock();
    },
    
    onSearch : function (evt) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        input = $('#newsApp_searchbar');
        
        c.searchQuery = input.val().replace(' ', '%20');
        c.dtCurrent = new Date(new Date().getTime() - (1000 * 60 * 10));
        c.dtEnd = new Date();
        c.lastCurrentGet = new Date();

        c.locked = true;
        $('.newsApp__item__outer').fadeOut('slow').promise().done (function() {
            $('.newsApp__item__outer').remove();
            c.locked = false;
            c.firstRun = true;
            c.tries = 0;
            clearTimeout (c.timerLoadNews_read_loop);
            clearInterval (c.intervalMailLogCountdown);
            clearTimeout (c.timerDisplayNews_loop);
            clearInterval (c.newItemsInterval);
            na1.loadNews_read_loop();
        });
    },
    
    clearSearch : function (evt) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        input = $('#newsApp_searchbar');
        
        c.searchQuery = input.val().replace(' ', '%20');
        c.dtCurrent = new Date(new Date().getTime() - (1000 * 60 * 10));
        c.dtEnd = new Date();
        c.lastCurrentGet = new Date();

        c.locked = true;
        $('.newsApp__item__outer').fadeOut('slow', function() {
            $('.newsApp__item__outer').remove();
            c.locked = false;
            c.firstRun = true;
            c.db = {};
            na1.loadNews_read_loop();
        });
    },
    
    gotoNextPage : function () {
        var
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db;
        c.gotoNextPage = true;
    },
    
    toggleLock : function () {
        var
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        lock = $('#newsApp_lock')[0];
        if (lock.src.match('_on')) {
            lock.src = na.site.globals.urls.app + '/nicerapp/apps/nicerapp/news/appContent/newsApp/2.0.0/btnLock_off.png';
            c.locked = false;            
        } else {
            lock.src = na.site.globals.urls.app + '/nicerapp/apps/nicerapp/news/appContent/newsApp/2.0.0/btnLock_on.png';
            c.locked = true;            
        }
        
    },
    
    intervalMailLogCountdown : function () {
        var
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        ms = c.dtCurrent.getTime(),//na.m.elapsedMilliseconds(),
        msgTime = na.m.secondsToTimeString(ms/1000);
        
        c.mailLogMsg = msgTime + ' has passed, mailing log of what happened at around 15 to 20 seconds.';
        if (parseFloat($('#newsApp_debug').css('z-index'))!==10 * 1000 * 1000) {
            $('#newsApp_debug').css ({
                opacity : 0.001,
                zIndex : 10 * 1000 * 1000,
                height : '3em',
                padding : '7px'
                
            }).animate({opacity:0.75,color:'white',backgroundColor:'green'});
        }
        
        $('#newsApp_debug').html (c.mailLogMsg);
    },
    
    loadNews_read_loop : function () {
        var
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        urlp = na1.getURLparameters(location.href),
        settings = urlp[0],
        dtBegin = new Date(),
        dc = { 0 : 0 },
        di = { 0 : [] },
        params = {
            dc : dc,
            di : di
        },
        ow = ($('#siteContent')[0].offsetWidth)-20,
        oh = $('#siteContent')[0].offsetHeight;
        
        g.buffer = Math.round( ( ow / 440 ) * 5 );
        
        
        na.m.walkArray (db, undefined, na1.displayNews_getDisplayCounts, false, params);
        var
        ks = Object.keys(dc),
        total = 0;
        
        ks = ks.sort(function(a,b){ b - a });
        
        var
        unread = dc[ks[0]];
        
        // get older news items when needed
        //debugger;
        if (c.firstRun) {
            c.firstRun = false;
            na1.loadNews_get_forDateTimeRange (c.dtCurrent, c.dtEnd, settings);
        } else if (unread < g.buffer) {
            c.dtEnd = c.dtCurrent;
            c.dtCurrent = new Date(c.dtEnd.getTime() - (1000 * 60 * c.read_loop_minutesIntoPast));
            na1.loadNews_get_forDateTimeRange (c.dtCurrent, c.dtEnd, settings);
            //c.dtCurrent = c.dtEnd;
        } else {
            clearInterval (c.intervalMailLogCountdown);
            clearTimeout (c.timerDisplayNews_loop);
            $('#newsAppDebug').animate({opacity:0.001});
            
            if ($('#newsApp_content .newsApp__item__outer').length===0) c.timerDisplayNews_loop = setTimeout (na1.displayNews_loop, 250);
        }
        
        // get newest news items
        if (
            !c.lastCurrentGet
            || c.lastCurrentGet.getTime() < dtBegin.getTime() - 1000 * 60 * 4
        ) {
            c.lastCurrentGet = dtBegin;
            na1.loadNews_get_forDateTimeRange (new Date(dtBegin.getTime() - 1000 * 60 * 6), dtBegin, settings);
        };
    },
    
    /*
    loadNews_read_loop_old : function (dtBegin, dtEnd, dtQuit, settings, waitTimeInSeconds, dtOffsetInSeconds) {
        var
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        doNextToo = true;
        
        //c.dtCurrent = dtBegin;
        //c.dtEnd = dtEnd;
        na1.loadNews_get_forDateTimeRange (dtBegin, dtEnd, settings);
        
        if (dtOffsetInSeconds < 0 && dtQuit) {
            doNextToo = dtBegin.getTime() > dtQuit.getTime();
        };
        
        if (doNextToo) setTimeout (function() {
            c.dtEnd = new Date(dtEnd.getTime() + 1000 * dtOffsetInSeconds);
            c.dtBegin = new Date(dtBegin.getTime() + 1000 * dtOffsetInSeconds);
            
            na1.loadNews_read_loop(c.dtBegin, c.dtEnd, dtQuit, settings, waitTimeInSeconds, dtOffsetInSeconds);
        }, 1000 * waitTimeInSeconds);
    },
    */
    
    loadNews_get_forDateTimeRange : function (dtBegin, dtEnd, settings) {
        //debugger;
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        dtBeginURL = na1.formatDateForLoading(dtBegin),//('' + dtBegin).replace('+', '%2B'),
        dtEndURL = na1.formatDateForLoading(dtEnd),//('' + dtEnd).replace('+', '%2B'),
        url = '/nicerapp/apps/nicerapp/news/ajax_get_items.php?section='+settings.replace(/-/g,'/').replace(/ /g, '_')+'&dateBegin='+dtBeginURL+'&dateEnd='+dtEndURL;
        
        if (c.searchQuery) url += '&q='+c.searchQuery;
        na.analytics.logMetaEvent ('newsApp : loadNews_get_forDateTimeRange() url='+url);
//alert (url);
        ajaxCommand = {
            type : 'GET',
            url : url,
            success : function (data, textStatus, jqXHR) {
                // ajax_get_items.php sets a header to content-type: application/json
                // that will make $ provide the data as already decoded json js object data[1]
                // if you ever have problems with news not showing up it could be due to data-translation errors.
                // eventually you'll have to debug in crontabEntry_manageDatabase.php and class.newsApp-2.php as well, 
                // they're in the same folder as ajax_get_items.php and this file.
                
                na.m.log (20, {
                    url : url,
                    data : data,
                    textStatus : textStatus
                });
                
//alert(data);
//alert ('POST LOAD : '+url);
                
                $('.loader, .loaderAfter').remove(); 
                $('#newsApp_searchbar__enterQuery, #newsApp_searchbar__abandonQuery, #newsApp_info, #newsApp_timer').css({display:'block'});
                $('#newsApp_title, #newsApp_searchbar, #newsApp_header_buttons').css({display:'table-cell'});
                $('#siteContent .vividDialogContent').css ({
                    display : 'block',
                    justifyContent : '',
                    alignItems : '',
                    textAlign : '',
                    background : 'rgba(0,0,0,0)'
                });                    
                $('#siteContent__content').css({
                    top : $('#siteContent__header').height(),
                    left : 0,
                    width : $('#siteContent').width(),
                    height : $('#siteContent').height() - $('#siteContent__header').height(),
                    opacity : 1
                });
                    
                
                
                
                
                var
                idxStart = c.idx;
                
                na.m.walkArray (data, undefined, na1.loadNews_get_forDateTimeRange_walkValue);
        
                
                var
                itemsLoadedCount = c.idx - idxStart;
                console.log (itemsLoadedCount + ' - ' + url);
                //alert (itemsLoadedCount + ' - ' + url);
                na.analytics.logMetaEvent ('newsApp : loadNews_get_forDateTimeRange() data fetched sucessfully for itemsLoadedCount='+itemsLoadedCount+' and url='+url);
       //debugger;
                
                if (itemsLoadedCount < 50) {
                    //c.dtCurrent = new Date(c.dtCurrent.getTime() - 1000 * 60 * c.read_loop_minutesIntoPast);

                    c.read_loop_minutesIntoPast = 60 * 4;
                    c.read_loop_millisecondsToDoNext = 1000 * .5;
                } else if (itemsLoadedCount < 100) {
                    c.read_loop_minutesIntoPast = 60 * 2;
                    c.read_loop_millisecondsToDoNext = 1000 * .5;
                } else {
                    c.read_loop_minutesIntoPast = 60;
                    c.read_loop_millisecondsToDoNext = 1000 * .5;
                };
                
                // na.m.extend() works with pointers (i think, i hope) and does not let go of old data in a recursive array/object,
                // unlike $.extend and Object.assign
                na.m.extend (na.apps.loaded.newsApp.settings.current.db, data);
                
                var i=0; for (var idx in na.apps.loaded.newsApp.settings.current.db) i++;
                
                if (i === 0) {
                    var 
                    dtNow = new Date();
                    
                    /*
                    if (c.dtStart.getTime() + 1000 * 15 < dtNow.getTime()) {
                        clearInterval (c.intervalMailLogCountdown);
                        alert ('startup of news app failed. sorry.');
                        debugger;
                        na1.settings.loadedIn['#siteContent'].ondestroy();
                        
                    }*/
                } else {
                    clearInterval (c.intervalMailLogCountdown);
                    $('#newsApp_debug').animate({opacity:0.001}, {complete :function () {
                        $('#newsApp_debug').html('');
                    }});
                }
                
                var
                dc = {},
                di = {},
                params = {
                    dc : dc,
                    di : di
                };
                //dc = { 0 : 0 }, di : { 0 : [] }, params = { dc : dc, di : di };
                
                na.m.walkArray (db, undefined, na1.displayNews_getDisplayCounts, false, params);
                
                var
                ks = Object.keys(dc),
                total = 0,
                highest = 10;
                
                ks = ks.sort(function(a,b){ b - a });
                c.displayCounts = '';
                for (k in ks) {
                    if (c.displayCounts!=='') c.displayCounts +=', ';
                    c.displayCounts += dc[ks[k]];
                };
                c.displayCounts = '<span class="newsApp__header__displayCounts">' + (-1 * (g.buffer-parseInt(c.displayCounts))) + '</span>';
                $('#newsApp_timer').html(na1.formatDateForHeader()+ ' ' +(c.displayCounts));
                
                c.timerLoadNews_read_loop = setTimeout (na1.loadNews_read_loop, c.read_loop_millisecondsToDoNext);
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                alert (thrownError);
            }
        };
        na.m.log (20, url);
    //debugger;   
        $.ajax (ajaxCommand);        
    },
    
    loadNews_get_forDateTimeRange_walkValue : function (cd) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        urlp = na1.getURLparameters(location.href),
        settings = {
            section : urlp[0].replace(/__/g,'/').replace(/_/g,' ')
        };
        
        if (cd.v && cd.v.items) {
            for (var i=0; i<cd.v.items.length; i++) {
                var it = cd.v.items[i];
                it.idx = c.idx++;
                it.rssURL = cd.v.url;
                it.path = cd.path.replace(/\d+\//g, '').substr(1);
                if (parseInt(it.path)>0) {
                    it.path = settings.section;
                } else {
                    it.path = settings.section + '/' + it.path;
                };
                it.level = cd.level;
                it.displayCount = 0;
            }
        }
    },
    
    displayNews_getDisplayCounts : function (cd) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db;
        if (cd.v && cd.v.items) {
            for (var i=0; i<cd.v.items.length; i++) {
                var it = cd.v.items[i];
                
                var k = it.displayCount;
                
                if (typeof cd['params']['dc'][k]=='undefined') 
                    cd['params']['dc'][k] = 1; 
                else 
                    cd['params']['dc'][k]++;

                if (typeof cd['params']['di'][k]=='undefined') 
                    cd['params']['di'][k] = []; 
                else {
                    var key = cd['params']['di'][k].length;
                    cd['params']['di'][k][key] = it;
                }
            }
        }        
    },
    
    displayNews_loop : function (state) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        urlp = na1.getURLparameters(location.href),
        container = $('#newsApp_content'),
        getToTry = g.buffer * 4;
        
        console.log ('displayNews_loop() : state='+state);
        
        //$('#siteContent__content').css ({ top : 0 });
        $('#siteContent__header').animate({opacity:1},700);
        $('#newsApp_title').html (urlp[0].replace(/__/g, ' ').replace(/_/g, ' '));
        $('#newsApp_content .newsApp__item__outer').animate({opacity:1},'normal');

        if (s.loaderIcon) {
            $(s.loaderIcon).fadeOut('slow', function() {
                $(s.loaderIcon).remove();
                delete s.loaderIcon;
            });
        }
        
        c.tries++;
    
        var
        // dc means displayCount, an elaborate way to make sure entries that havent been shown too often end up on the screen quickly.
        dc = { 0 : 0 },
        di = { 0 : [] },
        params = {
            dc : dc,
            di : di
        };
        
        na.m.walkArray (db, undefined, na1.displayNews_getDisplayCounts, false, params);
        
        var
        ks = Object.keys(dc),
        total = 0,
        highest = 10;
        
        ks = ks.sort(function(a,b){ b - a });
        c.displayCounts = '';
        for (k in ks) {
            if (c.displayCounts!=='') c.displayCounts +=', ';
            c.displayCounts += dc[ks[k]];
        };
        c.displayCounts = '<span class="newsApp__header__displayCounts">' + (-1 * (g.buffer-parseInt(c.displayCounts))) + '</span>';
        $('#newsApp_timer').html(na1.formatDateForHeader()+ ' ' +c.displayCounts);

        var 
        //numKeys = Object.keys(params.di).length-1,
        //its = di[c.maxDisplayCount-1>0?c.maxDisplayCount-1:0], 
        found = false,
        it = null;
        
        var l = 0;
        while (di[l].length==0) l++;
        its = di[l];

        console.log ('displayNews_loop() (2) : state='+state);
        
            var
            key = Math.floor(Math.random() * its.length),
            it = its[key];
                var els2 = $('#newsApp_content .newsApp__item__outer');
                for (var j=0; j<els2.length; j++) {
                    if (els2[j].innerHTML.indexOf(it.t)!==-1) found = true;
                }
        /*
        while (it===null) {
            var
            key = Math.floor(Math.random() * its.length),
            it = its[key];
            
            if (!it) debugger;
            if (typeof it.displayCount=='number' && it.displayCount > 0) {
                it = null;
            } else {
                var els2 = $('#newsApp_content .newsApp__item__outer');
                for (var j=0; j<els2.length; j++) {
                    if (els2[j].innerHTML.indexOf(it.t)!==-1) found = true;
                }
            }
            console.log ('displayNews_loop() (3)', its, key, it);
        };*/
        //itEl = $('#newsApp__item__'+it.idx)[0];
        
                
        if (found || !na1.match_searchCriteria(it)) {
            //debugger;
            setTimeout (function () {
                c.tries--;
                na1.displayNews_loop ('testing');
            }, 50);
            return false;
        } else {
            var dnfi = na1.displayNews_formatItem (it, '');
            na.m.log (1, {msg:'displayNews_loop(): state='+state, dnfi:dnfi});
            if (!dnfi) {
                var state = 'testing';
                na.m.log (1, {msg:'displayNews_loop(): state reset ='+state});
                na1.displayNews_loop(state);
                return false;
            };
                
            var 
            states = [ 'testing', 'displaying', 'finished' ];
            if (!state) var state = 'testing';
            //console.log ('NEW: '+state + ' - ' +it.idx);
            
            function displayNewsItem(state) {
                if (!na.apps.loaded.newsApp) return false;
                       
                na.m.log (1, {msg : 'displayNewsItem(state='+state+')'});

                var 
                na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db;
                
                if (state=='testing') {
                    var prefix = it.idx+'___';
                } else if (state=='displaying') {
                    var prefix = '';
                    it.displayCount++;
                    if (it.displayCount > c.maxDisplayCount) c.maxDisplayCount = it.displayCount;                       
                } else return true;
                         
                var
                dnfi = na1.displayNews_formatItem (it, prefix),
                html = dnfi.html,
                htmlTooltip = dnfi.html2;
                       
                if (!c.resize) c.resize={};
                c.resize[prefix+'newsApp__item__'+it.idx] = function (t, event, itIDX, prefix) {
                    if (!na.apps.loaded.newsApp) return false;

                    var 
                    itEl = $('#'+prefix+'newsApp__item__'+itIDX)[0],
                    sp = $('.vividScrollpane', itEl)[0];
                    
                    if (!itEl) {
                        return false;
                    }
                    //na.m.log (1, {msg : 'c.resize['+prefix+'newsApp__item__'+it.idx+']', dnfi:dnfi, state:state});
                    if (sp && sp.scrollHeight > 300) {
                        var
                        jel2 = $('.newsApp__item__mediaSingle',itEl);
                        $('img, iframe', sp).not('.newsApp__item__mediaSingle__0').not('[width="1"]').not('[border="1"]').not('.dontResize').css ({
                            margin : 0,
                            border : '0px solid black',
                            float : '',
//                            width : sp.offsetWidth - 30,
                                width : $(itEl).width() - jel2.width() - 30,
                            height : ''
                        }).each(function(idx,el){
                            el.removeAttribute('height');
                            el.removeAttribute('width');
                        });
                        setTimeout(function(){ // EXPERIMENTAL, used to not setTimeout() here
                            /*
                            $('#'+sp.id+', #'+sp.id+'__container',itEl).css({
                                width : $(itEl).width() - jel2.width() - 10,
                                height : 300
                            });
                            if ($('#'+sp.id+'__container',itEl)[0]) {
                                setTimeout (function(sp) {
                                    if (itEl) na.sp.containerSizeChanged(sp, true);
                                    var 
                                    dnf = na.apps.loaded.newsApp.displayNews_full(),
                                    full = dnf.full,
                                    removed = dnf.removed;
                                    if (full) {
                                        na1.countDown();
                                    } else if (removed && c.tries < getToTry) {
                                        state = 'testing';
                                        na1.displayNews_loop(state);
                                        return false;
                                    } else if (removed) {
                                        na1.countDown();
                                    }
                                        
                                }, 10, sp);
                            } else {
                                setTimeout (function(itEl) {
                                    na.vcc.init(itEl, function () {
                                        $(itEl).css({left:0});
                                    });
                                }, 10, itEl);
                            }*/
                        }, 200);
                        
                    } 
                };
                
                html = html.replace ('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>','');
                html = html.replace (/http:\/\//g, 'https://');
                try {
                    if (state=='testing') {
                        $('#newsApp_content_shadow').append(html.replace(/id="/g, 'id="'+prefix));
                    } else if (state=='displaying') {
                        $('#newsApp_content').append(html);
                        //if (html.indexOf('vividScrollpane')!==-1) debugger;
                        
                    } else return true;
                } catch (e) {
                    state='testing';
                    na1.displayNews_loop(state);
                    return false;
                }

                       
                       
                if (c.timerDisplayNewsItem) clearTimeout(c.timerDisplayNewsItem);
                c.timerDisplayNewsItem = setTimeout (function (it, prefix, state) {
                    
                    if (!na.apps.loaded.newsApp) return false;
                    
                    var 
                    itEl = $('#'+(state=='testing'?prefix:'')+'newsApp__item__'+it.idx)[0],
                    thumbWidth = (
                        na.m.userDevice.isPhone
                        ? 80
                        : 150
                    );
                    if (!itEl) {
                        state = 'testing';
                        na1.displayNews_loop(state);
                        return false;
                    };
                    
                    na.m.log (1, {msg : 'c.timerDisplayNewsItem() : itEl.id='+itEl.id, state:state});
                    
                    $('.feedflare', itEl).remove();
                    
                    itEl.db = it;
                    //console.log ('dni : '+state + ' - ' +itEl.id);
                    itEl.htmlTooltip = htmlTooltip;
                    
                    if (state==='displaying') {
                        $(itEl).tooltipster({
                            theme : 'newsAppTooltipTheme',
                            contentAsHTML : true,
                            content : htmlTooltip
                        });                        
                    }
                    
                    
                    $('img', itEl).each (function (idx,el) {
                        if (this.src.match(/cnn_freevideo/)) $(this).addClass('dontResize');
                        if (this.src.match(/cnn_latest/)) $(this).addClass('dontResize');
                    });
                    
                    // resize item
                    var 
                    imgs = $('img, iframe', itEl).not('.newsApp__item__mediaSingle__0').not('[width="1"]').not('[border="1"]').not('.dontResize');
                    
                    imgs.each(function(idx,el){
                        if ($(this).width() > na.apps.loaded.newsApp.settings.itemWidth - 10) {
                            $(this).css ({
                                width : na.apps.loaded.newsApp.settings.itemWidth - 10,
                                height : ''
                            })
                            el.removeAttribute('height');
                            el.removeAttribute('width');
                        }
                    })
                    
                    $('.vividScrollpane td > img', itEl).not('.newsApp__item__mediaSingle__0').not('[width="1"]').not('.dontResize').css ({
                        width : thumbWidth,
                        height : ''
                    }).each(function(idx,el){
                        el.removeAttribute('height');
                        el.removeAttribute('width');
                    });

                    if (!$('div > div > iframe', itEl)[0]) {
                        var 
                        minWidth = null,
                        ms = $('.newsApp__item__mediaSingle', itEl),
                        imgs = $('img', itEl);
                        
                        if (imgs.length==0 && ms[0] && it.m.length && it.m.length>0) {
                            var m1 = it.m[it.m.length-1];
                            for (var i=0; i<it.m.length; i++) {
                                var m = it.m[i];
                                if (typeof m.u=='string') {
                                    if (!minWidth && typeof m.width=='number') minWidth = parseInt(m.width);
                                    if (parseInt(m.width) < minWidth) {
                                        minWidth = parseInt(m.width);
                                        var m1 = it.m[i];
                                    }
                                    if (m.content) {
                                        var m1 = it.m[i];
                                        minWidth = thumbWidth;
                                    }
                                };
                            }
                            if (!minWidth) minWidth=thumbWidth;
                            if (minWidth>thumbWidth) minWidth=thumbWidth;                                        
                                                        
                            if (typeof m1.u=='string') {
                                m1.u = m1.u.replace ('http://', 'https://');

                                var
                                html = '<a class="nomod" target="_new" href="'+it.u+'"><img src="'+m1.u+'" class="newsApp__item__mediaSingle__0" style="width:150px;"/></a>';
                                
                                //$(ms).append($.parseHTML(html, document, true));
                                $(ms)[0].innerHTML = html;
                            }
                        };
                    }
                    
                    //if (state=='displaying') {
                    if (c.timerDisplayNewsItem) clearTimeout (c.timerDisplayNewsItem);
                    c.timerDisplayItem = setTimeout (function (it, itEl, prefix) {
                        //if (itEl.offsetTop + itEl.offsetHeight < container.offsetHeight) {
                        if (!na.apps.loaded.newsApp) return false;

                        var id = prefix+'newsApp__item__'+it.idx;
                        c.resize[id](undefined, undefined, it.idx, prefix);
                        //}
                    }, (state=='testing'?10:10), it, itEl, prefix);
                    //}
                    
                    //if (c.timerCheck) clearTimeout (c.timerCheck);
                    c.timerCheck = setTimeout (function(itEl, prefix, state) {
                        if (!na.apps.loaded.newsApp) return false;
                                               
                        var 
                        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
                        dnf = na1.displayNews_full(prefix),
                        full = dnf.full,
                        removed = dnf.removed;
                    
                        na.m.log (1, {msg : 'c.timerCheck() : itEl.id='+itEl.id, dnf:dnf, state:state});
                        
                        if (!full && !removed) 
                        c.timerAnimateItemIn = setTimeout (function(itEl, removed, state) {
                            var 
                            na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db;
                            if (!na.apps.loaded.newsApp) return false;
                        
                            na.m.log (1, {msg : 'c.timerAnimateItemIn() : itEl.id='+itEl.id, removed:removed, state:state, c:c, getToTry:getToTry});
                    
                            if (!removed && state=='displaying') {
                                /*if (itEl.parentNode) {
                                    it.displayCount++;
                                    if (it.displayCount > c.maxDisplayCount) c.maxDisplayCount = it.displayCount;
                                }; in displayNews_loop() now */
                                //debugger;
                                if (!itEl || !itEl.className || itEl.className.indexOf('newsApp__item__outer')===-1 || !itEl.id.match(/newsApp__item__\d+.*/)) debugger;
                                $(itEl).animate({opacity:1}, 500);
                            } 

                            if (!removed && state=='testing') {
                                state = 'displaying';
                                if ($('img, iframe', itEl).not('[width="1"]').not('[border="1"]').not('.dontResize').length>0) {
                                    setTimeout (displayNewsItem, 500, state);
                                } else displayNewsItem(state);
                                return false;
                            };
                            
                            /*
                            setTimeout (function (itEl, it) {
                                if (!itEl.parentNode) debugger;
                                if (itEl.parentNode) { dnf:dnf,
                                    it.displayCount++;
                                    if (it.displayCount > c.maxDisplayCount) c.maxDisplayCount = it.displayCount;
                                    $(itEl).animate({opacity:1}, 700);
                                }
                            }, 1000, itEl, it);
                            */
                            //console.log (state + ' - ' +itEl.id);
                            if (state=='displaying' && c.tries < getToTry) {
                                state = 'testing';
                                na1.displayNews_loop(state);
                                return true;
                            } /*else if (state=='finished') {
                                var 
                                na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
                                container = $('#newsApp_content'),
                                l = $('.newsApp__item__outer', container).length,
                                countDown = (
                                    l < 15
                                    ? 15
                                    : 30
                                ),
                                countDown = Math.round(l * 1.5);
                                
                                c.onScreen = l;
                                
                                clearInterval (c.newItemsInterval);
                                c.newItemsInterval = setInterval (function() {
                                    $('#newsApp_timer').html(na1.formatDateForHeader()+ ' ' +(c.displayCounts)+' -'+countDown);
                                    if (!c.locked) countDown--;
                                    if (countDown==0 || c.gotoNextPage) {
                                        clearInterval (c.newItemsInterval);
                                        $(container).fadeOut(500, function() {
                                            container.html ('').fadeIn('fast');
                                            $('#newsApp_content_shadow').html('');
                                            c.its3 = [];
                                            c.resize = {};
                                            c.tries = 0;
                                            delete c.gotoNextPage;
                                            na1.onresize();
                                            state = 'testing';
                                            na1.displayNews_loop();
                                        });
                                    }
                                }, 1 * 1000);
                            }*/                                
                        }, (state=='testing'?100:100), itEl, removed, state);
                        
                        if (full) {
                            na1.countDown();
                        } else if (removed && c.tries < getToTry) {
                            state = 'testing';
                            na1.displayNews_loop(state);
                            return false;
                        } else if (removed) {
                            na1.countDown();
                        }
                        
                        //delete c.timerDisplayNewsItem;
                    }, 50, itEl, prefix, state)
                }, 50, it, prefix, state);
            };
            displayNewsItem(state);
        };
    },
    
    match_searchCriteria : function (it) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        input = $('#newsApp_searchbar');
        
        if (input.val()!=='') {
            searchQueryLookArounds = '',
            searchQueryLookAheads = '',
            searchQueryRegx = '',
            searchQueryParts = input.val().split(' ');
            for (var idx in searchQueryParts) {
                var 
                searchQueryPart = searchQueryParts[idx];
                
                if (searchQueryPart.indexOf('-')!==0) {
                    if (searchQueryLookArounds!=='') searchQueryLookArounds += '|';
                    searchQueryLookArounds += '.*('+searchQueryPart+').*';
                } else {
                    searchQueryPartCorrected = searchQueryPart.substr(1, searchQueryPart.length-1);
                    if (searchQueryLookAheads!=='') searchQueryLookAheads += '|';
                    searchQueryLookAheads += '((?!'+searchQueryPartCorrected+').)';
                }
            };
            if (searchQueryLookArounds!=='') {
                searchQueryRegx = '^'+searchQueryLookAheads+searchQueryLookArounds;
            } else {
                searchQueryRegx = '^.*('+searchQueryLookAheads + ').*$';
            }
            searchQueryRegExp = new RegExp (searchQueryRegx, 'gmi');
        } else {
            searchQueryRegx = null;
        }
        
        //if (it.de.indexOf('hina')!==-1 || it.t.indexOf('hina')!==-1) debugger;
        if (searchQueryRegx!==null) {
            if (it.de.match (searchQueryRegExp) || it.t.match(searchQueryRegExp)) {
                return true;
            } else {
                it.displayCount++;
                return false;                
            }
        } else {
            return true;
        }
    },
    
    countDown : function () {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        container = $('#newsApp_content'),
        l = $('.newsApp__item__outer', container).length,
        countDown = (
            l < 15
            ? 15
            : 30
        ),
        countDown = 10 + Math.round(l * 2.2);
        
        c.onScreen = l;
        
        clearInterval (c.newItemsInterval);
        c.newItemsInterval = setInterval (function() {
            if (!na.apps.loaded.newsApp) return false;

            $('#newsApp_timer').html(na1.formatDateForHeader()+ ' ' +(c.displayCounts)+' -'+countDown);
            if (!c.locked) countDown--;
            //debugger;
            if (countDown==0 || c.gotoNextPage) {
                clearInterval (c.newItemsInterval);
                $(container).fadeOut(500, function() {
                    container.html ('').fadeIn('fast');
                    $('#newsApp_content_shadow').html('');
                    c.its3 = [];
                    c.resize = {};
                    c.tries = 0;
                    delete c.gotoNextPage;
                    na1.onresize();
                    state = 'testing';
                    na1.displayNews_loop();
                });
            }
        }, 1 * 1000);
    },
    
    displayNews_full : function (prefix) {
        var
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        container = (
            prefix == ''
            ? $('#newsApp_content')
            : $('#newsApp_content_shadow')
        ),
        its = $('.newsApp__item__outer', container),
        full = false,
        removed = false,
        its2 = [],
        max = 0, max2 = 0;
        
        for (var i=0; i<its.length; i++) {
            var 
            it = its[i],
            y = $(it).position().top + it.offsetHeight,
            y2 = $(it).position().top;
            
            if (y > max) max = y;
            if (y2 > max2) max2 = y2;
            if (y > container[0].offsetHeight - 20 ) { // - 20 for margin and padding of news item
                var found = false;
                for (var j=0; j<c.its3.length; j++) {
                    if (c.its3[j].id === it.id) found = true;
                };
                if (!found) {
                    //debugger;
                    its2[its2.length] = it;
                }

            } else {
                var found2 = false;
                for (var j=0; j<c.its3.length; j++) {
                    if (c.its3[j].id === it.id) found2 = true;
                }
                if (!found2) c.its3[c.its3.length] = it;
            }
            //if ($(it).position().top > container[0].offsetHeight) {
                //full = true;
                //its2[its2.length] = it;
            //}
        };
        for (var i=0; i<its2.length; i++) {
            var it = its2[i];
            removed = true;
            //debugger;
            if (it.parentNode) it.parentNode.removeChild (it);
        }
        
        //if (max2 > container.height() - 50) full = true;
        if (prefix=='' && max > container.height()-20) full = true;
        
        return {
            full : full,
            removed : removed 
        };
    },
    
    displayNews_getRandomItems : function () {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        db2 = na1.displayNews_getRandomItems_traverse(db, 6);
        
        return db2;     
    },
    
    displayNews_getRandomItems_traverse : function (db, maxDepth, depth) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, 
        keys = Object.keys(db),
        key = Math.floor(Math.random() * keys.length),
        it = db[keys[key]];
        
        if (!depth) depth = 0;
        
        if (it && !it.items) {
            return na1.displayNews_getRandomItems_traverse (it, maxDepth, depth + 1);
        };
        
        return it;
    },
    
    displayNews_formatItem : function (it, prefix) {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        fontSize = (
            na.m.userDevice.isPhone
            ? ';font-size:70%;'
            : ';font-size:100%;'
        ),
        w = na.apps.loaded.newsApp.settings.itemWidth;        
        
        if (!it) return false;
        if (typeof it.de=='string') {
            it.de = it.de.replace(/6f6f6f/g, 'BBBBBB');                
            it.de = it.de.replace(/style=".*?"/g, '');
            it.de = it.de.replace('div class="feedflare"', 'div class="feedflare" style="display:none"');
            it.de = it.de.replace(/<img/g, '<img onload="var na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current;  var ni = $(this).parents(\'.newsApp__item__outer:first\');  if (ni[0]) { var dnf = na1.displayNews_full(\''+prefix+'\'), id = ni[0].id, resize = c.resize[id]; if (!dnf.removed && typeof resize==\'function\') setTimeout(function() { resize(this,event,'+it.idx+',\''+prefix+'\'); }, 100); if (dnf.removed) { ni.remove(); }; if (dnf.removed && c.tries < g.onScreen + 1000) na1.displayNews_loop(); else { if (dnf.removed) na1.countDown(); }}"');
        }
        
        //var html = '<div id="newsApp__layoutGuide1" style="width:1px;height:400px;display:inline-block"></div>';
        var html = '';
        html += '<div id="newsApp__item__'+it.idx+'" class="newsApp__item__outer" style="max-height:400px;width:'+w+'px;display:inline-block;background:rgba(0,0,0,0.5);border-radius:10px;box-shadow:inset 1px 1px 1px 1px rgba(70,70,70,0.8), 2px 2px 2px 2px rgba(0,0,0,0.7); margin:10px;padding:10px;'+fontSize+';opacity:0.0001">';
        
        if (typeof it.de=='string') {
            if (typeof it.t=='string' && it.t!='' && it.de.indexOf(it.t)===-1) html+= '<span class="newsApp__item__title"><a class="nomod" target="newsAppItem_'+it.idx+'" href="' + it.u+'">' + it.t.replace(/\&#39;/g, '\'').replace(/#39;/g, '\'')+ '</a></span><br/>';
        } else {
            if (typeof it.t=='string' && it.t!='') html+= '<span class="newsApp__item__title"><a class="nomod" target="newsAppItem_'+it.idx+'" href="' + it.u+'">' + it.t.replace(/\&#39;/g, '\'').replace(/#39;/g, '\'') + '</a></span><br/>';
        }
        if (typeof it.de=='string') html+= '<table cellpadding="2" cellspacing="3"><tr><td class="newsApp__item__mediaSingle"></td><td><div id="newsApp_item_'+it.idx+'__scrollpane" class="newsApp__item__desc vividScrollpane" style="max-width:'+(w-10)+'px;max-height:300px">' + it.de.replace(/\&#39;/g, '\'').replace(/#39;/g, '\'') + '</div></td></tr></table><div style="height:1px;overflow:hidden;">&nbsp;</div>';
        html += '<span class="newsApp__item__copy"><a class="nomod" href="javascript:var el = $(\'#newsApp__item__'+it.idx+'\')[0], textarea = $(\'#siteContent__textareaCopy\')[0]; if (!textarea) { var el2=document.createElement(\'textarea\'); window.top.document.append(el2); textarea=el2 }; el_html = el.innerHTML; el.innerHTML = el.innerHTML.replace(\/<span class..newsApp__item__copy.>.*newsApp__item__date.><.span><.a>\/,\'\') + \'Found via <a href=\\\'https://nicer.app/news\\\' target=\\\'_new\\\'>nicer.app/news</a>\'; var selection = window.getSelection(); var range = document.createRange(); range.selectNodeContents(el); selection.removeAllRanges(); selection.addRange(range); window.top.document.execCommand(\'copy\');setTimeout(function(){selection.removeAllRanges(); el.innerHTML=el_html;},1000);">Copy</span> ';
        html += '<span class="newsApp__item__date"><a class="nomod" target="newsAppItem_'+it.idx+'" href="' + it.u+'">' + na.apps.loaded.newsApp.formatDate(it.pd, true, true)+'</a></span><br/>';
         
        //html+= '<img class="newsApp__btnInfo dontResize" style="position:sticky;bottom:5px;left:'+(w-35)+'px;width:30px;height:30px;" src="'+na.site.globals.urls.app+'/nicerapp/apps/nicerapp/news/appContent/newsApp/2.0.0/btnInfo.png" title="test"/>';
                       
        var html2 = '';
        html2+= '<span class="newsApp__item__url"><a class="nomod" target="newsAppItem_'+it.idx+'" href="' + it.u+'">Article</a> discovered via ';
        html2+= '<a class="nomod" target="newsAppItem_'+it.idx+'_rssURL" href="' + it.rssURL+'">'+na.apps.loaded.newsApp.urlToDomainName(it.rssURL)+'</a></span>';
        html2+= '<br/>';
        html2+= '<span class="newsApp__item__category"><span class="newsApp__item__categoryTitle">Category</span> <span class="newsApp__item__categoryColon">:</span> <span class="newsApp__item__categoryValue">'+it.path+'</span></span><br/>';
        
        
        //html2+= '<span class="newsApp__item__date">' + na.apps.loaded.newsApp.formatDate(it.dateStr)+'</span><br/>';
        if (typeof it.pd=='number') {
            // some sources report unix timestamps without timezone info, from their own timezone. this prevents me from doing several cool things like list the local *and* remote time clearly for each news item.
            html2+= '<span class="newsApp__item__date">' + it.pd + '</span><br/>'; //this is the actual RSS <pubDate> field contents.

        } else if (!it.pd) {
            //debugger;
            html2+= '<span class="newsApp__item__date">' + na.apps.loaded.newsApp.formatDate(it.dateStr, true)+'</span><br/>';
        } else {
            html2+= '<span class="newsApp__item__date">' + na.apps.loaded.newsApp.formatDate(it.pd)+'</span><br/>';
        }
        
        html+= '</div>';
        
        return {
            html : html,
            html2 : html2
        };
    },
    
    urlToDomainName : function (url) {
        if (typeof url!=='string' || url=='') return '';
        return url.replace('http://','').replace('https://','').replace(/\/.*/,'');
    },
    
    formatDateForHeader : function () {
        var 
        na1 = na.apps.loaded.newsApp, g = na1.globals, s = na1.settings, c = s.current, db = c.db,
        m = c.dtEnd.getTime() > c.lastCurrentGet.getTime() ? c.dtEnd : c.lastCurrentGet,//new Date(),
        dns = Date.locale.en.day_names,
        tz = m.getTimezoneOffset() * 60 /*seconds*/ * 1000 /*milliseconds*/,
        tx = '' + ((-1 * m.getTimezoneOffset()) / 60),
        m1 = c.dtCurrent,
        r1 = '<span class="newsApp__header__datetime">' + m.getFullYear() + "-" +
            ("0" + (m.getMonth()+1)).slice(-2) + "-" +
            ("0" + m.getDate()).slice(-2) + "(" + dns[m.getDay()] + ') ' +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2) + '</span>',
        r2 = '<span class="newsApp__header__datetime">' + m1.getFullYear() + "-" +
            ("0" + (m1.getMonth()+1)).slice(-2) + "-" +
            ("0" + m1.getDate()).slice(-2) + "(" + dns[m1.getDay()] + ') ' +
            ("0" + m1.getHours()).slice(-2) + ":" +
            ("0" + m1.getMinutes()).slice(-2) + ":" +
            ("0" + m1.getSeconds()).slice(-2) + '</span>',
        r3 = '<span class="newsApp__header__datetime">' + m.getFullYear() + "-" +
            ("0" + (m.getMonth()+1)).slice(-2) + "-" +
            ("0" + m.getDate()).slice(-2) + "(" + dns[m.getDay()] + ') ' +
            ("0" + m1.getHours()).slice(-2) + ":" +
            ("0" + m1.getMinutes()).slice(-2) + ":" +
            ("0" + m1.getSeconds()).slice(-2) + " to " +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2) + '</span>';
                       
        rr = (
            m.getFullYear() === m1.getFullYear()
            && m.getMonth() === m1.getMonth()
            && m.getDate() === m1.getDate()
            ? r3
            : r2 + ' to ' + r1
        );
        
        return rr;
    },
    
    formatDateForLoading : function (dateStr, noPubDate, no2ndLine) {
        var 
        m = new Date(dateStr),
        dns = Date.locale.en.day_names,
        tz = m.getTimezoneOffset() * 60 /*seconds*/ * 1000 /*milliseconds*/,
        tx = '' + ((-1 * m.getTimezoneOffset()) / 60),
        r1 = m.getFullYear() + "-" +
            ("0" + (m.getMonth()+1)).slice(-2) + "-" +
            ("0" + m.getDate()).slice(-2) + '%20' +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2) + '%20' +
            ( tx > 0 
                ? 'GMT%2B' + ("0" + tx).slice(-2) + '00'
                : tx < -9
                    ? 'GMT-0' + Math.abs(tx) + '00'
                    : 'GMT'+tx+'00'
            );
            
        return r1;
    },
    
    
    formatDate : function (dateStr, noPubDate, no2ndLine) {
        var 
        m = new Date(dateStr),
        dns = Date.locale.en.day_names,
        tz = m.getTimezoneOffset() * 60 /*seconds*/ * 1000 /*milliseconds*/,
        tx = '' + ((-1 * m.getTimezoneOffset()) / 60),
        m1 = new Date(m.getTime() + tz),
        r1 = '<span class="newsApp__item__date__local">Local : ' + m.getFullYear() + "-" +
            ("0" + (m.getMonth()+1)).slice(-2) + "-" +
            ("0" + m.getDate()).slice(-2) + "(" + dns[m.getDay()] + ') ' +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2) + '</span>', // + ' ' + tx
        r2 = '<span class="newsApp__item__date__remote">Local : ' + m1.getFullYear() + "-" +
            ("0" + (m1.getMonth()+1)).slice(-2) + "-" +
            ("0" + m1.getDate()).slice(-2) + "(" + dns[m1.getDay()] + ') ' +
            ("0" + m1.getHours()).slice(-2) + ":" +
            ("0" + m1.getMinutes()).slice(-2) + ":" +
            ("0" + m1.getSeconds()).slice(-2) + '</span>',
        r3 = '<span class="newsApp__item__date__remote">Remote : ' + dateStr + '</span>',
        r4 = (
            no2ndLine
            ? r1
            : noPubDate
                ? '<span class="newsApp__item__date__remote">[no pubDate field found for news item]</span>'
                //? r1 + '<br/>' + r3 + '<br/><span class="newsApp__item__date__remote">[no pubDate field found for news item]</span>'
                : r1 + '<br/>' + r3
        );
            
        return r4;
    },
    
	getURLparameters : function (url) {
        /*
        var
		p1 = url.indexOf('section\''),
		p2 = url.indexOf('\'', p1 + 8),
		section = url.substr(p1+8,p2-p1-8);
		
		return [
			section
		];
        */
        var
        p1 = url.indexOf('apps/'),
        p2 = url.indexOf('/', p1 + 5);
        
        if (p2!==-1) {
            var apps = url.substr(p1+5, p2-p1-5);
        } else {
            var apps = url.substr(p1+5);
        }
        
        apps = apps.replace(/#$/,'');
        
        //debugger;
        var 
        json = na.m.base64_decode_url (apps),
        arr = JSON.parse(json);
        //debugger;
        return [
            arr.news.section
        ];
	},
    
    onresize : function () {
        var 
        ow = ($('#siteContent')[0].offsetWidth)-20,
        oh = $('#siteContent')[0].offsetHeight, 
        dw = (
            na.m.userDevice.isPhone
            ? ow - 2
            : ow > 430 ? 430 : ow
        ),  
        wf = ow / dw,
        iw = ( ow / wf ), // iw = initial width of news item (in pixels)
        iw = iw < dw ? dw : iw,
        iw = dw,
        wo = ow, // wo = width outer container
        wo = (
            true // $('#newsApp_content__sliderbar__ver')[0].style.display!=='none'
            ? wo
            : wo
        ),
        wt = 0, // wt = width target
        i = 0; // counter of news items measured horizontally
        
        while (wt < wo) {
            wt += iw;
            i++;
        }
        wt -= iw;
        i--;
        
        var
        wu = wt, // wu = width used
        wl = wo - wu, // wl = width left over
        we = (wl) / i; // we = width extra per news item (above iw)
        w = iw + we - 50; // 50 or 60 is the magic number here.. don't know why..
        
        na.apps.loaded.newsApp.settings.itemWidth = w;
        $('.newsApp__item__outer, .newsApp__item__outer > table').css({height:'',width:w});
        
        $('#siteContent__header').css({
            height : $('#siteContent__header table').height()
        });
        
        $('#newsApp_content_shadow, #newsApp_content').css({
            height : oh - $('#siteContent__header').height(),
            width : ow
        });
    }
    
};	
//window.top.na.s.c.settings.contentLoaded = true;
na.apps.loaded.newsApp.settings.loadedIn['#siteContent'].onload({});

}, 100); // na.m.waitForCondition (); to load this app
//}); // $(document).ready(function(){});
