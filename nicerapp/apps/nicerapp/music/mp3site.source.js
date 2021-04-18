var mp3site = {
	about : {
		whatsThis : 'Complete application code for the music playback-and-download site on http://nicer.app/musicPlayer',
		copyright : 'Copyrighted (c) 2011-2021 by Rene AJM Veerman - rene.veerman.netherlands@gmail.com',
		license : 'http://nicer.app/LICENSE.txt',
		version : '3.1.0',
		firstReleased : '2011',   
		lastUpdated : '2020-02-04(Thursday) 18:20 Amsterdam.NL timezone',
		knownBugs : {
			1 : "None atm, I think. Please report any bugs you find.."
		}
	},
    globals : {
        url : '/nicerapp/apps/nicerapp/music/'
    },
	settings : {
		playingIndex : 0,
		paused : false,
		stopped : true,
		repeating : false,
		masterLeftOffset : null,
		dialogs : {}
	},
	language : {
		siteTitle : "DJ FireSnake's mixes"
	},
	
	startApp : function () {
        na.analytics.logMetaEvent ('startApp : musicPlayer');

        if (mp3site.settings.loaded) return false; else mp3site.settings.loaded = true;

        mp3site.setupDragNDrop();
		//$('.vividDialog_dialog, #playlist_wrapper, #infoWindow_mp3desc, #infoWindow_comments, #mp3s, #player').css({opacity:0.0001});
                        
        na.site.loadTheme(function () {
            $('#siteContent', window.top.document).css({background:'rgba(0,0,0,0)',border:'1px solid rgba(0,0,0,0)',boxShadow:'0px 0px 1px 1px rgba(0,0,0,0)'});
        });

        $(window).resize(function() {
            clearTimeout(mp3site.settings.timeoutResize);
            mp3site.settings.timeoutResize = setTimeout(mp3site.onWindowResize,1000);
        });
        setTimeout (mp3site.onWindowResize, 1500);
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
	
	selectMP3 : function (id, file, firstRun) {
		mp3site.settings.activeID = id;
		
        mp3site.settings.playingIndex = false;
        delete mp3site.settings.stopped;
		var pl = $('#playlist')[0];
		for (var i=0; i<pl.children.length; i++) {
            if (pl.children[i].id==id || (pl.children[i].children[0] && pl.children[i].children[0].id==id)) mp3site.settings.playingIndex = i;
		};
        if (!file) debugger;
        na.analytics.logMetaEvent ('appEvent : musicPlayer : selectMP3() file='+file);
        
        $('.mp3').removeClass('selected').removeClass('vividButtonSelected').addClass('vividButton');
        $('#'+id).addClass('selected').removeClass('vividButton').addClass('vividButtonSelected');

		var ajaxCommand = {
			type : 'GET',
			url : '/nicerapp/apps/nicerapp/music/music/'+naLocationBarInfo['apps']['music']['set']+'/' + file + '.json',
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
				//window.History.pushState (null, mp3site.language.siteTitle + ' - ' + mixTitle, na.site.globals.urls.app+'/musicPlayer(play\''+mixLoc+'\')');
			
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
            
            
            //setTimeout (function () {
                if (!firstRun) {
                    var 
                    mp3 = '/nicerapp/apps/nicerapp/music/music/'+naLocationBarInfo['apps']['music']['set']+'/' + file;
                    $('#audioTag')[0].src = mp3;
                    $('#audioTag')[0].play();
                    mp3site.settings.stopped = false;
                    mp3site.setTimeDisplayInterval();
                }
            //}, 100);
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
                    debugger;
                    mp3site.next();
                } else {
                    
                    $('.jp-duration').html(strLength);
                    $('.jp-current-time').html(strCurrentTime);
                    
                    var 
                    widthSeekBar = $('.jp-seek-bar').width(),
                    widthPlayBar = Math.floor((widthSeekBar * currentTime)/length);
                    
                    if (!mp3site.settings.maxPlayBarWidth) mp3site.settings.maxPlayBarWidth = widthSeekBar;
                    $('.jp-play-bar')[0].style.width = (widthPlayBar <= mp3site.settings.maxPlayBarWidth ? widthPlayBar : mp3site.settings.maxPlayBarWidth)+'px';
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
                if (pl.children[i].children[0] && pl.children[i].children[0].id== newIndex) {
                    mp3site.selectMP3 (newIndex, pl.children[i].children[0].file, false);
                    return true;
                }
            }
            //var x = $('#btn_repeat').hasClass('selected');
            //if (x) {
            //var x = na.vcc.settings['btn_repeat'].items[0].stateCurrent;
            //if (x === 'selected') {
            if (mp3site.settings.repeating) {
                var newIndex = 'playlist_0';
                if (pl.children[i].id == newIndex) {
                    mp3site.selectMP3 (newIndex, pl.children[i].file, false);
                    return true;
                }
                if (pl.children[i].children[0] && pl.children[i].children[0].id== newIndex) {
                    mp3site.selectMP3 (newIndex, pl.children[i].children[0].file, false);
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
                if (this.id===mp3site.settings.resortedItem) return false;
                var div = document.createElement('div');
                $(this).clone(true,true).appendTo(div).css({zIndex:1100, color:'yellow'});
                $(document.body).append(div);
                //debugger;
                return div;
			}
		});
		$('#playlist').sortable({
			revert : true,
			start : function (evt, ui) {
                
			},
			stop : function (evt, ui) {
                
			}
		});
		$('#playlist').droppable ({
			drop : function (evt, ui) {
                var pl = $('#playlist')[0];
				var dragged = ui.draggable[0].children[0];//).clone(true,true)[0];
                var pc = mp3site.playlistCount;
                if (!ui.helper[0].children[0]) return false;
            
                var 
                oldID = ui.helper[0].children[0].id,
                original = $('#'+oldID),
                newID = 'playlist_'+pc;
                
                if (oldID.match('playlist_')) return false;
                $(dragged).attr('id', newID);
                $(dragged).attr('class', 'mp3 vividButton ui-draggable ui-draggable-handle');
                $(dragged).css({height : 30});
                $(dragged).attr('file', original.attr('file'));
                dragged.file = original.attr('file');
                dragged.oldID = oldID;
                $(dragged).attr('onclick',''+original[0].onclick.toString().replace("'"+oldID+"'", "'"+newID+"'").replace('function onclick(event) {', '').replace('\n}','').replace (new RegExp(oldID), dragged.id));
                
                $(dragged).draggable({
                    containment : '#playlist',
                    connectToSortable : '#playlist',
                    helper : function (evt, ui) {
                        mp3site.settings.resortedItem = dragged.oldID;
                    }
                });
                
                if (mp3site.settings.stopped) mp3site.selectMP3 (newID, $(dragged).attr('file'), false);
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
        
        $('#siteContent > .vdBackground', window.top.document).fadeOut('normal');

		if (typeof mp3site.settings.masterLeftOffset == 'number') {
			var masterLeftOffset = mp3site.settings.masterLeftOffset;
			if (masterLeftOffset<0) masterLeftOffset=0;
		} else {
			var masterLeftOffset = ((myWidth - contentWidth) / 2);
			if (masterLeftOffset<0) masterLeftOffset=0;
			mp3site.settings.masterLeftOffset = masterLeftOffset;
		}
		
		var 
		timeDelay = 10,
		timeIncrease = 50,
        leftOffset = masterLeftOffset + 20;
			
		$('#horizontalMover__containmentBox2').css({
			left : 0,
            top : 0,
			width : myWidth - 30,
			opacity : 0.001,
			display : 'block'
		}).animate ({opacity:0.1},1000);
		$('#horizontalMover__containmentBox1').css({
			left : 2,
            top : 0,
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
				.not ('#siteLoginSuccessful, #siteLoginFailed, #siteLogin, #siteRegistration, #siteDateTime, #infoWindow_info, #infoWindow_tools, #infoWindow_tools, #infoWindow_info')
				.css ({visibility:'visible',display:'block',opacity:1});
            //}, 1000);
        }
		
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
    setTimeout (function() {
    mp3site.startApp();
    }, 500);
});
