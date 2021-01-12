var na = {};
var nas = na.site = {
    about : {
        firstCreated : '10 January 2021 13:15 CET',
        lastModified : '10 January 2021 13:15 CET',
        copyright : 'Copyright (c) and All Rights Reserved (r) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    },
    
    onload : function (evt) {
        $('.vividDialog').fadeIn('slow', function() {
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
        });
        $('#siteContent .vividDialogContent').focus();
        setInterval (nas.updateDateTime, 1000);
    },
    
    updateDateTime : function() {
		var 
		d = new Date(),
		r = 
			d.getFullYear() + '-' + na.m.padNumber((d.getMonth()+1),2,'0') + '-' + na.m.padNumber(d.getDate(), 2, '0')
			+ '(' + Date.locale.en.day_names_short[d.getDay()] + ')'
			+ '<br/>' + na.m.padNumber(d.getHours(), 2, '0') + ':' + na.m.padNumber(d.getMinutes(), 2, '0')
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
    }
    
};

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

