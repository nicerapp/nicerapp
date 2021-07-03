na.ds = na.dialogSettings = {
    settings : { current : { firstRun : true, forDialogID : 'siteContent' } }, 
    onload : function (forDialogID) {
        na.ds.settings.current.forDialogID = forDialogID;
        var ac = {
            type : 'GET',
            url : '/nicerapp/apps/nicerapp/cms/ajax_getTreeNodes.php',
            success : function (data, ts, xhr) {
                let dat = JSON.parse(data);
                na.ds.settings.current.db = dat;
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
                        && na.ds.settings.current.selectedTreeNode
                        && na.ds.settings.current.selectedTreeNode.type=='naDocument'
                    ) na.blog.saveEditorContent(na.blog.settings.current.selectedTreeNode);
                    
                    for (var i=0; i<data.selected.length; i++) {
                        var d = data.selected[i], rec = data.instance.get_node(d);
                        $('#documentTitle').val(rec.original.text);
                        na.ds.settings.current.selectedTreeNode = rec;
                        if (rec.original.type=='naDocument') {
                            na.site.settings.buttons['#btnSelectBackgroundImage'].disable();
                        } else if (rec.original.type=='naMediaFolder') {
                            na.site.settings.buttons['#btnSelectBackgroundImage'].enable();
                            var
                            path = na.ds.currentPath(rec),
                            path = path.replace(/ /g, '%20'),
                            src = '/nicerapp/userInterface/photoAlbum/4.0.0/index.php?basePath='+path,
                            el = $('#dialogSettings_photoAlbum')[0];
                            el.onload = na.ds.onresize;
                            el.src = src;
                        } else {
                            na.site.settings.buttons['#btnSelectBackgroundImage'].disable();
                        }

                    };
                });
                
                $('#siteToolbarLeft .lds-facebook').fadeOut('slow');
                
                setTimeout(function() {
                    var 
                    div = $('#'+na.ds.settings.current.forDialogID),
                    bg = $('.vdBackground', $('#'+na.ds.settings.current.forDialogID)[0]),
                    rgbaRegEx = /rgba\(\d{1,3}\,\s*\d{1,3}\,\s*\d{1,3}\,\s*([\d.]+)\).*/,
                    rgbRegEx = /rgb\(\d{1,3}\,\s*\d{1,3}\,\s*\d{1,3}\).*/,
                    test = rgbaRegEx.test($(bg).css('background')),
                    test2 = rgbaRegEx.test($(div).css('border')),
                    test2a = rgbRegEx.test($(div).css('border')),
                    c = test ? $(bg).css('background') : '#000',
                    c2 = typeof $(div).css('border')==='undefined' ? 'rgba(0,0,0,0)' : test2 ? $(div).css('border').match(rgbaRegEx)[0] : test2a ? $(div).css('border').match(rgbRegEx)[0] : 'lime';
                    na.ds.settings.current.borderColor = c2;
                    
                    var x = $('#colorpicker').css('display');
                    $('#colorpicker').css({display:'block'}).spectrum ({color:c, type:'flat', change : function (color) {
                        var bg = $('.vdBackground', $('#'+na.ds.settings.current.forDialogID)[0]);
                        $(bg).css({ background : color, opacity : 1 });
                        na.site.saveTheme();                        
                    }});
                    if (na.ds.settings.current.selectedButtonID!=='btnSelectBackgroundColor') $('#colorpicker').next().css({display:x});
                    var x = $('#borderColorpicker').css('display');
                    $('#borderColorpicker').css({display:'block'}).spectrum ({color:c2, type: "flat", change : na.ds.borderSettingsSelected});
                    if (na.ds.settings.current.selectedButtonID!=='btnSelectBorderSettings') $('#borderColorpicker').next().css({display:x});
                    
                    if ($(window).width() < na.site.globals.reallySmallDeviceWidth) $('.sp-container').css({width:$(window).width()-35});
                    //$('.sp-container').addClass('dialogSettingsComponent').css({position:'absolute'});
                }, 200);
                    
                
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);

        na.ds.settings.current.textColor = 'white';
        na.ds.settings.current.textShadowColor = 'black';
        na.ds.settings.current.selectedTextShadow = $('#textShadow_0')[0];
        na.ds.settings.current.boxSettings = $('#boxShadow_0')[0];
        setTimeout (function() {
            $('.mediaThumb', $('#dialogSettings_photoAlbum')[0].contentWindow.document).each(function(idx,el) {
                var x = $('#'+forDialogID+' .vdBackground').css('background');
                if (x && x.match(el.src)) {
                    var scale = $('#'+forDialogID+' .vdBackground').css('backgroundSize').match(/\d+/);
                    if (scale) na.ds.settings.current.scale = scale[0];
                    na.ds.settings.current.selectedImage = el;
                }
            });
        }, 750);
        

        var s = JSON.parse( $('#specificity').find('option:selected')[0].value );
        na.ds.settings.current.specificity = s;
        
        $('#btnViewResult .cvbBorderCSS').css({ boxShadow : '0px 0px 0px 0px rgba(0,0,0,0)' });
        $('#btnViewResult .cvbImgButton').css({ top : 2 });
        
        $('.vividButton, .vividButton_icon', $('#siteToolbarDialogSettings')[0]).each(function(idx,el){
            na.site.settings.buttons['#'+el.id] = new naVividButton(el);
        });
        
        if (na.ds.settings.current.firstRun) {
            na.ds.settings.current.firstRun = false;
            //setTimeout (function() {
                na.ds.settings.current.selectedButtonID = 'btnSelectBackgroundColor';
                na.ds.selectBackground_color();
            //}, 500);
        } else {
            var btnID = na.ds.settings.current.selectedButtonID;
            $('#'+btnID).trigger('click');
        }
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
            if (na.ds.settings.current.selectedImage) na.ds.imageSelected(na.ds.settings.current.selectedImage);
        };
        $('#dialogSettings_photoScale')[0].oninput = function () {
            na.ds.settings.current.scale = parseInt($('#dialogSettings_photoScale').val());
            if (na.ds.settings.current.selectedImage) na.ds.imageSelected(na.ds.settings.current.selectedImage);
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
    },
    
    onclick : function (el, fireSaveTheme) {
        na.ds.settings.current.fireSaveTheme = fireSaveTheme === null ? true : false;
        if (na.ds.settings.current.selectedButtonID) {
            var b = na.site.settings.buttons['#'+na.ds.settings.current.selectedButtonID];
            b.deselect();
        }
        
        var b = na.site.settings.buttons['#'+el.id];
        na.ds.settings.current.selectedButtonID = el.id;
        b.select();
        $('#'+el.id).click(event);
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
        na.ds.settings.current.specificity = s;
        na.site.loadTheme (function () {
            var btn = $('#'+na.ds.settings.current.selectedButtonID)[0];
            na.ds.onclick(btn, false);
        });
    },
    
    selectBorderSettings : function () {
        na.ds.onclick($('#btnSelectBorderSettings')[0]);
        $('.dialogSettingsComponent').not('#borderSettings').fadeOut('normal');
        $('.dialogSettings_colorPicker').next().fadeOut('normal');
        $('#borderSettings').fadeIn('normal', 'swing', function () {
            $('#borderSettings').css({display:'flex'});
            $('.boxSettingsLabel').css({width:$('.boxSettingsLabel').width()+10});
            $('#boxShadow').css({width:$('#borderSettings').width() - $('#labelBoxShadow').width() - 20 });
            $('.boxShadow').css({
                border:$('#borderWidth').val()+'px '+$('#borderType').val()+' '+$('#borderColorpicker').val(),
                borderRadius:parseInt($('#borderRadius').val())
            });
            $('#borderType').css({width:$('#borderSettings').width() - $('#labelBorderType').width() - 20 });
            $('#borderWidth').css({width:$('#borderSettings').width() - $('#labelBorderWidth').width() - 20 });
            $('#borderRadius').css({width:$('#borderSettings').width() - $('#labelBorderRadius').width() - 20 });
            $('#boxShadowInsetClear').css({width:$('#borderSettings').width() - $('#labelBoxShadowInset').width() - 35 });
            $('#boxShadowXoffset').css({width:$('#borderSettings').width() - $('#labelBoxShadowXoffset').width() - 20 });
            $('#boxShadowYoffset').css({width:$('#borderSettings').width() - $('#labelBoxShadowYoffset').width() - 20 });
            $('#boxShadowSpreadRadius').css({width:$('#borderSettings').width() - $('#labelBoxShadowSpreadRadius').width() - 20 });
            $('#boxShadowBlurRadius').css({width:$('#borderSettings').width() - $('#labelBoxShadowBlurRadius').width() - 20 });
            $('#labelBoxShadowColor').css({width:$('#borderSettings').width() - 10});
        });
        $('#boxShadowColorpicker').spectrum ({color:'rgba(0,0,0,0.5)', type: "flat", change : na.ds.boxSettingsChanged_shadowColor});
        $('#borderColorpicker').spectrum ({color:na.ds.settings.current.borderColor, type: "flat", change : na.ds.borderSettingsSelected});
        var evt = { currentTarget : $('#'+na.ds.settings.current.forDialogID)[0] };
        na.ds.boxSettingsSelected (evt);
    },
    
    borderSettingsSelected : function (color) {
        if (color) na.ds.settings.current.borderColor = color; else color = na.ds.settings.current.borderColor;
        var 
        bg = $('#'+na.ds.settings.current.forDialogID),
        newBorder = $('#borderWidth').val() + 'px ' + $('#borderType').val() + ' ' + color,
        newBorderRadius = parseInt($('#borderRadius').val());
        
        $(bg).css({ border : newBorder, borderRadius : newBorderRadius });
        $('#'+na.ds.settings.current.forDialogID+' .vdBackground').css({borderRadius : newBorderRadius});
        $('.boxShadow').css({ border : newBorder, borderRadius : newBorderRadius });
        /*if (na.ds.settings.current.fireSaveTheme) */na.site.saveTheme();
    },
    
    boxSettingsSelected : function (event) {
        if (event.currentTarget.id!==na.ds.settings.current.forDialogID) na.ds.settings.current.boxSettings = event.currentTarget;
        
        var 
        bs = $(event.currentTarget).css('boxShadow'),
        b = $(event.currentTarget).css('border');
        
        if (bs == 'none') {
            var
            sliders = [ 2, 2, 2, 2 ];
            $('#boxShadowColorpicker').spectrum('set', 'rgba(0,0,0,0.7)');
            $('#boxShadowInset')[0].checked = false;
            na.ds.settings.current.borderColor = $('#borderColorpicker').val();
        } else {
            if (bs.match('inset')) $('#boxShadowInset')[0].checked = true; else $('#boxShadowInset')[0].checked = false;
            var 
            re1 = /(?:((?:#\w{3,6})|(?:hsla?|rgba?)\((?:(?:\d+%?),?\s*){2,3}(?:\d*\.\d*%?)?\)))\s((?:-?\d+(?:px)?\s*){3,4})/,
            rex = bs.match(re1),
            rex2 = b.match(re1),
            sliders = rex[2].split(' ');
            
            sliders[0] = parseInt(sliders[0].replace('px',''));
            sliders[1] = parseInt(sliders[1].replace('px',''));
            sliders[2] = parseInt(sliders[2].replace('px',''));
            sliders[3] = parseInt(sliders[3].replace('px',''));
            
            $('#boxShadowColorpicker').spectrum('set', rex[1]);
            na.ds.settings.current.borderColor = rex2[1];
            na.ds.boxSettingsChanged (rex[1]);
        };
        
        $('#boxShadowXoffset').val(sliders[0]);
        $('#boxShadowYoffset').val(sliders[1]);
        $('#boxShadowSpreadRadius').val(sliders[2]);
        $('#boxShadowBlurRadius').val(sliders[3]);
        
        $('.boxShadow').remove();
        if (bs !== 'none' && bs.match(',')) {
            var bss = bs.split(', rgb');
            for (var i=0; i<bss.length; i++) {
                if (i>0) bss[i] = 'rgb'+bss[i];
                var html = '<div id="boxShadow_'+i+'" class="boxShadow" style="background:rgb(200,200,200);box-shadow:'+bss[i]+';border:'+$('#borderWidth').val()+'px solid '+na.ds.settings.current.borderColor+';border-radius:'+parseInt($(event.currentTarget).css('borderRadius'))+'px;margin:5px;padding:5px;" onclick="na.ds.boxSettingsSelected(event);">ABC XYZ</div>';
                $('#boxShadow').append (html);
            }
        };
        
        var
        b = $(event.currentTarget).css('border'),
        bw = b.match(/^\d+/)[0];
        
        $('#borderWidth').val(parseInt(bw));
        $('#borderRadius').val(parseInt($(event.currentTarget).css('borderRadius')));
    },
    
    boxSettingsChanged : function (color) {
        if (color) $(na.ds.settings.current.boxSettings)[0].boxShadowColor = color; 
        else {
            color = $(na.ds.settings.current.boxSettings).css('boxShadow');
            if (color.match('#')) color = color.match(/#.*\s/)[0];
            if (color.match('rgba')) color = color.match(/rgba\(.*\)/)[0];
            else if (color.match('rgb')) color = color.match(/rgb\(.*\)/)[0];
        };
        
        var
        newBoxSetting = 
            ( $('#boxShadowInset')[0].checked ? 'inset ' : '' )
            + $('#boxShadowXoffset').val() + 'px '
            + $('#boxShadowYoffset').val() + 'px '
            + $('#boxShadowSpreadRadius').val() + 'px '
            + $('#boxShadowBlurRadius').val() + 'px '
            + color;
        $(na.ds.settings.current.boxSettings).css ({ boxShadow : newBoxSetting });
        
        newBoxSetting = '';
        $('.boxShadow').each(function(idx,el) {
            if (newBoxSetting!=='') newBoxSetting += ', ';
            newBoxSetting += $(el).css('boxShadow');
        });
        $('#'+na.ds.settings.current.forDialogID).css ({ boxShadow : newBoxSetting });
        /*if (na.ds.settings.current.fireSaveTheme) */na.site.saveTheme();
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
        var html = '<div id="boxShadow_'+(last+1)+'" class="boxShadow" onclick="na.ds.boxSettingsSelected(event)" style="border:'+$('#borderWidth').val()+'px solid '+na.ds.settings.current.borderColor+';background:rgba(200,200,200,1);box-shadow:2px 2px 2px 2px rgba(0,0,0,0.5);border-radius:'+parseInt($('#borderRadius').val())+'px;margin:5px;padding:5px;">ABC XYZ</div>';
        $('#boxShadow').append(html);
        
        na.ds.settings.current.boxSettings = $('#boxShadow_'+(last+1))[0];
        $('#boxShadowXoffset').val(2);
        $('#boxShadowYoffset').val(2);
        $('#boxShadowSpreadRadius').val(2);
        $('#boxShadowBlurRadius').val(2);
    },
    
    deleteBoxShadow : function(evt) {
        $(na.ds.settings.current.boxSettings).remove();
        na.ds.settings.current.boxSettings = $('#boxShadow_0')[0];
        na.ds.boxSettingsChanged();
    },
    
    
    
    selectBackground_color : function () {
        na.ds.onclick($('#btnSelectBackgroundColor')[0]);
        $('.dialogSettingsComponent').not('.sp-container').fadeOut('normal');
        $('.sp-container').fadeIn('normal').css({top:8,opacity:1});
    },

    selectBackground_folder : function () {
        na.ds.onclick($('#btnSelectBackgroundFolder')[0]);
        $('.dialogSettingsComponent').not('#dialogSettings_jsTree').fadeOut('normal');
        $('.dialogSettings_colorPicker').next().fadeOut('normal');
        $('#dialogSettings_jsTree').fadeIn('normal');
    },
    
    selectBackground_image : function () {
        na.ds.onclick($('#btnSelectBackgroundImage')[0]);
        $('.dialogSettingsComponent').not('#dialogSettings_photoAlbum, #dialogSettings_photoAlbum_specs').fadeOut('normal');
        $('.dialogSettings_colorPicker').next().fadeOut('normal');
        $('#dialogSettings_photoAlbum, #dialogSettings_photoOpacity, #dialogSettings_photoAlbum_specs').fadeIn('normal');
        $('#dialogSettings_photoOpacity').css({
            width:$('#siteToolbarDialogSettings').width() - $('#label_dialogSettings_photoOpacity').width() - 40,
            left : $('#label_dialogSettings_photoOpacity').width() + 10
        });
        $('#dialogSettings_photoScale').css({
            width:$('#siteToolbarDialogSettings').width() - $('#label_dialogSettings_photoScale').width() - 40,
            left : $('#label_dialogSettings_photoScale').width() + 10
        }).val(na.ds.settings.current.scale).fadeIn('normal');
            
    },
    
    opacityChange : function (evt) {
        var 
        bg = $(evt.currentTarget).parents('.vividDialog'),
        bg1 = $(bg).css('background'),
        rgbaRegEx = /rgba\((\d{1,3})\,\s*(\d{1,3})\,\s*(\d{1,3})\,\s*([\d.]+)\)(.*)/,
        rgbRegEx = /rgb\((\d{1,3})\,\s*(\d{1,3})\,\s*(\d{1,3})\)(.*)/,
        opacity = $(evt.currentTarget).val()/100;
        
        if (bg && bg.children('.vdBackground')[0]) bg = bg.children('.vdBackground');
        
        if (typeof bg1=='string' && bg1!=='') {
            var bg2 = '', bg2a = bg1.match(rgbaRegEx), bg2b = bg1.match(rgbRegEx);
            if (bg2a) {
                $(bg).css({ background : 'rgba('+bg2a[1]+', '+bg2a[2]+', '+bg2a[3]+', '+opacity+')'+bg2a[5] });
            } else {
                $(bg).css({ background : 'rgba('+bg2b[1]+', '+bg2b[2]+', '+bg2b[3]+', '+opacity+')'+bg2b[4] });
            }
        } else { 
            $(bg).css({ opacity : opacity });
        }
        /*if (na.ds.settings.current.fireSaveTheme) */na.site.saveTheme();
    },
    
    imageSelected : function (el) {
        na.ds.settings.current.selectedImage = el;
        var bg = $('.vdBackground', $('#'+na.ds.settings.current.forDialogID)[0]);
        $(bg).css({ background : 'url("'+el.src+'") repeat', opacity : parseInt($('#dialogSettings_photoOpacity').val())/100, backgroundSize : na.ds.settings.current.scale+'% '+na.ds.settings.current.scale+'%' });
        /*if (na.ds.settings.current.fireSaveTheme) */na.site.saveTheme();
    },
    
    selectTextSettings : function () {
        na.ds.onclick($('#btnSelectTextSettings')[0]);
        $('.dialogSettingsComponent').not('#textSettings').fadeOut('normal');
        $('.dialogSettings_colorPicker').next().fadeOut('normal');
        $('#textSettings').fadeIn('normal', 'swing', function () {
            $('.textSettingsLabel').css({width:$('.textSettingsLabel').width()+10});
            $('#textFontFamily').css({width:$('#textSettings').width() - $('#labelTextFontFamily').width() - 20 });
            var
            el = $('#'+na.ds.settings.current.forDialogID),
            el2 = $('#'+na.ds.settings.current.forDialogID+' .vividDialogContent'),
            el3 = $('#'+na.ds.settings.current.forDialogID+' td'),
            el_ts = $(el).css('fontSize'),
            el2_ts = $(el2).css('fontSize'),
            el3_ts = $(el3).css('fontSize'),
            el_fw = $(el).css('fontWeight'),
            el2_fw = $(el2).css('fontWeight'),
            el3_fw = $(el3).css('fontWeight');
            
            debugger;
            if (typeof el3_ts=='string' && el3_ts!=='') $('#textSize').val(parseInt(el3_ts));
            if (typeof el2_ts=='string' && el2_ts!=='') $('#textSize').val(parseInt(el2_ts));
            if (typeof el_ts=='string' && el_ts!=='') $('#textSize').val(parseInt(el_ts));
                                  
            if (typeof el3_fw=='string' && el3_fw!=='') $('#textWeight').val(parseInt(el3_fw)/100);
            if (typeof el2_fw=='string' && el2_fw!=='') $('#textWeight').val(parseInt(el2_fw)/100);
            if (typeof el_fw=='string' && el_fw!=='') $('#textWeight').val(parseInt(el_fw)/100);
            
            $('#textSize').css({width:$('#textSettings').width() - $('#labelTextSize').width() - 40 });
            $('#textWeight').css({width:$('#textSettings').width() - $('#labelTextWeight').width() - 40 });
            $('#textShadowXoffset').css({width:$('#textSettings').width() - $('#labelTextShadowXoffset').width() - 40 });
            $('#textShadowYoffset').css({width:$('#textSettings').width() - $('#labelTextShadowYoffset').width() - 40 });
            $('#textShadowBlurRadius').css({width:$('#textSettings').width() - $('#labelTextShadowBlurRadius').width() - 40 });
        });
        $('#textColorpicker').spectrum ({color:'white', type: "flat", change : na.ds.textSettingsSelected_textColor});
        $('#textShadowColorpicker').spectrum ({color:'black', type: "flat", change : na.ds.textSettingsSelected_textShadowColor});
    },
    addTextShadow : function () {
        var last = 0;
        $('.textShadow').each(function(idx,el) {
            var idx2 = parseInt(el.id.replace('textShadow_',''));
            if (idx2 > last) last = idx2;
        });
        var html = '<div id="textShadow_'+(last+1)+'" class="textShadow" onclick="na.ds.selectTextShadow(event)" style="margin:5px;padding:5px;">ABC XYZ</div>';
        $('#textShadow').append(html);
        var 
        el = $('#textShadow_'+(last+1))[0],
        evt = { currentTarget : el };
        na.ds.selectTextShadow(evt);
    },
    
    deleteTextShadow : function () {
    },
    
    selectTextShadow : function (evt) {
        var el = evt.currentTarget;
        na.ds.settings.current.selectedTextShadow = el;
        $('.textShadow').css({ background : 'none', border : 'none', borderRadius : '0px' });
        $(el).css({background : 'navy', border : '1px solid white', borderRadius : '10px'  });
    },
    
    textSettingsSelected : function () {
        var
        el = $('#'+na.ds.settings.current.forDialogID),
        el2 = $('#'+na.ds.settings.current.forDialogID+' .vividDialogContent'),
        el3 = $('#'+na.ds.settings.current.forDialogID+' td'),
        newTextShadow = 
            $('#textShadowXoffset').val()+'px '
            +$('#textShadowYoffset').val()+'px '
            +$('#textShadowBlurRadius').val()+'px '
            +na.ds.settings.current.textShadowColor;

        $(na.ds.settings.current.selectedTextShadow).css ({ textShadow : newTextShadow});
        na.ds.textSettingsSelected_updateDialog();
    },
    
    textSettingsSelected_updateDialog : function () {
        var
        el = $('#'+na.ds.settings.current.forDialogID),
        el2 = $('#'+na.ds.settings.current.forDialogID+' .vividDialogContent, #'+na.ds.settings.current.forDialogID+' td'),
        newFontSize = $('#textSize').val(),
        newFontWeight = $('#textWeight').val() * 100,
        newFontFamily = $('#textFontFamily').val(),//.replace(/ /g, '+'),
        newTextShadow = '';
        
        $('.textShadow')
            .css({ fontWeight : newFontWeight, fontSize : newFontSize+'px', fontFamily : newFontFamily })
            .each(function(idx,el) {
                if (newTextShadow!=='') newTextShadow+=', ';
                newTextShadow = $(el).css('textShadow');
            });
        $(el).add(el2).css({ fontWeight : newFontWeight, fontSize : newFontSize+'px', fontFamily : newFontFamily });
        $(el).add(el2).css({ textShadow : newTextShadow });
        /*if (na.ds.settings.current.fireSaveTheme) */na.site.saveTheme();
    },
    
    textSettingsSelected_textColor : function (color) {
        if (color) na.ds.settings.current.textColor = color; else color = na.ds.settings.current.textColor;
        var
        el = $('#'+na.ds.settings.current.forDialogID),
        el2 = $('#'+na.ds.settings.current.forDialogID+' .vividDialogContent'),
        el3 = $('#'+na.ds.settings.current.forDialogID+ 'td');
        $(el).add(el2).add(el3).css ({ color : color });
        /*if (na.ds.settings.current.fireSaveTheme) */na.site.saveTheme();
    },
    
    textSettingsSelected_textShadowColor : function (color) {
        if (color) {
            na.ds.settings.current.textShadowColor = color;
            na.ds.textSettingsSelected();
        }
    }
};
