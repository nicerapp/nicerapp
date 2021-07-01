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
        
        var html = 
            '<div class="vdSettings">'
                +'<img class="btnSettings" src="/nicerapp/siteMedia/btnPickColor.png" onclick="na.site.settings.activeDivs = [\'#siteToolbarDialogSettings\']; var d = na.site.settings.dialogs[\'#'+this.el.id+'\']; d.displaySettingsDialog(d, \''+t.el.id+'\')"/>'
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
                na.site.saveTheme();
            }, 1000);
            
            $(t.el).css ({ background : 'rgba(0,0,0,'+(t2.value/100)+')' });
        };
    };
    
    displaySettingsDialog (t, dialogID) {
        na.site.settings.dialogs['#siteToolbarDialogSettings'].settings.current.dialogID = dialogID;
        var html = 
            '<div class="vdSettingsScripts">'
            +'<link rel="stylesheet" href="/nicerapp/3rd-party/jsTree-3.2.1/dist/themes/default/style.css" onload="var d = na.site.settings.dialogs[\'#siteToolbarDialogSettings\']; d.displaySettingsDialog_scriptLoaded(d);"/> <!-- has style.min.css -->'
            //+'<script type="text/javascript" src="/nicerapp/3rd-party/jsTree-3.2.1/dist/jstree.min.js?c='+na.m.changedDateTime_current()+'" onload="var d = na.site.settings.dialogs[\'#siteToolbarDialogSettings\'];  d.displaySettingsDialog_scriptLoaded(d);"></script> <!-- has jstree.min.js -->'
            +'</div>';
        if ($('.vdSettingsScripts', t.el).length<1) {
            $(t.el).prepend(html);
            var d = na.site.settings.dialogs['#siteToolbarDialogSettings'];
            //na.m.addJS (null, "/nicerapp/3rd-party/jQuery/spectrum/dist/spectrum.min.js?c="+na.m.changedDateTime_current(), null, function () { d.displaySettingsDialog_scriptLoaded(d); });
            //na.m.addJS (null, "/nicerapp/3rd-party/jsTree-3.2.1/dist/jstree.min.js?c="+na.m.changedDateTime_current(), null, function () { d.displaySettingsDialog_scriptLoaded(d); });
            //na.m.addJS (null, "/nicerapp/dialogSettings.js?c="+na.m.changedDateTime_current(), null, function () { d.displaySettingsDialog_scriptLoaded(d); });
            
        }
    }
    
    displaySettingsDialog_scriptLoaded (t) {
        if (!t.scriptLoadedCount) t.scriptLoadedCount = 1; else t.scriptLoadedCount++;
        if (t.scriptLoadedCount==1) t.displaySettingsDialog_displayDialog(t);
    }
    
    displaySettingsDialog_displayDialog (t) {
        if (!na.desktop.settings.visibleDivs.includes('#siteToolbarDialogSettings')) na.desktop.settings.visibleDivs.push('#siteToolbarDialogSettings');
        na.desktop.resize(function(el) {
            //debugger;
            if (el && el.id=='siteToolbarDialogSettings') na.dialogSettings.onload(t.settings.current.dialogID);
        });
    }
}
