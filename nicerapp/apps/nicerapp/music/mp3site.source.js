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
        url : '/nicerapp/apps/nicerapp/musicPlayer/appContent/musicPlayer/'
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
					$(document.body).css({
                        width : $(window.top.document.getElementById('siteContent'))[0].offsetWidth,
                        height : $(window.top.document.getElementById('siteContent'))[0].offsetHeight
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
			$('#iframe-content', window.parent.window.document).addClass('saDontHijackLinksInThis');
			if (typeof f==='function') f(mp3site.startApp);
			*/
		}
	},
	
	startApp : function () {
        na.analytics.logMetaEvent ('musicPlayer : startApp()');
        mp3site.vividsInitialized();
	},
	
	vividsInitialized : function () {
		$('.vividDialog_dialog, #playlist_wrapper, #infoWindow_mp3desc, #infoWindow_comments, #mp3s, #player').css({opacity:0.0001});

        mp3site.setupDragNDrop();

        mp3site.editorInitialized();
	},
	
	editorInitialized : function () {
		//debugger;
        na.analytics.logMetaEvent ('musicPlayer : editorInitialized()');
		if (mp3site.settings.editorInitialized) return false;
		mp3site.settings.editorInitialized = true;
	
		mp3site.hideCommentsEditor();
		$('#siteBackground_img').fadeIn (700);
		setTimeout (function() {
			// now show the previously hidden site widgets and dialogs
				setTimeout (function() {
          			mp3site.onWindowResize();
					
					// For browsers that do not support the HTML5 History API:
					if (window.location.hash!=='') mp3site.selectMP3fromLocation (window.location.hash.replace(/#/,''));
					// For browsers that do support the HTML5 History API:
					//if (window.location.href.match('play/')) mp3site.selectMP3fromLocation(window.location.href.replace(na.m.globals.urls.app,'').replace(/#.*/,''));
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
			from : $('#newCommentFrom')[0].value,
			when : na.m.dateForComments(),
			whenGetTime : now.getTime(),
			whenTimezoneOffset : now.getTimezoneOffset(),
			whenUTC : now_utc.getTime(),
			comment : ed.getContent()
		};
		$.cookie ('commentFrom', $('#newCommentFrom')[0].value);
		na.comments.newComment (entry, function (result, statusAsText) {
			$('#comments').prepend (result);
			window.top.document.body.na.s.c.transformLinks ($('#comments')[0]);
			na.s.c.hideCommentsEditor();
		});
	},
	
	removeComment : function (subscriptionName, commentIdx, result, statusAsText) {
		var $c = $('#fwaComment_subscription_' + subscriptionName + '_item_' + commentIdx);
		$c.slideUp('slow', function () {
			$c.remove();
			na.sp.containerSizeChanged($('#comments')[0]);
		});
	},
	
	hideCommentsEditor : function () {
	},
	
	showCommentsEditor : function () {
	},
	
	toggleView : function (buttonID, divID) {
		var d = $('#'+divID)[0];
		if (!mp3site.settings.toggleView) mp3site.settings.toggleView = {};
		if (!mp3site.settings.toggleView[divID]) mp3site.settings.toggleView[divID] = false;
		mp3site.settings.toggleView[divID] = !mp3site.settings.toggleView[divID];
		$('#'+divID).css ({visibility:'visible'});
		if (divID=='infoWindow_tools') $('#infoWindow_tools_content').css ({display:'block'});
		if (mp3site.settings.toggleView[divID]) {
			$('#'+divID+'').css ({
				display : 'block',
				visibility : 'hidden'
			});
			$('#'+divID+'').css ({
				display : 'none',
				visibility : 'visible',
				top : ($('#'+buttonID).offset().top + $('#'+buttonID)[0].offsetHeight + 10) + 'px',
				left : ($('#'+buttonID).offset().left + $('#'+buttonID)[0].offsetWidth - $('#'+divID+'')[0].offsetWidth) + 'px'
			}).fadeIn('slow');
		} else {
			na.vcc.changeState (
				document.getElementById(buttonID),
				document.getElementById(buttonID+'__item__0'),
				'normal'
			);
			$('#'+divID+'').fadeOut ('slow');
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
		npi.className = 'mp3 vividButton';
        $(npi).attr('theme','dark');
		npi.innerHTML = 
			'<a href="javascript:mp3site.selectMP3(\'' + npi.id + '\', \'' + file + '\');">'
			+ file.replace(' - DJ FireSnake.mp3', '')
			+ '</a>';
		
		pl.appendChild (npi);
        na.apps.loaded.mp3site.onWindowResize();
        if (mp3site.settings.stopped) {		
            mp3site.selectMP3 (npi.id, file);
        }
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
		var pl = $('#playlist')[0];
		for (var i=0; i<pl.children.length; i++) {
			if (pl.children[i].id==id) mp3site.settings.playingIndex = i;
		};
        if (!file) debugger;
        na.analytics.logMetaEvent ('musicPlayer : selectMP3() file='+file);
        
        $('.mp3').removeClass('selected').removeClass('vividButtonSelected').addClass('vividButton');
        $('#'+id).addClass('selected').removeClass('vividButton').addClass('vividButtonSelected');

		var ajaxCommand = {
			type : 'GET',
			// LOCAL = SLOW, CLOGS ADSL LINE : 
			url : '/nicerapp/apps/nicerapp/music/music/'+naLocationBarInfo['apps']['music']['set']+'/' + file + '.json',
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
		$.ajax(ajaxCommand);

	},
    
    updateDescriptionDiv : function (id, file, firstRun, html) {
        $('#siteIntroText').fadeOut (500, function () {
            $('.mp3').each (function (index,element) {
                if (this.id=='') return false;
                if (this.id==id) var state = 'selected'; else var state='normal';
            });
            $('#mp3descText').fadeOut(400).html (html).fadeIn(1000, function () { 
                
            });
            
            
            setTimeout (function () {
                /*
                if ($('#mp3desc__container').length>0) {
                    $('#mp3desc__container').css ({
                        height : $('#infoWindow_mp3desc').height() + 'px'
                    });
                    na.sp.containerSizeChanged($('#infoWindow_mp3desc')[0]);
                };
                na.sp.containerSizeChanged($('#infoWindow_mp3desc')[0]);
                */
/*
                if ($('#infoWindow_mp3desc').css('visibility')=='hidden') {
                    $('#infoWindow_mp3desc').css ({
                        display : 'none',
                        visibility:'visible'
                    }).fadeIn ('slow');
                    $('#infoWindow_mp3desc').css({visibility:'visible'});
                }
*/						
                if (!firstRun) {
                    var 
                    mp3 = '/nicerapp/apps/nicerapp/music/music/'+naLocationBarInfo['apps']['music']['set']+'/' + file;
                    $('#audioTag')[0].src = mp3;
                    $('#audioTag')[0].play();
                    /*
                    $('#jplayer.jp-jplayer').jPlayer("setMedia", {
                        // SLOW, CLOGS ADSL LINE : 
                        mp3: na.m.globals.urls.app + '/nicerapp/apps/nicerapp/musicPlayer/appContent/musicPlayer/music/'+naLocationBarInfo['apps']['musicPlayer']['set']+'/' + file
                        //mp3 : na.m.globals.urls.upstream.apps.nicerapp.musicPlayer.cloudhosting['DJ_FireSnake'].saApp.musicPlayer.music['DJ_FireSnake'].hosting['godaddy.com'] + file,
                    }).jPlayer("play");
                    */
                    mp3site.settings.stopped = false;
                    mp3site.setTimeDisplayInterval();
                }

                
            }, 100);
        });

    },
    
    setTimeDisplayInterval : function () {
        if (!mp3site.settings.timeDisplayInterval) 
            mp3site.settings.timeDisplayInterval = setInterval (function() {
                var 
                length = $('#audioTag')[0].duration, // in seconds
                strLength = mp3site.convertSecondsToTimeString(length),
                currentTime = $('#audioTag')[0].currentTime, // in seconds
                strCurrentTime = mp3site.convertSecondsToTimeString(currentTime);
                
                if (currentTime==length) {
                    mp3site.next();
                } else {
                    
                    $('.jp-duration').html(strLength);
                    $('.jp-current-time').html(strCurrentTime);
                    
                    var 
                    widthSeekBar = $('.jp-seek-bar').width(),
                    widthPlayBar = Math.floor((widthSeekBar * currentTime)/length);
                    
                    $('.jp-play-bar')[0].style.width = widthPlayBar+'px';
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
			$('#audioTag')[0].play();
			mp3site.settings.paused = false;
			mp3site.settings.stopped = false;
            $('#btnPlayPause')[0].src = '/nicerapp/apps/nicerapp/music/pause_icon.png';
		} else {
			$('#audioTag')[0].pause();
			mp3site.settings.paused = true;
			mp3site.settings.stopped = false;
            $('#btnPlayPause')[0].src = '/nicerapp/apps/nicerapp/music/play_icon.png';
		}
	},
	
	stop : function () {
		$('#audioTag')[0].pause();
		mp3site.settings.stopped = true;

		$('.mp3').each (function (index,element) {
			if (this.id=='') return false;
		});
		$('#mp3descText').fadeOut (1000);
		setTimeout (function () {
			$('#siteIntroText').fadeIn (1000);
		}, 1010);
	},
    
    next : function () {
        if (mp3site.settings.playingIndex===false) {
            return false;
        } else {
            var pl = $('#playlist')[0];
            for (var i=0; i<pl.children.length; i++) {
                var newIndex = 'playlist_' + (mp3site.settings.playingIndex + 1);
                if (pl.children[i].id == newIndex) {
                    mp3site.selectMP3 (newIndex, pl.children[i].file, false);
                    return true;
                }
            }
            //var x = $('#btn_repeat').hasClass('selected');
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
			$('#audioTag')[0].muted = false;
			mp3site.settings.muted = false;
            $('#btnMuteUnmute')[0].src = '/nicerapp/apps/nicerapp/music/mute_icon.png';
		} else {
			$('#audioTag')[0].muted = true;
			mp3site.settings.muted = true;
            $('#btnMuteUnmute')[0].src = '/nicerapp/apps/nicerapp/music/unmute_icon.png';
		}
	},
    
	toggleRepeat : function () {
		mp3site.settings.repeating = !mp3site.settings.repeating;
        if (mp3site.settings.repeating) {
            $('#btnRepeat')[0].src = '/nicerapp/apps/nicerapp/music/repeat_selected_icon.png';
        } else {
            $('#btnRepeat')[0].src = '/nicerapp/apps/nicerapp/music/repeat_icon.png';
        }
	},
    
    seek : function (evt) {
        var 
        length = $('#audioTag')[0].duration, // in seconds
        strLength = mp3site.convertSecondsToTimeString(length),
        currentTime = $('#audioTag')[0].currentTime;
        
        $('.jp-duration').html(strLength);
        //$('.jp-current-time').html(strCurrentTime);
        
        var 
        widthSeekBar = $('.jp-seek-bar').width(),
        widthPlayBar = evt.offsetX;//Math.round((widthSeekBar * evt.offsetX)/length),
        newCurrentTime = Math.round((widthPlayBar * length)/widthSeekBar);

        $('.jp-play-bar')[0].style.width = widthPlayBar+'px';
        $('#audioTag')[0].currentTime = newCurrentTime;
    },
    
    setVolume : function (evt) {
        var 
        widthVolumeBar = $('.jp-volume-bar').width();
        debugger;
        $('#audioTag')[0].volume = evt.offsetX / widthVolumeBar;
        $('.jp-volume-bar-value').css ({ width : evt.offsetX });
    },
	
	setupDragNDrop : function () {
		var mp3s = $('.mp3');
		$('.mp3').draggable ({
			containment : 'window',
            connectToSortable : '#playlist',
			helper : function (evt, ui) {
                var div = document.createElement('div');
                $(this).clone(true,true).appendTo(div).css({zIndex:1100, color:'yellow'});
                $(document.body).append(div);
                //debugger;
                return div;
			}
		});
		/*$('#playlist').sortable({
			revert : true,
			start : function (evt, ui) {
				//var buttonID = ui.item[0].children[0].id.replace(/__item__0/,'');
				//na.vcc.settings[buttonID].items[0].ignoreClickEvent = true;
			},
			stop : function (evt, ui) {
				//var buttonID = ui.item[0].children[0].id.replace(/__item__0/,'');
				//na.vcc.settings[buttonID].items[0].ignoreClickEvent = false;
			}
		});*/
		$('#playlist').droppable ({
			drop : function (evt, ui) {
                //debugger;
                var pl = $('#playlist')[0];
				var dragged = $(ui.draggable[0]).clone(true,true)[0];
				var pc = mp3site.playlistCount;
                if (!ui.helper[0].children[0]) return false;
            
                var 
                oldID = ui.helper[0].children[0].id,
                original = $('#'+oldID),
                newID = 'playlist_'+pc;//ui.helper[0].children[0].id;
                
                if (oldID.match('playlist_')) return false;
                dragged.id = newID;
                dragged.className = 'mp3 vividButton';
                dragged.style.height = '30px';
                $(dragged).attr('file', original.attr('file'));
                dragged.file = original.attr('file');
                $(dragged).attr('onclick','debugger;'+original[0].onclick.toString().replace('function onclick(event) {', '').replace('\n}','').replace (new RegExp(oldID), dragged.id));
                
                pl.append(dragged);

                if (mp3site.settings.stopped) mp3site.selectMP3 (dragged.id, $(dragged).attr('file'), false);
                mp3site.onWindowResize();
				mp3site.playlistCount++;
			}
		});
	},
	playlistCount : 0,

	onWindowResize : function () {
        //setTimeout (function () {
        if (!window.top || !$(window.top.document.getElementById('siteContent'))[0]) return false;
		var 
		myWidth = $(window.top.document.getElementById('siteContent'))[0].offsetWidth,
		myHeight = $(window.top.document.getElementById('siteContent'))[0].offsetHeight - $('#horizontalMover__containmentBox2').height() - $('#horizontalMover__containmentBox2')[0].offsetTop - 50,
		contentWidth = 20 + 240 + 40 + 300 + 20;
        //debugger;
		var
		sc_scrollpane = $('#siteContent', window.top.document.body),
		sc_scrollpaneContainer = $('#siteContent', window.top.document.body),
		sc_siteContent = $('#siteContent', window.top.document.body);

		if (typeof mp3site.settings.masterLeftOffset == 'number') {
			var masterLeftOffset = mp3site.settings.masterLeftOffset;
			if (masterLeftOffset<0) masterLeftOffset=0;
		} else {
			var masterLeftOffset = ((myWidth - contentWidth) / 2);
			if (masterLeftOffset<0) masterLeftOffset=0;
			mp3site.settings.masterLeftOffset = masterLeftOffset;
		}
		
		$('.vd_btns').css({display:'none'}),
		failed = false;
//debugger;
		var 
		timeDelay = 10,
		timeIncrease = 50,
        leftOffset = masterLeftOffset + 20;
		
		//debugger;
			/*
			function resizeIframe_mp3site () {
				$(window).resize(function(){
						$("#siteContent__iframe", window.parent.document.body).css({
							width:$("#siteContent__contentDimensions", window.parent.document.body)[0].offsetWidth, 
							height:$("#siteContent__contentDimensions", window.parent.document.body)[0].offsetHeight
						})
				});
				$("#siteContent__iframe", window.parent.document.body).css({
						width:$("#siteContent__contentDimensions", window.parent.document.body)[0].offsetWidth, 
						height:$("#siteContent__contentDimensions", window.parent.document.body)[0].offsetHeight
				});		
			}*/	

			//resizeIframe();
			
			/*
			$("#siteContent__iframe", window.top.document.body).css({
				width:$("#siteContent__contentDimensions", window.top.document.body)[0].offsetWidth, 
				height:$("#siteContent__contentDimensions", window.top.document.body)[0].offsetHeight
			})*/

			
		$('#horizontalMover__containmentBox2').css({
			left : 0,
			width : myWidth - 30,
			opacity : 0.001,
			display : 'block'
		}).animate ({opacity:0.1},1000);
		$('#horizontalMover__containmentBox1').css({
			left : 2,
			width : myWidth - 34,
			opacity : 0.001,
			display : 'block'
		}).animate ({opacity:0.3},1300);
		if (!mp3site.settings.afterInitializing) {
            mp3site.settings.afterInitializing = true;
            setTimeout (function() {
                $(document.body).animate({opacity:1}, 'fast');
                $('#horizontalMover').css({
                    width : 610,
                    opacity : 0.001,
                    display : 'block'
                }).animate ({opacity:0.5}, 700);
            }, 100);
        
            //setTimeout (function() {
			$('.vividDialog, .vividScrollpane, .vividDialog_dialog, .vsp_container, #heading_wrapper, #siteIntroText, #mp3s, #player, #player_table, #playlist_wrapper, #infoWindow_help, #comments')
				.not ('#siteDateTime, #infoWindow_info, #infoWindow_tools, #infoWindow_tools, #infoWindow_info')
				.css ({visibility:'visible',display:'block',opacity:1});
            //}, 1000);
        }
		
		//debugger;
        //na.vcc.applyTheme ('infoWindow_mp3desc');				
		
        //setTimeout (function() {
            $('#infoWindow_mp3desc, #infoWindow_mp3desc__CSS3, #infoWindow_mp3desc__item__0, #infoWindow_mp3desc__item__0__img1, infoWindow_mp3desc__item__0__img2, #infoWindow_mp3desc, #infoWindow_mp3desc').css({
                position : 'absolute',
                width : 300,
                height : (myHeight - 40 - 120) /2,
                opacity : 1                                                                                                                                                                                                                                                
            });
            $('#infoWindow_mp3desc').css({
                left : leftOffset + 250 + 20,
                top : 30 + $('#player')[0].offsetHeight + 20,
                width : 300,
                height : ((myHeight - 40 - 120) /2),
                opacity : 1
            });
			$('#infoWindow_mp3desc__CSS3').css({
				width : 300,
				height : (myHeight - 40 - 120) /2,
                opacity : 0.5
			});
            $('#mp3descText').css({ marginLeft : 40 });
            
            
            $('#infoWindow_mp3desc > table').css({
                width : '',
                height : ((myHeight - 40 - 120) /2),
                opacity : 1
            });
        //}, timeDelay);// + (1 * timeIncrease) );
			
	 
		var dialogMP3sList = '#mp3s';
		if ($('#infoWindow_mp3desc').length>0) var dialogMP3desc = '#infoWindow_mp3desc'; 
			else var dialogMP3desc = '#infoWindow_mp3desc';
		if ($('#playlist_wrapper').length>0) var dialogPlaylist = '#playlist_wrapper, #playlist_wrapper'; 
			else var dialogPlaylist = '#playlist_wrapper';
		if ($('#player').length>0) var dialogPlayer = '#player, #player, #player__CSS3'; 
			else var dialogPlayer = '#player, #player__CSS3';
		
		if ($('#infoWindow_comments').length>0) var dialogComments = '#infoWindow_comments'; else var dialogComments = '#infoWindow_comments';

        var 
		$dialogHeading = $('#heading_wrapper'),
		$dialogMP3sList = $(dialogMP3sList),
		$dialogMP3desc = $(dialogMP3desc),
		$dialogPlaylist = $(dialogPlaylist),
		$dialogPlayer = $(dialogPlayer),
		$dialogComments = $(dialogComments),
		centerDialogsWidth = $(dialogMP3sList).width() + $dialogPlaylist.width() + $dialogComments.width(),
		dialogsLeft = Math.round (leftOffset),
		dialogsTop = 30,//$dialogHeading[0].offsetTop + $dialogHeading.height() + 10,
		dialogsHeight = (myHeight - dialogsTop - 40);

        $('#horizontalMover').css({
			left : masterLeftOffset
		});


        var playerLeft = (leftOffset + 250 + 20);
        $('#player, #player__CSS3').css ({
            left : playerLeft,
            width : 300,
            top : dialogsTop,
            opacity : 1
        });
        $('#player__CSS3').css ({ left : '', top : '', opacity : 0.5 });
        
        $('#mp3s').css ({
            visibility : 'visible',
            position : 'absolute',
            left : dialogsLeft,
            width : 245,
            height : myHeight ,
            top : dialogsTop,
            opacity : 1
        });
        
        // hardcoded for now with use of vividTheme__lava_002.png
        $('.mp3', $('#mp3s')[0]).css ({
            position: 'relative',
            display : 'flex',
            width : 220,
            height : 25
        });
        $('.mp3', $('#playlist_wrapper')[0]).css({height:30});

        $dialogPlaylist.css ({
            left : leftOffset + 250 + 20,
            width : 300,
            height : (myHeight - 40 - 120) /2,
            top : ($dialogMP3desc[0].offsetTop + $dialogMP3desc.height() + 20) + 'px',
            opacity : 1
        });
	}
	
};
$(document).ready(function() {
    mp3site.startAppNested();
});
