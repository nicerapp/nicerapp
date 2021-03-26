na.blog = {
    settings : {},
    
    onload : async function() {
        var ac = {
            type : 'GET',
            url : '/nicerapp/apps/nicerapp/cms/ajax_getTreeNodes.php',
            success : function (data, ts, xhr) {
                let dat = JSON.parse(data);
                $('#jsTree').css({
                    height : $('#siteToolbarLeft .vividDialogContent').height() - $('#jsTree_navBar').height()
                }).jstree({
                    core : {
                        data : dat
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
                            "valid_children" : ["naFolder", "naMediaAlbum", "naDocument"]
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
                        "naMediaAlbum" : {
                            "icon" : "/nicerapp/siteMedia/na.view.tree.naMediaAlbum.png",
                            "valid_children" : [ "naMediaAlbum" ]
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
                }).on('ready.jstree', function (e, data) {
                  
                }).on('changed.jstree', function (e, data) {
                    if (na.blog.settings.selectedRecord) na.blog.saveEditorContent(na.blog.settings.selectedRecord);
                    for (var i=0; i<data.selected.length; i++) {
                        var d = data.selected[i], rec = data.instance.get_node(d);
                        na.blog.treeButtonsEnableDisable (rec);
                        $('#documentTitle').val(rec.original.text);
                        if (rec.original.type=='naDocument') {
                            na.blog.loadEditorContent(rec);
                            na.blog.settings.selectedRecord = rec;
                            $('#folder').css({display:'none'});
                            $('#document').css({display:'block'});
                        } else {
                            $('#folder').css({display:'block'});
                            $('#document').css({display:'none'});
                            delete na.blog.settings.selectedRecord;
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
        $(window).resize(na.blog.onresize)
        na.blog.onresize();
    },
    
    refresh : function () {
        $('#siteToolbarLeft .lds-facebook').fadeIn('slow');
        var ac = {
            type : 'GET',
            url : '/nicerapp/apps/nicerapp/cms/ajax_getTreeNodes.php',
            success : function (data, ts, xhr) {
                let dat = JSON.parse(data);
                $('#jsTree').jstree(true).settings.core.data = dat;
                $('#jsTree').jstree(true).refresh();
                $('#siteToolbarLeft .lds-facebook').stop(true,true).fadeOut('slow');
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    loadEditorContent : function (rec, callback) {
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_loadDocument.php',
            data : {
                database : rec.original.database.replace('tree','documents'),
                id : rec.original.id
            },
            success : function (data, ts, xhr) {
                na.m.waitForCondition ('tinymce ready',
                    function () {
                        return tinymce.ready
                    },
                    function () {
                        tinymce.get('tinymce').setContent(data);
                        if (typeof callback=='function') callback(rec);
                    },
                    100
                );
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    saveEditorContent : function (rec, callback) {
        var 
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_editDocument.php',
            data : {
                database : rec.original.database.replace('tree','documents'),
                id : rec.original.id,
                document : tinymce.get('tinymce').getContent()
            },
            success : function (data, ts, xhr) {
                if (typeof callback=='function') callback(rec);
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
        
    },
    
    onresize : function() {
        if (na.m.userDevice.isPhone) {
            na.blog.settings.activeDialog='#siteToolbarLeft';
            na.d.s.visibleDivs.remove('#siteContent');
        }
        na.desktop.resize(function (t) {
            if (!t) t = this;
            if (t.id=='siteContent') {
                let w = 0, d = $('#document').css('display');
                $('#document').css({display:'block'});
                $('.navBar_button', $('#document_navBar')[0]).each(function(idx,el){
                    w += $(el).width();
                });
                w += $('#documentTitle_label').width();
                $('#documentTitle').css({
                    width : jQuery('#siteContent .vividDialogContent').width() - w - 45
                });
                var editorHeight = $('#siteContent .vividDialogContent').height() - $('#document_navBar').height();
                $('#jsTree').css({ height : $('#siteToolbarLeft .vividDialogContent').height() - $('#jsTree_navBar').height() - 20 });
                var mce_bars_height = 0;
                $('.tox-toolbar-overlord, .tox-statusbar').each(function() { mce_bars_height += $(this).height(); });
                $('.tox-tinymce').css ({
                    width : '100%',
                    height : editorHeight - $('.tox-statusbar').height()
                });
                $('#tinymce_ifr').css ({
                    width : '100%',
                    height : editorHeight - mce_bars_height
                });
                $('#document').css({display:d});
            }
        });
        
        
    },
    
    onchange_documentTitle : function () {
        var 
        tree = $('#jsTree').jstree(true),
        sel = tree.get_node(tree.get_selected()[0]),
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_changeNodeText.php',
            data : {
                database : sel.original.database,
                id : sel.original.id,
                text : $('#documentTitle').val()
            },
            success : function (data, ts, xhr) {
                na.blog.refresh();
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    onclick_addFolder : function() {
        var 
        tree = $('#jsTree').jstree(true),
        sel = tree.get_node(tree.get_selected()[0]),
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_addNode.php',
            data : {
                database : sel.original.database,
                parent : sel.original.id,
                type : 'naFolder'
            },
            success : function (data, ts, xhr) {
                na.blog.refresh();
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    onclick_addDocument : function() {
        var 
        tree = $('#jsTree').jstree(true),
        sel = tree.get_node(tree.get_selected()[0]),
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_addNode.php',
            data : {
                database : sel.original.database,
                parent : sel.original.id,
                type : 'naDocument'
            },
            success : function (data, ts, xhr) {
                na.blog.refresh();
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    onclick_addMediaAlbum : function() {
        alert ('new media album');
    },
    
    onclick_delete : function () {
        var 
        tree = $('#jsTree').jstree(true),
        sel = tree.get_node(tree.get_selected()[0]),
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_deleteNode.php',
            data : {
                database : sel.original.database,
                id : sel.original.id,
            },
            success : function (data, ts, xhr) {
                na.blog.refresh();
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    onclick_publish : function () {
        var
        tree = $('#jsTree').jstree(true),
        sel = tree.get_node(tree.get_selected()[0]),
        arr = {
            cmsText : {
                database : sel.original.database,
                id : sel.original.id
            }
        },
        url = na.m.base64_encode_url (JSON.stringify(arr));
        na.blog.saveEditorContent(sel, function() {
            na.site.loadContent(url);
        });
    },
    
    treeButtonsEnableDisable : function(rec) {
        $('.jsTree_navBar_button').removeClass('disabled');
        switch (rec.original.type) {
            case 'naFolder':
                break;
            case 'naSystemFolder':
                $('#jsTree_addDocument').addClass('disabled');
                $('#jsTree_addFolder').addClass('disabled');
                $('#jsTree_addMediaAlbum').addClass('disabled');
                $('#jsTree_delete').addClass('disabled');
                break;
            case 'naUserRootFolder':
                break;
            case 'naGroupRootFolder':
                break;
            case 'naDocument':
                $('#jsTree_newDocument').addClass('disabled');
                break;
        }
    }
}
