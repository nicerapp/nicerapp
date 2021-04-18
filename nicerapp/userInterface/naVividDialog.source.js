class naVividDialog {
    constructor(el,html,parent) {
        var t = this;
        t.p = parent;
        if (typeof html=='string' && html!=='') {
            var h = $(html);
            $(parent).append(h);
            t.el = h[0];
        } else {
            t.el = el;
        };
        t.t = $(this.el).attr('theme');
        
        var html = 
            '<div class="vdSettings">'
                +'<img class="btnSettings" src="/nicerapp/siteMedia/btnPickColor.png" onclick="na.site.settings.activeDivs = [\'#siteToolbarDialogSettings\']; var d = na.site.settings.dialogs[\'#'+this.el.id+'\']; d.displaySettingsDialog(d)"/>'
                +'<input type="range" min="1" max="100" value="50" class="sliderOpacityRange"/>'
            +'</div>'
            +'<div class="vdBackground"></div>';
        if (t.el.id!=='#siteToolbarDialogSettings' && !$('.vdSettings',t.el)[0]) $(t.el).prepend(html);
        
        $('.vdSettings', t.el).hover (function() {
            $(this).stop(true,true).animate({opacity:1},'slow');
        }, function() {
            $(this).stop(true,true).animate({opacity:0.0001},'slow');
        });
        
        $('.vdSettings input', t.el)[0].oninput = function () {
            var t2 = this;
            
            clearTimeout (t.timeoutOpacityChange);
            t.timeoutOpacityChange = setTimeout(function() {
                t.changeOpacity (t, t2.value);
            }, 1000);
            
            $(t.el).css ({ background : 'rgba(0,0,0,'+(t2.value/100)+')' });
        };
    };
    
    displaySettingsDialog (t) {
        if (!na.desktop.settings.visibleDivs.includes('#siteToolbarDialogSettings')) na.desktop.settings.visibleDivs.push('#siteToolbarDialogSettings');
        na.desktop.resize();
    }
    
    changeOpacity (t, percentage) {
        //$(t.el).css ({ background : 'rgba(0,0,0,'+(percentage/100)+')' });
        var 
        selector = '#'+t.el.id+' .vdBackground',
        acData = {
            username : na.account.settings.username,
            pw : na.account.settings.password,
            url : '[default]'            
        };
        if (!acData.dialogs) acData['dialogs'] = {};
        acData['dialogs'][selector] = t.fetchTheme (t, selector);
        
        acData['dialogs'] = JSON.stringify (acData['dialogs']);
        
        var
        ac = {
            type : 'POST',
            url : '/nicerapp/ajax_get_vdsettings.php',
            data : acData,
            success : function (data, ts, xhr) {
                acData['dialogs'] = JSON.parse(acData['dialogs']);
                
                var
                themeData = $.extend({}, acData);
                themeData = na.m.negotiateOptions (themeData, JSON.parse(data));
                if (!themeData.dialogs) themeData['dialogs'] = {};
                themeData['dialogs'][selector] = t.fetchTheme (t, selector);
                themeData['dialogs'] = JSON.stringify(themeData['dialogs']);
                
                var
                ac2 = {
                    type : 'POST',
                    url : '/nicerapp/ajax_set_vdsettings.php',
                    data : themeData,
                    success : function (data, ts, xhr) {
                        
                    },
                    failure : function (xhr, ajaxOptions, thrownError) {
                        debugger;
                    }
                };
                $.ajax(ac2);
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
                
    };
    
    fetchTheme (t, selector) {
        var ret = {};
        ret.background = $(selector).css('background');
        ret.border = $(selector).css('border');
        ret.opacity = $(selector).css('opacity');
        return ret;
    };
    
}
