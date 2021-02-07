na.desktop = {
    globals : {
        divs : [ '#siteContent', '#siteVideo', '#siteVideoSearch', '#siteComments', '#siteStatusbar' ],
        configs : {
            'all' : [ '#siteContent', '#siteVideo', '#siteVideoSearch', '#siteStatusbar' ],
            'content' : [ '#siteContent' ],
            'contentMusicAndMusicSearch' : [ '#siteContent', '#siteVideo', '#siteVideoSearch' ],
            'contentMusicComments' : [ '#siteContent', '#siteVideo', '#siteComments' ],
            'contentComments' : [ '#siteContent', '#siteComments' ],
            'comments' : [ '#siteComments' ],
            'musicAndMusicSearch' : [ '#siteVideo', '#siteVideoSearch' ],
            'musicComments' : [ '#siteVideo', '#siteComments' ]
        },
        margin : 10
    },
    settings : {
        visibleDivs : [ '#siteContent' ]
    },
    
    init : function () {
        var divs = [], cookies = false;
        for (var divIdx in na.d.g.divs) {
            var divID = na.d.g.divs[divIdx];
            var cookie = $.cookie('visible_'+divID.substr(1));            
            if (cookie=='true') {
                cookies = true;
                divs[divs.length] = divID;
            }
        }
        if (!cookies) divs[0] = '#siteContent';
        na.d.s.visibleDivs = divs;
        na.d.goto (divs, true);
    },
    
    setConfig : function (configName) {
        var divs = [];
        for (var i=0; i<na.d.g.divs.length; i++) {
            var divID = na.d.g.divs[i];
            $.cookie ('visible_'+divID.substr(1), 'false', na.m.cookieOptions());
        }
        for (var i=0; i<na.d.g.configs[configName].length; i++) { 
            var divID = na.d.g.configs[configName][i]; 
            divs[divs.length] = divID; 
            $.cookie ('visible_'+divID.substr(1), 'true', na.m.cookieOptions());
        };
        na.d.goto (divs, false);
    },
    
    resize : function () {
        na.d.goto(na.d.s.visibleDivs);
    },
    
    goto : function (visibleDivs, pageInit) {
        
        if ($.cookie('agreedToPolicies')!=='true') {
            if (!visibleDivs.includes('#siteStatusbar')) visibleDivs[visibleDivs.length] = '#siteStatusbar';
        }
        
        na.d.s.visibleDivs = visibleDivs;
        var calculate = {
            'calculate_2nd_topbar' : na.m.negotiateOptions(
                (
                    {
                        '#siteDateTime' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : 'body', edge : 'left' }
                            ]
                        },
                        '#btnThemeSwitch' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#siteDateTime', edge : 'right' }
                            ]
                        },
                        '#btnChangeBackground' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#btnThemeSwitch', edge : 'right' }
                            ]
                        },
                        '#siteMenu' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#btnChangeBackground', edge : 'right' }
                            ]
                        }
                    }
                )
            ),
            'calculate_3rd_visible' : na.m.negotiateOptions(
                (
                    visibleDivs.includes('#siteStatusbar')
                    ? {
                        '#siteStatusbar' : {
                            snapTo : [
                                { element : 'body', edge : 'left' },
                                { element : 'body', edge : 'bottom' }
                            ],
                            growTo : 'maxX'
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteVideo')
                    && visibleDivs.includes('#siteVideoSearch')
                    ? {
                        '#siteVideo' : {
                            snapTo : [
                                { element : '#siteDateTime', edge : 'bottom' },
                                { element : 'body', edge : 'right' }
                            ]
                        },
                        '#siteVideoSearch' : {
                            snapTo : [
                                { element : '#siteVideo', edge : 'bottom' },
                                { element : 'body', edge : 'right' }
                            ],
                            growTo : 'maxY',
                            growToLimits : (
                                visibleDivs.includes('#siteStatusbar')
                                ? [ { element : '#siteStatusbar', edge : 'top' } ]
                                : []
                            )
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteVideo')
                    && visibleDivs.includes('#siteComments')
                    ? {
                        '#siteVideo' : {
                            snapTo : [
                                { element : '#siteDateTime', edge : 'bottom' },
                                { element : 'body', edge : 'right' }
                            ]
                        },
                        '#siteComments' : {
                            snapTo : [
                                { element : '#siteVideo', edge : 'bottom' },
                                { element : 'body', edge : 'right' }
                            ],
                            growTo : 'maxY',
                            growToLimits : (
                                visibleDivs.includes('#siteStatusbar')
                                ? [ { element : '#siteStatusbar', edge : 'top' } ]
                                : []
                            )
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteComments')
                    && !visibleDivs.includes('#siteVideo')
                    ? {
                        '#siteComments' : {
                            snapTo : [
                                { element : '#siteDateTime', edge : 'bottom' },
                                { element : 'body', edge : 'right' }
                            ],
                            growTo : 'maxY',
                            growToLimits : (
                                visibleDivs.includes('#siteStatusbar')
                                ? [ { element : '#siteStatusbar', edge : 'top' } ]
                                : []
                            )
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteContent')
                    && visibleDivs.includes('#siteComments')
                    ? {
                        '#siteContent' : {
                            snapTo : [
                                { element : '#siteDateTime', edge : 'bottom' },
                                { element : 'body', edge : 'left' }
                            ],
                            growTo : 'max',
                            growToLimits : (
                                visibleDivs.includes('#siteStatusbar')
                                ? [
                                    { element : '#siteComments', edge : 'left' },
                                    { element : '#siteStatusbar', edge : 'top' }
                                ]
                                : [
                                    { element : '#siteComments', edge : 'left' }
                                ]
                            )
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteContent')
                    ? {
                        '#siteContent' : {
                            snapTo : [
                                { element : '#siteDateTime', edge : 'bottom' },
                                { element : 'body', edge : 'left' }
                            ],
                            growTo : 'max',
                            growToLimits : (
                                visibleDivs.includes('#siteStatusbar')
                                
                                ? visibleDivs.includes('#siteVideo')
                                    ? [ 
                                        { element : '#siteStatusbar', edge : 'top' },
                                        { element : '#siteVideo', edge : 'left' }
                                    ]
                                    : visibleDivs.includes('#siteComments')
                                        ? [
                                            { element : '#siteStatusbar', edge : 'top' },
                                            { element : '#siteComments', edge : 'left' }
                                        ]
                                        : []
                                : visibleDivs.includes('#siteVideo')
                                    ? [
                                        { element : '#siteVideo', edge : 'left' }
                                    ]
                                    : visibleDivs.includes('#siteComments')
                                        ? [
                                            { element : '#siteComments', edge : 'left' }
                                        ]
                                        : []
                            )
                        }
                    }
                    : {}
                )
            ) // calculate_3rd_visible
        };
        
        debugger;
        var divs = {};
        for (var sectionID in calculate) {
            var section = calculate[sectionID];
            for (var divID in section) {
                divs[divID] = { top : 0, left : 0, width : $(divID).width(), height : $(divID).height() };
                for (var i=0; i<section[divID].snapTo.length; i++) {
                    var sn = section[divID].snapTo[i];
                    switch (sn.edge) {
                        case 'top':
                            divs[divID].top = $(sn.element).offset().top;// + (na.d.g.margin * 2);
                            break;
                        case 'bottom':
                            if (sn.element==='body') {
                                divs[divID].top = $(window).height() - $(divID).outerHeight();// - na.d.g.margin;
                            } else {
                                divs[divID].top = $(sn.element).offset().top + $(sn.element).outerHeight();// + (na.d.g.margin * 2);
                            }
                            break;
                        case 'left':
                            divs[divID].left = $(sn.element).offset().left;// + (na.d.g.margin * 2);
                            break;
                        case 'right':
                            if (sn.element=='body') {
                                divs[divID].left = $(window).width() - $(divID).outerWidth();// - (na.d.g.margin * 1);
                            } else {
                                divs[divID].left = $(sn.element).offset().left + $(sn.element).outerWidth();// + (na.d.g.margin * 2);
                            }
                            break;
                    }
                }

                switch (section[divID].growTo) {
                    case 'max':
                        divs[divID].width = $(window).width() - divs[divID].left;// - (na.d.g.margin*2);
                        divs[divID].height = $(window).height() - divs[divID].top;// - (na.d.g.margin*2);
                        break;
                    case 'maxX':
                        divs[divID].width = $(window).width() - divs[divID].left;// - (na.d.g.margin*3);
                        divs[divID].height = $(divID).height();
                        break;
                    case 'maxY':
                        divs[divID].width = $(divID).width();
                        divs[divID].height = $(window).height() - divs[divID].top;// - (na.d.g.margin*2);
                        break;
                }
                
                if (section[divID].growToLimits)
                for (var i=0; i<section[divID].growToLimits.length; i++) {
                    var gtl = section[divID].growToLimits[i];
                    switch (gtl.edge) {
                        case 'left':
                            divs[divID].width -= ($(window).width() - divs[gtl.element].left);
                            break;
                        case 'top':
                            debugger;
                            divs[divID].height -= ($(window).height() - divs[gtl.element].top);
                            break;
                    }
                }
                
                switch (divID) {
                    case '#siteDateTime':
                    case '#btnThemeSwitch':
                    case '#btnChangeBackground':
                    case '#siteMenu':
                        divs[divID].top += na.d.g.margin;
                        divs[divID].left += na.d.g.margin;
                        break;
                    case '#siteContent':
                        divs[divID].height -= (2 * na.d.g.margin);
                        divs[divID].left += na.d.g.margin;
                        divs[divID].width -= (3 * na.d.g.margin);
                        //if (visibleDivs.includes('#siteDateTime')) {
                            divs[divID].top += (2 * na.d.g.margin );
                            divs[divID].height -= (2 * na.d.g.margin );
                        //}
                        if (visibleDivs.includes('#siteComments')) {
                            divs[divID].width -= ( na.d.g.margin );
                        }
                        break;
                    case '#siteVideo':
                        divs[divID].left -= (na.d.g.margin);
                        divs[divID].top += (2 * na.d.g.margin );
                        break;
                    case '#siteVideoSearch':
                        divs[divID].left -= na.d.g.margin;
                        divs[divID].top += na.d.g.margin;
                        divs[divID].height -= (3 * na.d.g.margin);
                        break;
                    case '#siteComments':
                        divs[divID].height -= (2*na.d.g.margin);
                        divs[divID].left += na.d.g.margin;
                        divs[divID].width -= (2 * na.d.g.margin);
                        if (visibleDivs.includes('#siteVideo')) divs[divID].top += na.d.g.margin;
                        //if (visibleDivs.includes('#siteDateTime')) {
                            divs[divID].top += (2 * na.d.g.margin );
                            divs[divID].height -= (2 * na.d.g.margin );
                        //}
                        if (visibleDivs.includes('#siteStatusbar')) {
                            divs[divID].height -= (na.d.g.margin );
                        }
                        break;
                    case '#siteStatusbar':
                        divs[divID].top -= na.d.g.margin;
                        divs[divID].left += na.d.g.margin;
                        divs[divID].width -= (4 * na.d.g.margin);
                        break;
                }
                
                if (pageInit) 
                $(divID).stop(true,true).fadeIn('slow').css ({
                    top : divs[divID].top,
                    left : divs[divID].left,
                    width : divs[divID].width,
                    height : divs[divID].height,
                    display : 'flex',
                    opacity : 1
                }); else
                $(divID).stop(true,true).css({display:'flex',opacity:0.0001}).animate ({
                    top : divs[divID].top,
                    left : divs[divID].left,
                    width : divs[divID].width,
                    height : divs[divID].height,
                    opacity : 1
                }, 'slow');
            }
        }
        
        for (var i=0; i<na.d.g.divs.length; i++) {
            var divID = na.d.g.divs[i], shown = false;
            for (var divID2 in divs) if (divID2==divID) shown = true;
            if (!shown) $(divID).stop(true,true).fadeOut ('slow');
        }
    } // goto()
};
na.d = na.desktop;
na.d.g = na.d.globals;
na.d.s = na.d.settings;
