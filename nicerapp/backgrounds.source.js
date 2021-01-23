na.backgrounds = {
    settings : {
        lastMenuSelection : (
            $(window).width() > $(window).height()
            ? 'landscape'
            : 'portrait'
        )
    },
    next : function (div, search) {
        var
        bgs = nas.s.backgrounds,
        sk = search.split(/\s+/),
        hits = [];
        
        na.bg.s.lastMenuSelection = search;
        
        for (var i=0; i<bgs.length; i++) {
            var 
            bg = bgs[i],
            hit = true;
            
            for (var j=0; j<sk.length; j++) {
                if (sk[j].substr(0,1)==='-') {
                    if (bg.match(sk[j])) hit = false;
                } else {
                    if (!bg.match(sk[j])) hit = false;
                }
            }
            
            if (hit) {
                hits[hits.length] = bg;
            }
        };
        
        var
        url = '/nicerapp/siteMedia/backgrounds'+hits[Math.floor(Math.random() * Math.floor(hits.length))],
        bgf = $(div+' img.bg_first')[0],
        bgl = $(div+' img.bg_last')[0];
        
        bgl.onload=function(){
            jQuery(bgl).fadeIn(1000, function(){
                bgf.src = bgl.src;
                jQuery(bgl).fadeOut('fast');
            });
        };
        bgl.src = url;
        $.cookie('siteBackground_img', url);
        na.analytics.logMetaEvent ('selectionEngines.random.next : url='+url);
    }
};
na.bg = na.backgrounds;
na.backgrounds.s = na.backgrounds.settings;
