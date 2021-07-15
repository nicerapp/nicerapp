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
        t.settings = { current : {} };
        
        var html = '';
        if (!$(t.el).find('.vdBackground')[0]) html += '<div class="vdBackground"></div>';
        
        //if (t.el.id=='siteContent') debugger;
        if (na.site.globals.cosmeticsDBkeys) {
            html += 
                '<div class="vdSettings">'
                    +'<img class="btnSettings" src="/nicerapp/siteMedia/btnPickColor.png" onclick="na.site.settings.activeDivs = [\'#siteToolbarDialogSettings\']; var d = na.site.settings.dialogs[\'#'+this.el.id+'\']; d.displaySettingsDialog(d, \''+t.el.id+'\')"/>'
                    +'<input type="range" min="1" max="100" value="50" class="sliderOpacityRange" onchange="na.ds.opacityChange(event);"/>'
                +'</div>';
        /*
            if (
                t.el.id!=='#siteToolbarDialogSettings' 
                && !$('.vdSettings',t.el)[0]
            ) $(t.el).prepend(html);
          */  
        } else $(t.el).find('.vdSettings').remove();
        
        $(t.el).prepend(html);
        

        var
        bg = t.el,
        rgbaRegEx = /rgba\((\d{1,3})\,\s*(\d{1,3})\,\s*(\d{1,3})\,\s*([\d.]+)\)(.*)/,
        rgbRegEx = /rgb\((\d{1,3})\,\s*(\d{1,3})\,\s*(\d{1,3})\)(.*)/;
        if (bg && $(bg).children('.vdBackground')[0]) bg = $(bg).children('.vdBackground');
        var bg1 = $(bg).css('background');
        if (typeof bg1=='string' && bg1!=='' && !bg1.match('url')) {
            var bg2 = '', bg2a = bg1.match(rgbaRegEx), bg2b = bg1.match(rgbRegEx);
            if (bg2a) {
                var opacity = bg2a[4];
                $(bg).css({ background : 'rgba('+bg2a[1]+', '+bg2a[2]+', '+bg2a[3]+', '+bg2a[4]+')'+bg2a[5] });
            } else {
                var opacity = 0.5;
                $(bg).css({ background : 'rgba('+bg2b[1]+', '+bg2b[2]+', '+bg2b[3]+', 0.5)'+bg2b[4] });
            }
        } else { 
            var opacity = parseFloat($(bg).css('opacity'));
            $(bg).css({ opacity : opacity });
        }
        var dialog = $(bg).parents('.vividDialog')[0];
        $(dialog).find('.sliderOpacityRange').val(parseInt(opacity*100));
        
        
        $('.vdSettings', t.el).hover (function() {
            if (!$(this).is(':animated')) $(this).animate({opacity:1},'fast');
        }, function() {
            if (!$(this).is(':animated')) $(this).animate({opacity:0.0001},'fast');
        });
    };
    
    displaySettingsDialog (t, dialogID) {
        na.site.settings.dialogs['#siteToolbarDialogSettings'].settings.current.dialogID = dialogID;
        var html = 
            '<div class="vdSettingsScripts">'
            +'<link rel="stylesheet" href="/nicerapp/3rd-party/jsTree-3.2.1/dist/themes/default/style.css" onload="var d = na.site.settings.dialogs[\'#siteToolbarDialogSettings\']; d.displaySettingsDialog_scriptLoaded(d);"/> <!-- has style.min.css -->'
            //+'<script type="text/javascript" src="/nicerapp/3rd-party/jsTree-3.2.1/dist/jstree.min.js?c='+na.m.changedDateTime_current()+'" onload="var d = na.site.settings.dialogs[\'#siteToolbarDialogSettings\'];  d.displaySettingsDialog_scriptLoaded(d);"></script> <!-- has jstree.min.js -->'
            +'</div>';
        if ($('.vdSettingsScripts').length<1) {
            $(t.el).prepend(html);
            var d = na.site.settings.dialogs['#siteToolbarDialogSettings'];
            //na.m.addJS (null, "/nicerapp/3rd-party/jQuery/spectrum/dist/spectrum.min.js?c="+na.m.changedDateTime_current(), null, function () { d.displaySettingsDialog_scriptLoaded(d); });
            //na.m.addJS (null, "/nicerapp/3rd-party/jsTree-3.2.1/dist/jstree.min.js?c="+na.m.changedDateTime_current(), null, function () { d.displaySettingsDialog_scriptLoaded(d); });
            //na.m.addJS (null, "/nicerapp/dialogSettings.js?c="+na.m.changedDateTime_current(), null, function () { d.displaySettingsDialog_scriptLoaded(d); });
            
        } else {
            t.settings.current.dialogID = t.el.id;
            t.displaySettingsDialog_displayDialog(t);
        }
    }
    
    displaySettingsDialog_scriptLoaded (t) {
        if (!t.scriptLoadedCount) t.scriptLoadedCount = 1; else t.scriptLoadedCount++;
        if (t.scriptLoadedCount==1) t.displaySettingsDialog_displayDialog(t);
    }
    
    displaySettingsDialog_displayDialog (t) {
        if (!na.desktop.settings.visibleDivs.includes('#siteToolbarDialogSettings')) na.desktop.settings.visibleDivs.push('#siteToolbarDialogSettings');
        na.desktop.resize(function(el) {
            if (el && el.id=='siteToolbarDialogSettings') na.dialogSettings.onload(t.settings.current.dialogID);
        });
    }
}
