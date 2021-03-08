var nicerapp = na = {};
na.apps = {
    loaded : {}
};

na.account = na.a = {
    settings : {
        username : 'Guest',
        password : 'Guest'
    }
};

na.m = {
    settings : {
        debugLevel : 'show all',
        debugCategoriesVisible : [ 'all' ],
        waitForCondition : {}
    },
    
    base64_encode_url : function (str) {
        var str2 = btoa(str);
        str2 = str2.replace (/=/g, '');
        str2 = str2.replace ('+', '-');
        str2 = str2.replace ('/', '_');
        return str2;
    },
    
    base64_decode_url : function (str) {
        var str2 = str;
        str2 = str2.replace ('-', '+');
        str2 = str2.replace ('_', '/');
        return atob(str2);
    },
    
    cookieOptions : function () {
        var d = new Date();
        return {
            expires : new Date(d.getTime() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years from now
            path : '/'
        };
    },
    
	secondsToTime : function (secs) {
		//thx 
		// http://codeaid.net/javascript/convert-seconds-to-hours-minutes-and-seconds-%28javascript%29
		//and
		// http://stackoverflow.com/questions/175554/how-to-convert-milliseconds-into-human-readable-form
		var days = Math.floor(secs / (60 * 60 * 24));
		var hours = Math.floor(secs / (60 * 60));
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.floor(divisor_for_seconds);
		var milliSeconds = Math.round((secs - Math.floor(secs)) * 1000);

		var obj = {
			days : days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			milliSeconds : milliSeconds
		};

		return obj;
	},

	secondsToTimeString : function (secs) {
		var d = na.m.secondsToTime(secs);
		var s = '';
		if (d.days>0) {
			s += d.days + 'd';
		};
		if (d.hours>0) {
			if (s!='') s+=', ';
			s += d.hours + 'h';
		};
		if (d.minutes>0) {
			if (s!='') s+=', ';
			s += d.minutes + 'm';
		};
		if (d.seconds>0) {
			if (s!='') s+=', ';
			s += d.seconds + 's';
		};
		if (d.milliSeconds>0) {
			if (s!='') s+=', ';
			s += d.milliSeconds + 'ms';
		};
		return s;
	},
    
    log : function (level, msg) {
        var
        date = new Date(),
        timeInMilliseconds = date.getTime(),
        appRuntime = timeInMilliseconds - na.m.settings.startTime;
        
        if (na.m.settings.debugLevel == 'show all')
            na.m.settings.debugLevel = 0;
        
        if (level >= na.m.settings.debugLevel) {
            if (typeof msg=='object') {
                msg.runtimeInMilliseconds = appRuntime;
                if (na.m.settings.debugCategoriesVisible.include('all')) {
                    console.log (msg);
                } else {
                    var writtenAlready = false;
                    for (var cat in msg.categories) {
                        if (na.m.settings.debugCategoriesVisible.include(cat)
                            && !writtenAlready
                        ) {
                            console.log (msg);
                            writtenAlready = true
                        }
                    }
                }                
            } else if (typeof msg=='string') {
                console.log (appRuntime + ' : ('+level+') '+msg);
            }
        }
    },
	
    
	padNumber : function (number, characterPositions, paddingWith) {
		var 
		r = '' + number,
		padding = '';
		for (var i=0; i<characterPositions-r.length; i++) {
			padding += paddingWith;
		};
		r = padding + number;
		return r;
	},
    
	userDevice : {
		isPhone : 
                navigator.userAgent === 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' // iPhone 8 and iPhone 8 Plus
                || navigator.userAgent === 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' // iPhone 7 and iPhone 7 Plus
                || navigator.userAgent === 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36' // iPhoneX and iPhoneX Plus
                || navigator.userAgent.match(/Moto/)
				|| navigator.userAgent.match(/iPhone/i)
				|| navigator.userAgent.match(/iPad/i)
				|| navigator.userAgent.match(/Mobile Safari/i)
				|| navigator.userAgent.match(/BlackBerry/i)
				|| navigator.userAgent.match(/PlayStation/i)
				|| navigator.userAgent.match(/IEMobile/i)
				|| navigator.userAgent.match(/Windows CE/i)
				|| navigator.userAgent.match(/Windows Phone/i)
				|| navigator.userAgent.match(/SymbianOS/i)
				|| navigator.userAgent.match(/Android/i)
				|| navigator.userAgent.match(/PalmOS/i)
				|| navigator.userAgent.match(/PalmSource/i)
				|| navigator.userAgent.match(/SonyEricsson/i)
				|| navigator.userAgent.match(/Opera Mini/i)
				|| navigator.userAgent.match(/Vodafone/i)
				|| navigator.userAgent.match(/DoCoMo/i)
				|| navigator.userAgent.match(/AvantGo/i)
				|| navigator.userAgent.match(/J-PHONE/i)
				|| navigator.userAgent.match(/UP.Browser/i)
	},
    
	waitForCondition : function (label, condition, callback, frequency, context) {
		var _fncn = 'na.m.waitForCondition(): ';
		if (typeof label!=='string') { na.m.log ( { error : _fncn+'invalid label' } ); return false;};
		if (typeof condition!=='function') { na.m.log ( { error : _fncn+'invalid condition' } ); return false; };
		if (typeof callback!=='function') { na.m.log ( { error : _fncn+'invalid callback' } ); return false; };
		if (typeof frequency=='undefined' || frequency<50) frequency = 50; 
		
		var r = condition(context);

		if (r) {
		// condition()==true, we're done waiting
			clearTimeout (na.m.settings.waitForCondition[label]);
			delete na.m.settings.waitForCondition[label];
			callback();
		} else {
		// condition()==false, more waiting
			if (!na.m.settings.waitForCondition[label]) { // prevents double checks & activations of callback().
				na.m.settings.waitForCondition[label] = setTimeout (function () {
					clearTimeout (na.m.settings.waitForCondition[label]);
					delete na.m.settings.waitForCondition[label];
					na.m.waitForCondition (label, condition, callback, frequency, context); 
				}, frequency);
			} 
		}
		return r;
	},
    
    walkArray : function (a, keyCallback, valueCallback, callKeyForValues, callbackParams, k, level, path) {
        if (!path) path = '';
        if (typeof a !== 'object') {
            debugger;
        } else {
            for (var k in a) {
                var 
                v = a[k],
                cd = {
                    type : 'key',
                    path : path,
                    level : level,
                    k : k,
                    v : v,
                    params : callbackParams
                };
                if (typeof keyCallback=='function' && (callKeyForValues || typeof v==='object')) keyCallback (cd);
                if (typeof v==='object') {
                    cd.type = 'value';
                    if (typeof valueCallback=='function') valueCallback(cd);
                    na.m.walkArray (a[k], keyCallback, valueCallback, callKeyForValues, callbackParams, k, level+1, path+'/'+k);
                } else {
                    cd.type = 'value';
                    if (typeof valueCallback=='function') valueCallback(cd);
                }
            }
        }
    },
    
    chaseToPath : function (wm, path, create) {
        var 
        nodes = path.split('/');
        
        return na.m.chase (wm, nodes, create);
    },
    
    chase : function (arr, indexes, create) {
        var 
        r = arr;
        
        for (var i=0; i<indexes.length; i++) {
            var idx = indexes[i];
            if (
                typeof r === 'object'
                && (
                    create === true
                    || r[idx]
                )
            ) {
                if (create===true && !r[idx]) r[idx]={};
                r = r[idx];
            }
        }
        
        return r;
    },
    
	negotiateOptions : function () {
		// na.m.negotiateOptions() can't handle functions, and I dont trust jQuery.extend
		var r = {};
		for (var i = 0; i < arguments.length; i++) {
			var a = arguments[i];
			if (typeof a=='object' && a!==null && typeof a.length=='number') r =[];
			if (a===null || typeof a==='undefined') continue;
			for (k in a) {
				if (typeof a[k] == 'object') {
					r[k] = na.m.negotiateOptions(r[k], a[k]);
				} else {
					r[k] = a[k];
				}
			}
		}
		return r;
	},
    
    extend : function () {
		var r = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var a = arguments[i];
			if (typeof a=='object' && a!==null && typeof a.length=='number') r =[];
			if (a===null || typeof a==='undefined') continue;
			for (k in a) {
				if (typeof a[k] == 'object') {
                    if (!r[k]) r[k] = {};
					r[k] = na.m.extend(r[k], a[k]);
				} else {
					r[k] = a[k];
				}
			}
		}
		return r;
    }
    

    
};

Date.prototype.getMonthName = function(lang) {
	lang = lang && (lang in Date.locale) ? lang : 'en';
	return Date.locale[lang].month_names[this.getMonth()];
};

Date.prototype.getMonthNameShort = function(lang) {
	lang = lang && (lang in Date.locale) ? lang : 'en';
	return Date.locale[lang].month_names_short[this.getMonth()];
};

Date.prototype.getDayName = function(lang) {
	lang = lang && (lang in Date.locale) ? lang : 'en';
	return Date.locale[lang].day_names[this.getDay()];
};

Date.prototype.getDayNameShort = function(lang) {
	lang = lang && (lang in Date.locale) ? lang : 'en';
	return Date.locale[lang].day_names_short[this.getDay()];
};

Date.locale = {
	en: {
		month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        day_names : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        day_names_short : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	}
};

Date.prototype.stdTimezoneOffset = function() {
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function() {
	return (this.getTimezoneOffset() < this.stdTimezoneOffset());
};	

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.includes = function (x) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === x) {
            return true;
        }
    }
    return false;
};

window.onerror = function (msg, url, lineno, colno, error) {
    var err = msg+'\n'+url+'\n'+lineno+' - '+colno+'\n'+error;
    //alert (err);
    console.log (err);
};

var nas = na.site = {
    about : {
        firstCreated : '10 January 2021 13:15 CET',
        copyright : '<table style="width:100%;height:100%;"><tr><td>Copyright (c) 2021 by Rene A.J.M. Veerman <a href="mailto:rene.veerman.netherlands@gmail.com" style="color:green">&lt;rene.veerman.netherlands@gmail.com&gt;</a></td><td style="width:220px;"><div class="vividButton" theme="dark" style="position:relative;color:white;" onclick="na.site.dismissCopyrightMessage();">Ok</div></td></table>' // actually (c) 2002-2021 if you count in all the previous major versions of this nicerapp platform (it also had other names in previous versions, but 'nicerapp' will be it's final name).
    },
    
    settings : {
        defaultStatusMsg : (
            $.cookie('agreedToPolicies')!=='true'
            ? '<table style="width:100%;height:100%;"><tr><td>This site uses cookies for remembering user settings, and for analytics.<br/>'
                + 'By using this site, you agree to such cookies getting stored on, and read from, your computer.</td><td style="width:220px;"><div class="vividButton" theme="dark" style="position:relative;color:white;" onclick="na.site.dismissCookieWarning();">Ok</div></td></table>'
            : '<table style="width:100%;height:100%;"><tr><td>Copyright (c) 2021 by Rene A.J.M. Veerman <a href="mailto:rene.veerman.netherlands@gmail.com" style="color:green">&lt;rene.veerman.netherlands@gmail.com&gt;</a></td><td style="width:220px;"><div class="vividButton" theme="dark" style="position:relative;color:white;" onclick="na.site.dismissCopyrightMessage();">Ok</div></td></table>'
        ),
        dialogs : {},
        buttons : {},
        menus : {},
        na3D : {}
    },
    
    dismissCookieWarning : function () {
        $.cookie('agreedToPolicies', 'true', na.m.cookieOptions());
        na.site.settings.defaultStatusMsg = na.site.about.copyright;
        na.site.setStatusMsg (na.site.about.copyright);
        
    },
    
    dismissCopyrightMessage : function () {
        $.cookie('showStatusbar', 'false', na.m.cookieOptions());
        na.desktop.settings.visibleDivs.remove('#siteStatusbar');
        na.desktop.resize();
    },
    
    onload : function (evt) {
        na.desktop.init();
        
        var startTime = new Date();
        na.m.settings.siteStartTime = startTime.getTime();
        
        if (na.m.userDevice.isPhone) {
            $('#siteDateTime').css({display:'none'});
            $('#btnThemeSwitch, #btnChangeBackground, #siteMenu').addClass('phoneView');
        } else {
            na.d.s.visibleDivs.push('#siteDateTime');
        }

        if (!$.cookie('siteBackground_url') || $.cookie('siteBackground_url')==='') {
        //if (true) {
            $.cookie('siteBackground_search', 'landscape', na.m.cookieOptions());
            $.cookie('siteBackground_url', '/nicerapp/siteMedia/backgrounds/tiled/active/grey/cracked-surface-seamless-gray-background.jpg', na.m.cookieOptions());
        }; 
        //if (typeof $.cookie('siteBackground_search')==='string' && $.cookie('siteBackground_search')!=='')
        na.backgrounds.next ('#siteBackground', $.cookie('siteBackground_search'), $.cookie('siteBackground_url'));
        
        $('#siteContent .vividDialogContent').animate({opacity:1},'slow').focus();
        if ($('.vividDialogContent').css('display')==='none') $('.vividDialogContent').css({display:'block'});
        
        $('.vividButton').each(function(idx,el){
            na.site.settings.buttons['#'+el.id] = new naVividButton(el);
        });
        
        $('.vividDialog').each(function(idx,el){
            na.site.settings.dialogs['#'+el.id] = new naVividDialog(el);
        });
        
        if ($.cookie('agreedToPolicies')!=='true') $.cookie('showStatusbar', 'true', na.m.cookieOptions());
        na.site.setStatusMsg(na.site.settings.defaultStatusMsg); // calls na.desktop.resize() as well

        $(window).resize (function() {
            $('#siteBackground img, #siteBackground div').css({
                width : $(window).width(),
                height : $(window).height()
            });
        
            if (na.site.settings.timeoutWindowResize) clearTimeout(nas.s.timeoutWindowResize);
            na.site.settings.timeoutWindowResize = setTimeout (function() {
                nas.onresize();
            }, 250);
        });
        na.site.onresize();
        $('#siteContent').css({display:'block'});
        
        var ac = {
            type : 'GET',
            url : '/nicerapp/domainConfigs/'+na.site.globals.domain+'/ajax_backgrounds.php',
            success : function (data, ts, xhr) {
                var dataDecoded = JSON.parse(data);
                na.site.settings.backgrounds = dataDecoded;
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }                
        };
        $.ajax(ac);

        var ac = {
            type : 'GET',
            url : '/nicerapp/domainConfigs/'+na.site.globals.domain+'/ajax_backgrounds_recursive.php',
            success : function (data, ts, xhr) {
                var dataDecoded = JSON.parse(data);
                na.site.settings.backgroundsRecursive = dataDecoded;
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }                
        };
        $.ajax(ac);
        
        na.analytics.logMetaEvent ('startup : html and js fully loaded, browserWidth='+$(window).width()+', browserHeight='+$(window).height()+', referer='+na.site.globals.referer+', userAgent='+navigator.userAgent+', isPhone='+(na.m.userDevice.isPhone?'true':'false'));

        na.analytics.logMetaEvent ('startup : url='+document.location.href);
        
        setInterval (nas.updateDateTime, 1000);
        
        setInterval (function() {
            na.analytics.logMetaEvent ('keep-alive');
        }, 5000);
        
        na.site.transformLinks ($('#siteContent')[0]);
		History.Adapter.bind(window,'statechange', na.site.stateChange); // use HTML5 History API if available:
    },
    
    transformLinks : function (rootElement) {
        $('a', rootElement).not('noPushState').each(function(idx, el){
            let x = el.href, y = el.target;
            if (el.href.match(document.location.origin)) {
                let h = "javascript:na.site.loadContent('"+el.href.replace(document.location.origin,'').replace('/apps/','')+"');";
                el.href = h;
                $(el).attr('targetDisabled',$(el).attr('target'));
                $(el).attr('target','');
                
            }
        });
    },
    
    loadContent : function (url) {
        History.pushState (null, '', document.location.origin+'/apps/'+url);
    },
    
	stateChange : function(){ 
		var 
		state = History.getState();

        na.m.log (200, 'na.site.stateChange() : url = '+state.url);
		//na.s.c.urlSpecificSettings(state.url, function () {
          //  na.m.log (200, 'na.s.c.stateChange(2) : url = '+state.url);
            na.site.loadContent_getAndDisplayContent (state.url.replace(document.location.origin,'').replace('/apps/', ''));
        //});
	},

    loadContent_getAndDisplayContent : function (url) {
        var ac = {
            type : 'GET',
            url : '/apps_content/'+url.replace(document.location.origin,'').replace(document.location.host,'').replace('/apps/', ''),
            success : function (data, ts, xhr) {
                //debugger;
                var d = JSON.parse(data);
                if (d.siteContent) $('#siteContent .vividDialogContent').fadeOut('normal', function() {
                    $('#siteContent .vividDialogContent').html(d.siteContent).fadeIn('normal');
                    na.site.transformLinks($('#siteContent')[0]);
                    na.site.reloadMenu();
                });
                if (d.siteToolbarRight) $('#siteContent .vividDialogContent').fadeOut('normal', function() {
                    $('#siteToolbarRight .vividDialogContent').html(d.siteToolbarRight).fadeIn('normal');
                    na.site.transformLinks($('#siteToolbarRight')[0]);
                });
            }, 
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
                alert ('na.site.loadContent() : '+thrownError);
            }
        };
        ac.url = ac.url.replace('\/\/','/');
        //debugger;
        $.ajax(ac);
      
        na.analytics.logMetaEvent('na.site.loadContent() : url='+url);
    },
    
    updateDateTime : function() {
		var 
		d = new Date(),
		r = 
			d.getFullYear() + '-' + na.m.padNumber((d.getMonth()+1),2,'0') + '-' + na.m.padNumber(d.getDate(), 2, '0')
			+ '(' + Date.locale.en.day_names_short[d.getDay()] + ')'
			+ ' ' + na.m.padNumber(d.getHours(), 2, '0') + ':' + na.m.padNumber(d.getMinutes(), 2, '0')
			+ ':' + na.m.padNumber(d.getSeconds(), 2, '0'); // + '.' + na.m.padNumber(d.getMilliseconds(), 3, 0);
			
        jQuery('#siteDateTime').html(r);
    },
    
    themeSwitch : function () {
        var 
        x = $('#siteTheme').val(),
        t = 'light';
        if (x=='light') t = 'dark';
        $('#siteTheme').val(t);
        $.cookie('siteTheme',t, na.m.cookieOptions());
        $('#siteSettings').submit();
    },

    startTooltips : function(evt) {
        $('.tooltip').each (function(idx,el) {
            
            if (el.id=='btnThemeSwitch' && $.cookie('haveShownTutorial')!=='true') {
                nas.settings.btnThemeSwitch = this;
                var ptSettings = {
                    className : $(el).attr('tooltipTheme'),//'mainTooltipTheme',
                    contentAsHTML : true,
                    content : $(el).attr('title'),
                    //animation : 'grow',
                    alignTo : 'target',
                    alignX : 'inner-left',
                    offsetX : 10,
                    fade : !na.m.userDevice.isPhone,
                    slide : !na.m.userDevice.isPhone,
                    slideOffset : 25
                };
                if (na.m.userDevice.isPhone) ptSettings.showOn = 'none';
                $(el).poshytip(ptSettings);
                $(this).poshytip('show');
                $(this).poshytip('hide');
                $(this).addClass('started');
                setTimeout (function() {
                    $(nas.settings.btnThemeSwitch).poshytip('show');
                    setTimeout(function() {
                        $(nas.settings.btnThemeSwitch).poshytip('hide');
                    }, 2500);
                }, 2770);
                
            } else if (el.id=='btnChangeBackground' && $.cookie('haveShownTutorial')!=='true') {
                nas.settings.btnChangeBackground = el;
                var ptSettings = {
                    className : $(el).attr('tooltipTheme'),//'mainTooltipTheme',
                    contentAsHTML : true,
                    content : $(el).attr('title'),
                    animation : 'grow',
                    alignTo : 'target',
                    alignX : 'inner-right',
                    offsetX : -20,
                    fade : !na.m.userDevice.isPhone,
                    slide : !na.m.userDevice.isPhone,
                    slideOffset : 25
                };
                if (na.m.userDevice.isPhone) ptSettings.showOn = 'none';
                $(el).poshytip(ptSettings);
                $(el).poshytip('show');
                $(el).poshytip('hide');
                $(el).addClass('started');
                setTimeout (function() {
                    $(el).poshytip('show');
                    if (na.m.userDevice.isPhone) $('.mainTooltipTheme').css({left:$('.mainTooltipTheme').offset().left-20});
                    $('.tip-arrow').css({left:$(el).offset().left-$('.mainTooltipTheme').offset().left});
                    setTimeout(function() {
                        $(el).poshytip('hide');
                    }, 2500);
                }, 7270);
            } else if (
                el.id!=='btnChangeBackground'
                && el.id!=='btnThemeSwitch'
            ) {
                var ptSettings = {
                    className : $(el).attr('tooltipTheme'),//'mainTooltipTheme',
                    contentAsHTML : true,
                    content : $(el).attr('title'),
                    alignTo : 'target',
                    alignX : 'center'
                };
                if (na.m.userDevice.isPhone) ptSettings.showOn = 'none';
                $(el).poshytip(ptSettings);
            }
        });
        $.cookie('haveShownTutorial', 'true', na.m.cookieOptions());
    },
    
    onresize : function(settings) {
        if (
            !settings
            || (typeof settings=='object' && settings.reloadMenu===true)
        ) na.site.reloadMenu();
        
        $('#siteBackground img, #siteBackground div, #siteBackground iframe').css({
            width : $(window).width(),
            height : $(window).height()
        });
        //$('#siteBackground img.bg_first').fadeIn(2000);
        
        if ($(window).width() < 1000) {
            jQuery('#siteContent, #siteStatusbar').css ({ fontSize : '70%' });
            jQuery('#siteStatusbar').css({height:'5.5rem'});
            jQuery('#siteStatusbar .vividButton').css({width : 50});
            jQuery('#siteStatusbar td:nth-child(2)').css({width:55});
            jQuery('#tableFor_saCompanyLogo').css ({ width : 80, height : 80 });
            jQuery('#divFor_saCompanyLogo').css ({ width : 70, height : 70, marginLeft : 0 });
            jQuery('#saCompanyLogo').attr('width',70).attr('height',70);
            jQuery('#headerSite, #headerSite h1, #headerSite h2, #headerSite h3').css ({ fontSize : '84%', paddingLeft : 0 });
            jQuery('.td_spacer').css ({ height : 100 });
            jQuery('#headerSiteDiv').css ({ height : 70, width : 120 });
            jQuery('#headerSiteDiv div').css ({ height : 0, width : 120 });
        } else {
            jQuery('#siteContent, #siteStatusbar').css ({ fontSize : '100%' });
            jQuery('#siteStatusbar').css({height:'4.5rem'});
            jQuery('#siteStatusbar .vividButton').css({width : 220});
            jQuery('#siteStatusbar td:nth-child(2)').css({width:225});
            jQuery('#mainCSS').html('.vividMenu_item td { font-size : 80%; }; #siteStatus td { font-weight : bold };');
            jQuery('#tableFor_saCompanyLogo').css ({ width : 200, height : 200 });
            jQuery('#divFor_saCompanyLogo').css ({ width : 200, height : 200, marginLeft : 40 });
            jQuery('#datetime').css({marginLeft:40,marginTop:20});
            jQuery('#saCompanyLogo').attr('width',200).attr('height',200);
            jQuery('#headerSite h1').css ({ fontSize : navigator.userAgent.match('Chrome')?'220%':'140%', paddingLeft : 20 });
            jQuery('#headerSite h2').css ({ fontSize : '100%', paddingLeft : 20 });
            jQuery('#headerSite, #headerSite h3').css ({ fontSize : '100%', paddingLeft : 20 });
            
            jQuery('.td_spacer').css ({ height : 100 });
            jQuery('#headerSiteDiv').css ({ height : 200, width : 320 });
            jQuery('#headerSiteDiv div').css ({ height : 10, width : 320 });
        }; 
        
        na.desktop.resize();
    },
    
    reloadMenu : function() {
        var ac = {
            type : 'POST',
            url : '/nicerapp/domainConfigs/'+na.site.globals.domain+'/mainmenu.php',
            data : {
                na_js__screenWidth : $(window).width(),
                na_js__menuSpace : $(window).width() - $('#siteMenu').offset().left,
                na_js__menuItemWidth : 200,
                na_js__hasContentMenu : true
            },
            success : function (data, ts, xhr) {
                jQuery('#siteMenu').html(data);
                
                var 
                mlp = '<li class="contentMenu"><a href="-contentMenu-">-contentMenu-</a></li>',
                contentMenu = $('#app_mainmenu')[0] ? $('#app_mainmenu')[0].innerHTML : '',
                menu = $('#siteMenu')[0].innerHTML,
                p1 = menu.indexOf(mlp);
                $('#siteMenu')[0].innerHTML = menu.substr(0,p1) + contentMenu + menu.substr(p1+mlp.length);
                //alert ($('li', $('#siteMenu')).length + ' menu items');
                
                nas.s.menus['#siteMenu'] = new naVividMenu($('#siteMenu')[0]);
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }                
        }
        $.ajax(ac);
    },
    
    changeBackground : function () {
        na.backgrounds.next ('#siteBackground', na.backgrounds.s.lastMenuSelection);
    },
    
    setStatusMsg : function (msg) {
        $('#siteStatusbar .vividDialogContent').animate({opacity:0.0001},'slow', function () {
            $('#siteStatusbar .vividDialogContent').html(msg).css({display:'block',margin:0}).animate({opacity:1},'slow');
            
            na.site.onresize({reloadMenu : false});
            
            if (msg !== na.site.settings.defaultStatusMsg)
            setTimeout (function () {
                na.site.setStatusMsg (na.site.settings.defaultStatusMsg);
            }, 2500);
        });
    }
}
nas.s = nas.settings;

    
