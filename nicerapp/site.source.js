var nicerapp = na = {};
var nas = na.site = {
    about : {
        firstCreated : '10 January 2021 13:15 CET',
        copyright : '<table style="width:100%;height:100%;"><tr><td>Copyright (c) 2021 by Rene A.J.M. Veerman <a href="mailto:rv.nicer.app@gmail.com" style="color:green">&lt;rv.nicer.app@gmail.com&gt;</a></td><td style="width:220px;"><div class="vividButton" theme="dark" style="position:relative;color:white;" onclick="na.site.dismissCopyrightMessage();">Ok</div></td></table>' // actually (c) 2002-2021 if you count in all the previous major versions of this nicerapp platform (it also had other names in previous versions, but 'nicerapp' will be it's final name).
    },
    
    globals : {
        smallDeviceWidth : 1000,
        reallySmallDeviceWidth : 500
    },
    
    settings : {
        defaultStatusMsg : (
            $.cookie('agreedToPolicies')!=='true'
            ? '<table style="width:100%;height:100%;"><tr><td>This site uses cookies for remembering user settings, and for analytics.<br/>'
                + 'By using this site, you agree to such cookies getting stored on, and read from, your computer.</td><td style="width:105px;"><div class="vividButton" theme="dark" style="position:relative;color:white;width:100px;" onclick="na.site.dismissCookieWarning();">Ok</div></td></table>'
            : '<table style="width:100%;height:100%;"><tr><td>Copyright (c) 2021 by Rene A.J.M. Veerman &lt;<a href="mailto:rv.nicer.app@gmail.com" style="color:darkgreen">rv.nicer.app@gmail.com</a>&gt;</td><td style="width:220px;"><div class="vividButton" theme="dark" style="position:relative;color:white;" onclick="na.site.dismissCopyrightMessage();">Ok</div></td></table>'
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
        na.d.s.visibleDivs.remove('#siteToolbarTop'); $.cookie('visible_siteToolbarTop','');
        na.d.s.visibleDivs.remove('#siteToolbarLeft'); $.cookie('visible_siteToolbarLeft','');
        na.d.s.visibleDivs.remove('#siteToolbarRight'); $.cookie('visible_siteToolbarRight','');

        if (na.m.userDevice.isPhone) {
            //debugger;
            $('#siteLoginSuccessful, #siteLoginFailed, #siteRegistration, #siteLogin').css ({ width : $(window).width() - 75, left : 20 });
        }
        
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
            // special hack to prevent zoom-to-tabs gesture in safari
            document.body.style.zoom = 0.99;
        });

        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
            // special hack to prevent zoom-to-tabs gesture in safari
            document.body.style.zoom = 0.99;
        });

        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
            // special hack to prevent zoom-to-tabs gesture in safari
            document.body.style.zoom = 0.99;
        });        
        
        na.desktop.init();
        
        var startTime = new Date();
        na.m.settings.siteStartTime = startTime.getTime();
        
        if (na.m.userDevice.isPhone) {
            $('#siteDateTime').css({display:'none'});
            //$('#btnLoginLogout, #btnChangeBackground, #siteMenu').addClass('phoneView');
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
        
        //$('#siteContent .vividDialogContent').animate({opacity:1},'slow').focus();
        $('.vividDialogContent').css({opacity:1,display:'block'});
        
        $('.vividButton, .vividButton_icon').each(function(idx,el){
            na.site.settings.buttons['#'+el.id] = new naVividButton(el);
        });
        
        $('.vividDialog').each(function(idx,el){
            na.site.settings.dialogs['#'+el.id] = new naVividDialog(el);
        });
        if (na.m.userDevice.isPhone) {
            $('.vdSettings img, .vdSettings input').on('click touchstart', function() {
                var t = this;
                $(t).parent('.vdSettings').stop(true,true).animate({opacity : 1},'normal');
                clearTimeout(t.timeout);
                t.timeout = setTimeout(function() {
                    $(t).parent('.vdSettings').animate({opacity:0.0001}, 'normal');
                }, 4000);
            });
        }
        
        if ($.cookie('agreedToPolicies')!=='true') $.cookie('showStatusbar', 'true', na.m.cookieOptions());
        na.site.setStatusMsg(na.site.settings.defaultStatusMsg); // calls na.desktop.resize() as well
        
        if (typeof $.cookie('loginName')=='string') {
            $('#slf_loginName').val($.cookie('loginName'));
            $('#slf_pw').val($.cookie('pw'));
            na.site.login(function (loginWasSuccessful) {
                na.site.loadTheme(function() {
                    na.site.onresize({reloadMenu:true})
                });
            });
        } else {
            $('#slf_loginName').val(na.account.settings.username);
            $('#slf_pw').val(na.account.settings.password);
            na.site.login(function (loginWasSuccessful) {
                na.site.loadTheme(function() {
                    na.site.onresize({reloadMenu:true})
                });
            });
        }

        
        window.onresize  = function(evt) {
            $('#siteBackground img, #siteBackground div').css({
                width : $(window).width(),
                height : $(window).height()
            });
        
            if (na.site.settings.timeoutWindowResize) clearTimeout(nas.s.timeoutWindowResize);
            na.site.settings.timeoutWindowResize = setTimeout (function() {
                na.site.onresize({reloadMenu:true});
            }, 250);
        };
        /* browser support for pinching is still very sketchy 
        document.addEventListener('touchmove', function (e) {
            na.site.onresize ({ reloadMenu : true });
        }, false);
        window.addEventListener('gesturechange', function(e) {
            na.site.settings.current.scale = e.scale;
            na.site.onresize({ reloadMenu : true });
            if (e.scale < 1.0) {
                // User moved fingers closer together
            } else if (e.scale > 1.0) {
                // User moved fingers further apart
            }
        }, false);
        window.visualViewport.addEventListener('scroll',function() {
            //alert (2);
            na.site.onresize ({ reloadMenu : true });
        });
        
        window.visualViewport.addEventListener('resize',function() {
            na.site.onresize ({ reloadMenu : true });
        });
        window.needsResize_interval = setInterval (function (evt) {
            if (!evt) return false;
            alert (evt.scale);
            debugger;
            var c = na.site.settings.current, w = $(window).width();
            if (!c.lastWidth) { 
                c.lastWidth = w;
            } else if (c.lastWidth !== w) { 
                c.lastWidth = w;
                na.site.onresize ({ reloadMenu : true });
            }
        }, 200);
        na.site.settings.current.hammer = new Hammer($('body')[0]);
        na.site.settings.current.hammer.ontransform = function (ev) {
            na.site.settings.current.scale = ev.scale;
            na.site.onresize ({ reloadMenu : true });
        };
        window.addEventListener('deviceorientation', function() {
            na.site.onresize({ reloadMenu : true });
        });
        window.addEventListener("devicemotion", function() {
            na.site.onresize({ reloadMenu : true });
        }, true);
        window.addEventListener('gesturechange', function(e) {
            na.site.settings.current.scale = e.scale;
            na.site.onresize({ reloadMenu : true });
            if (e.scale < 1.0) {
                // User moved fingers closer together
            } else if (e.scale > 1.0) {
                // User moved fingers further apart
            }
        }, false);
        window.addEventListener('gestureend', function(e) {
            na.site.settings.current.scale = e.scale;
            na.site.onresize({ reloadMenu : true });
            if (e.scale < 1.0) {
                // User moved fingers closer together
            } else if (e.scale > 1.0) {
                // User moved fingers further apart
            }
        }, false);
        document.addEventListener('touchmove', function (e) {
            na.site.onresize ({ reloadMenu : true });
        }, false);
        window.visualViewport.addEventListener("resize", function() {
            na.site.onresize({ reloadMenu : true });
        });*/
        /*
        $('body').hammer().on('pinchin', '.vividDialog', function() { na.site.onresize ({ reloadMenu : true }) });
        $('body').hammer().on('pinchout', '.vividDialog', function() { na.site.onresize ({ reloadMenu : true }) });
        na.site.settings.zingtouch = new ZingTouch.Region(document.body);
        na.site.settings.zingtouch.bind ($('#siteContent')[0], 'distance', function (e) {
            alert (JSON.stringify(e));
            na.site.onresize({ reloadMenu : true });
        });
        */
        
        
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
        let 
        reloadMenu = false,
        url2 = url.replace(document.location.origin,'').replace(document.location.host,'').replace('/apps/', ''),
        app = url2!=='/'?JSON.parse(na.m.base64_decode_url(url2)):{},
        loadContent_do = function () {
            let
            ac = {
                type : 'GET',
                url : '/apps_content/'+url2,
                success : function (data, ts, xhr) {
                    na.d.s.visibleDivs.remove('#siteToolbarTop'); $.cookie('visible_siteToolbarTop','');
                    na.d.s.visibleDivs.remove('#siteToolbarLeft'); $.cookie('visible_siteToolbarLeft','');
                    na.d.s.visibleDivs.remove('#siteToolbarRight'); $.cookie('visible_siteToolbarRight','');

            
                    var dat = JSON.parse(data), reloadMenu = false;
                    //debugger;
                    for (let divID in dat) {
                        if (divID=='siteContent') reloadMenu = true;
                        if (!na.d.s.visibleDivs.includes('#'+divID)) {
                            na.d.s.visibleDivs.push('#'+divID);
                            $.cookie('visible_'+divID, true);
                        };
                        $('#'+divID+' .vividDialogContent').fadeOut('normal', function () {
                            $('#'+divID+' .vividDialogContent').html(dat[divID]).fadeIn('normal');
                            //$('#'+divID+' .vividDialogContent')[0].innerHTML = dat[divID];
                            na.site.transformLinks($('#'+divID)[0]);
                        });
                    };
                    na.desktop.resize();
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
        };
        //debugger;
        
        if (app.meta && app.meta.mustBeLoggedIn) {
            if (na.account.settings.username==='Guest') {
                na.site.settings.postLoginSuccess = loadContent_do;
                na.site.displayLogin();
            } else loadContent_do();
        } else loadContent_do();
    },
    
    updateDateTime : function() {
		var 
		d = new Date(),
		r = 
			d.getFullYear() + '-' + na.m.padNumber((d.getMonth()+1),2,'0') + '-' + na.m.padNumber(d.getDate(), 2, '0')
			+ '(' + Date.locale.en.day_names_short[d.getDay()] + ')'
			+ ' ' + na.m.padNumber(d.getHours(), 2, '0') + ':' + na.m.padNumber(d.getMinutes(), 2, '0')
			+ ':' + na.m.padNumber(d.getSeconds(), 2, '0'); // + '.' + na.m.padNumber(d.getMilliseconds(), 3, 0);
			
        jQuery('#siteDateTime .vividDialogContent').html(r);
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

    startTooltips : function(evt, rootEl) {
        if (!rootEl) rootEl = document;
        $('.tooltip', rootEl).each (function(idx,el) {
            var theme = $(el).attr('tooltipTheme');
            if (!theme) theme = 'mainTooltipTheme';
            if (el.id=='btnLoginLogout' && $.cookie('haveShownTutorial')!=='true') {
                nas.settings.btnLoginLogout = this;
                var ptSettings = {
                    className : theme,
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
                    $(nas.settings.btnLoginLogout).poshytip('show');
                    setTimeout(function() {
                        $(nas.settings.btnLoginLogout).poshytip('hide');
                    }, 2500);
                }, 2770);
                
            } else if (el.id=='btnChangeBackground' && $.cookie('haveShownTutorial')!=='true') {
                nas.settings.btnChangeBackground = el;
                var ptSettings = {
                    className : theme,
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
            } else /*if (
                el.id!=='btnChangeBackground'
                && el.id!=='btnLoginLogout'
            ) */{
                var ptSettings = {
                    theme : theme,
                    contentAsHTML : true,
                    content : $(el).attr('title')
                };
                if (na.m.userDevice.isPhone) ptSettings.showOn = 'none';
                $(el).tooltipster(ptSettings);
            }
        });
        $.cookie('haveShownTutorial', 'true', na.m.cookieOptions());
    },
    
    onresize : function(settings) {
        $('#siteBackground img, #siteBackground div, #siteBackground iframe').css({
            width : $(window).width(),
            height : $(window).height()
        });
        //$('#siteBackground img.bg_first').fadeIn(2000);

        // fix attempts (all failed) for [apple bug 1] orientation change bug on iphone 6
        jQuery('body')[0].scrollLeft = 0;//	jQuery('body')[0].style.position = 'relative';
        jQuery('body')[0].scrollTop = 0;//	jQuery('body')[0].style.position = 'relative';
        
        jQuery('html')[0].scrollLeft = 0;
        jQuery('html')[0].scrollTop = 0;
        jQuery('html')[0].style.display = 'none';
        jQuery('html')[0].style.display = 'block';
        
        
        na.site.onresize_doContent(settings);
        
        if (
            !settings
            || (typeof settings=='object' && settings.reloadMenu===true)
        ) na.site.reloadMenu(function () {
            na.desktop.resize(function() {
                if (na.m.userDevice.isPhone) $('#btnOptions, #btnLoginLogout, #btnChangeBackground').css({opacity:1})
                else $('#btnOptions, #btnLoginLogout, #btnChangeBackground').animate({opacity:1},'normal');
                
                na.site.settings.desktopReady = true;
            });
        });
    },
    onresize_doContent : function (settings) {
        if ($(window).width() < na.site.globals.reallySmallDeviceWidth) {
            jQuery('#siteContent, #siteStatusbar').css ({ fontSize : '70%' });
            jQuery('#siteStatusbar').css({height:'5.5rem'});
            jQuery('#siteStatusbar .vividButton').css({width : 40});
            jQuery('#siteStatusbar td:nth-child(2)').css({width:55});
            jQuery('#tableFor_saCompanyLogo').css ({ width : 80, height : 80 });
            jQuery('#divFor_saCompanyLogo').css ({ width : 70, height : 70, marginLeft : 0 });
            jQuery('#saCompanyLogo').attr('width',70).attr('height',70);
            jQuery('#headerSite, #headerSite h1, #headerSite h2, #headerSite h3').css ({ fontSize : '84%', paddingLeft : 0 });
            jQuery('.td_spacer').css ({ height : 100 });
            jQuery('#headerSiteDiv').css ({ height : 70, width : 80 });
            jQuery('#headerSiteDiv div').css ({ height : 0, width : 80 });
        } else if ($(window).width() < na.site.globals.smallDeviceWidth) {
            jQuery('#siteContent, #siteStatusbar').css ({ fontSize : '100%' });
            jQuery('#siteStatusbar').css({height:'4.5rem'});
            jQuery('#siteStatusbar .vividButton').css({width : 100});
            jQuery('#siteStatusbar td:nth-child(2)').css({width:105});
            jQuery('#mainCSS').html('.vividMenu_item td { font-size : 80%; }; #siteStatus td { font-weight : bold };');
            jQuery('#tableFor_saCompanyLogo').css ({ width : 200, height : 200 });
            jQuery('#divFor_saCompanyLogo').css ({ width : 200, height : 200});
            jQuery('#datetime').css({marginLeft:40,marginTop:20});
            jQuery('#saCompanyLogo').attr('width',200).attr('height',200);
            jQuery('#headerSite h1').css ({ fontSize : navigator.userAgent.match('Chrome')?'220%':'140%', paddingLeft : 20 });
            jQuery('#headerSite h2').css ({ fontSize : '100%', paddingLeft : 20 });
            jQuery('#headerSite, #headerSite h3').css ({ fontSize : '100%', paddingLeft : 20 });
            
            jQuery('.td_spacer').css ({ height : 100 });
            jQuery('#headerSiteDiv').css ({ height : 200, width : 320 });
            jQuery('#headerSiteDiv div').css ({ height : 10, width : 320 });
        } else {
            jQuery('#siteContent, #siteStatusbar').css ({ fontSize : '100%' });
            jQuery('#siteStatusbar').css({height:'4.5rem'});
            jQuery('#siteStatusbar .vividButton').css({width : 220});
            jQuery('#siteStatusbar td:nth-child(2)').css({width:225});
            jQuery('#mainCSS').html('.vividMenu_item td { font-size : 80%; }; #siteStatus td { font-weight : bold };');
            jQuery('#tableFor_saCompanyLogo').css ({ width : 200, height : 200 });
            jQuery('#divFor_saCompanyLogo').css ({ width : 200, height : 200 });
            jQuery('#datetime').css({marginLeft:40,marginTop:20});
            jQuery('#saCompanyLogo').attr('width',200).attr('height',200);
            jQuery('#headerSite h1').css ({ fontSize : navigator.userAgent.match('Chrome')?'220%':'140%', paddingLeft : 20 });
            jQuery('#headerSite h2').css ({ fontSize : '100%', paddingLeft : 20 });
            jQuery('#headerSite, #headerSite h3').css ({ fontSize : '100%', paddingLeft : 20 });
            
            jQuery('.td_spacer').css ({ height : 100 });
            jQuery('#headerSiteDiv').css ({ height : 200, width : 320 });
            jQuery('#headerSiteDiv div').css ({ height : 10, width : 320 });
        }; 
    },
    
    reloadMenu : function(callback) {
        
        na.desktop.resize(function () {
            na.site.settings.desktopReady = true;
        });
        
        var 
        na_js__menuItemWidth = (na.m.userDevice.isPhone && $(window).width() < 220 + 180 + 15) ? $(window).width()-(3*60)-15 : 220,
        ac = {
            type : 'POST',
            url : '/nicerapp/domainConfigs/'+na.site.globals.domain+'/mainmenu.php',
            data : {
                na_js__screenWidth : $(window).width(),
                na_js__menuSpace : $(window).width() - $('#siteMenu').offset().left,
                na_js__menuItemWidth : na_js__menuItemWidth,
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
                
                nas.s.menus['#siteMenu'] = new naVividMenu($('#siteMenu')[0], function() {
                    var topLevelItemCount = 0;
                    $('#siteMenu .vividButton.level1').each (function() { topLevelItemCount++ });
                    $('#siteMenu').css({ width : (topLevelItemCount * na_js__menuItemWidth) + 10})
                    if (typeof callback=='function') callback($('#siteMenu')[0]);
                });
                
                
                
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
            //na.site.onresize_doContent(settings);
            
            if (msg !== na.site.settings.defaultStatusMsg)
            setTimeout (function () {
                na.site.setStatusMsg (na.site.settings.defaultStatusMsg);
            }, 2500);
        });
    },
    
    displayLogin : function () {
        $('#siteRegistration').fadeOut('fast', 'swing', function () {
            $('#siteLogin').fadeIn('fast');
        });
    },
    
    newAccount : function () {
        $('#siteLogin').fadeOut('fast', 'swing', function () {
            $('#siteRegistration').fadeIn('fast');
        });
    },
    
    register : function () {
        var
        pw1 = $('#siteRegistration #srf_pw1').val(),
        pw2 = $('#siteRegistration #srf_pw2').val();
        
        if (pw1 !== pw2) {
            $('#siteRegistrationError').html('Passwords do not match.').fadeIn('normal');
        } else {
            $('#siteRegistrationError').fadeOut('normal');
            var ac = {
                type : 'POST',
                url : '/nicerapp/ajax_register.php',
                data : {
                    loginName : $('#siteRegistration #srf_loginName').val(),
                    email : $('#siteRegistration #srf_email').val(),
                    pw : $('#siteRegistration #srf_pw1').val()
                },
                success : function (data, ts, xhr) {
                    $('#slf_loginName').val ($('#srf_loginName').val());
                    $('#slf_pw').val ($('#srf_pw1').val());
                    na.site.login();
                },
                failure : function (xhr, ajaxOptions, thrownError) {
                    debugger;
                }
            };
            $.ajax(ac);
        }
    },
    
    login : function (callback) {
        var ac = {
            type : 'POST',
            url : '/nicerapp/ajax_login.php',
            data : {
                loginName : $('#siteLogin #slf_loginName').val(),
                pw : $('#siteLogin #slf_pw').val()
            },
            success : function (data, ts, xhr) {
                $('#siteRegistration').fadeOut('normal');
                if (data=='Success') {
                    na.account.settings.username = $('#slf_loginName').val();
                    na.account.settings.password = $('#slf_pw').val();
                    $.cookie('loginName', $('#slf_loginName').val());
                    $.cookie('pw', $('#slf_pw').val());
                    if (typeof callback=='function') callback(true);
                    $('#siteLogin').fadeOut('normal', 'swing', function () {
                        $('#siteLoginSuccessful').html('Logged in as '+na.account.settings.username+' <img src="/nicerapp/3rd-party/tinymce-4/plugins/naEmoticons/img/happy.gif"/>').fadeIn('normal', 'swing', function () {
                            setTimeout (function() {
                                $('#siteLoginSuccessful').fadeOut('normal');
                                if (typeof na.site.settings.postLoginSuccess=='function') {
                                    na.site.settings.postLoginSuccess (na.account.settings.username, na.account.settings.pw);
                                    delete na.site.settings.postLoginSuccess;
                                }
                            }, 2 * 1000);
                        });
                    });
                } else {
                    na.account.settings.username = 'Guest';
                    na.account.settings.password = 'Guest';
                    if (typeof callback=='function') callback(false);
                    $('#siteLogin').fadeOut('normal', 'swing', function () {
                        $('#siteLoginFailed').fadeIn('normal', 'swing', function () {
                            setTimeout (function() {
                                $('#siteLoginFailed').fadeOut('normal', 'swing', function () {
                                    $('#siteLogin').fadeIn('normal');
                                });
                            }, 2 * 1000);
                        });
                    });
                }
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    loadTheme : function (callback) {
        var 
        acData = {
            username : na.account.settings.username,
            pw : na.account.settings.password,
            url : '[default]'            
        };
        /*
        if (!acData.dialogs) acData['dialogs'] = {};
        for (var i=0; i<na.desktop.globals.divs.length; i++) {
            var 
            dID = na.desktop.globals.divs[i],
            dIDbg = dID+' .vdBackground',
            d = na.site.settings.dialogs[dID],            
            dData = {};
            
            dData[dID] = d.fetchTheme(d, dID);
            dData[dIDbg] = d.fetchTheme(d, dIDbg);
            
            acData['dialogs'] = na.m.negotiateOptions (
                acData['dialogs'],
                dData
            );
        }
        acData['dialogs'] = JSON.stringify (acData['dialogs']);
        */
        
        var
        ac = {
            type : 'POST',
            url : '/nicerapp/ajax_get_vividDialog_settings.php',
            data : acData,
            success : function (data, ts, xhr) {
                var dat = JSON.parse(data);
                if (dat.dialogs && dat.dialogs['.vividDialog']) {
                    $('.vividDialog').css(dat.dialogs['.vividDialog']);
                    $('.vividDialog .vdBackground').css(dat.dialogs['.vividDialog .vdBackground']);
                }
                for (var dID in dat.dialogs) {
                    if (dID=='.vividDialog' || dID=='.vividDialog .vdBackground') continue;
                    var dit = dat.dialogs[dID];
                    $(dID).css (dit);
                    if (dit.background) {
                        var 
                        del = $(dID)[0],
                        rgbaRegEx = /rgba\(\d{1,3}\,\s+\d{1,3}\,\s+\d{1,3}\,\s+([\d.]+)\).*/,
                        test = rgbaRegEx.test(dit.background),
                        ditbgOpacity = test ? dit.background.match(rgbaRegEx)[1] : dit.opacity;
                        $('.sliderOpacityRange', del).attr('value', ditbgOpacity*100);
                    }
                };
                if (typeof callback=='function') callback(true);
                //debugger;
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;   
            }
        };        
        $.ajax(ac);
    },
    
    saveTheme : function (callback) {
        var 
        themeData = {
            username : na.account.settings.username,
            pw : na.account.settings.password,
            url : '[default]',
            dialogs : {}
        };
        
        for (var i=0; i<na.desktop.globals.divs.length; i++) {
            var selector = na.desktop.globals.divs[i];
            themeData.dialogs = $.extend (themeData.dialogs, na.site.fetchTheme (selector));
        }
        
        themeData.dialogs = JSON.stringify(themeData.dialogs);
        
        var
        ac2 = {
            type : 'POST',
            url : '/nicerapp/ajax_set_vividDialog_settings.php',
            data : themeData,
            success : function (data, ts, xhr) {
                if (typeof callback=='function') callback (themeData, data);
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac2);
    },
    
    fetchTheme (selector) {
        var ret = {};
        ret[selector] = {
            border : $(selector).css('border'),
            borderRadius : $(selector).css('borderRadius'),
            boxShadow : $(selector).css('boxShadow'),
            color : $(selector).css('color'),
            fontFamily : $(selector).css('fontFamily'),
            textShadow : $(selector+' .vividDialogContent').css('textShadow')
        };
        ret[selector+' .vdBackground'] = {
            opacity : $(selector+' .vdBackground').css('opacity'),
            background : $(selector+' .vdBackground').css('background'),
            borderRadius : $(selector).css('borderRadius')
        };
        /*
        ret[selector+' .vividDialogContent'] = {
            textShadow : $(selector+' .vividDialogContent').css('textShadow')
        };*/
        return ret;
    }
}
nas.s = nas.settings;

    
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
    
    addJS : function (text, s_URL, funcToRun, runOnLoad) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        if (runOnLoad) {
            scriptNode.addEventListener ("load", runOnLoad, false);
        }
        scriptNode.type                         = "text/javascript";
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    },
    
    cookieOptions : function () {
        var d = new Date();
        return {
            expires : new Date(d.getTime() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years from now
            path : '/'
        };
    },
    
    randomString : function () {
        return Math.random().toString(36).substr(2, 20);
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
                if (na.m.settings.debugCategoriesVisible.includes('all')) {
                    console.log (msg);
                } else {
                    var writtenAlready = false;
                    for (var cat in msg.categories) {
                        if (na.m.settings.debugCategoriesVisible.includes(cat)
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
    },
    
    changedDateTime_current : function () {
        var 
        d = new Date(),
        r = d.getFullYear() 
            + ('0' + d.getMonth()+1).slice(-2)
            + ('0' + d.getDate()).slice(-2)
            + ('0' + d.getHours()).slice(-2)
            + ('0' + d.getMinutes()).slice(-2)
            + ('0' + d.getSeconds()).slice(-2);
        return r;
    },
    
	hookScrollwheel : function (el, handler, useCapture, add) {
		if (add) {
            if (el.addEventListener) {
				var r = el.addEventListener ('DOMMouseScroll', handler, true);
				var r = el.addEventListener ('mousewheel', handler, true);
				var r = el.addEventListener ('wheel', handler, true);
			} else {
				el.onmousewheel = handler;
			}
		} else {
			if (el.removeEventListener) {
				//el.removeEventListener ('scroll', handler, true);
				el.removeEventListener ('DOMMouseScroll', handler, true);
				el.removeEventListener ('mousewheel', handler, true);
				el.removeEventListener ('wheel', handler, true);
			} else {
				el.onmousewheel = null;
			}
		}
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

/*Array.prototype.include = function (x) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === x) {
            return true;
        }
    }
    return false;
};*/

window.onerror = function (msg, url, lineno, colno, error) {
    var err = msg+'\n'+url+'\n'+lineno+' - '+colno+'\n'+error;
    //alert (err);
    console.log (err);
};
