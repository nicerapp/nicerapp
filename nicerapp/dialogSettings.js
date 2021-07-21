na.ds = na.dialogSettings = {
    settings : { 
        current : { 
            firstRun : true, 
            forDialogID : 'siteContent',
            //selectedButtonID : 'btnSelectBackgroundColor', // OBSOLETED
            selectedSetting : 'backgroundColor'
        } 
    }, 
    onload : function (forDialogID) {
        var
        date = new Date(),
        timeInMilliseconds = date.getTime();
        
        na.m.settings.startTime = timeInMilliseconds;
        
        na.ds.s.c.forDialogID = forDialogID;
        $('#specificityForDiv').html ('For : #'+forDialogID);
        
        var ac = {
            type : 'GET',
            url : '/nicerapp/apps/nicer.app/cms/ajax_getTreeNodes.php',
            success : function (data, ts, xhr) {
                let dat = JSON.parse(data);
                na.ds.s.c.db = dat;
                if ($.jstree) $.jstree.defaults.core.error = function (a,b,c,d) {
                    //debugger;
                };
                $('#dialogSettings_jsTree').css({
                    height : $('#siteToolbarLeft .vividDialogContent').height() - $('#jsTree_navBar').height()
                }).jstree('destroy').jstree({
                    core : {
                        data : dat,
                        check_callback : true
                    },
                    types : {
                        "naSystemFolder" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naSystemFolder.png",
                            "valid_children" : []
                        },
                        "naUserRootFolder" : {
                            "max_depth" : 14,
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naUserRootFolder.png",
                            "valid_children" : ["naFolder", "naMediaAlbum", "naDocument"]
                        },
                        "naGroupRootFolder" : {
                            "max_depth" : 14,
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naGroupRootFolder.png",
                            "valid_children" : ["naFolder", "naMediaAlbum", "naDocument"]
                        },
                        "naFolder" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naFolder.png",
                            "valid_children" : ["naFolder", "naMediaFolder", "naDocument"]
                        },
                        "naDialog" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naSettings.png",
                            "valid_children" : []
                        },
                        "naSettings" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naSettings.png",
                            "valid_children" : []
                        },
                        "naTheme" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naVividThemes.png",
                            "valid_children" : []
                        },
                        "naVividThemes" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naVividThemes.png",
                            "valid_children" : []
                        },
                        "naMediaFolder" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naMediaAlbum.png",
                            "valid_children" : [ "naMediaFolder" ]
                        },
                        "naDocument" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naDocument.png",
                            "valid_children" : []
                        },
                        "saApp" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naApp.png",
                            "valid_children" : []
                        }
                    },
                    "plugins" : [
                        "contextmenu", "dnd", "search",
                        "state", "types", "wholerow"
                    ]
                }).on('changed.jstree', function (e, data) {
                    if (
                        rec
                        && na.blog
                        && na.ds.s.c.selectedTreeNode
                        && na.ds.s.c.selectedTreeNode.type=='naDocument'
                    ) na.blog.saveEditorContent(na.blog.settings.current.selectedTreeNode);
                    
                    for (var i=0; i<data.selected.length; i++) {
                        var 
                        d = data.selected[i], 
                        rec = data.instance.get_node(d),
                        btn = na.site.settings.buttons['#btnSelectBackgroundImage'];
                        
                        $('#documentTitle').val(rec.original.text);
                        na.ds.s.c.selectedTreeNode = rec;
                        if (rec.original.type=='naDocument') {
                            if (btn) btn.disable();
                        } else if (rec.original.type=='naMediaFolder') {
                            if (btn) btn.enable();
                            var
                            path = na.ds.currentPath(rec),
                            path = path.replace(/ /g, '%20'),
                            src = '/nicerapp/userInterface/photoAlbum/4.0.0/index.php?basePath='+path,
                            el = $('#dialogSettings_photoAlbum')[0];
                            el.onload = na.ds.onresize;
                            el.src = src;
                        } else {
                            if (btn) btn.disable();
                        }

                    };
                });
                
                $('#siteToolbarLeft .lds-facebook').fadeOut('slow');
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);

        var 
        div = $('#'+na.ds.s.c.forDialogID),
        bg = $('.vdBackground', $('#'+na.ds.s.c.forDialogID)[0]),
        rgbaRegEx = /rgba\(\d{1,3}\,\s*\d{1,3}\,\s*\d{1,3}\,\s*([\d.]+)\).*/,
        rgbRegEx = /rgb\(\d{1,3}\,\s*\d{1,3}\,\s*\d{1,3}\).*/,
        test1a = $(bg).css('background').match(rgbaRegEx),
        test1b = $(bg).css('backgroundColor').match(rgbaRegEx)
        test2a = $(div).css('border').match(rgbaRegEx),
        test2b = $(div).css('borderTopColor').match(rgbaRegEx),
        test2c = $(div).css('border').match(rgbRegEx),
        test2d = $(div).css('borderTopColor').match(rgbRegEx),
        c = test1a ? $(bg).css('background') : test1b ? $(bg).css('backgroundColor') : 'rgba(0,0,0,0.5)',
        c2 = (
            test2a 
            ? $(div).css('border')
            : test2b
                ? $(div).css('borderTopColor')
                : test2c
                    ? $(div).css('border')  
                    : test2d
                        ? $(div).css('borderTopColor')
                        : 'black'
        );
        na.ds.s.c.borderColor = c2;
        
        $('#siteToolbarDialogSettings').css({ display : 'flex', flexDirection : 'row', flexWrap : 'wrap' });
        
        var x = $('#colorpicker').css('display'), y = 'abc';
        //debugger;
        $('#colorpicker').css({display:'block'}).spectrum ({
            color:c, 
            type:'flat',
            showPalette : false,
            clickoutFiresChange : false, 
            change : function (color) {
                //debugger;
                if (typeof color=='object') color = 'rgba('+color._r+', '+color._g+', '+color._b+', '+color._a+')';
                var bg = $('.vdBackground', $('#'+na.ds.s.c.forDialogID)[0]);
                $(bg).css({ background : color, opacity : 1 });
                na.site.saveTheme();                        
            }});
        //if (na.ds.s.c.selectedButtonID!=='btnSelectBackgroundColor') $('#colorpicker').next().css({display:x});
        var x = $('#borderColorpicker').css('display');
        $('#borderColorpicker').css({display:'block'}).spectrum ({
            color:c2, 
            type: "flat", 
            showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.borderSettingsSelected
        });
        //if (na.ds.s.c.selectedButtonID!=='btnSelectBorderSettings') $('#borderColorpicker').next().css({display:x});
        
        //if ($(window).width() < na.site.globals.reallySmallDeviceWidth) $('.sp-container').css({width:$(window).width()-35});
        //$('.sp-container').addClass('dialogSettingsComponent').css({position:'absolute'});

        na.ds.s.c.boxShadowColor = c2;
        
        var 
        div = $('#'+na.ds.s.c.forDialogID),
        rgbaRegEx = /(rgba\(\d{1,3}\,\s*\d{1,3}\,\s*\d{1,3}\,\s*([\d.]+))\).*/,
        rgbRegEx = /(rgb\(\d{1,3}\,\s*\d{1,3}\,\s*\d{1,3})\).*/,
        test1 = $(div).css('boxShadow').match (rgbaRegEx),
        test2 = $(div).css('boxShadow').match (rgbRegEx);
        if (test1) {
            var textShadowColor = test1[1];
        } else if (test2) {
            var textShadowColor = test2[1];
        } else {
            var textShadowColor = 'black';
        };
        na.ds.s.c.textShadowColor = textShadowColor;
        
        var
        p1 = $(div).find('td').css('color'),
        p2 = $(div).css('color');
        if (p1) {
            var textColor = p1
        } else if (p2) {
            var textColor = p2;
        } else {
            var textColor = 'white';
        };
        na.ds.s.c.textColor = textColor;
        if (!na.ds.s.c.selectedTextShadow) {
            na.ds.s.c.selectedTextShadow = $('#textShadow_0')[0];
            $('#textShadow_0').css({ textShadow : $(div).css('textShadow') });
        }
        if (!na.ds.s.c.boxSettings) na.ds.s.c.boxSettings = $('#boxShadow_0')[0];
        setTimeout (function() {
            var x = $('#'+forDialogID+' .vdBackground').css('background');
            //na.m.log (300, 'x='+x);
            $('.mediaThumb', $('#dialogSettings_photoAlbum')[0].contentWindow.document).each(function(idx,el) {
                //na.m.log (300, 'el.src='+el.src.replace('thumbs/', ''));
                if (x && x.indexOf(el.src.replace('thumbs/', ''))!==-1) {
                    var scale = $('#'+forDialogID+' .vdBackground').css('backgroundSize').match(/\d+/);
                    if (scale) na.ds.s.c.scale = scale[0];
                    na.ds.s.c.selectedImage = el;
                    na.m.log (300, 'na.ds.s.c.selectedImage = '+el.src);
                }
            });
        }, 750);
        

        var s = JSON.parse( $('#specificity').find('option:selected')[0].value );
        na.ds.s.c.specificity = s;
        if (!s.role && !s.user) {
            na.site.settings.buttons['#btnDeleteSpecificity'].disable();
        } else {
            na.site.settings.buttons['#btnDeleteSpecificity'].enable();
        }
        
        $('#btnViewResult .cvbBorderCSS').css({ boxShadow : '0px 0px 0px 0px rgba(0,0,0,0)' });
        
        $('.vividButton, .vividButton_icon', $('#siteToolbarDialogSettings')[0]).each(function(idx,el){
            na.site.settings.buttons['#'+el.id] = new naVividButton(el);
        });

        var tabPage = na.ds.s.c.selectedSetting;
        na.ds.whichSettingSelected(tabPage);
        
        setTimeout (na.ds.onresize, 100);
    },
    
    onresize : function () { 
        var 
        t = this,
        display = $('#dialogSettings_photoAlbum').css('display'),
        doc = $('#dialogSettings_photoAlbum')[0].contentWindow.document;
        $('.vividScrollpane div', doc).css({width:110,height:130});
        $('.vividScrollpane div img', doc).css({width:100,height:100}).each(function(idx,el){
            el.onclick = function () { na.ds.imageSelected(el); };
        });
        /*$('#dialogSettings_photoOpacity')[0].oninput = function () {
            if (na.ds.s.c.selectedImage) na.ds.imageSelected(na.ds.s.c.selectedImage);
        };
        $('#dialogSettings_photoScale')[0].oninput = function () {
            na.ds.s.c.scale = parseInt($('#dialogSettings_photoScale').val());
            if (na.ds.s.c.selectedImage) na.ds.imageSelected(na.ds.s.c.selectedImage);
        };*/
        $('#dialogSettings_photoAlbum').css({
            display : 'block',
            width : $('#siteToolbarDialogSettings .vividDialogContent').width(),
            height : 
                $('#siteToolbarDialogSettings .vividDialogContent').height() 
                - $('#dialogSettings_photoAlbum').offset().top
                - $('.navbar').height()
                - $('#specificitySettings').height()
                - 70
        }).css({display:display});

        /*
        var 
        w = $('#siteToolbarDialogSettings').width(),
        h = $('#siteToolbarDialogSettings').height(),
        h1 = $('#specificitySettings').position().top,
        h2 = $('#specificitySettings').height();
        $('#siteToolbarDialogSettings .vividScrollpane').css({
            width : w - 15,
            height : h - 20
        });*/
        
        $('.dialogSettings_colorPicker').next().css ({ width : 230 });
        $('#siteToolbarDialogSettings label', t.el).css ({ float : 'left' });
    },
    
    onclick : function (el, fireSaveTheme) {
        if (!el) return false;
        na.ds.s.c.fireSaveTheme = fireSaveTheme === null ? true : false;
        if (na.ds.s.c.selectedButtonID) {
            var b = na.site.settings.buttons['#'+na.ds.s.c.selectedButtonID];
            if (b) b.deselect();
        }
        
        var b = na.site.settings.buttons['#'+el.id];
        if (b) {
            na.ds.s.c.selectedButtonID = el.id;
            b.select();
            $('#'+el.id).click(event);
        }
    },
    
    whichSettingSelected : function (event) {
        if (typeof event=='object') whichSetting = $(event.currentTarget).val(); else whichSetting = event;
        switch (whichSetting) {
            case 'border' : na.dialogSettings.selectBorderSettings(event); break;
            case 'boxShadow' : na.dialogSettings.selectBoxShadowSettings(event); break;
            case 'backgroundColor' : na.dialogSettings.selectBackground_color(event); break;
            case 'backgroundFolder' : na.dialogSettings.selectBackground_folder(event); break;
            case 'backgroundImage' : na.dialogSettings.selectBackground_image(event); break;
            case 'text' : na.dialogSettings.selectTextSettings(event); break;
            case 'textShadow' : na.dialogSettings.selectTextShadowSettings(event); break;
            //case 'scrollbars' : break;
        };
    },
    
    currentPath : function (node) {
        var me = na.ds, s = me.settings, c = s.current;
        
        var
        path = [ ],
        n = node;
        while (n.parent!=='#') {
            path[path.length] = n.text;
            var n2 = n;
            for (var idx in c.db) {
                var st = c.db[idx];
                if (st.id && st.id == n.parent) {
                    n = st;
                    break;
                }
            }
            if (n2 === n) {
                console.log ('ERROR : na.tree.currentPath(iid, ) : n2===n');
                debugger;
                break;
            }
        };
        path[path.length] = n.text;
        path = path.reverse().join('/');
        return path;//.replace('Users/','');
        //return path; // only paths being used right now already include the username in that path (from the tree node under 'Users')
    },
    
    specificitySelected : function (event) {
        var s = JSON.parse( $(event.currentTarget).find('option:selected')[0].value );
        na.ds.s.c.specificity = s;
        if (!s.role && !s.user) {
            na.site.settings.buttons['#btnDeleteSpecificity'].disable();
        } else {
            na.site.settings.buttons['#btnDeleteSpecificity'].enable();
        }
        
        na.site.loadTheme (function () { // **POSSIBLY** NOT NEEDED
            var btn = $('#'+na.ds.s.c.selectedButtonID)[0];
            if (btn) na.ds.onclick(btn, false);
        });
    },
    deleteSpecificity : function (event, callback) {
        var
        s = na.ds.s.c.specificity,
        themeData = {
            username : na.account.settings.username,
            pw : na.account.settings.password
        };
        
        if (s.url) themeData.url = s.url;
        if (s.role) themeData.role = s.role;
        if (s.user) themeData.user = s.user;

        var
        ac2 = {
            type : 'POST',
            url : '/nicerapp/ajax_delete_vividDialog_settings.php',
            data : themeData,
            success : function (data, ts, xhr) {
                var 
                state = History.getState(),
                url = state.url.replace(document.location.origin,'').replace('/apps/', ''),
                url2 = url.replace(document.location.origin,'').replace(document.location.host,'').replace('/apps/', '');
                
                var ac2 = {
                    type : 'GET',
                    url : '/nicerapp/ajax_get_pageSpecificSettings.php',
                    data : {
                        apps : url2
                    },
                    success : function (data, ts, xhr) {
                        $('#cssPageSpecific, #jsPageSpecific').remove();
                        $('head').append(data);
                        setTimeout(function () {
                            na.site.loadTheme (function () {
                                var 
                                btn = $('#'+na.ds.s.c.selectedButtonID)[0],
                                evt = { currentTarget : $('#specificity')[0] };
                                
                                na.ds.specificitySelected(evt);
                                //na.ds.onclick(btn, false);
                                var tabPage = na.ds.s.c.selectedSetting;
                                na.ds.whichSettingSelected(tabPage);
                                
                                if (typeof callback=='function') callback (themeData, data);
                            }); 
                        }, 250);
                    },
                    failure : function (xhr, ajaxOptions, thrownError) {
                    }
                };
                //setTimeout (function() { 
                    $.ajax(ac2);
                //}, 250);
                
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac2);
    },
    
    selectBorderSettings : function (event) {
        //var ct = $('#btnSelectBorderSettings')[0];
        //na.ds.onclick(ct);
        na.ds.s.c.selectedSetting = 'border';
        $('.dialogSettings_colorPicker').next().css ({ width : 230 });
        var w1 = $('#siteToolbarDialogSettings .vividDialogContent').width() - 25;
        $('.dialogSettingsComponent').css({ width : w1 });
        //$('#borderSettings').children().css({ width : w1 });
        $('.dialogSettingsComponent').not('#borderSettings').fadeOut('fast');
        $('.dialogSettings_colorPicker').next().fadeOut('fast');
        $('#borderSettings').fadeIn('fast', 'swing', function () {
            $('#borderSettings, .boxSettingsLabel, #borderSettings > *').not('#boxShadowControls, #borderColorpicker, .sp-container').css({display:'block'});
            $('#boxShadow').css({width:$('#borderSettings').width() - $('#labelBoxShadow').width() - 20 });
            $('.boxShadow').css({
                background : $('#'+na.ds.s.c.forDialogID+' .vdBackground').css('background'),
                border:$('#borderWidth').val()+'px '+$('#borderType').val()+' '+$('#borderColorpicker').val(),
                borderRadius:parseInt($('#borderRadius').val())
            });
            var w3 = 'calc(100% - 108px)';
            $('#borderType').css({ width : w3 });
            $('#borderWidth').css({ width : w3 });
            $('#borderRadius').css({ width : w3 });
        });
        $('#borderColorpicker').spectrum ({color:na.ds.s.c.borderColor, type: "flat", showPalette : false, clickoutFiresChange : false, change : na.ds.borderSettingsSelected});
        var evt2 = { currentTarget : $('#'+na.ds.s.c.forDialogID)[0] };
        na.ds.boxSettingsSelected (evt2, false); //event.currentTarget === ct
    },
    borderSettingsSelected : function (color) {
        if (color) na.ds.s.c.borderColor = color; else color = na.ds.s.c.borderColor;
        if (typeof color=='object') color = 'rgba('+color._r+', '+color._g+', '+color._b+', '+color._a+')'; // firefox bugfix
        var 
        bg = $('#'+na.ds.s.c.forDialogID),
        newBorder = $('#borderWidth').val() + 'px ' + $('#borderType').val() + ' ' + color,
        newBorderRadius = parseInt($('#borderRadius').val());
        
        $(bg).css({ border : newBorder, borderRadius : newBorderRadius });
        $('#'+na.ds.s.c.forDialogID+' .vdBackground').css({borderRadius : newBorderRadius});
        $('.boxShadow').css({ border : newBorder, borderRadius : newBorderRadius });
        /*if (na.ds.s.c.fireSaveTheme) */na.site.saveTheme();
    },
    
    selectBoxShadowSettings : function (event) {
        //var ct = $('#btnSelectBorderSettings')[0];
        //na.ds.onclick(ct);
        na.ds.s.c.selectedSetting = 'boxShadow';
        $('.dialogSettings_colorPicker').next().css ({ width : 230 });
        var w1 = $('#siteToolbarDialogSettings .vividDialogContent').width() - 25;
        $('.dialogSettingsComponent').css({ width : w1 });
        //$('#boxShadowSettings').children().css({ width : w1 });
        $('.dialogSettingsComponent').css({ width : w1 });
        $('.dialogSettingsComponent').not('#boxShadowSettings').fadeOut('fast');
        $('.dialogSettings_colorPicker').next().fadeOut('fast');
        $('#boxShadowSettings').fadeIn('fast', 'swing', function () {
            var
            div = $('#'+na.ds.s.c.forDialogID),
            bg = $('#'+na.ds.s.c.forDialogID+' .vdBackground'),
            bg1 = $(bg).css('background').replace(/"/g, '\''),
            bs = $(div).css('boxShadow').split(', rgb');
            opacity = bg1.indexOf('url(')!==-1 ? bg.css('opacity') : 1,
            border = $('#borderWidth').val()+'px solid '+na.ds.s.c.borderColor,
            br = parseInt($('#borderRadius').val());
            
            for (var i=1; i<bs.length; i++) { 
                bs[i] = 'rgb'+bs[i]; 
            };
            $('.boxShadow').remove();
            for (let i=0; i<bs.length; i++) {
                var html = '<div id="boxShadow_'+i+'" class="boxShadow" onclick="na.ds.boxSettingsSelected(event)" style="height:1.5em;margin:5px;padding:5px;position:relative;"><div id="boxShadow_'+i+'_bg" style="border:'+border+';background:'+bg1+';opacity:'+opacity+';border-radius:'+br+'px;box-shadow:'+bs[i]+';position:absolute;"></div><span class="boxShadow_bg" style="position:absolute;height:1em;top:0.5em;vertical-align:middle;text-align:center;display:table-cell;">ABC XYZ</span></div>';
                
                $('#boxShadowControls').append(html);
                
                setTimeout (function () { 
                    $('#boxShadow_'+i+'_bg, #boxShadow_'+i+' span').css({ 
                        width : $('#boxShadow_'+i).width(),
                        height : $('#boxShadow_'+i).height()
                    });
                }, 200);
            };
            
            
            $('#boxShadowSettings, .boxSettingsLabel, #boxShadowSettings > *').not('#boxShadowControls, #boxShadowColorpicker, .sp-container').css({display:'block'});
            $('#boxShadow').css({width:$('#borderSettings').width() - $('#labelBoxShadow').width() - 20 });
            var w3 = 'calc(100% - 108px)';
            $('#boxShadowInsetClear').css({ width : w3 });
            $('#boxShadowXoffset').css({ width : w3 });
            $('#boxShadowYoffset').css({ width : w3 });
            $('#boxShadowSpreadRadius').css({ width : w3 });
            $('#boxShadowBlurRadius').css({ width : w3 });
        });
        $('#boxShadowColorpicker').spectrum ({
            color:na.ds.s.c.boxShadowColor, 
            type: "flat", 
            showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.boxSettingsChanged_shadowColor
        });
        var evt2 = { currentTarget : $('#'+na.ds.s.c.forDialogID)[0] };
        na.ds.boxSettingsSelected (evt2, false); //event.currentTarget === ct
    },
    boxSettingsSelected : function (event, saveTheme) {
        if (event.currentTarget.id!==na.ds.s.c.forDialogID) na.ds.s.c.boxSettings = event.currentTarget;
        if (saveTheme!==false) saveTheme = true;
        
        var 
        bs = $(event.currentTarget).css('boxShadow'),
        b = $(event.currentTarget).css('border');
        
        if (!b) b = $(event.currentTarget).css('borderTopWidth')+' '+$(event.currentTarget).css('borderTopStyle')+' '+$(event.currentTarget).css('borderTopColor');
        
        if (bs == 'none') {
            var
            sliders = [ 2, 2, 4, 2 ];
            $('#boxShadowColorpicker').spectrum('set', 'rgba(0,0,0,0.7)');
            $('#boxShadowInset')[0].checked = false;
            na.ds.s.c.borderColor = $('#borderColorpicker').val();
        } else {
            if (bs.match('inset')) $('#boxShadowInset')[0].checked = true; else $('#boxShadowInset')[0].checked = false;

            // NOTE (for beginners) : re1a through re2b are regular expressions. you can test your regexs at https://regex101.com/
            var 
            re1a = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d\.]+)\)\s+(\d+px)\s+(\d+px)\s+(\d+px)\s+(\d+px)\s*(\w+)*,?.*$/,
            re1b = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)\s+(\d+px)\s+(\d+px)\s+(\d+px)\s*(\w+)?,?.*$/,
            re2a = /^(\d+)px\s*(\w+)\s*rgb\((\d+),\s*(\d+),\s+(\d+),\s+(\d+)\)$/,
            re2b = /^(\d+)px\s*(\w+)\s*rgb\((\d+),\s*(\d+),\s+(\d+)\)$/,
            m1 = bs.match(re1a) ? bs.match(re1a) : bs.match(re1b),
            m2a = b.match(re2a),
            m2b = b.match(re2b),
            sliders = [ 
                parseInt(m1[5].replace('px','')),
                parseInt(m1[6].replace('px','')),
                parseInt(m1[7].replace('px','')),
                parseInt(m1[8].replace('px',''))
            ],
            boxShadowColor = 
                bs.match(re1a) 
                ? 'rgba('+m1[1]+', '+m1[2]+', '+m1[3]+', '+m1[4]+')'
                : 'rgb('+m1[1]+', '+m1[2]+', '+m1[3]+')',
            borderColor =
                b.match(re2a)
                ? 'rgba('+m2a[3]+', '+m2a[4]+', '+m2a[5]+', '+m2a[6]+')'
                : b.match(re2b)
                    ? 'rgb('+m2b[4]+', '+m2b[4]+', '+m2b[5]+')'
                    : 'lime';
                
            $('#boxShadowColorpicker').spectrum('set', boxShadowColor);
            na.ds.s.c.borderColor = borderColor;
            na.ds.s.c.boxShadowColor = boxShadowColor;
            
            if (saveTheme) na.ds.boxSettingsChanged (boxShadowColor);
        };
        
        $('#boxShadowXoffset').val(sliders[0]);
        $('#boxShadowYoffset').val(sliders[1]);
        $('#boxShadowSpreadRadius').val(sliders[2]);
        $('#boxShadowBlurRadius').val(sliders[3]);
        
        var
        b = $(event.currentTarget).css('border'),
        br = $(event.currentTarget).css('borderRadius');
        if (!b) b = $(event.currentTarget).css('borderTopWidth')+' '+$(event.currentTarget).css('borderTopStyle')+' '+$(event.currentTarget).css('borderTopColor');
        
        if (b!=='') {
            var bw = b.match(/^\d+/)[0];
            $('#borderWidth').val(parseInt(bw));
        }
        if (br!=='') {
            $('#borderRadius').val(parseInt(br));
        }
    },
    boxSettingsChanged : function (color) {
        if (color) $(na.ds.s.c.boxSettings)[0].boxShadowColor = color; 
        else {
            color = $('#'+na.ds.s.c.boxSettings.id+' div').css('boxShadow');
            if (color && color.match('#')) color = color.match(/#.*\s/)[0];
            if (color && color.match('rgba')) color = color.match(/rgba\(.*\)/)[0];
            else if (color && color.match('rgb')) color = color.match(/rgb\(.*\)/)[0];
        };
        if (typeof color=='object') color = 'rgba('+color._r+', '+color._g+', '+color._b+', '+color._a+')'; 
        na.ds.s.c.boxShadowColor = color;
        
        var
        newBoxSetting = 
            ( $('#boxShadowInset')[0].checked ? 'inset ' : '' )
            + $('#boxShadowXoffset').val() + 'px '
            + $('#boxShadowYoffset').val() + 'px '
            + $('#boxShadowSpreadRadius').val() + 'px '
            + $('#boxShadowBlurRadius').val() + 'px '
            + color;
        $('#'+na.ds.s.c.boxSettings.id+' div').css ({ boxShadow : newBoxSetting });
        
        newBoxSetting = '';
        $('.boxShadow').each(function(idx,el) {
            if (newBoxSetting!=='') newBoxSetting += ', ';
            newBoxSetting += $('#'+el.id+' div').css('boxShadow');
        });
        $('#'+na.ds.s.c.forDialogID).css ({ boxShadow : newBoxSetting });
        /*if (na.ds.s.c.fireSaveTheme) */na.site.saveTheme();
        
    },
    boxSettingsChanged_shadowColor : function (color) {
        na.ds.boxSettingsChanged(color);
    },
    addBoxShadow : function () {
        var last = 0;
        $('.boxShadow').each(function(idx,el) {
            var idx2 = parseInt(el.id.replace('boxShadow_',''));
            if (idx2 > last) last = idx2;
        });

        var
        div = $('#'+na.ds.s.c.forDialogID),
        bg =  $('#'+na.ds.s.c.forDialogID+' .vdBackground'),
        bg1 = bg.css('background').replace(/\'/g, '\\\'').replace(/"/g, '\''),
        opacity = bg1.indexOf('url(')!==-1 ? bg.css('opacity') : 1,
        border = div.css('border'),
        borderRadius = bg.css('borderRadius'),
        i = last + 1,
        html = '<div id="boxShadow_'+i+'" class="boxShadow" onclick="na.ds.boxSettingsSelected(event)" style="height:1.5em;margin:5px;padding:5px;position:relative;"><div id="boxShadow_'+i+'_bg" style="border:'+border+';background:'+bg1+';opacity:'+opacity+';border-radius:'+br+'px;position:absolute;"></div><span class="boxShadow_label" style="position:absolute;height:1em;top:0.5em;vertical-align:middle;text-align:center;display:table-cell;">ABC XYZ</span></div>';
        
        $('#boxShadowControls').append(html);
        setTimeout (function () { 
            $('#boxShadow_'+i+'_bg, #boxShadow_'+i+' span').css({ 
                width : $('#boxShadow_'+i).width(),
                height : $('#boxShadow_'+i).height()
            });
        }, 200);
        
        na.ds.s.c.boxSettings = $('#boxShadow_'+(last+1))[0];
        $('#boxShadowXoffset').val(2);
        $('#boxShadowYoffset').val(2);
        $('#boxShadowSpreadRadius').val(2);
        $('#boxShadowBlurRadius').val(2);
    },
    deleteBoxShadow : function(evt) {
        if ( na.ds.s.c.boxSettings !== $('#boxShadow_0')[0] ) {
            $(na.ds.s.c.boxSettings).remove();
            na.ds.s.c.boxSettings = $('#boxShadow_0')[0];
        } else {
            $('#boxShadowXoffset').val(0);
            $('#boxShadowYoffset').val(0);
            $('#boxShadowSpreadRadius').val(0);
            $('#boxShadowBlurRadius').val(0);
        };
        na.ds.boxSettingsChanged();
    },
    
    selectBackground_color : function (event) {
        na.ds.onclick($('#btnSelectBackgroundColor')[0]);
        na.ds.s.c.selectedSetting = 'backgroundColor';
        $('.dialogSettingsComponent').not('.sp-container').fadeOut('fast');
        $('.dialogSettings_colorPicker').next().css ({ width : 230 });
        $('.sp-container').fadeIn('fast').css({top:8,opacity:1});
    },

    selectBackground_folder : function (event) {
        na.ds.onclick($('#btnSelectBackgroundFolder')[0]);
        na.ds.s.c.selectedSetting = 'backgroundFolder';
        $('.dialogSettingsComponent').not('#dialogSettings_jsTree').fadeOut('fast');
        $('.dialogSettings_colorPicker').next().fadeOut('fast');
        $('#dialogSettings_jsTree').fadeIn('fast');
    },
    
    selectBackground_image : function (event) {
        na.ds.onclick($('#btnSelectBackgroundImage')[0]);
        na.ds.s.c.selectedSetting = 'backgroundImage';

        $('.dialogSettingsComponent').not('#dialogSettings_photoAlbum, #dialogSettings_photoAlbum_specs').fadeOut('fast');
        setTimeout (function () {
            $('.dialogSettings_colorPicker').next().fadeOut('fast');
            $('#dialogSettings_photoAlbum, #dialogSettings_photoOpacity, #dialogSettings_photoAlbum_specs').fadeIn('fast');
            setTimeout(function() {
                $('#dialogSettings_photoAlbum_specs').css({
                    display : 'flex',
                    flexWrap : 'wrap',
                    boxSizing: 'border-box',
                    width : '97%'
                });
                //$('.labelDialogSettings').css ({ width : 170, flexShrink : 0, flexGrow : 0 });
                
                $('#label_dialogSettings_photoOpacity').css ({ top : 4, position : 'absolute' });
                $('#dialogSettings_photoOpacity').css({
                    display : 'block',
                    width : $('#siteToolbarDialogSettings').width() - 180,
                    left : 150
                });

                $('#label_dialogSettings_photoScale').css ({ top : 37, position : 'absolute' });
                $('#dialogSettings_photoScale').css({
                    display : 'block',
                    width:$('#siteToolbarDialogSettings').width() - 180,
                    left : 150
                }).val(na.ds.s.c.scale).fadeIn('fast');
            }, 100);
        }, 100);
            
    },
    
    opacityChange : function (evt) {
        var 
        bg = $(evt.currentTarget).parents('.vividDialog')[0],
        rgbaRegEx = /rgba\((\d{1,3})\,\s*(\d{1,3})\,\s*(\d{1,3})\,\s*([\d.]+)\)(.*)/,
        rgbRegEx = /rgb\((\d{1,3})\,\s*(\d{1,3})\,\s*(\d{1,3})\)(.*)/,
        opacity = $(evt.currentTarget).val()/100;
        
        if (bg && $(bg).children('.vdBackground')[0]) bg = $(bg).children('.vdBackground');
        
        var bg1 = $(bg).css('background');        
        
        if (typeof bg1=='string' && bg1!=='' && !bg1.match('url')) {
            var bg2 = '', bg2a = bg1.match(rgbaRegEx), bg2b = bg1.match(rgbRegEx);
            if (bg2a) {
                $(bg).add('.boxShadow_bg, .textShadow_bg').css({ background : 'rgba('+bg2a[1]+', '+bg2a[2]+', '+bg2a[3]+', '+opacity+')'+bg2a[5] });
            } else {
                $(bg).add('.boxShadow_bg, .textShadow_bg').css({ background : 'rgba('+bg2b[1]+', '+bg2b[2]+', '+bg2b[3]+', '+opacity+')'+bg2b[4] });
            }
        } else { 
            $(bg).add('.boxShadow_bg, .textShadow_bg').css({ opacity : opacity });
        }
        /*if (na.ds.s.c.fireSaveTheme) */na.site.saveTheme();
    },
    
    imageSelected : function (el) {
        na.ds.s.c.selectedImage = el;
        var 
        bg = $('.vdBackground', $('#'+na.ds.s.c.forDialogID)[0]),
        src = el.src.replace('thumbs/','');

        if ($('#dialogSettings_photoSpecificity_dialog')[0].checked) {
            $(bg).css({ 
                background : 'url("'+src+'") repeat', 
                opacity : parseInt($('#dialogSettings_photoOpacity').val())/100, 
                backgroundSize : na.ds.s.c.scale+'% '+na.ds.s.c.scale+'%' 
            });
        } else {
            na.backgrounds.next ('#siteBackground', na.site.globals.backgroundSearchKey, src);
        }
        /*if (na.ds.s.c.fireSaveTheme) */na.site.saveTheme();
    },
    
    selectTextSettings : function (updateTextSettingsControls) {
        na.ds.onclick($('#btnSelectTextSettings')[0]);
        na.ds.s.c.selectedSetting = 'text';
        $('.dialogSettingsComponent').not('#textSettings').fadeOut('fast');
        $('.dialogSettings_colorPicker').next().css ({ width : 230 }).fadeOut('fast');;
        $('#textSettings').fadeIn('fast', 'swing', na.ds.updateTextSettingsControls);
        
        $('#textColorpicker').spectrum ({
            color:na.ds.s.c.textColor, 
            type: "flat", 
            showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.textSettingsSelected_textColor
        });
        $('#textShadowColorpicker').spectrum ({
            color:na.ds.s.c.textShadowColor, 
            type: "flat", 
            showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.textSettingsSelected_textShadowColor
        });
    },
    
    selectTextShadowSettings : function (updateTextSettingsControls) {
        //na.ds.onclick($('#btnSelectTextSettings')[0]);
        na.ds.s.c.selectedSetting = 'textShadow';
        $('.dialogSettingsComponent').not('#textSettings').fadeOut('fast');
        $('.dialogSettings_colorPicker').next().fadeOut('fast');
        $('#textShadowSettings').fadeIn('fast', 'swing', na.ds.updateTextSettingsControls);
        
        var
        div = $('#'+na.ds.s.c.forDialogID),
        bg =  $('#'+na.ds.s.c.forDialogID+' .vdBackground'),
        bg1 = bg.css('background').replace(/\'/g, '\\\'').replace(/"/g, '\''),
        opacity = bg1.indexOf('url(') !== -1 ? bg.css('opacity') : 1,
        border = div.css('border'),
        br = bg.css('borderRadius'),
        ts = $(div).css('textShadow').split(', rgb');
        $('.textShadow').remove();
        for (var i=1; i<ts.length; i++) { 
            ts[i] = 'rgb'+ts[i]; 
        };
        for (let i=0; i<ts.length; i++) {
            var
            j = i,
            fw = div.css('fontWeight'),
            font = div.css('fontFamily').replace(/"/g, '\''),
            html = '<div id="textShadow_'+j+'" class="textShadow" onclick="na.ds.boxSettingsSelected(event)" style="height:1.5em;margin:5px;padding:5px;position:relative;"><div id="textShadow_'+j+'_bg" class="textShadow_bg" style="border:'+border+';background:'+bg1+';opacity:'+opacity+';border-radius:'+br+';position:absolute;"></div><span style="font-weight:'+fw+';font-family:'+font+';position:absolute;height:1em;top:0.5em;vertical-align:middle;text-align:center;display:table-cell;text-shadow:'+ts[i]+'">abc XYZ</span></div>';
            
            $('#textShadowControls').append(html);

            setTimeout (function () { 
                $('#textShadow_'+j+'_bg, #textShadow_'+j+' span').css({ 
                    width : $('#textShadow_'+j).width(),
                    height : $('#textShadow_'+j).height()
                });
            }, 200);
        };
        
        $('#textColorpicker').spectrum ({
            color:na.ds.s.c.textColor, 
            type: "flat", showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.textSettingsSelected_textColor
        });
        $('#textShadowColorpicker').spectrum ({
            color:na.ds.s.c.textShadowColor, 
            type: "flat", showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.textSettingsSelected_textShadowColor
        });
    },
    
    updateTextSettingsControls : function (evt) {
        var
        el = $('#'+na.ds.s.c.forDialogID),
        el2 = $('#'+na.ds.s.c.forDialogID+' .vividDialogContent'),
        el3 = $('#'+na.ds.s.c.forDialogID+' td'),
        ts = $(el).css('textShadow').split(', rgb');
        for (var i=1; i<ts.length; i++) {
            ts[i] = 'rgb'+ts[i];
        };
        var        
        selID = parseInt($(na.ds.s.c.selectedTextShadow)[0].id.match(/\d+$/)[0]),
        el_ts = $(el).css('fontSize'),
        el2_ts = $(el2).css('fontSize'),
        el3_ts = $(el3).css('fontSize'),
        el_fw = $(el).css('fontWeight'),
        el2_fw = $(el2).css('fontWeight'),
        el3_fw = $(el3).css('fontWeight'),
        re1a = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d\.]+)\)\s+(\-?\d+px)\s+(\-?\d+px)\s+(\-?\d+px)$/,
        re1b = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)\s+(\-?\d+px)\s+(\-?\d+px)\s+(\-?\d+px)$/,
        re2a = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d\.]+)\)$/,
        re2b = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
        test1a = ts[selID] ? ts[selID].match(re1a) : null,
        test1b = ts[selID] ? ts[selID].match(re1b) : null,
        test2a = $(el).css('color').match(re2a),
        test2b = $(el).css('color').match(re2b),
        newTextShadowColor = 
            test1a 
            ? 'rgba('+test1a[1]+', '+test1a[2]+', '+test1a[3]+', '+test1a[4]+')'
            : test1b
                ? 'rgb('+test1b[1]+', '+test1b[2]+', '+test1b[3]+')'
                : 'black',
        newTextColor = test2a ? test2a[0] : test2b ? test2b[0] : 'white',
        newFontFamily = 
            el3[0]
            ? $(el3).css('fontFamily')
            : el2[0]
                ? $(el2).css('fontFamily')
                : el[0]
                    ? $(el).css('fontFamily')
                    : 'ABeeZee',
        newFontFamily = newFontFamily.split(', ')[0].replace(/"/g,'');

        na.ds.s.c.fontFamily = newFontFamily;
        na.ds.s.c.textColor = newTextColor;
        na.ds.s.c.textShadowColor = newTextShadowColor;
        
        $('#textColorpicker').spectrum ({
            color:na.ds.s.c.textColor, 
            type: "flat", showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.textSettingsSelected_textColor
        });
        $('#textShadowColorpicker').spectrum ({
            color:na.ds.s.c.textShadowColor, 
            type: "flat", showPalette : false, 
            clickoutFiresChange : false, 
            change : na.ds.textSettingsSelected_textShadowColor
        });
        $('#textFontFamily')
            .css({width:$('#textSettings').width() - $('#labelTextFontFamily').width() - 20 })
            .val(newFontFamily);
        $('#textSize')
            .css({width:$('#textSettings').width() - $('#labelTextSize').width() - 20 })
            .val(typeof el3_ts == 'string' && el3_ts!=='' 
                    ? parseInt(el3_ts.replace('px','')) 
                    : typeof el2_ts == 'string' && el2_ts!==''
                        ? parseInt(el2_ts.replace('px',''))
                        : typeof el_ts == 'string' && el_ts!==''
                            ? parseInt(el_ts.replace('px'))
                            : 12
                );
        $('#textWeight')
            .css({width:$('#textSettings').width() - $('#labelTextWeight').width() - 20 })
            .val(el3_fw!=='' ? el3_fw : el2_fw!=='' ? el2_fw : el_fw!=='' ? el_fw : 500);
        $('#textShadowXoffset')
            .css({width:$('#textSettings').width() - $('#labelTextShadowXoffset').width() - 40 })
            .val(test1a ? parseInt(test1a[5].replace('px','')) : test1b ? parseInt(test1b[4].replace('px','')) : 2);
        $('#textShadowYoffset')
            .css({width:$('#textSettings').width() - $('#labelTextShadowYoffset').width() - 40 })
            .val(test1a ? parseInt(test1a[6].replace('px','')) : test1b ? parseInt(test1b[5].replace('px','')) : 2);
        $('#textShadowBlurRadius')
            .css({width:$('#textSettings').width() - $('#labelTextShadowBlurRadius').width() - 40 })
            .val(test1a ? parseInt(test1a[7].replace('px','')) : test1b ? parseInt(test1b[6].replace('px','')) : 4);
    },
    addTextShadow : function (evt) {
        var last = 0;
        $('.textShadow').each(function(idx,el) {
            var idx2 = parseInt(el.id.replace('textShadow_',''));
            if (idx2 > last) last = idx2;
        });
        
        var
        div = $('#'+na.ds.s.c.forDialogID),
        bg =  $('#'+na.ds.s.c.forDialogID+' .vdBackground'),
        bg1 = bg.css('background').replace(/\'/g, '\\\'').replace(/"/g, '\''),
        opacity = bg1.match('url(') ? bg.css('opacity') : 1,
        border = div.css('border'),
        br = bg.css('borderRadius'),
        fw = div.css('fontWeight'),
        font = div.css('fontFamily'),
        j = last === 0 ? 0 : last + 1;
        var
        html = '<div id="textShadow_'+j+'" class="textShadow" onclick="na.ds.boxSettingsSelected(event)" style="height:1.5em;margin:5px;padding:5px;position:relative;"><div id="textShadow_'+j+'_bg" class="textShadow_bg" style="border:'+border+';background:'+bg1+';opacity:'+opacity+';border-radius:'+br+';position:absolute;"></div><span style="font-weight:'+fw+';font-family:'+font+';position:absolute;height:1em;top:0.5em;vertical-align:middle;text-align:center;display:table-cell;text-shadow:'+ts[i]+'">abc XYZ</span></div>';

        $('#textShadowControls').append(html);

        setTimeout (function () { 
            $('#textShadow_'+(i+1)+'_bg').css({ 
                width : $('#textShadow_'+(i+1)).width(),
                height : $('#textShadow_'+(i+1)).height()
            });
        }, 200);
        
        var 
        el = $('#textShadow_'+(last+1))[0],
        evt2 = { currentTarget : el };
        na.ds.selectTextShadow(evt2);
    },
    deleteTextShadow : function (evt) {
        var 
        toDel = na.ds.s.c.selectedTextShadow,
        nextSelected = $(na.ds.s.c.selectedTextShadow).next('.textShadow');
        if (!nextSelected[0]) nextSelected = $(na.ds.s.c.selectedTextShadow).prev('.textShadow');
        
        $(toDel).remove();
        na.ds.s.c.selectedTextShadow = nextSelected;        

        na.ds.updateTextSettingsControls(evt);
    },
    selectTextShadow : function (evt) {
        var 
        el = evt.currentTarget,
        updateControls = na.ds.s.c.selectedTextShadow !== el;
        
        na.ds.s.c.selectedTextShadow = el;
        $(el).css({
            borderRadius : '10px'  
        });
        if (updateControls) na.ds.updateTextSettingsControls(evt);
    },
    textSettingsSelected : function () {
        var
        el = $('#'+na.ds.s.c.forDialogID),
        el2 = $('#'+na.ds.s.c.forDialogID+' .vividDialogContent'),
        el3 = $('#'+na.ds.s.c.forDialogID+' td'),
        tsc = na.ds.s.c.textShadowColor,
        newFontSize = $('#textSize').val(),
        newFontWeight = $('#textWeight').val() * 100,
        newFontFamily = $('#textFontFamily').val(),//.replace(/ /g, '+'),
        newTextShadow = 
            $('#textShadowXoffset').val()+'px '
            +$('#textShadowYoffset').val()+'px '
            +$('#textShadowBlurRadius').val()+'px '
            + (typeof tsc == 'object'
                ? 'rgba('+tsc._r+', '+tsc._g+', '+tsc._b+', '+tsc._a+')'
                : tsc
            ),
        els = $('#'+na.ds.s.c.selectedTextShadow.id+' span')
                .add(na.ds.s.c.selectedTextShadow)
                .add(el[0])
                .add('#'+el[0].id+' td');

        debugger;
        els.css ({ 
            textShadow : newTextShadow, 
            fontWeight : newFontWeight, 
            fontSize : newFontSize+'px', 
            fontFamily : newFontFamily 
        });
        
        setTimeout (na.ds.textSettingsSelected_updateDialog, 250);
    },
    
    textSettingsSelected_updateDialog : function () {
        var
        el = $('#'+na.ds.s.c.forDialogID),
        el2 = $('#'+na.ds.s.c.forDialogID+' .vividDialogContent, #'+na.ds.s.c.forDialogID+' td'),
        newFontSize = $('#textSize').val(),
        newFontWeight = $('#textWeight').val() * 100,
        newFontFamily = $('#textFontFamily').val(),//.replace(/ /g, '+'),
        newTextShadow = '';
        
        $('.textShadow')
            //.css({ fontWeight : newFontWeight, fontSize : newFontSize+'px', fontFamily : newFontFamily })
            .each(function(idx,el) {
                if (newTextShadow!=='') newTextShadow+=', ';
                newTextShadow += $('#'+el.id+' span').css('textShadow');
            });
            
        $(el).add(el2).css({ fontWeight : newFontWeight, fontSize : newFontSize+'px', fontFamily : newFontFamily });
        $(el).add(el2).css({ textShadow : newTextShadow });
        /*if (na.ds.s.c.fireSaveTheme) */na.site.saveTheme();
    },
    
    textSettingsSelected_textColor : function (color) {
        if (color) na.ds.s.c.textColor = color; else color = na.ds.s.c.textColor;
        if (typeof color=='object') color = 'rgba('+color._r+', '+color._g+', '+color._b+', '+color._a+')'; // firefox bugfix
        var
        el = $('#'+na.ds.s.c.forDialogID),
        el2 = $('#'+na.ds.s.c.forDialogID+' .vividDialogContent'),
        el3 = $('#'+na.ds.s.c.forDialogID+' td');
        $(el).add(el2).add(el3).css ({ color : color });
        /*if (na.ds.s.c.fireSaveTheme) */na.site.saveTheme();
    },
    
    textSettingsSelected_textShadowColor : function (color) {
        if (color) {
            na.ds.s.c.textShadowColor = color;
            na.ds.textSettingsSelected();
        }
    }
};
na.ds.s = na.ds.settings;
na.ds.s.c = na.ds.s.current;
