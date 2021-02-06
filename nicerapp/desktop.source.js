na.desktop = {
    globals : {
        divs : [ '#siteContent', '#siteComments' ],
        configs : {
            'all' : [ '#siteContent', '#siteComments' ],
            'content' : [ '#siteContent' ],
            'contentComments' : [ '#siteContent', '#siteComments' ],
            'comments' : [ '#siteComments' ]
        },
        margin : 10
    },
    settings : {
        visibleDivs : [ '#siteContent' ]
    },
    
    init : function () {
        var divs = [];
        for (var divIdx in na.d.g.divs) {
            var divID = na.d.g.divs[divIdx];
            var cookie = $.cookie('visible_'+divID.substr(1));            
            if (cookie=='true') divs[divs.length] = divID;
        }
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
                    visibleDivs.includes('#siteComments')
                    ? {
                        '#siteComments' : {
                            snapTo : [
                                { element : '#siteDateTime', edge : 'bottom' },
                                { element : 'body', edge : 'right' }
                            ],
                            growTo : 'maxY'                            
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
                            growToLimits : [
                                { element : '#siteComments', edge : 'left' }
                            ]
                        }
                    }
                    : {}
                )
            ) // calculate_3rd_visible
        };
        
        //debugger;
        var divs = {};
        for (var sectionID in calculate) {
            var section = calculate[sectionID];
            for (var divID in section) {
                divs[divID] = { top : 0, left : 0, width : $(divID).outerWidth(), height : $(divID).outerHeight() };
                for (var i=0; i<section[divID].snapTo.length; i++) {
                    var sn = section[divID].snapTo[i];
                    switch (sn.edge) {
                        case 'top':
                            divs[divID].top = $(sn.element).offset().top;
                            break;
                        case 'bottom':
                            divs[divID].top = $(sn.element).offset().top + $(sn.element).outerHeight();
                            break;
                        case 'left':
                            divs[divID].left = $(sn.element).offset().left;
                            break;
                        case 'right':
                            if (sn.element=='body') {
                                divs[divID].left = $(sn.element).offset().left + $(sn.element).outerWidth() - $(divID).outerWidth() - (na.d.g.margin * 4);
                            } else {
                                divs[divID].left = $(sn.element).offset().left + $(sn.element).outerWidth();
                            }
                            break;
                    }
                }
                divs[divID].top += (na.d.g.margin * 2);
                divs[divID].left += (na.d.g.margin * 2);

                switch (section[divID].growTo) {
                    case 'max':
                        divs[divID].width = $(window).width() - divs[divID].left - (na.d.g.margin*2);
                        divs[divID].height = $(window).height() - divs[divID].top - (na.d.g.margin*2);
                        break;
                    case 'maxX':
                        divs[divID].width = $(window).width() - divs[divID].left - (na.d.g.margin*2);
                        divs[divID].height = $(divID).height();
                        break;
                    case 'maxY':
                        divs[divID].width = $(divID).width();
                        divs[divID].height = $(window).height() - divs[divID].top - (na.d.g.margin*2);
                        break;
                }
                
                if (section[divID].growToLimits)
                for (var i=0; i<section[divID].growToLimits.length; i++) {
                    var gtl = section[divID].growToLimits[i];
                    switch (gtl.edge) {
                        case 'left':
                            divs[divID].width -= ($(window).width() - divs[gtl.element].left);
                            break;
                    }
                }
                
                debugger;
                if (pageInit) 
                $(divID).stop(true,true).fadeIn('slow').css ({
                    top : divs[divID].top,
                    left : divs[divID].left,
                    width : divs[divID].width,
                    height : divs[divID].height,
                    display : 'flex',
                    opacity : 1
                }); else
                $(divID).stop(true,true).fadeIn('slow').animate ({
                    top : divs[divID].top,
                    left : divs[divID].left,
                    width : divs[divID].width,
                    height : divs[divID].height
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
