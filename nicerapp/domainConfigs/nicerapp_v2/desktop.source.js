na.desktop = {
    globals : {
        divs : [ '#siteDateTime', '#siteContent', '#siteVideo', '#siteVideoSearch', '#siteComments', '#siteStatusbar', '#siteToolbarDialogSettings', '#siteToolbarLeft', '#siteToolbarRight', '#siteToolbarTop' ],
        configs : {
            'background' : [ ],
            'all' : [ '#siteContent', '#siteVideo', '#siteVideoSearch', '#siteStatusbar' ],
            'content' : [ '#siteContent' ],
            'contentMusicAndMusicSearch' : [ '#siteContent', '#siteVideo', '#siteVideoSearch' ],
            'contentMusicComments' : [ '#siteContent', '#siteVideo', '#siteComments' ],
            'contentComments' : [ '#siteContent', '#siteComments' ],
            'comments' : [ '#siteComments' ],
            'musicAndMusicSearch' : [ '#siteVideo', '#siteVideoSearch' ],
            'musicComments' : [ '#siteVideo', '#siteComments' ],
            'contentAndToolbarRight' : [ '#siteContent', '#siteToolbarRight' ]
        },
        defaultPos : {
            '#siteDateTime' : {
                top : -100,
                left : 10,
                opacity : 0.0001
            },
            '#siteContent' : {
                top : ($(window).height()/2)-50,
                left : ($(window).width()/2)-50,
                width : 100,
                height : 100,
                opacity : 0.0001
            },
            '#siteVideo' : {
                top : $('#siteDateTime').height()+20,
                left : $(window).width()+100,
                opacity : 0.0001
            },
            '#siteVideoSearch' : {
                top : $('#siteDateTime').height()+20+$('#siteVideo').height()+10,
                left : $(window).width()+100,
                width : !na.m.userDevice.isPhone ? 300 : $(window).width - 50,
                opacity : 0.0001
            },
            '#siteComments' : {
                top : $('#siteDateTime').height()+20,
                left : $(window).width()+100,
                width : !na.m.userDevice.isPhone ? 300 : $(window).width - 50,
                opacity : 0.0001
            },
            '#siteToolbarDialogSettings' : {
                top : $('#siteDateTime').height()+20,
                left : -480,
                height : $(window).height()-120,
                width : !na.m.userDevice.isPhone ? 470 : $(window).width - 50,
                opacity : 0.0001
            },
            '#siteToolbarLeft' : {
                top : $('#siteDateTime').height()+20,
                left : -420,
                height : $(window).height()-120,
                width : !na.m.userDevice.isPhone ? 400 : $(window).width - 50,
                opacity : 0.0001
            },
            '#siteToolbarRight' : {
                top : $('#siteDateTime').height()+20,
                left : $(window).width()+100,
                height : $(window).height()-120,
                width : !na.m.userDevice.isPhone ? 300 : $(window).width - 50,
                opacity : 0.0001
            },
            '#siteToolbarTop' : {
                top : -200,
                left : 10,
                opacity : 0.0001
            },
            
            '#siteStatusbar' : {
                top : $(window).height() + 50,
                opacity : 0.0001
            }
        },                
        margin : na.m.userDevice.isPhone ? 5 : 10
    },
    settings : {
        visibleDivs : [ '#siteContent' ]
    },
    
    init : function () {
        var divs = [], cookies = false;
        for (var divIdx in na.d.g.divs) {
            if (typeof na.d.g.divs[divIdx]!=='string') continue;
            var divID = na.d.g.divs[divIdx];
            $(divID).css(na.d.g.defaultPos[divID]);
            var cookie = $.cookie('visible_'+divID.substr(1));            
            if (cookie=='true') {
                cookies = true;
                divs[divs.length] = divID;
            }
        }
        if (!cookies) divs[0] = '#siteContent';
        na.d.s.visibleDivs = divs;
        //na.d.goto (divs);
    },
    
    isVisible : function (id) {
        return na.desktop.settings.visibleDivs.includes(id);
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
        na.site.settings.menus['#siteMenu'].updateItemStates();
    },
    
    inConfig : function (configName) {
        var vdivs = [];
        for (var i=0; i<na.d.s.visibleDivs.length; i++) {
            var div = na.d.s.visibleDivs[i];
            if (div!=='#siteDateTime' && div!=='#siteStatusbar') vdivs.push(div);
        };
        var 
        json1 = JSON.stringify(vdivs),
        json2 = JSON.stringify(na.d.g.configs[configName]),
        r = json1 === json2;

        return r;
    },
    
    resize : function (callback) {
        na.d.goto(na.d.s.visibleDivs,callback);
    },
    
    goto : function (visibleDivs, callback) {
        
        if (
            $.cookie('agreedToPolicies')!=='true'
            || $.cookie('showStatusbar')==='true'
        ) {
            if (!visibleDivs.includes('#siteStatusbar')) visibleDivs.push('#siteStatusbar');
        }
        
        if (!na.m.userDevice.isPhone && !visibleDivs.includes('#siteDateTime')) {
            visibleDivs.push('#siteDateTime');
        }
        
        if ($(window).width() < na.site.globals.reallySmallDeviceWidth) {
            if (na.site.settings.activeDivs && na.site.settings.activeDivs.length) visibleDivs = na.site.settings.activeDivs;
            if ($.cookie('showStatusbar') && !visibleDivs.includes('#siteStatusbar')) visibleDivs.push('#siteStatusbar');
            if (!visibleDivs.includes('#btnOptions')) visibleDivs.push('#btnOptions');
            if (!visibleDivs.includes('#btnLoginLogout')) visibleDivs.push('#btnLoginLogout');
            if (!visibleDivs.includes('#btnChangeBackground')) visibleDivs.push('#btnChangeBackground');
        }
        
        na.d.s.visibleDivs = visibleDivs;
        
        
        var calculate = {
            'calculate_visible' : na.m.negotiateOptions( // TODO : clean up, reduce number of evaluations
                (
                    !na.m.userDevice.isPhone || $(window).width() > na.site.globals.smallDeviceWidth
                    ? {
                        '#siteDateTime' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : 'body', edge : 'left' }
                            ]
                        },
                        '#btnOptions' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#siteDateTime', edge : 'right' }
                            ]
                        },
                        '#btnLoginLogout' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#btnOptions', edge : 'right' }
                            ]
                        },
                        '#btnChangeBackground' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#btnLoginLogout', edge : 'right' }
                            ]
                        },
                        '#siteMenu' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#btnChangeBackground', edge : 'right' }
                            ]
                        }
                    }
                    : {
                        '#btnOptions' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : 'body', edge : 'left' }
                            ]
                        },
                        '#siteMenu' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#btnOptions', edge : 'right' }
                            ]
                        },
                        '#btnLoginLogout' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#siteMenu', edge : 'right' }
                            ]
                        },
                        '#btnChangeBackground' : {
                            snapTo : [
                                { element : 'body', edge : 'top' },
                                { element : '#btnLoginLogout', edge : 'right' }
                            ]
                        },
                 
                    }
                ),
            /*),
            'calculate_3rd_visible' : na.m.negotiateOptions(*/
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
                    && !visibleDivs.includes('#siteToolbarRight')
                    && !visibleDivs.includes('#siteToolbarTop')
                    ? {
                        '#siteVideo' : {
                            snapTo : [
                                { element : '#btnOptions', edge : 'bottom' },
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
                    && !visibleDivs.includes('#siteToolbarRight')
                    && !visibleDivs.includes('#siteToolbarTop')
                    ? {
                        '#siteVideo' : {
                            snapTo : [
                                { element : '#btnOptions', edge : 'bottom' },
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
                    && !visibleDivs.includes('#siteToolbarRight')
                    && !visibleDivs.includes('#siteToolbarTop')
                    ? {
                        '#siteComments' : {
                            snapTo : [
                                { element : '#btnOptions', edge : 'bottom' },
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
                    visibleDivs.includes('#siteToolbarRight')
                    ? {
                        '#siteToolbarRight' : {
                            snapTo : [
                                {element : '#btnOptions', edge : 'bottom' },
                                {element : 'body', edge:'right'}
                            ],
                            growTo : 'maxY',
                            growToLimits : (
                                visibleDivs.includes ('#siteStatusbar')
                                ? [
                                    { element : '#siteStatusbar', edge : 'top' }
                                ]
                                : []
                            )
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteToolbarDialogSettings')
                    ? {
                        '#siteToolbarDialogSettings' : {
                            snapTo : [
                                { element : '#btnOptions', edge : 'bottom' },
                                { element : 'body', edge : 'left' }
                            ],
                            growTo : 'maxY',
                            growToLimits : 
                                visibleDivs.includes('#siteStatusbar')
                                ? [
                                    { element : '#siteStatusbar', edge : 'top' }
                                ]
                                : []
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteToolbarLeft')
                    && !visibleDivs.includes('#siteToolbarDialogSettings')
                    ? {
                        '#siteToolbarLeft' : {
                            snapTo : [
                                { element : '#btnOptions', edge : 'bottom' },
                                { element : 'body', edge : 'left' }
                            ],
                            growTo : 'maxY',
                            growToLimits : 
                                visibleDivs.includes('#siteStatusbar')
                                ? [
                                    { element : '#siteStatusbar', edge : 'top' }
                                ]
                                : []
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteToolbarLeft')
                    && visibleDivs.includes('#siteToolbarDialogSettings')
                    ? {
                        '#siteToolbarLeft' : {
                            snapTo : [
                                { element : '#btnOptions', edge : 'bottom' },
                                { element : '#siteToolbarDialogSettings', edge : 'left' }
                            ],
                            growTo : 'maxY',
                            growToLimits : 
                                visibleDivs.includes('#siteStatusbar')
                                ? [
                                    { element : '#siteStatusbar', edge : 'top' }
                                ]
                                : []
                        }
                    }
                    : {}
                ), (
                    visibleDivs.includes('#siteContent')
                    ? {
                        '#siteContent' : {
                            snapTo : 
                                visibleDivs.includes('#siteToolbarLeft')
                                ? [
                                    { element : '#btnOptions', edge : 'bottom' },
                                    { element : '#siteToolbarLeft', edge : 'right' }
                                ]
                                : visibleDivs.includes('#siteToolbarDialogSettings')
                                    ? [
                                        { element : '#btnOptions', edge : 'bottom' },
                                        { element : '#siteToolbarDialogSettings', edge : 'right' }
                                    ]
                                    : [
                                        { element : '#btnOptions', edge : 'bottom' },
                                        { element : 'body', edge : 'left' }
                                    ],
                            growTo : 'max',
                            growToLimits : []
                        }
                    }
                    : {}
                )
            ) // calculate_visible
        };

        var c = calculate['calculate_visible'];
        c.order = 
            visibleDivs.includes('#siteDateTime')
            ? [ '#siteDateTime', '#btnOptions', '#btnLoginLogout', '#btnChangeBackground', '#siteMenu' ]
            : [ '#btnOptions', '#siteMenu', '#btnLoginLogout', '#btnChangeBackground' ];
            
        c.order.push ('#siteStatusbar');
        if (visibleDivs.includes('#siteToolbarDialogSettings')) c.order.push('#siteToolbarDialogSettings');
        if (visibleDivs.includes('#siteToolbarLeft')) c.order.push('#siteToolbarLeft');
        if (visibleDivs.includes('#siteToolbarRight')) c.order.push('#siteToolbarRight');
        if (visibleDivs.includes('#siteToolbarTop')) c.order.push('#siteToolbarTop');
        c.order.push ('#siteContent');
        c.order.push ('#siteVideo');
        c.order.push ('#siteVideoSearch');
        c.order.push ('#siteComments');
            
        if (c['#siteContent']) {
            var gtl = c['#siteContent'].growToLimits;
            if (visibleDivs.includes('#siteToolbarRight')) gtl.push ({ element : '#siteToolbarRight', edge : 'left' });
            if (visibleDivs.includes('#siteVideo')) gtl.push ({ element : '#siteVideo', edge : 'left' });
            if (visibleDivs.includes('#siteVideoSearch')) gtl.push ({ element : '#siteVideoSearch', edge : 'left' });
            if (visibleDivs.includes('#siteComments')) gtl.push ({ element : '#siteComments', edge : 'left' });
            if (visibleDivs.includes('#siteStatusbar')) gtl.push ({ element : '#siteStatusbar', edge : 'top' });
        }
        
        //debugger;
        var divs = {};
        for (var sectionID in calculate) {
            var section = calculate[sectionID];
            for (var i=0; i<section.order.length; i++) {
                var divID = section.order[i];
                if (!section[divID]) { continue; };
                divs[divID] = { top : 0, left : 0, width : $(divID).width(), height : $(divID).height() };
            
                for (var j=0; j<section[divID].snapTo.length; j++) {
                    var sn = section[divID].snapTo[j];
                    switch (sn.edge) {
                        case 'top':
                            if (sn.element==='body') divs[divID].top = 0; else divs[divID].top = divs[sn.element].top;
                            break;
                        case 'bottom':
                            if (sn.element==='body') {
                                divs[divID].top = $(window).height() - $(divID).outerHeight();
                            } else {
                                divs[divID].top = divs[sn.element].top + $(sn.element).outerHeight() + na.d.g.margin;
                            }
                            break;
                        case 'left':
                            if (sn.element==='body') divs[divID].left = na.d.g.margin; 
                            else divs[divID].left = divs[sn.element].left + $(sn.element).outerWidth() + na.d.g.margin;
                            break;
                        case 'right':
                            if (sn.element=='body') {
                                divs[divID].left = $(window).width() - $(divID).outerWidth();
                            } else {
                                divs[divID].left = divs[sn.element].left + $(sn.element).outerWidth() ;
                                //debugger;
                                //alert (divID + ' - '+divs[divID].left + ' - '+sn.element+' - '+divs[sn.element].left+' - '+$(sn.element).outerWidth());
                            }
                            break;
                    }
                }

                switch (section[divID].growTo) {
                    case 'max':
                        divs[divID].width = $(window).width() - divs[divID].left - na.d.g.margin;
                        divs[divID].height = $(window).height() - divs[divID].top;
                        break;
                    case 'maxX':
                        divs[divID].width = $(window).width() - divs[divID].left - na.d.g.margin;
                        divs[divID].height = $(divID).height();
                        break;
                    case 'maxY':
                        if ($(window).width() < na.site.globals.reallySmallDeviceWidth)
                            divs[divID].width = $(window).width() - (3 * na.d.g.margin)
                        else 
                            divs[divID].width = $(divID).width();
                        divs[divID].height = $(window).height() - divs[divID].top - (2 * na.d.g.margin);
                        break;
                }

                if (section[divID].growToLimits)
                for (var j=0; j<section[divID].growToLimits.length; j++) {
                    var gtl = section[divID].growToLimits[j];
                    switch (gtl.edge) {
                        case 'left':
                            divs[divID].width -= ($(window).width() - divs[gtl.element].left);
                            break;
                        case 'top':
                            divs[divID].height -= ($(window).height() - divs[gtl.element].top);
                            break;
                    }
                }
                
                switch (divID) {
                    case '#siteDateTime':
                    case '#btnOptions':
                    case '#btnLoginLogout':
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
                        if (
                            visibleDivs.includes('#siteComments')
                            || visibleDivs.includes('#siteToolbarRight')                            
                        ) {
                            divs[divID].width -= ( na.d.g.margin );
                        }
                        break;
                    case '#siteVideo':
                        divs[divID].left -= (na.d.g.margin);
                        divs[divID].top += (2 * na.d.g.margin );
                        break;
                    case '#siteToolbarLeft':
                        divs[divID].height -= (2 * na.d.g.margin);
                        break;
                    case '#siteVideoSearch':
                    case '#siteToolbarRight':
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
                
                if (divID=='#siteContent') {
                    var params = {
                        duration: 1000,
                        easing : 'linear',
                        complete : function () {
                        }
                    };
                } else var params = undefined;
                
            
                if (divID=='#siteContent') 
                    if (na.m.userDevice.isPhone) {
                        $(divID).css ({
                            top : divs[divID].top,
                            left : divs[divID].left,
                            width : divs[divID].width,
                            height : divs[divID].height,
                            display : 'flex',
                            opacity : 1
                        }); 
                        for (var id in na.site.settings.na3D) {
                            var el = na.site.settings.na3D[id];
                            $('canvas', el.p)
                                .css ({ width : $(el.p).width(), height : $(el.p).height() })
                                .attr('width', $(el.p).width())
                                .attr('height', $(el.p).height());
                            el.camera.aspect = $(el.p).width() / $(el.p).height();
                            el.camera.updateProjectionMatrix();
                            el.renderer.setSize  ($(el.p).width(), $(el.p).height());
                        }
                        if (typeof callback=='function') callback(this);             
                    } else $(divID).stop(true,true,false).animate ({
                        top : divs[divID].top,
                        left : divs[divID].left,
                        width : divs[divID].width,
                        height : divs[divID].height,
                        opacity : 1
                    }, 'normal', 'swing', function () {
                        for (var id in na.site.settings.na3D) {
                            var el = na.site.settings.na3D[id];
                            $('canvas', el.p)
                                .css ({ width : $(el.p).width(), height : $(el.p).height() })
                                .attr('width', $(el.p).width())
                                .attr('height', $(el.p).height());
                            el.camera.aspect = $(el.p).width() / $(el.p).height();
                            el.camera.updateProjectionMatrix();
                            el.renderer.setSize  ($(el.p).width(), $(el.p).height());
                        }
                        if (typeof callback=='function') callback(this);
                    });
                    
                else if (na.m.userDevice.isPhone) {
                        var props = {
                            top : divs[divID].top,
                            left : divs[divID].left,
                            width : divs[divID].width,
                            height : divs[divID].height,
                            display : 'flex'
                        };
                        if (divID.substr(0,4)!=='#btn' || !na.m.userDevice.isPhone) props.opacity = 1;
                        $(divID).css (props); 
                        if (typeof callback=='function') callback($(divID)[0]);
                    } 
                    else {
                        var props = {
                            top : divs[divID].top,
                            left : divs[divID].left,
                            width : divs[divID].width,
                            height : divs[divID].height
                        };
                        if (divID.substr(0,4)!=='#btn' || !na.m.userDevice.isPhone) props.opacity = 1;
                        $(divID).stop(true,true,false).animate (props, 'normal', 'swing', callback);
                    }
            }
        }

        for (var i=0; i<na.d.g.divs.length; i++) {
            var divID = na.d.g.divs[i], shown = false;
            for (var divID2 in divs) if (divID2==divID) shown = true;
            if (!shown) $(divID).stop(true,true,false).animate(na.d.g.defaultPos[divID],'slow');
        }
    } // goto()
};
na.d = na.desktop;
na.d.g = na.d.globals;
na.d.s = na.d.settings;
