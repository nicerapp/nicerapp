na.blog = {
    settings : { current : { mediaFolderView : 'view' } },
    
    onload : async function() {
        var ac = {
            type : 'GET',
            url : '/nicerapp/apps/nicerapp/cms/ajax_getTreeNodes.php',
            success : function (data, ts, xhr) {
                let dat = JSON.parse(data);
                na.blog.settings.current.db = dat;
                $.jstree.defaults.core.error = function (a,b,c,d) {
                    //debugger;
                };
                $('#jsTree').css({
                    height : $('#siteToolbarLeft .vividDialogContent').height() - $('#jsTree_navBar').height()
                }).jstree({
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
                }).on('ready.jstree', function (e, data) {
                  
                }).on('changed.jstree', function (e, data) {
                    if (
                        na.blog.settings.current.selectedTreeNode
                        && na.blog.settings.current.selectedTreeNode.type=='naDocument'
                    ) na.blog.saveEditorContent(na.blog.settings.current.selectedTreeNode);
                    
                    for (var i=0; i<data.selected.length; i++) {
                        var d = data.selected[i], rec = data.instance.get_node(d);
                        na.blog.treeButtonsEnableDisable (rec);
                        $('#documentTitle').val(rec.original.text);
                        na.blog.settings.current.selectedTreeNode = rec;
                        if (rec.original.type=='naDocument') {
                            na.blog.loadEditorContent(rec);
                            $('#folder').css({display:'none'});
                            $('#upload').css({display:'none'});
                            $('#document').css({display:'block'});
                        } else if (rec.original.type=='naMediaFolder') {
                            $('#folder').css({display:'none'});
                            $('#upload').css({display:'block'});
                            $('#document').css({display:'none'});
                            var
                            path = na.blog.currentPath(rec),
                            path = path.replace(/ /g, '%20'),
                            src = (
                                na.blog.settings.current.mediaFolderView == 'upload'
                                ? '/nicerapp/3rd-party/plupload-2.3.6/examples/jquery/jquery_ui_widget.php?c='+na.m.changedDateTime_current()+/*'&smID='+siteManager.id+'&iid='+iid+'&dialogID='+did+*/'&basePath='+path
                                : '/nicerapp/userInterface/photoAlbum/4.0.0/index.php?basePath='+path
                            ),
                            el = $('#jQueryFileUpload')[0];
                            el.onload = na.blog.onresize;
                            el.src = src;
                        } else {
                            $('#folder').css({display:'block'});
                            $('#upload').css({display:'none'});
                            $('#document').css({display:'none'});
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
    
    currentPath : function (node) {
        var me = na.blog, s = me.settings, c = s.current;
        
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
    
    onresize : function() {
        if (na.m.userDevice.isPhone) {
            na.blog.settings.activeDialog='#siteToolbarLeft';
            na.d.s.visibleDivs.remove('#siteContent');
        };
        na.desktop.resize(function (t) {
            if (!t) t = this;
            if (t.id=='siteContent') {
                $('#siteContent .vividDialogContent').css({overflow:''});
                na.m.waitForCondition('tree select node',
                    function () {
                        return na.blog.settings.current.selectedTreeNode;
                    },
                    function () {
                        switch (na.blog.settings.current.selectedTreeNode.type) {
                            case 'naDocument':
                                
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
                                var mce_bars_height = 20;
                                $('.mce-toolbar-grp, .mce-statusbar').each(function() { mce_bars_height += $(this).height(); });
                                $('.mce-tinymce').css ({
                                    width : '99%',
                                    height : editorHeight - $('.mce-statusbar').height()
                                });
                                $('#tinymce_ifr').css ({
                                    width : '99%',
                                    height : editorHeight - mce_bars_height
                                });
                                $('#document').css({display:d});
                                break;
                                
                            case 'naMediaFolder':
                                var
                                p = $('#siteContent .vividDialogContent'),
                                nb = $('#mediaFolder_navBar');
                                
                                $('#siteContent .vividDialogContent').css({overflow:'hidden'});
                                $('.jQueryFileUpload').css ({
                                    top : '0px',
                                    left : '0px',
                                    width : p.width(), 
                                    height : p.height() - nb.height(),
                                    border : '0px solid rgba(0,0,0,0)'
                                });
                                break;
                        
                        }
                    },
                    100
                );
            }
        });
    },
    
    refresh : function (callback) {
        $('#siteToolbarLeft .lds-facebook').fadeIn('slow');
        var ac = {
            type : 'GET',
            url : '/nicerapp/apps/nicerapp/cms/ajax_getTreeNodes.php',
            success : function (data, ts, xhr) {
                let dat = JSON.parse(data);
                na.blog.settings.current.db = dat;
                $('#jsTree').jstree(true).settings.core.data = dat;
                $('#jsTree').jstree(true).refresh();
                $('#siteToolbarLeft .lds-facebook').stop(true,true).fadeOut('slow');
                setTimeout (function () {
                    if (typeof callback=='function') callback (dat);
                }, 500);
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
        var 
        tree = $('#jsTree').jstree(true),
        sel = tree.get_node(tree.get_selected()[0]),
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_addNode.php',
            data : {
                database : sel.original.database,
                parent : sel.original.id,
                type : 'naMediaFolder'
            },
            success : function (data, ts, xhr) {
                var 
                me = na.blog, s = me.settings, c = s.current,
                dat = JSON.parse(data);
                na.blog.refresh(function(nodes) {
                    for (var i=0; i<c.db.length; i++) {
                        if (c.db[i].text === dat.recordAdded.text) {
                            $('#jsTree').jstree('deselect_all');
                            $('#jsTree').jstree('select_node', c.db[i].id);
                        }
                    }
                    na.blog.onclick_btnUpload();
                });
            },
            failure : function (xhr, ajaxOptions, thrownError) {
                debugger;
            }
        };
        $.ajax(ac);
    },
    
    onclick_delete : function () {
        var 
        tree = $('#jsTree').jstree(true),
        sel = tree.get_node(tree.get_selected()[0]),
        rec = na.blog.settings.current.selectedTreeNode,
        path = na.blog.currentPath(rec),
        ac = {
            type : 'POST',
            url : '/nicerapp/apps/nicerapp/cms/ajax_deleteNode.php',
            data : {
                database : sel.original.database,
                id : sel.original.id,
                currPath : path
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
        role = undefined,
        user = undefined;
        
        for (var i=0; i<sel.parents.length; i++) {
            var p = tree.get_node(sel.parents[i]);
            if (p.type == 'naUserRootFolder') user = p.text;
            if (p.type == 'naGroupRootFolder') role = p.text;
        }
        var
        arr = {
            cmsText : {
                database : sel.original.database,
                id : sel.original.id
            }
        };
        if (user) arr.cmsText.user = user;
        if (role) arr.cmsText.role = role;
        
        var
        url = na.m.base64_encode_url (JSON.stringify(arr));
        
        na.blog.saveEditorContent(sel, function() {
            na.site.loadContent(url);
        });
    },
    
    onclick_insertMedia : function () {
        var
        tmce = tinymce.get('tinymce');
        
        tmce.windowManager.open({
            title : 'Insert Photo Album',
            url : '/nicerapp/userInterface/photoAlbum/4.0.0/index.all.php',
            width : 570,
            height: 700
        });
    },
    
    insertMediaFolder : function (relPath) {
        tinymce.activeEditor.execCommand ('mceInsertContent', false, ':{"mediaFolder":"'+relPath+'"}:');
        tinymce.activeEditor.windowManager.close();
    },
    
    onclick_btnUpload : function (evt) {
        na.blog.settings.current.mediaFolderView = 'upload';
        na.blog.mediaFolder_viewChanged();
    },
    
    onclick_btnViewMedia : function (evt) {
        na.blog.settings.current.mediaFolderView = 'view';
        na.blog.mediaFolder_viewChanged();
    },
    
    onclick_mediaThumbnail : function (evt, basePath, filename) {
        var 
        arr = {
            cmsViewMedia : {
                basePath : basePath,
                filename : filename
            }
        },
        base64 = na.m.base64_encode_url(JSON.stringify(arr));
        na.site.loadContent(base64);
    },
    
    mediaFolder_viewChanged : function () {
        var
        rec = na.blog.settings.current.selectedTreeNode,
        path = na.blog.currentPath(rec),
        path = path.replace(/ /g, '%20'),
        src = (
            na.blog.settings.current.mediaFolderView == 'upload'
            ? '/nicerapp/3rd-party/plupload-2.3.6/examples/jquery/jquery_ui_widget.php?changed='+na.m.changedDateTime_current()+/*'&smID='+siteManager.id+'&iid='+iid+'&dialogID='+did+*/'&basePath='+path
            : '/nicerapp/userInterface/photoAlbum/4.0.0/index.php?basePath='+path
        ),
        el = $('#jQueryFileUpload')[0];
        el.onload = na.blog.onresize;
        el.src = src;
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
    },
    
    tinymce_link_list : function (success) {
        var me = na.blog, s = me.settings, c = s.current, rel = jQuery(s.hid)[0];
        var x = c.db;
        var r = [
            /*
            { title : 'abc', menu : [
                { title : 'xyz' : value : 'url/to/page.html' }
            ]},
            { title : 'abd', menu : [] }
            */
        ];
        
        for (var i=0; i<c.db.length; i++) {
            var it = c.db[i];
            if (it.type=='naDocument') {
                // find the parents
                var 
                j = i,
                it2 = c.db[j],
                title = it2.title,
                parentsLabel = it2.text,
                parentsURL = it2.text; // or it2.title
                
                while (it2.parent!=='#') {
                    for (var k=0; k<c.db.length; k++) {
                        var it3 = c.db[k];
                        if (it3.id && it3.id===it2.parent) {
                            parentsLabel = it3.text + '/' + parentsLabel;
                            parentsURL = it3.text + '/' + parentsURL;
                            break;
                        }
                    }
                    
                    if (it3.parent==='#') {
                        var userOrGroupVal = it2.text;
                    }
                    it2 = it3;
                    if (it2.parent==='#') {
                        if (it2.text==='Users') var userOrGroup = 'user';
                        if (it2.text==='Groups') var userOrGroup = 'group';
                    }
                }
                
                var v = { // ---> the URL part of a final URL that lists as http://yoursite.com/apps/BASE64JSON-URL                    
                    cmsText : { // nicerapp app name
                        database : it.database,
                        id : it.id
                    }
                };
                
                var y = { 
                    title : parentsLabel, 
                    value : '/apps/'+na.m.base64_encode_url( JSON.stringify(v) ) 
                };
                //debugger;
                r.push (y);
            }
        };

        //debugger;
        success(r);
    },
    
    currentNode_createPath : function (event, path) {
        var 
        me = na.blog, s = me.settings, c = s.current,
        tree = $('#jsTree').jstree(true),
        sel = tree.get_selected()[0],
        node = tree.get_node(sel),
        
        types = {
            saFolder : 'tree_btnCreateFolder',
            naMediaAlbum : 'tree_btnCreateMediaAlbum',
            naDocument : 'tree_btnCreateDocument'
        }//,
        //proceed = parseFloat(jQuery('#'+types[type]).css('opacity')) === 1;
        
        var
        t = tree.get_json(node),
        cur = t,
        paths = path.split('/');
        
        //if (paths.length==2) debugger;
        
        for (var i=0; i<paths.length; i++) {
            var 
            folderName = paths[i],
            d = cur.children,
            found = false;
            for (var j=0; j<d.length; j++) {
                if (d[j].text===folderName) {
                    found = true;
                    cur = d[j];
                }
            }
            if (!found) {
                var 
                n2 = tree.get_node(cur.id),
                n = {
                    database : n2.original.database,
                    id : na.m.randomString(),
                    type : 'naMediaFolder',
                    text : folderName,
                    title : folderName,
                    parent : cur.id,
                    state : { opened : true }
                },
                r = tree.create_node (cur.id, n),
                ac = {
                    type : 'POST',
                    url : '/nicerapp/apps/nicerapp/cms/ajax_addNode.php',
                    data : {
                        database : n2.original.database,
                        id : r,
                        parent : cur.id,
                        label : folderName,
                        type : 'naMediaFolder'
                    },
                    success : function (data, ts, xhr) {
                        //na.blog.refresh();
                    },
                    failure : function (xhr, ajaxOptions, thrownError) {
                        debugger;
                    }
                };
                $.ajax(ac);

                //debugger;
                c.db[c.db.length] = node;
                
                return me.currentNode_createPath (event, path);
            }
        }
        
        return true;
    },
    
    mediaUploadComplete : function (up, files) {
        na.blog.refresh(function(nodes) {
            var 
            me = na.blog, s = me.settings, c = s.current,
            id = files[0].relativePath.split('/')[1];
            
            for (var i=0; i<c.db.length; i++) {
                var it = c.db[i];
                if (it.text === id) {
                    $('#jsTree').jstree('deselect_all');
                    $('#jsTree').jstree('select_node', it.id);
                };
            };
            na.blog.onclick_btnViewMedia();
        });
    }
}
