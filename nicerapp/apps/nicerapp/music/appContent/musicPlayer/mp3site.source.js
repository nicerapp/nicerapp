var siteCode_nicerapp = {
	onLoad : function () {
		mp3site.startAppNested();
	},
	onResize : function (isManualResize) {
		mp3site.onWindowResize();
	}
};

window.top.na.vcc.settings['siteContent'].canAutoHeight = false;
na.analytics.logMetaEvent ('musicPlayer : init-stage-0');


window.top.na.apps.loaded.mp3site  = {
	about : {
		whatsThis : 'Application code for the musicPlayer by nicer.app',
		copyright : 'Copyrighted (c) and All Rights Reserved (r) 2011-2019 by Rene AJM Veerman - rene.veerman.netherlands@gmail.com',
		license : 'http://nicer.app/LICENSE.txt (an MIT type license)',
        version : '3.1.0'
	},
	globals : {
        contentOpacity : 0,
        contentBorder : '0px solid black',
        contentBoxShadow : '0px 0px 0px 0px rgba(0,0,0,0)'
	},
	settings : { 
        initialized : true,
		ready : true,
		loadedIn : {
			'#siteContent' : {
				settings : {
					initialized : true,
                    ready : true
				},
				onload : function (settings) {
                    if (!window.top) return false;
                    na.analytics.logMetaEvent ('musicPlayer : init-stage-1');
					var 
					pw = window.top.window,
					pd = window.top.document,
					psc = pw.na.s.c,
					psa = pw.sa,
                    m = window.top.na.apps.loaded.mp3site, g = m.globals, s = m.settings, c = m.settings;

                    /*
                    jQuery('#siteContent', window.top.document.body).css({
                        width : jQuery('#siteContent__contentDimensions', window.top.document.body)[0].offsetWidth,
                        height : jQuery('#siteContent__contentDimensions', window.top.document.body)[0].offsetHeight
                    });
                    */
                    
                    if (c.oldContentOpacity) return false;
                    c.oldContentOpacity = jQuery('#siteContent__CSS3', pd).css('opacity');
                    c.oldContentBorder = jQuery('#siteContent__dialog', pd).css('border');
                    c.oldContentBoxShadow = jQuery('#siteContent__dialog', pd).css('boxShadow');
                    jQuery('#siteContent__CSS3', pd).css({
                        opacity : g.contentOpacity
                    });
                    jQuery('#siteContent__dialog', pd).css({
                        border : g.contentBorder,
                        boxShadow : g.contentBoxShadow
                    });
                    jQuery('#siteContent').css({
                        width : jQuery('#siteContent__scrollpane').outerWidth(),
                        height : jQuery('#siteContent__scrollpane').outerHeight()
                    });
                    
					//na.apps.loaded.search_youtube = na.apps.loaded.search_youtube.siteCode;
					
					/* done from na.desktop already!
					jQuery(window).resize(function(){
						siteVideoSearch_resize();
					});
					na.vcc.settings['siteVideoSearch'].afterResize = na.m.traceFunction(function () {
						siteVideoSearch_resize();
					});
					*/
					
					/*
					na.m.fireAppEvent ({
						divName : '#siteVideoSearch',
						eventName : 'onresize'
					});*/
					//siteVideoSearch_resize();
                    //setTimeout(mp3site.onWindowResize, 10);
					
					//na.apps.loaded.search_youtube.settings.appContentHTMLelement = $('#siteContent__iframe')[0];
                    mp3site.startAppNested();
				},
				ondestroy : function (settings) {
                    if (!window.parent) {
                        
                        return false;
                    };
                    
                    var 
					pw = window.parent.window,
					pd = window.parent.document,
					psc = pw.na.s.c,
					psa = pw.sa,
                    m = window.parent.na.apps.loaded.mp3site, g = m.globals, s = m.settings, c = m.settings;
                    
                    jQuery('#siteContent__CSS3', pd).css({
                        opacity : c.oldContentOpacity
                    });
                    jQuery('#siteContent__dialog', pd).css({
                        border : c.oldContentBorder,
                        boxShadow : c.oldContentBoxShadow
                    });
                    
                    setTimeout (function() {
                        delete na.apps.loaded.mp3site;
                    }, 100);
                },
				onresize : function (settings) {
                    mp3site.onWindowResize();
				}
			}				
		},
        current : {},
		resizing : {}			
	}
};	

var mp3site = {
	about : {
		whatsThis : 'Complete application code for the music playback-and-download site on http://nicer.app/musicPlayer',
		copyright : 'Copyrighted (c) and All Rights Reserved (r) and All Rights Reserved (r) 2011-2018 by Rene AJM Veerman - rene.veerman.netherlands@gmail.com',
		license : 'http://nicer.app/LICENSE.txt',
		version : '3.1.0',
		firstReleased : '2011',
		lastUpdated : '2018-10-03(Wednesday) 17:55 CEST Amsterdam.NL timezone',
		knownBugs : {
			1 : "None atm, I think. Please report any bugs you find.."
		}
	},
    globals : {
        url : na.m.globals.urls.app + '/nicerapp/apps/nicerapp/musicPlayer/appContent/musicPlayer/'
    },
	settings : {
		playingIndex : 0,
		paused : false,
		stopped : true,
		repeating : false,
		
		masterLeftOffset : null,
		
		loadedIn : {
			'#siteContent__iframe' : {
				/*settings : {
					initialized : false
				},
				saConfigUpdate : function (settings) {
					na.apps.loaded.cardgame_tarot.globals.desktop.configs = na.apps.loaded.cardgame_tarot.globals.desktop.calculate.configs();
					na.desktop.settings.allConfigs = na.apps.loaded.cardgame_tarot.globals.desktop.configs;
				},
				onload : function (settings) {
					na.apps.loaded.cardgame_tarot.nestedStartApp();
				},*/
				onresize : function (settings) {
                    jQuery(window.top.document.getElementById('siteContent')).css({
                        width : jQuery(window.top.document.getElementById('siteContent__scrollpane'))[0].offsetWidth,
                        height : jQuery(window.top.document.getElementById('siteContent__scrollpane'))[0].offsetHeight
                    });

					jQuery(document.body).css({
                        width : jQuery(window.top.document.getElementById('siteContent__scrollpane'))[0].offsetWidth,
                        height : jQuery(window.top.document.getElementById('siteContent__scrollpane'))[0].offsetHeight
					});
					setTimeout(mp3site.onWindowResize, 10);
				}
			}
		}
		
	},
	language : {
		siteTitle : "DJ FireSnake's mixes"
	},
	startAppNested : function () {
        na.analytics.logMetaEvent ('musicPlayer : startAppNested()');
        jQuery('#siteContent',window.top.document.body).css({
            width : jQuery('#siteContent__scrollpane',window.top.document.body).outerWidth(),
            height : jQuery('#siteContent__scrollpane',window.top.document.body).outerHeight()
        });
        
		if (mp3site.settings.loaded) return false; else mp3site.settings.loaded = true;
		
		if (window === window.top) {
			mp3site.startApp();
		} else if (
			window.parent 
			&& window.parent.window
			&& window.parent.window.na
		) {
			mp3site.startApp();
			
			/*
			debugger;
			var f = window.parent.window.na.m.settings.iframeLoaded;
			console.log ('mp3site.nestedStartApp 3:', ''+f);
			jQuery('#iframe-content', window.parent.window.document).addClass('saDontHijackLinksInThis');
			if (typeof f==='function') f(mp3site.startApp);
			*/
		}
	},
	
	startApp : function () {
        na.analytics.logMetaEvent ('musicPlayer : startApp()');
		na.comments.globals = {
			removeCallback : mp3site.removeComment
		};
        //jQuery(document.body).css({opacity:0.001});
		na.vcc.init(document.body, mp3site.vividsInitialized, true);
	},
	
	vividsInitialized : function () {
        na.analytics.logMetaEvent ('musicPlayer : vividsInitialized()');
		mp3site.settings.vividsInitialized = true;
		jQuery('.vividDialog_dialog, #playlist_wrapper__dialog, #infoWindow_mp3desc__dialog, #infoWindow_comments__dialog, #mp3s__scrollpane__container, #player').css({opacity:0.0001});

		mp3site.setupDragNDrop();
		window.parent.na.s.c.transformLinks (jQuery('#mp3s')[0]);
		window.parent.na.s.c.transformLinks (jQuery('#player')[0]);
		
	
		// initialize the audio player
        /*
		$.jPlayer.timeFormat.showHour = true;
		jQuery("#jplayer").jPlayer({
			ready: function () {
			},
			ended: function (event) {
				var pl = jQuery('#playlist')[0];
				mp3site.settings.playingIndex++;
				if (mp3site.settings.playingIndex >= pl.children.length) {
					if (mp3site.settings.repeating) {
						mp3site.settings.playingIndex = 0;
						var fileID = jQuery(pl.children[mp3site.settings.playingIndex]).attr('file');
						mp3site.selectMP3 (pl.children[mp3site.settings.playingIndex].id, fileID, false);
					} else {
						mp3site.stop();
					}
				} else {
						var fileID = jQuery(pl.children[mp3site.settings.playingIndex]).attr('file');
						mp3site.selectMP3 (pl.children[mp3site.settings.playingIndex].id, fileID, false);
				}
			},
			supplied: "mp3",
			nativeSupport: false, //attempt to force this component to using swf (flash) for playback, because that shows a progress bar as mix downloads to browser;
			swfPath: na.m.globals.urls.framework + "/lib/jquery.jPlayer-2.5.0/"
		});
		*/
		// initially the comment editor is hidden:
		jQuery('#comment_editor').slideUp (1);
		jQuery('#comments, #comments__container').css ({height:(jQuery('#infoWindow_comments__dialog').height()-130) + 'px'});
		na.sp.containerSizeChanged(jQuery('#comments')[0]);
		
		// note paths to tinyMCE (rich text editor) CSS files
		var css_e = na.m.globals.urls.framework + '/lib/tinymce-3.5.10/jscripts/tiny_mce/themes/advanced/skins/default/ui_nicerappTransparency.css';
		var path = na.m.globals.urls.framework + "/lib/tinymce-3.5.10/nicerappTransparency/";
		var css_c = path + 'editor_comment.css,';
		if (navigator.userAgent.match(/MSIE/)) {
			css_c += path + 'editor_comment_ie5.css';
		} else {
			css_c += path + 'editor_comment_css3.css';
		};

        
		/*
		tinyMCE.init({
				// General options
				mode : "textareas",
				theme : "advanced",
				plugins : "autolink,lists,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

				// Theme options
				theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
				theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
				theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
				theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",
				theme_advanced_statusbar_location : "bottom",
				theme_advanced_resizing : true,

				// Skin options
				skin : "o2k7",
				skin_variant : "silver",

				// Example content CSS (should be your site CSS)
				content_css : "css/example.css",

				// Drop lists for link/image/media/template dialogs
				template_external_list_url : "js/template_list.js",
				external_link_list_url : "js/link_list.js",
				external_image_list_url : "js/image_list.js",
				media_external_list_url : "js/media_list.js",

				// Replace values for the template plugin
				template_replace_values : {
						username : "Some User",
						staffid : "991234"
				}
		});		
		
		*/
//debugger;
		/*
		tinyMCE.init({
			mode : "textareas",
			theme : "advanced",
			plugins : 'emotions',
			skin : 'default',
			
			init_instance_callback : na.m.traceFunction(function(){mp3site.editorInitialized()}), 

			theme_advanced_buttons1 : "bold,italic,underline,strikethrough,indent,outdent,bullist,numlist",
			theme_advanced_buttons2: "justifyleft,justifycenter,justifyright,justifyfull,link,unlink,emotions",
			theme_advanced_buttons3: "fontselect,fontsizeselect,forecolor,backcolor",
			theme_advanced_buttons4: "",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "center",
			font_size_style_values : "8px,10px,12px,14px,18px,24px,36px",
			keep_style : true, 
			content_css : css_c,
			editor_css : css_e,
			inline_styles : true,
			theme_advanced_resize_horizontal : false,
			theme_advanced_resizing : false,
			apply_source_formatting : true,
			convert_fonts_to_spans : true
		});	*/
		mp3site.editorInitialized();
	},
	
	editorInitialized : function () {
		//debugger;
        na.analytics.logMetaEvent ('musicPlayer : editorInitialized()');
		if (mp3site.settings.editorInitialized) return false;
		mp3site.settings.editorInitialized = true;
		na.m.settings.initialized.site = true;
	
		mp3site.hideCommentsEditor();

		// get rid of that spinning icon:		
		if (mp3site.settings.loaderIcon && mp3site.settings.loaderIcon.parentNode) mp3site.settings.loaderIcon.parentNode.removeChild (mp3site.settings.loaderIcon);

		//na.serviceLog.makeLogEntry();

		/*
		jQuery(window.top).resize(function () {
			jQuery(document.body).css({
				width : jQuery('#siteContent__contentDimensions', window.top.document.body)[0].offsetWidth,
				height : jQuery('#siteContent__contentDimensions', window.top.document.body)[0].offsetHeight
			});
			setTimeout(mp3site.onWindowResize, 10);
		});*/
		
		//mp3site.onWindowResize();
		jQuery('#siteLoadingMsg,#siteBootLog').fadeOut (300);
		jQuery('#siteBackground_img').fadeIn (700);
		setTimeout (function() {
			// now show the previously hidden site widgets and dialogs
				setTimeout (function() {
          			mp3site.onWindowResize();
					
					// use HTML5 History API if available:
					History.Adapter.bind(window,'statechange',function(){ 
						var state = History.getState(); 
						na.m.googleAnalyticsMakeHit();
						//na.serviceLog.makeLogEntry();
					});
					// For browsers that do not support the HTML5 History API:
					if (window.location.hash!=='') mp3site.selectMP3fromLocation (window.location.hash.replace(/#/,''));
					// For browsers that do support the HTML5 History API:
					if (window.location.href.match('play/')) mp3site.selectMP3fromLocation(window.location.href.replace(na.m.globals.urls.app,'').replace(/#.*/,''));
				},10); // the fade in takes 700!
		},10);
	},
	
	enterNewComment : function () {
		var 
		ed = tinyMCE.get('newComment'),
		now = new Date(),
		now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		var entry = {
			subscription : 'DJ_FireSnake',
			from : jQuery('#newCommentFrom')[0].value,
			when : na.m.dateForComments(),
			whenGetTime : now.getTime(),
			whenTimezoneOffset : now.getTimezoneOffset(),
			whenUTC : now_utc.getTime(),
			comment : ed.getContent()
		};
		jQuery.cookie ('commentFrom', jQuery('#newCommentFrom')[0].value);
		na.comments.newComment (entry, function (result, statusAsText) {
			jQuery('#comments').prepend (result);
			window.top.document.body.na.s.c.transformLinks (jQuery('#comments')[0]);
			na.s.c.hideCommentsEditor();
		});
	},
	
	removeComment : function (subscriptionName, commentIdx, result, statusAsText) {
		var $c = jQuery('#fwaComment_subscription_' + subscriptionName + '_item_' + commentIdx);
		$c.slideUp('slow', function () {
			$c.remove();
			na.sp.containerSizeChanged(jQuery('#comments')[0]);
		});
	},
	
	hideCommentsEditor : function () {
		jQuery('#comment_editor').slideUp ('slow');
		jQuery('#newCommentShowEditor_td').animate ({height:'35px'},500);
		jQuery('#newCommentShowEditor').fadeIn (500);
		jQuery('#comments, #comments__container').animate ({height:(jQuery('#infoWindow_comments__dialog').height()-130) + 'px'},500);
		setTimeout (function() {
			na.sp.containerSizeChanged(jQuery('#comments')[0]);
		}, 550);					
	},
	
	showCommentsEditor : function () {
		jQuery('#comments, #comments__container').animate ({height:(jQuery('#infoWindow_comments__dialog').height()-510) + 'px'}, 'slow', function () {
			na.sp.containerSizeChanged(jQuery('#comments')[0]);
		});
		jQuery('#newCommentShowEditor').fadeOut ('slow', function () {
			jQuery('#newCommentShowEditor_td').animate ({height:'1px'},'slow');
			jQuery('#comment_editor').show ('slow');
		});
	},
	
	toggleView : function (buttonID, divID) {
		var d = jQuery('#'+divID)[0];
		if (!mp3site.settings.toggleView) mp3site.settings.toggleView = {};
		if (!mp3site.settings.toggleView[divID]) mp3site.settings.toggleView[divID] = false;
		mp3site.settings.toggleView[divID] = !mp3site.settings.toggleView[divID];
		jQuery('#'+divID).css ({visibility:'visible'});
		if (divID=='infoWindow_tools') jQuery('#infoWindow_tools_content').css ({display:'block'});
		if (mp3site.settings.toggleView[divID]) {
			na.vcc.changeState (
				document.getElementById(buttonID),
				document.getElementById(buttonID+'__item__0'),
				'selected'
			);
			jQuery('#'+divID+'__dialog').css ({
				display : 'block',
				visibility : 'hidden'
			});
			jQuery('#'+divID+'__dialog').css ({
				display : 'none',
				visibility : 'visible',
				top : (jQuery('#'+buttonID).offset().top + jQuery('#'+buttonID)[0].offsetHeight + 10) + 'px',
				left : (jQuery('#'+buttonID).offset().left + jQuery('#'+buttonID)[0].offsetWidth - jQuery('#'+divID+'__dialog')[0].offsetWidth) + 'px'
			}).fadeIn('slow');
		} else {
			na.vcc.changeState (
				document.getElementById(buttonID),
				document.getElementById(buttonID+'__item__0'),
				'normal'
			);
			jQuery('#'+divID+'__dialog').fadeOut ('slow');
		}
	},
	
	queueMP3 : function (id, file) {
		var pl = document.getElementById('playlist');
		var pc = mp3site.playlistCount++;
		
		var newPlaylistItem = npi = document.createElement('div');
		npi.setAttribute ('file', file);
		npi.id = 'playlist_' + pc;
        npi.file = file;
        debugger;
		//npi.style.padding = '2px';
        //npi.style.height = '25px';
		npi.className = 'mp3 vividButton vividTheme__lava_002';
		npi.innerHTML = 
			'<a href="javascript:mp3site.selectMP3(\'' + npi.id + '\', \'' + file + '\');">'
			+ file.replace(' - DJ FireSnake.mp3', '')
			+ '</a>';
		
		pl.appendChild (npi);
		na.vcc.init (npi, function () {
			//na.sp.containerSizeChanged(jQuery('#playlist_wrapper__scrollpane')[0]);
            na.apps.loaded.mp3site.onWindowResize();
			if (mp3site.settings.stopped) {		
				mp3site.selectMP3 (npi.id, file);
			}
		});
	},
	
	selectMP3fromLocation : function (location) {
		location = location.replace ('/play/', '').replace(/_/g,' ');

		// check if mix to play is already in playlist;
		var winner = null;
		var pl = document.getElementById('playlist');
		for (var i=0; i<pl.children.length; i++) {
			if (pl.children[i].getAttribute('file').match(location)) winner = pl.children[i];
		};
		if (winner) {
			mp3site.selectMP3 (winner, winner.getAttribute('file'));
		} else {
			// mix to play is not in playlist, add it to playlist if we can find it in the main mp3 list;
			var mp3list = document.getElementById('mp3s');
			
			for (var i=0; i<mp3list.children.length; i++) {
				if (mp3list.children[i].id!='mp3s__images' && mp3list.children[i].getAttribute('file').match(location)) winner = mp3list.children[i];
			};
			if (winner) mp3site.queueMP3 (winner, winner.getAttribute('file'));
		}
	},

	selectMP3 : function (id, file, firstRun) {
		mp3site.settings.activeID = id;
		
        mp3site.settings.playingIndex = false;
		var pl = jQuery('#playlist')[0];
		for (var i=0; i<pl.children.length; i++) {
			if (pl.children[i].id==id) mp3site.settings.playingIndex = i;
		};
        
        if (!file) debugger;
        na.analytics.logMetaEvent ('musicPlayer : selectMP3() file='+file);

		var ajaxCommand = {
			type : 'GET',
			// LOCAL = SLOW, CLOGS ADSL LINE : 
			url : mp3site.globals.url + '/music/'+naLocationBarInfo['apps']['musicPlayer']['set']+'/' + file + '.json',
			//url : na.m.globals.urls.upstream.apps.nicerapp.musicPlayer.cloudhosting['DJ_FireSnake'].saApp.musicPlayer.music['DJ_FireSnake'].hosting['godaddy.com'] + file + '.json',
            error: function(l0_jqXHR, l0_textStatus, l0_errorThrown) {
				var html = '';
                html += '<table>';
				html += '<tr><td colspan="2" style="text-align:center"><a href="' + mp3site.globals.url + '/download_mp3.php?file='+file+'">download</a></td></tr>';
				html += '<tr><td><span class="mp3_info_label mp3_title_label">title</span></td><td><span class="mp3_title">'+file+'</span></td></tr>';
                html += '</table>';
                mp3site.updateDescriptionDiv(id, file, firstRun, html);
            },
			success : function (json, ts) {
				var mixTitle = file.replace ('- DJ FireSnake.mp3','').replace('.mp3','');
				var mixLoc = file.replace (' - DJ FireSnake.mp3','').replace('.mp3','').replace(/ /g, '_');
				//window.History.pushState (null, mp3site.language.siteTitle + ' - ' + mixTitle, na.m.globals.urls.app+'/musicPlayer(play\''+mixLoc+'\')');
			
				if (typeof json!=='object') json = eval ('('+json+') ');
                if (json.description) {
                    var html = '';
                    html += '<table>';
                    html += '<tr><td colspan="2" style="text-align:center"><a href="' + mp3site.globals.url + '/download_mp3.php?file='+file+'">download</a></td></tr>';
                    html += '<tr><td><span class="mp3_info_label mp3_title_label">title</span></td><td><span class="mp3_title">'+json.title+'</span></td></tr>';
                    html += '<tr><td><span class="mp3_info_label mp3_album_label">album</span></td><td><span class="mp3_album">' + json.album + '</span></td></tr>';
                    html += '<tr><td><span class="mp3_info_label mp3_length_label">length</span></td><td><span class="mp3_length">' + json.length + '</span></td></tr>';
                    html += '<tr><td><span class="mp3_info_label mp3_year_label">year</span></td><td><span class="mp3_year">'+json.year+'</span></td></tr>';
                    html += '<tr><td colspan="2"><span class="mp3_description">' + json.description + '</span></td></tr>';
                    html += '</table>';
                } else {
                    var html = '';
                    html += '<table>';
                    html += '<tr><td colspan="2" style="text-align:center"><a href="' + mp3site.globals.url + '/download_mp3.php?file='+file+'">download</a></td></tr>';
                    html += '<tr><td colspan="2" style="text-align:center"><a href="https://youtube.com/watch?v='+json.youtubeID+'" target="_new">youtube link</a></td></tr>';
                }
                mp3site.updateDescriptionDiv(id, file, firstRun, html);
			}
		};
		jQuery.ajax(ajaxCommand);

	},
    
    updateDescriptionDiv : function (id, file, firstRun, html) {
        jQuery('#siteIntroText').fadeOut (500, function () {
            jQuery('.mp3').each (function (index,element) {
                if (this.id=='') return false;
                if (this.id==id) var state = 'selected'; else var state='normal';
                na.vcc.changeState (
                    document.getElementById(this.id),
                    document.getElementById(this.id+'__item__0'),
                    state
                );
            });
            jQuery('#mp3descText').fadeOut(400).html (html).fadeIn(1000, function () { 
                na.sp.containerSizeChanged (jQuery('#mp3descText')[0]);
            });
            
            
            setTimeout (function () {
                /*
                if (jQuery('#mp3desc__container').length>0) {
                    jQuery('#mp3desc__container').css ({
                        height : jQuery('#infoWindow_mp3desc').height() + 'px'
                    });
                    na.sp.containerSizeChanged(jQuery('#infoWindow_mp3desc__scrollpane')[0]);
                };
                na.sp.containerSizeChanged(jQuery('#infoWindow_mp3desc__scrollpane')[0]);
                */
/*
                if (jQuery('#infoWindow_mp3desc').css('visibility')=='hidden') {
                    jQuery('#infoWindow_mp3desc__dialog').css ({
                        display : 'none',
                        visibility:'visible'
                    }).fadeIn ('slow');
                    jQuery('#infoWindow_mp3desc').css({visibility:'visible'});
                }
*/						
                if (!firstRun) {
                    var 
                    mp3 = na.m.globals.urls.app + '/nicerapp/apps/nicerapp/musicPlayer/appContent/musicPlayer/music/'+naLocationBarInfo['apps']['musicPlayer']['set']+'/' + file;
                    jQuery('#audioTag')[0].src = mp3;
                    jQuery('#audioTag')[0].play();
                    /*
                    jQuery('#jplayer.jp-jplayer').jPlayer("setMedia", {
                        // SLOW, CLOGS ADSL LINE : 
                        mp3: na.m.globals.urls.app + '/nicerapp/apps/nicerapp/musicPlayer/appContent/musicPlayer/music/'+naLocationBarInfo['apps']['musicPlayer']['set']+'/' + file
                        //mp3 : na.m.globals.urls.upstream.apps.nicerapp.musicPlayer.cloudhosting['DJ_FireSnake'].saApp.musicPlayer.music['DJ_FireSnake'].hosting['godaddy.com'] + file,
                    }).jPlayer("play");
                    */
                    mp3site.settings.stopped = false;
                    mp3site.setTimeDisplayInterval();
                }

                if (document.getElementById('btn_playpause__item__0') )
                na.vcc.changeState (
                    document.getElementById('btn_playpause'),
                    document.getElementById('btn_playpause__item__0'),
                    'selected'
                );
            }, 100);
        });

    },
    
    setTimeDisplayInterval : function () {
        if (!mp3site.settings.timeDisplayInterval) 
            mp3site.settings.timeDisplayInterval = setInterval (function() {
                var 
                length = jQuery('#audioTag')[0].duration, // in seconds
                strLength = mp3site.convertSecondsToTimeString(length),
                currentTime = jQuery('#audioTag')[0].currentTime, // in seconds
                strCurrentTime = mp3site.convertSecondsToTimeString(currentTime);
                
                if (currentTime==length) {
                    mp3site.next();
                } else {
                    
                    jQuery('.jp-duration').html(strLength);
                    jQuery('.jp-current-time').html(strCurrentTime);
                    
                    var 
                    widthSeekBar = jQuery('.jp-seek-bar').width(),
                    widthPlayBar = Math.floor((widthSeekBar * currentTime)/length);
                    
                    jQuery('.jp-play-bar')[0].style.width = widthPlayBar+'px';
                }
                
            }, 1000);
    },
    
    convertSecondsToTimeString : function (seconds) {
        var 
        hours = Math.floor(seconds/3600),
        minutes = Math.floor( (seconds-(hours * 3600)) / 60 ),
        secs = Math.floor(seconds - (hours * 3600) - (minutes * 60));
        
        if (hours<10) hours = '0'+hours;
        if (minutes<10) minutes = '0'+minutes;
        if (secs<10) secs = '0'+secs;
        
        return hours+':'+minutes+':'+secs;
    },
	
	playpause : function () {
		if (mp3site.settings.stopped || mp3site.settings.paused) {
			na.vcc.changeState(
				document.getElementById('btn_playpause'),
				document.getElementById('btn_playpause__item__0'),
				'selected'
			);
			jQuery('#audioTag')[0].play();
			mp3site.settings.paused = false;
			mp3site.settings.stopped = false;
		} else {
			na.vcc.changeState(
				document.getElementById('btn_playpause'),
				document.getElementById('btn_playpause__item__0'),
				'normal'
			);
			jQuery('#audioTag')[0].pause();
			mp3site.settings.paused = true;
			mp3site.settings.stopped = false;
		}
	},
	
	stop : function () {
		na.vcc.changeState(
			document.getElementById('btn_playpause'),
			document.getElementById('btn_playpause__item__0'),
			'normal'
		);
		jQuery('#audioTag')[0].pause();
		mp3site.settings.stopped = true;

		jQuery('.mp3').each (function (index,element) {
			if (this.id=='') return false;
			na.vcc.changeState (
				documeforwardnt.getElementById(this.id),
				document.getElementById(this.id+'__item__0'),
				'normal'
			);
		});
		jQuery('#mp3descText').fadeOut (1000);
		setTimeout (function () {
			jQuery('#siteIntroText').fadeIn (1000);
			/*
			setTimeout (function () {
				na.sp.containerSizeChanged(jQuery('#infoWindow_mp3desc__scrollpane')[0]);
			}, 100);*/
		}, 1010);
	},
    
    next : function () {
        if (mp3site.settings.playingIndex===false) {
            return false;
        } else {
            var pl = jQuery('#playlist')[0];
            for (var i=0; i<pl.children.length; i++) {
                var newIndex = 'playlist_' + (mp3site.settings.playingIndex + 1);
                if (pl.children[i].id == newIndex) {
                    mp3site.selectMP3 (newIndex, pl.children[i].file, false);
                    return true;
                }
            }
            //var x = jQuery('#btn_repeat').hasClass('selected');
            //if (x) {
            var x = na.vcc.settings['btn_repeat'].items[0].stateCurrent;
            if (x === 'selected') {
                var newIndex = 'playlist_0';
                if (pl.children[0].id == newIndex) {
                    mp3site.selectMP3 (newIndex, pl.children[0].file, false);
                    return true;
                }
            }
        };            
    },
	
	mute : function () {
		if (mp3site.settings.muted) {
			na.vcc.changeState(
				document.getElementById('btn_mute'),
				document.getElementById('btn_mute__item__0'),
				'normal'
			);
			jQuery('#jplayer').jPlayer('unmute');
			mp3site.settings.muted = false;
		} else {
			na.vcc.changeState(
				document.getElementById('btn_mute'),
				document.getElementById('btn_mute__item__0'),
				'selected'
			);
			jQuery('#jplayer').jPlayer('mute');
			mp3site.settings.muted = true;
		}
	},
    
	toggleRepeat : function () {
		mp3site.settings.repeating = !mp3site.settings.repeating;
			na.vcc.changeState(
				document.getElementById('btn_repeat'),
				document.getElementById('btn_repeat__item__0'),
				mp3site.settings.repeating ? 'selected' : 'normal'
			);
	},
    
    seek : function (evt) {
        var 
        length = jQuery('#audioTag')[0].duration, // in seconds
        strLength = mp3site.convertSecondsToTimeString(length),
        currentTime = jQuery('#audioTag')[0].currentTime;
        
        jQuery('.jp-duration').html(strLength);
        //jQuery('.jp-current-time').html(strCurrentTime);
        
        var 
        widthSeekBar = jQuery('.jp-seek-bar').width(),
        widthPlayBar = evt.offsetX;//Math.round((widthSeekBar * evt.offsetX)/length),
        newCurrentTime = Math.round((widthPlayBar * length)/widthSeekBar);

        jQuery('.jp-play-bar')[0].style.width = widthPlayBar+'px';
        jQuery('#audioTag')[0].currentTime = newCurrentTime;
    },
    
    setVolume : function (evt) {
        var 
        widthVolumeBar = jQuery('.jp-volume-bar').width();
        debugger;
        jQuery('#audioTag')[0].volume = evt.offsetX / widthVolumeBar;
        jQuery('.jp-volume-bar-value').css ({ width : evt.offsetX });
    },
	
	setupDragNDrop : function () {
		var mp3s = jQuery('.mp3');
		jQuery('.mp3').draggable ({
			containment : 'window',
			connectToSortable : '#playlist',
			helper : function (evt, ui) {
                /*debugger; //BUG_MUSIC_PLAYER__ANIMATIONS
                na.vcc.changeState(
                    document.getElementById(this.id),
                    document.getElementById(this.id+'__item__0'),
                    'normal'
                );*/
                //setTimeout (function () {
                    var div = document.createElement ('div');
                    if (this) div.appendChild (this.cloneNode(true));
                    document.body.appendChild (div);
                    return div;
                //}, 2000);
			}
		});
		jQuery('#playlist').sortable({
			revert : true,
			start : function (evt, ui) {
				var buttonID = ui.item[0].children[0].id.replace(/__item__0/,'');
				na.vcc.settings[buttonID].items[0].ignoreClickEvent = true;
			},
			stop : function (evt, ui) {
				var buttonID = ui.item[0].children[0].id.replace(/__item__0/,'');
				//na.vcc.settings[buttonID].items[0].statePrevious = 'normal';
				na.vcc.settings[buttonID].items[0].ignoreClickEvent = false;
			}
		});
		jQuery('#playlist').droppable ({
			drop : function (evt, ui) {
				var pl = jQuery('#playlist')[0];
				var dragged = ui.draggable[0];
				var pc = mp3site.playlistCount;
				//setTimeout (function () {
                    if (!ui.helper[0].children[0]) return false;
                
					var 
					oldID = ui.helper[0].children[0].id,
					original = jQuery('#'+oldID),
					newID = 'playlist_'+pc;//ui.helper[0].children[0].id;
                    
                    if (oldID.match('playlist_')) return false;
                    
					dragged.id = newID;
					dragged.className = 'mp3 vividButton vividTheme__lava_002';
                    dragged.style.height = '30px';
                    jQuery(dragged).attr('file', original.attr('file'));
                    dragged.file = original.attr('file');

					var listItemID = ui.helper[0].children[0].children[0].id.replace('__item__0','');
					if (listItemID=='') listItemID = ui.helper[0].children[0].id.replace('__item__0','');
					var listItem = na.vcc.settings[listItemID].items[0];
//						listItem.url = listItem.url.replace (new RegExp(oldID), dragged.id);
                    
                    
					var sc = listItem.stateCurrent;
					listItem.stateCurrent = 'normal';
					listItem.statePrevious = 'normal';

                    jQuery(dragged).html(jQuery('td', dragged)[0].innerHTML);
					na.vcc.init (dragged, function () {
                        setTimeout (function() {
                            na.vcc.changeState (
                                document.getElementById(dragged.id),
                                document.getElementById(dragged.id+'__item__0'),
                                'normal'
                            );
                        }, 400);
                        
                        var 
                        playlistItem = na.vcc.settings[oldID].items[0],
                        item = na.vcc.settings[newID].items[0];
                        
                        item.stateCurrent = sc;
                        item.url = playlistItem.url.replace (new RegExp(oldID), dragged.id);
                        
                        var pl = jQuery('#playlist')[0];
                        for (var i=0; i<pl.children.length; i++) {
                            //console.log (pl.children[i].id + ' - ' +na.vcc.settings[pl.children[i].id].items[0].stateCurrent);
                            if (na.vcc.settings[pl.children[i].id] && na.vcc.settings[pl.children[i].id].items[0].stateCurrent=='selected') mp3site.settings.playingIndex = i;
                        };
                        //debugger;
                        
                        //setTimeout (mp3site.onWindowResize, 1000);
                        //na.sp.containerSizeChanged(jQuery('#playlist_wrapper__scrollpane')[0]);

                        if (mp3site.settings.stopped) mp3site.selectMP3 (dragged.id, jQuery(dragged).attr('file'), false);
                                 
                        mp3site.onWindowResize();
                        
                    });
				//}, 50);
				mp3site.playlistCount++;
			}
		});
	},
	playlistCount : 0,

	onWindowResize : function () {
        //setTimeout (function () {
        if (!window.top || !jQuery(window.top.document.getElementById('siteContent__contentDimensions'))[0]) return false;
		var 
		myWidth = jQuery(window.top.document.getElementById('siteContent__contentDimensions'))[0].offsetWidth,
		myHeight = jQuery(window.top.document.getElementById('siteContent__contentDimensions'))[0].offsetHeight - jQuery('#horizontalMover__containmentBox2').height() - jQuery('#horizontalMover__containmentBox2')[0].offsetTop - 50,
		contentWidth = 20 + 240 + 40 + 300 + 20;
        
        
        
		var returnNow = !(
			window.top.na.m.settings.initialized.site === true
			//&& window.top.na.s.c.settings.booting === false
			//&& window.top.na.desktop.settings.animating === false
			&& mp3site.settings.vividsInitialized === true
		);
		//var rt = returnNow?'true':'false';
		//na.statusbar.update (rt, false);
		if (false) { //returnNow) {
			setTimeout (mp3site.onWindowResize, 1000);
			return false;
		}
		
		
		var
		sc_scrollpane = jQuery('#siteContent__scrollpane', window.top.document.body),
		sc_scrollpaneContainer = jQuery('#siteContent__scrollpane__container', window.top.document.body),
		sc_siteContent = jQuery('#siteContent', window.top.document.body);
		jQuery(sc_scrollpane).css ({
            height : sc_scrollpaneContainer[0].offsetHeight
        });
		jQuery(sc_siteContent).css ({
            height : sc_scrollpaneContainer[0].offsetHeight
        });

        
		window.top.na.sp.containerSizeChanged (jQuery('#siteContent__scrollpane', window.top.document.body)[0], true);
        

		if (typeof mp3site.settings.masterLeftOffset == 'number') {
			var masterLeftOffset = mp3site.settings.masterLeftOffset;
			if (masterLeftOffset<0) masterLeftOffset=0;
		} else {
			var masterLeftOffset = ((myWidth - contentWidth) / 2);
			if (masterLeftOffset<0) masterLeftOffset=0;
			mp3site.settings.masterLeftOffset = masterLeftOffset;
		}
		
		jQuery('.vd_btns').css({display:'none'}),
		failed = false;
//debugger;
		var 
		timeDelay = 10,
		timeIncrease = 50,
        leftOffset = masterLeftOffset + 20;
		
		//debugger;
			/*
			function resizeIframe_mp3site () {
				jQuery(window).resize(function(){
						jQuery("#siteContent__iframe", window.parent.document.body).css({
							width:jQuery("#siteContent__contentDimensions", window.parent.document.body)[0].offsetWidth, 
							height:jQuery("#siteContent__contentDimensions", window.parent.document.body)[0].offsetHeight
						})
				});
				jQuery("#siteContent__iframe", window.parent.document.body).css({
						width:jQuery("#siteContent__contentDimensions", window.parent.document.body)[0].offsetWidth, 
						height:jQuery("#siteContent__contentDimensions", window.parent.document.body)[0].offsetHeight
				});		
			}*/	

			//resizeIframe();
			
			/*
			jQuery("#siteContent__iframe", window.top.document.body).css({
				width:jQuery("#siteContent__contentDimensions", window.top.document.body)[0].offsetWidth, 
				height:jQuery("#siteContent__contentDimensions", window.top.document.body)[0].offsetHeight
			})*/

			
		jQuery('#horizontalMover__containmentBox2').css({
			left : 0,
			width : myWidth - 30,
			opacity : 0.001,
			display : 'block'
		}).animate ({opacity:0.1},1000);
		jQuery('#horizontalMover__containmentBox1').css({
			left : 2,
			width : myWidth - 34,
			opacity : 0.001,
			display : 'block'
		}).animate ({opacity:0.3},1300);
		if (!mp3site.settings.afterInitializing) {
            mp3site.settings.afterInitializing = true;
            setTimeout (function() {
                jQuery(document.body).animate({opacity:1}, 'fast');
                jQuery('#horizontalMover').css({
                    width : 610,
                    opacity : 0.001,
                    display : 'block'
                }).animate ({opacity:0.5}, 700);
            }, 100);
        
            //setTimeout (function() {
			jQuery('.vividDialog, .vividScrollpane, .vividDialog_dialog, .vsp_container, #heading_wrapper, #siteIntroText, #mp3s__scrollpane__container, #mp3s__scrollpane, #mp3s, #player, #player_table, #playlist_wrapper, #infoWindow_help, #comments')
				.not ('#infoWindow_info, #infoWindow_tools, #infoWindow_tools__dialog, #infoWindow_info__dialog')
				.css ({visibility:'visible',display:'block',opacity:1});
            //}, 1000);
        }
		
		//debugger;
        na.vcc.applyTheme ('infoWindow_mp3desc');				
		
        //setTimeout (function() {
            jQuery('#infoWindow_mp3desc__dialog, #infoWindow_mp3desc__CSS3, #infoWindow_mp3desc__item__0, #infoWindow_mp3desc__item__0__img1, infoWindow_mp3desc__item__0__img2, #infoWindow_mp3desc__scrollpane__container, #infoWindow_mp3desc__scrollpane').css({
                position : 'absolute',
                width : 300,
                height : (myHeight - 40 - 120) /2,
                opacity : 1                                                                                                                                                                                                                                                
            });
            jQuery('#infoWindow_mp3desc__dialog').css({
                left : leftOffset + 250 + 20,
                top : 30 + jQuery('#player__dialog')[0].offsetHeight + 20,
                width : 300,
                height : ((myHeight - 40 - 120) /2),
                opacity : 1
            });
			jQuery('#infoWindow_mp3desc__CSS3').css({
				width : 300,
				height : (myHeight - 40 - 120) /2,
                opacity : 0.5
			});
            
            
            jQuery('#infoWindow_mp3desc > table').css({
                width : '',
                height : ((myHeight - 40 - 120) /2),
                opacity : 1
            });
            jQuery('#infoWindow_mp3desc').css({
                height : 'auto',
                width : '',
                left : 0,
                top : 0,
                overflow : 'hidden',
                opacity : 1
            });
            jQuery('#infoWindow_mp3desc__scrollpane').css({
                overflow : 'hidden',
                opacity : 1
            });
            
            //setTimeout (function() {
                na.sp.containerSizeChanged (jQuery('#infoWindow_mp3desc__scrollpane')[0]);
                /*
                jQuery('#infoWindow_mp3desc__dialog').animate({
                    opacity : 1
                });
                */
            //}, 10);// + (5 * timeIncrease) );
        //}, timeDelay);// + (1 * timeIncrease) );
			
	 
		var dialogMP3sList = '#mp3s__scrollpane__container';
		if (jQuery('#infoWindow_mp3desc__dialog').length>0) var dialogMP3desc = '#infoWindow_mp3desc__dialog'; 
			else var dialogMP3desc = '#infoWindow_mp3desc';
		if (jQuery('#playlist_wrapper__dialog').length>0) var dialogPlaylist = '#playlist_wrapper__dialog, #playlist_wrapper'; 
			else var dialogPlaylist = '#playlist_wrapper';
		if (jQuery('#player__dialog').length>0) var dialogPlayer = '#player__dialog, #player, #player__CSS3'; 
			else var dialogPlayer = '#player, #player__CSS3';
		
		if (jQuery('#infoWindow_comments__dialog').length>0) var dialogComments = '#infoWindow_comments__dialog'; else var dialogComments = '#infoWindow_comments';

        var 
		$dialogHeading = jQuery('#heading_wrapper'),
		$dialogMP3sList = jQuery(dialogMP3sList),
		$dialogMP3desc = jQuery(dialogMP3desc),
		$dialogPlaylist = jQuery(dialogPlaylist),
		$dialogPlayer = jQuery(dialogPlayer),
		$dialogComments = jQuery(dialogComments),
		centerDialogsWidth = jQuery(dialogMP3sList).width() + $dialogPlaylist.width() + $dialogComments.width(),
		dialogsLeft = Math.round (leftOffset),
		dialogsTop = 30,//$dialogHeading[0].offsetTop + $dialogHeading.height() + 10,
		dialogsHeight = (myHeight - dialogsTop - 40);

        jQuery('#horizontalMover').css({
			left : masterLeftOffset
		});


        //setTimeout(function(){
            var playerLeft = (leftOffset + 250 + 20);
            jQuery('#player__dialog, #player__CSS3').css ({
                left : playerLeft,
                width : 300,
                top : dialogsTop + 'px',
                opacity : 1
            });
            jQuery('#player__CSS3').css ({ left : '', top : '', opacity : 0.5 });
            na.vcc.applyTheme ('player');
            jQuery('#player').css ({ left : 10, width : 300, top : 10, opacity : 1 });
            
            
            
            jQuery('#mp3s__dialog').css ({
                visibility : 'visible',
                position : 'absolute',
                left : dialogsLeft,
                width : 260,
                height : myHeight ,
                top : dialogsTop,
                opacity : 1
            });
            jQuery('#mp3s__CSS3').css({display:'none',opacity:0.0001});
            jQuery('#mp3s__scrollpane__container').css ({
                visibility : 'visible',
                left : 1,
                opacity : 1,
                width : 230,
                height : myHeight 
            });
            jQuery('#mp3s__scrollpane').css ({
                left : 0, // was 25, but that gave jitters when moving #horizontalMover
                width : 230,
                overflow : 'hidden',
                height : myHeight,
                opacity : 1
            });
            jQuery('#mp3s').css ({
                left : 0,
                width : 200,
                height : 'auto',
                opacity : 1
            });
            
            // hardcoded for now with use of vividTheme__lava_002.png
            jQuery('.vbutton_item, .vbutton_img', jQuery('.mp3', jQuery('#mp3s')[0])).css ({
                width : 200
                //height : 23
            });
            jQuery('.mp3', jQuery('#mp3s')[0]).css ({
                width : 200,
                height : 25
            });

            na.vcc.applyTheme ('mp3s');
            
            //setTimeout (function() {
                na.sp.containerSizeChanged(jQuery('#mp3s__scrollpane')[0], true);
            //}, 200 );
            
			$dialogPlaylist.css ({
				left : leftOffset + 250 + 20,
				width : 300,
				height : (myHeight - 40 - 120) /2,
				top : ($dialogMP3desc[0].offsetTop + $dialogMP3desc.height() + 20) + 'px',
				opacity : 1
			});
			jQuery('#playlist_wrapper__CSS3').css({
				width : 300,
				height : (myHeight - 40 - 120) /2,
				opacity : 0.5
			});
			jQuery('#playlist_wrapper').css ({
				top : 1,
				left : 1,
				position : 'relative',
				opacity : 1
			});
			jQuery('#playlist').css ({ 
				zIndex : 1000 * 1000, 
				width : '100%', 
				height : '100%' 
			});
				
			//na.vcc.applyTheme ('playlist_wrapper');
            
            jQuery('.mp3', jQuery('#playlist_wrapper')[0]).css({height:30});
            debugger;
		//}, timeDelay);// + (3 * timeIncrease) );

        /*
		setTimeout (function() {
			//na.sp.containerSizeChanged (jQuery('#playlist_wrapper__scrollpane')[0]);
			window.top.na.sp.containerSizeChanged (jQuery('#siteContent__scrollpane', window.top.document.body)[0], true);
		}, timeDelay + (8 * timeIncrease) );
		*/
		
        
        
        
        
		/*
		setTimeout(function(){
			jQuery('#infoWindow_comments__CSS3').css({
				width : 370,
				height : jQuery(document.body).height() - 40,
			});
		}, timeDelay + (7 * timeIncrease) );
		
		/*
		setTimeout (function () {
			if (jQuery('#infoWindow_comments__dialog')[0]) {
				jQuery('#comments_table, #infoWindow_comments, #infoWindow_comments__content').css({
					top : '',
					left : '',
					width : jQuery('#infoWindow_comments__dialog')[0].offsetWidth,
					height : jQuery('#infoWindow_comments__dialog')[0].offsetHeight
				});
			}
		}, timeDelay + (8 * timeIncrease) );
		
		
		
		jQuery('#comments').css ({
			width : jQuery('#infoWindow_comments').width()-30
		});
		var $cc = jQuery('#comments__container');
		if ($cc.length>0) {
			var $ce = jQuery('#comment_editor');
			jQuery('#comments__container').css ({
				height : ( jQuery('#infoWindow_comments').height() - 26 - ($ce.css('display')==='none'? 0 : $ce.height()) - jQuery('#newCommentShowEditor').height()  ) + 'px'
			});
			//console.log ('t1: '+jQuery('#comments__container').height());
			//na.sp.containerSizeChanged(jQuery('#comments')[0]);
		};
		
		setTimeout (function() {
		jQuery('#player__dialog, #playlist_wrapper__dialog, #infoWindow_mp3desc__dialog, #infoWindow_comments__dialog, #mp3s__scrollpane__container').css({opacity:1});
		}, timeDelay + (9 * timeIncrease) );
	
		if (failed) setTimeout (mp3site.onWindowResize, 500);
		*/
        //}, 200);
		
	}
	
};
