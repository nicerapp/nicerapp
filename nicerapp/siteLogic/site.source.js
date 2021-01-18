var na = {};
var nas = na.site = {
    about : {
        firstCreated : '10 January 2021 13:15 CET',
        lastModified : '10 January 2021 13:15 CET',
        copyright : 'Copyright (c) and All Rights Reserved (r) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    },
    
    settings : {
        buttons : {},
        menus : {}
    },
    
    onload : function (evt) {
        $('.vividDialog, .vividMenu').fadeIn('slow', function() {
                /*
                $('#siteContent').animate({
                    top : 'calc( 1vh + 2em )', // doesn't get set at all :(
                    left : '1vw',
                    width : '98vw',
                    height : '98vh'
                }, 'fast', function() {
                    $('#siteContent .vividDialogContent').fadeIn('slow');
                });
                
                $('#siteDateTime').animate({
                    left : '1vw'
                }, 'fast');
                */
                $('#siteContent').bind('onanimationend animationend webkitAnimationEnd', function() { 
                    if (!nas.s.siteContentStarted) {
                        nas.s.siteContentStarted = true;
                        $('#siteContent .vividDialogContent').fadeIn('slow');
                        nas.onresize();
                    }
                });

                $('#siteMenu').bind('onanimationend animationend webkitAnimationEnd', function() { 
                    //nas.s.menus['#siteMenu'].onresize();
                });
                
                $('.vividDialog, .vividMenu').addClass('started');
        });
        
        $('#siteContent .vividDialogContent').focus();
        
        $('.vividButton').each(function(idx,el){
            nas.s.buttons['#'+el.id] = new naVividButton(el);
        });

        $(window).resize (function() {
            if (nas.s.timeoutWindowResize) clearTimeout(nas.s.timeoutWindowResize);
            nas.s.timeoutWindowResize = setTimeout (function() {
                nas.onresize();
            }, 250);
        });
        
        /*
        $('.vividMenu').each(function(idx,el){
            nas.s.menus['#'+el.id] = new naVividMenu(el);
        });
        */
        
        setInterval (nas.updateDateTime, 1000);
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

    startTooltips : function(evt) {
        $('.tooltip').each (function(idx,el) {
            $(el).tooltipster({
                theme : $(el).attr('tooltipTheme'),//'siteMainTooltipsterTheme',
                contentAsHTML : true,
                content : $(el).attr('title'),
                animation : 'grow',
                offset : 10
            });
            /*
            if (el.id=='pageTitle') {
                $(this).tooltipster('show');
                $(this).tooltipster('hide');
            };
            */
        });
    },
    
    onresize : function() {
        nas.reloadMenu();
        $('#siteBackground img').css({
            width : $(window).width(),
            height : $(window).height()
        }).fadeIn('slow');
    },
    
    reloadMenu : function() {
        var ac = {
            type : 'POST',
            url : '/nicerapp/domainConfigs/localhost.v2/mainmenu.php',
            data : {
                na_js__screenWidth : $(window).width(),
                na_js__menuSpace : $(window).width() - $('#siteMenu').offset().left,
                na_js__menuItemWidth : 200,
                na_js__hasContentMenu : false
            },
            success : function (data, ts, xhr) {
                jQuery('#siteMenu').html(data);
                nas.s.menus['#siteMenu'] = new naVividMenu($('#siteMenu')[0]);
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }                
        }
        $.ajax(ac);
    }
}
nas.s = nas.settings;

na.m = {
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

