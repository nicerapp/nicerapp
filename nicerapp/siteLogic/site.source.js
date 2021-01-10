var na = {};
var nas = na.site = {
    about : {
        firstCreated : '10 January 2021 13:15 CET',
        lastModified : '10 January 2021 13:15 CET',
        copyright : 'Copyright (c) and All Rights Reserved (r) 2021 by Rene A.J.M. Veerman <rene.veerman.netherlands@gmail.com>'
    },
    
    onload : function (evt) {
        $('.vividDialog').fadeIn('normal');
        $('#siteContent').focus();
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
            if (el.id=='btnBackgroundRandom') {
                $(this).tooltipster('show');
                $(this).tooltipster('hide');
            };
            
        });
    }
    
};
