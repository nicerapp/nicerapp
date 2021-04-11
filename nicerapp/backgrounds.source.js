na.backgrounds = {
    settings : {
        lastMenuSelection : (
            $(window).width() > $(window).height()
            ? 'landscape'
            : 'portrait'
        )
    },
    next : function (div, search, url) {
        var
        bgs = nas.s.backgrounds,
        sk = search.split(/\s+/),
        hits = [];
        
        $('#siteBackground, #siteBackground img, #siteBackground div, #siteBackground iframe').css({
            position:'absolute',
            width : $(window).width(),
            height : $(window).height()
        });
        
        na.bg.s.lastMenuSelection = search;
        
        if (typeof url !== 'string' || url === '') {
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
            url = '/nicerapp/siteMedia/backgrounds'+hits[Math.floor(Math.random() * Math.floor(hits.length))];
        };
        
        var
        bgf = $(div+' img.bg_first')[0],
        bgl = $(div+' img.bg_last')[0],
        bgDiv = $(div+'_bg')[0];
        
        if (url.match('tiled')) {
            $(bgf).add(bgl).fadeOut('fast');
            $(bgDiv).css ({
                width: jQuery(window).width(),
                height: jQuery(window).height(),
                background : 'url("'+url+'") repeat'
            }).fadeIn('normal');
            
        } else if (url.match('youtube')) {
            $(bgf).add(bgl).fadeOut('fast');
            
            
            var ac = {
                type : 'GET',
                url : url,
                success : function (data, ts, xhr) {
                    var
                    outsideURL = data;
                    
                    if (outsideURL.indexOf('?')===-1) outsideURL += '?'; else outsideURL += '&';
                    outsideURL += 'wmode=transparent&enablejsapi=1&html5=1&origin='+document.location.href;
                    
                    var vidID = /embed\/(.*)\?/.exec(outsideURL);
                    if (vidID) {
                        vidID = vidID[1]; 
                    } else {
                        vidID = /watch\?v\=(.*)\&/.exec(outsideURL);
                        if (vidID) vidID = vidID[1];
                    };

                    jQuery(bgDiv).tubeplayer('destroy');
                    jQuery(bgDiv).fadeIn(1500).tubeplayer({
                        width: jQuery(window).width(),
                        height: jQuery(window).height(),
                        initialVideo : vidID,
                        autoPlay : true,
                        showControls: true,
                        showRelated: true,
                        annotations : false,
                        showinfo : true,
                        modestbranding : false,
                        loop : false,
                        onPlayerPlaying : function () {
                            /*if (jQuery(bgDiv).attr('saBGinit')=='true') {
                                jQuery(bgDiv).attr('saBGinit', 'false');
                                na.bg.youtube.videoLoaded (el, bgDiv, bgURL, bgContainerIdx, lIdx, layerCount, preFadeInCSS, fadeTime);
                            }*/
                        }
                    });
                    
                    // how i really want and kinda need a --ignoreAspectRatioAndFillWindow setting on the (jquery) youtube player..
                    jQuery(window).resize (function () {
                        jQuery(bgDiv).css ({ paddingBottom : '0.1%'});
                        debugger;
                        jQuery(bgDiv).tubeplayer({
                            width: jQuery(window).width(),
                            height: jQuery(window).height()
                        });
                    });
                    //debugger;
                },
                failure : function (xhr, ajaxOptions, thrownError) {
                    debugger;
                }
            };
            $.ajax(ac);

        } else {        
            bgl.onload=function(){
                jQuery(bgl).css({display:'none',zIndex:4,opacity:1}).fadeIn('normal', function(){
                    bgf.src = bgl.src;
                    $(bgf).css ({ zIndex : 3, display : 'block', opacity : 1 });
                    $(bgl).hide();
                    jQuery(bgDiv).fadeOut('normal', function(){
                        $(bgDiv).tubeplayer('destroy');
                    });
                });
            };
            $(bgl).css({position:'absolute'}).hide();
            bgl.src = url;
        }
        console.log ('background set to '+url);
        $.cookie('siteBackground_search', search, na.m.cookieOptions());
        $.cookie('siteBackground_url', url, na.m.cookieOptions());
        na.analytics.logMetaEvent ('selectionEngines.random.next : url='+url);
    }
};
na.bg = na.backgrounds;
na.backgrounds.s = na.backgrounds.settings;
