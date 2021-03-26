na.blog = {
    settings : {},
    
    onload : function() {
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
