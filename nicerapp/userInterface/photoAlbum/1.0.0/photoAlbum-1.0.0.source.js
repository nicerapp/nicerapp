nicerapp.photoAlbum = na.pa = {
	about : {
		
	},
	globals : {
		
	},
	settings : {
		current : {},
		perDiv : {}
	},
	
	init : function (settings) {
		na.pa.settings.perDiv[settings.iframe] = settings;
		if (settings.image) {
			na.pa.lowlevel.ui.init (settings);
			jQuery('#'+settings.iframe).addClass ('saPhotoAlbum_iframe');
			na.m.hookScrollwheel ($('#'+settings.iframe)[0], na.pa.lowlevel.mousewheel, false, true);
		}
		$(window).resize(na.pa.resize);
	},
	
	resize : function () {
		if (
			true
			//window.top.na.m.settings.initialized.site
			&& !window.top.na.desktop.settings.animating
		) {
			for (var div in na.pa.settings.perDiv) {
				na.pa.printAlbum(na.pa.settings.perDiv[div]);
			}		
		}
	},
	
	
	printAlbum : function (settings) {
		//debugger;
		
		var
		s = na.pa.settings.perDiv[settings.iframe],
		album = settings.db.albumsContents[settings.album],
		numHor = Math.floor(jQuery('#iframeContent').width() / (settings.lowres.width)) ,
		numVer = Math.floor((jQuery('#iframeContent').height()-80) / settings.lowres.height),
		numPage = numHor * numVer,
		beginIdx = (
			na.photoAlbum.settings.beginIdx
			? na.photoAlbum.settings.beginIdx
			: (settings.page -1) * numPage
		);
		debugger;
		if (!na.photoAlbum.settings.beginIdx) na.photoAlbum.settings.beginIdx = beginIdx;
		
		settings.map = {};
		
		if (na.pa.settings.preload) na.pa.settings.preload.close();
		na.pa.settings.preload = new createjs.LoadQueue (settings.rootURL);
		settings.loadQueue = [];
		na.pa.settings = settings;
		//if (jQuery('#saPhotoAlbum_overallProgress').length==0) {
		
		
			jQuery('#'+settings.iframe).html(
				'<div id="saPhotoAlbum">'
				+'<div id="saPhotoAlbum_titlebar" style="position:absolute;width:98%;top:2px;left:1%;text-align:center;height:1.5em;vertical-align:middle;">'
					+'<div class="saPhotoAlbum_titlebar_background" style="position:absolute;width:100%;height:100%;border-radius:4px;"></div>'
						+'<div id="saPhotoAlbum_titlebar_content" style="position:absolute;margin:3px;width:100%;height:100%;">'+numPage+' Photos, numbers '+(beginIdx+1)+' to '+(beginIdx+numPage)+' (page '+(Math.floor(beginIdx/numPage)+1)+' of '+(Math.floor(album.length/numPage))+') of '+album.length+' images in album '+settings.album+'.</div>'
					+'</div>'
				+'</div>'
				+'<div id="saPhotoAlbum_overallProgress" class="saPhotoAlbum_progress" style="position:absolute;top:0px;left:0px;width:100%;height:10px;">'
					+'<div class="saPhotoAlbum_overallProgress" style="width:0px;height:100%;"></div>'
				+'</div>'
				+'<div id="saPhotoAlbum_template" class="saPhotoAlbum_item" style="position:absolute;width:100%;float:left;"><div class="saPhotoAlbum_progressHolder" style="width:100%;height:10px;"><div class="saPhotoAlbum_progress saPhotoAlbum_itemProgress" style="width:0px;height:10px;"></div></div><a href="#" class="saPhotoAlbum_thumbnail" style=""></a></div>'
				+'<div id="pageMenu" class="vividMenu vividTheme__oval_blue_120x39" style="position:absolute;top:30px;width:200px;height:40px;">'
					+'<ul style="display:none;">'
					+'<li><a href="javascript:na.photoAlbum.toggleMode();">Select picture(s)</a></li>'
					+'<li><a href="javascript:na.photoAlbum.setAsMainBackground(na.photoAlbum.settings.selected);">Set as main background</a></li>'
					+'</ul>'
				+'</div>'
				+'<a id="btnPagePrevious" href="#" style="position:absolute;top:50%;z-index:10000;width:40px;"><img src="'+na.m.globals.urls.app+'nicerapp/com/ui/photoAlbum/btnPrevious.png" style="width:40px;"/></a>'
				+'<a id="btnPageNext" href="#" style="position:absolute;top:50%;right:0px;z-index:10000;width:40px;"><img src="'+na.m.globals.urls.app+'nicerapp/com/ui/photoAlbum/btnNext.png" style="width:40px;"/></a>'
				+'<div id="scrollpane_content" class="vividScrollpane vividTheme__scroll_black" style="position:absolute;top:65px;width:100%;height:100%;text-align:center;">'
				+'</div>'
				+'</div>'
			);
		//} else {
		//	jQuery('#saPhotoAlbum_overallProgress').fadeIn('normal');
		//};
		//
		
		//delete na.vcc.settings['pageMenu'];
		//jQuery('#pageMenu').removeClass('vividWidget_initialized');
		na.vcc.init (jQuery('#pageMenu')[0]);
		s.transformLinks(jQuery('#'+settings.iframe)[0],true);		
		
		var
		preload = na.pa.settings.preload,
		queue = settings.loadQueue;
		
		for (var i=beginIdx; i<beginIdx+numPage; i++) {
			queue[queue.length] = settings.rootURL + album[i].replace(settings.album, settings.album+'/lowres');
		};
		
		preload.on("fileload", na.pa.printAlbum_handleFileLoad);
        preload.on("progress", na.pa.printAlbum_handleOverallProgress);
        preload.on("fileprogress", na.pa.printAlbum_handleFileProgress);
        preload.on("error", na.pa.printAlbum_handleFileError);
        preload.setMaxConnections(3);
		
		//debugger;
		var
		k = 0,
		doneHor = 0;

		for (var i=0; i<queue.length; i++) {
			
			var 
			item = queue[i],
			div = $("#saPhotoAlbum_template").clone(),
			spacingH = (jQuery('#iframeContent').width() - (numHor*settings.lowres.width)) / (numHor),
			spacingV = (jQuery('#iframeContent').height() - (numVer*settings.lowres.height)) / (numVer);
			
			div.attr("id", ""); // Wipe out the ID
			div.css({
				postion : 'absolute',
				width : settings.lowres.width,
				height : settings.lowres.height,
				top : (((settings.lowres.height-1)+spacingV) * k) + 80,
				left : (((settings.lowres.height)-1)+spacingH) * (doneHor)
			});
			if ((doneHor) >= (numHor-1)) {
				k++;
				doneHor = 0;
			} else {
				doneHor++;
			};
			jQuery('#'+settings.div).append(div);
			settings.map[item] = div; // Store a reference to each item by its src
		};
		
		if (queue.length>0) preload.loadManifest (queue);//na.pa.printAlbum_loadAll (settings, queue);
		
	},

	toggleMode : function () {
		if (na.pa.settings.mode=='select') {
			na.pa.setMode ('normal');
		} else {
			na.pa.setMode ('select');
			
		}
	},
	
	setMode : function (newMode) { 
		na.pa.settings.mode = newMode;
		if (newMode=='select') {
			na.vcc.changeState (jQuery('#pageMenu')[0], jQuery('#pageMenu__item__0')[0], 'selected');
		} else {
			na.vcc.changeState (jQuery('#pageMenu')[0], jQuery('#pageMenu__item__0')[0], 'normal');
		}
	},
	

	printAlbum_handleFileLoad : function (event) {
		if (!event.item) debugger;
	
		var 
		s = na.pa.settings,
		div = s.map[event.item.id];
		
		div.addClass("complete");
		// Get a reference to the loaded image (<img/>)
		var img = event.result;
		
		div.children('a').click (function () { na.pa.lowlevel.click(this) } );
		
		div.children('a').attr('href', na.m.globals.urls.app + 'photo/' + event.item.id.replace(na.m.globals.urls.app+'siteData/nicerapp/com/ui/photoAlbum/albums/','').replace('/lowres','').replace(/\//g,'_') + '--' + s.page);
		s.transformLinks(jQuery('#'+s.iframe)[0],true);
		div.children('a').append(img); // Add it to the DOM
	},

	printAlbum_handleFileProgress : function (event) {
		if (!event.item) debugger;
		var 
		s = na.pa.settings,
		div = s.map[event.item.id]; // Lookup the related item
		
		div.children("DIV").width(event.progress*div.width()); // Set the width the progress.
		if (event.progress==1) div.children('DIV').fadeOut ('normal');
	},

	printAlbum_handleOverallProgress : function (event) {
		jQuery("#saPhotoAlbum_overallProgress > .saPhotoAlbum_overallProgress").width(na.pa.settings.preload.progress * $("#saPhotoAlbum_overallProgress").width());
		if (na.pa.settings.preload.progress==1) {
			jQuery('#saPhotoAlbum_overallProgress').fadeOut('normal');
			na.pa.setPageButtonLinks(na.pa.settings);
		};
			
	},

	// An error happened on a file
	printAlbum_handleFileError : function (event) {
		if (!event.item) debugger;
		var 
		s = na.pa.settings,
		div = s.map[event.item.id]; // Lookup the related item
		div.addClass("saPhotoAlbum_item_error");
	},	

	checkPageImagesLoaded : function (settings) {
		var
		s = na.photoAlbum.settings.perDiv[settings.iframe],
		album = settings.db.albumsContents[settings.album],
		numHor = Math.floor(jQuery('#iframeContent').width() / settings.lowres.width) - 1,
		numVer = Math.floor(jQuery('#iframeContent').height() / settings.lowres.height) - 1,
		numPage = numHor * numVer,
		beginIdx = (
			na.photoAlbum.settings.beginIdx
			? na.photoAlbum.settings.beginIdx
			: (settings.page -1) * numPage
		),
		printedSomething = false;

		//console.log ('t54', s.imgs.imgs.length, s.imgs.loadCount);
		
		for (var i=0; i < s.imgs.imgs.length; i++) {
			var img = s.imgs.imgs[i];
			
			if (!img.printed && img.html) {
				$('#'+settings.div).append(img.html);
				img.printed = true;
				printedSomething = true;
			}
		}
		var
		iframeWidth = jQuery('#iframeContent').width(),
		iframeHeight = jQuery('#iframeContent').height(),
		ml = Math.floor ( (iframeWidth - (numHor * settings.lowres.width)) / numHor ),
		mb = Math.floor ( (iframeHeight - (numVer * settings.lowres.height)) / numVer );
		jQuery('div.saPhotoAlbum_thumbnail').css({marginLeft:Math.floor(ml/2),marginRight:Math.floor(ml/2),marginTop:Math.floor(mb/2),marginBottom:Math.floor(mb/2)});
		
		if (printedSomething) {
			na.photoAlbum.setPageButtonLinks (settings);
			na.sp.containerSizeChanged(jQuery('#iframeContent')[0]); 
		};

	},
	
	setPageButtonLinks : function (settings) {
		var 
		prefix = '',//'content/',
		albump = settings.album.split('/');
		
		//albump.pop();
		
		var
		albumTitle = albump.join('/'),
		album = settings.db.albumsContents[settings.album],
		numHor = Math.floor(jQuery('#'+settings.iframe).width() / settings.lowres.width) - 1,
		numVer = Math.floor(jQuery('#'+settings.iframe).height() / settings.lowres.height) - 1,
		numPage = numHor * numVer,
		beginIdx = (settings.page -1) * numPage,
		yesPrevious = settings.page > 1,
		yesNext = settings.page < ( Math.floor(album.length / numPage) - 1 ),
		previous = settings.page - 1,
		next = settings.page + 1,
		albumURL = albumTitle.replace(/\//g,'_');
	
		if (yesPrevious) jQuery('#btnPagePrevious').attr('href', na.m.globals.urls.app + prefix + 'album/' + albumURL + '--' + previous); else jQuery('#btnPagePrevious').hide();
		if (yesNext) jQuery('#btnPageNext').attr('href', na.m.globals.urls.app + prefix + 'album/' + albumURL + '--' + next); else jQuery('#btnPageNext').hide();

		settings.transformLinks(jQuery('#'+settings.iframe)[0],true);
	},
	
	
	
	setImageButtonLinks : function (settings) {
		var 
		album = settings.image.replace(na.m.globals.urls.app+'siteData/nicerapp/com/ui/photoAlbum/albums/','')
		albump = album.split('/');
		
		albump.pop();
		var
		prefix = '',//'content/',
		album = albump.join('/'),
		dbAlbum = settings.db.albumsContents[album],
		urlBtnUp = na.m.globals.urls.app + 'album/' + album.replace(/\//g,'_');
		
		for (var i=0; i<dbAlbum.length; i++) {
			var scanImg = dbAlbum[i];
			if (dbAlbum[i]==settings.image && i>=1) {
				var urlRelativePrevious = dbAlbum[i-1].replace(/\//g,'_');
			}
			if (dbAlbum[i]==settings.image && i<=dbAlbum.length-2) {
				var urlRelativeNext = dbAlbum[i+1].replace(/\//g,'_');
			}
		}
		
		jQuery('#btnUp').attr('href', na.m.globals.urls.app + prefix + 'album/' + album.replace(/\//g,'_') + '--' + settings.page);
		if (urlRelativePrevious) jQuery('#btnPrevious').attr('href', na.m.globals.urls.app + prefix + 'photo/' + urlRelativePrevious); else jQuery('#btnPrevious').hide();
		if (urlRelativeNext) jQuery('#btnNext').attr('href', na.m.globals.urls.app + prefix + 'photo/' + urlRelativeNext); else jQuery('#btnNext').hide();
		
		settings.transformLinks(jQuery('#'+settings.iframe)[0],true);
	},
	
	setImageDimensions : function (settings) {
		var
		jQueryImg = $('#saPhotoAlbum_photo');
		if (!jQueryImg[0].loadHandler) {
			jQueryImg[0].loadHandler = true;
			jQueryImg.load ({settings:settings}, function(evt, settings) {
				if (!evt.data.settings) evt.data = settings;
				var
				s = na.pa.settings.perDiv[evt.data.settings.iframe],
				w = jQueryImg[0].naturalWidth,
				h = jQueryImg[0].naturalHeight,
				iframeWidth = $('#'+evt.data.settings.iframe).width(),
				iframeHeight = $('#'+evt.data.settings.iframe).height(),
				imgpw = Math.floor((w*100)/iframeWidth),
				imgph = Math.floor((h*100)/iframeHeight);
				
				s.naturalWidth = w;
				s.naturalHeight = h;

				//console.log ('t12', iframeWidth, w, iframeHeight, h, imgpw, imgph);
				if (imgph>imgpw) {
					if (h>iframeHeight) {
						tw = jQueryImg.css({width:'',left:0,height:iframeHeight}).width();
						th = jQueryImg.height();
						s.zoomPercentage = (tw*100)/w;
					} else if (w>iframeWidth) {
						th = jQueryImg.css({top:0,width:iframeWidth,height:''}).height();
						tw = jQueryImg.width();
						s.zoomPercentage = (th * 100) / h;
					} else if (w>h) {
						tw = jQueryImg.css({width:'',left:0,height:iframeHeight}).width();
						th = jQueryImg.height();
						s.zoomPercentage = (tw*100)/w;
					} else {
						th = jQueryImg.css({top:0,width:iframeWidth,height:''}).height();
						tw = jQueryImg.width();
						s.zoomPercentage = (th*100) / h;
					}

				} else {
					if (w>iframeWidth) {
						th = jQueryImg.css({top:0,width:iframeWidth,height:''}).height();
						tw = jQueryImg.width();
						s.zoomPercentage = (th*100) / h;
					} else if (h>iframeHeight) {
						tw = jQueryImg.css({width:'',left:0,height:iframeHeight}).width();
						th = jQueryImg.height();
						s.zoomPercentage = (tw*100)/w;
					} else if (w>h) {
						tw = jQueryImg.css({width:'',left:0,height:iframeHeight}).width();
						th = jQueryImg.height();
						s.zoomPercentage = (tw*100)/w;
					} else {
						th = jQueryImg.css({top:0,width:iframeWidth,height:''}).height();
						tw = jQueryImg.width();
						s.zoomPercentage = (th*100) / h;
					}
						
				};
				
				//console.log ('t01', s);
				if (jQueryImg.css('display')==='none') jQueryImg.fadeIn('normal');
				na.pa.lowlevel.ui.update (s);
				na.sp.containerSizeChanged(jQuery('#iframeContent')[0]); 
			});
		};
		jQueryImg.attr('src',settings.rootURL+settings.image);
		if (jQueryImg[0] && jQueryImg[0].naturalWidth>0) jQueryImg.trigger('load', {settings:settings});
	},
	
	lowlevel : {
		ui  : {
			init : function (settings) {
				var 
				html =
					'<div id="saPhotoAlbum__'+settings.iframe+'__control" class="saPhotoAlbum_control" style="position:absolute;top:5%;width:200px;height:100px;right:1%;">'
					+'<div class="saPhotoAlbum_control__background" style="position:absolute;width:100%;height:100%;">&nbsp;</div>'
					+'<div id="saPhotoAlbum__'+settings.iframe+'__control__naturalWidth" class="saPhotoAlbum_control_element" style="position:absolute;top:1em;">naturalWidth : '+settings.naturalWidth+'</div>'
					+'<div id="saPhotoAlbum__'+settings.iframe+'__control__naturalHeight" class="saPhotoAlbum_control_element" style="position:absolute;top:2em;">naturalHeight : '+settings.naturalHeight+'</div>'
					+'<div id="saPhotoAlbum__'+settings.iframe+'__control__width" class="saPhotoAlbum_control_element" style="position:absolute;top:3em;">width : '+settings.width+'</div>'
					+'<div id="saPhotoAlbum__'+settings.iframe+'__control__height" class="saPhotoAlbum_control_element" style="position:absolute;top:4em;">height : '+settings.naturalHeight+'</div>'
					+'<div id="saPhotoAlbum__'+settings.iframe+'__control__zoomPercentage" class="saPhotoAlbum_control_element" style="position:absolute;top:0em;">'+settings.zoomPercentage+'</div>'
					+'</div>';
					
				if (settings.image) $('#'+settings.iframe).append(html);
			},
			
			click : function (evt) {
				if (na.pa.settings.mode=='select') {
					jQuery(this).css({border : '2px lime'});
				} else {
					jQuery(this).attr('href', na.m.globals.urls.app + 'photo/' + event.item.id.replace(na.m.globals.urls.app+'siteData/nicerapp/com/ui/photoAlbum/albums/','').replace('/lowres','').replace(/\//g,'_') + '--' + s.page);
					s.transformLinks(jQuery('#'+s.iframe)[0],true);
				}				
			},
			
			update : function (settings) {
				console.log ('t02', settings);
				//debugger;
				if (settings) {
					na.pa.lowlevel.ui.update_zoomOfImage (settings);
					$('#saPhotoAlbum__'+settings.iframe+'__control__naturalWidth').html ( 'NaturalWidth : ' + settings.naturalWidth);
					$('#saPhotoAlbum__'+settings.iframe+'__control__naturalHeight').html ( 'NaturalHeight : ' + settings.naturalHeight);
					$('#saPhotoAlbum__'+settings.iframe+'__control__width').html ( 'Width : ' + settings.tw);
					$('#saPhotoAlbum__'+settings.iframe+'__control__height').html ( 'Height : ' + settings.th);
					$('#saPhotoAlbum__'+settings.iframe+'__control__zoomPercentage').html ( 'Zoom : ' + Math.round(settings.zoomPercentage*1000)/1000 + '%');
				}
			},
			update_zoomOfImage : function (settings) {
				var
				jQueryImg = $('#saPhotoAlbum_photo'),
				w = jQueryImg[0].naturalWidth,
				h = jQueryImg[0].naturalHeight,
				iframeWidth = $('#'+settings.iframe).width(),
				iframeHeight = $('#'+settings.iframe).height(),
				imgpw = Math.floor((iframeWidth*100)/w),
				imgph = Math.floor((iframeHeight*100)/h),
				th = false,
				tw = false;
				//debugger;
				if (imgph>imgpw) {
					if (h>iframeHeight) {
						th = ((h)/100) * settings.zoomPercentage;
						tw = jQueryImg.css({width:'',left:0,height:th}).width();
					} else if (w>iframeWidth) {
						tw = ((w)/100) * settings.zoomPercentage;
						th = jQueryImg.css({top:0,width:tw,height:''}).height();
					} else if (w>h) {
						tw = ((w)/100) * settings.zoomPercentage;
						th = jQueryImg.css({top:0,width:tw,height:''}).height();
					} else {
						th = ((h)/100) * settings.zoomPercentage;
						tw = jQueryImg.css({width:'',left:0,height:th}).width();
					}
				} else {
					if (w>iframeWidth) {
						tw = ((w)/100) * settings.zoomPercentage;
						th = jQueryImg.css({top:0,width:tw,height:''}).height();
					} else if (h>iframeHeight) {
						th = ((h)/100) * settings.zoomPercentage;
						tw = jQueryImg.css({width:'',left:0,height:th}).width();
					} else if (w>h) {
						tw = ((w)/100) * settings.zoomPercentage;
						th = jQueryImg.css({top:0,width:tw,height:''}).height();
					} else {
						th = ((h)/100) * settings.zoomPercentage;
						tw = jQueryImg.css({width:'',left:0,height:th}).width();
					}
				};
				settings.th = Math.round(th*1000)/1000;
				settings.tw = Math.round(tw*1000)/1000;
				
				var pos = {
					left : ((iframeWidth-tw)/2),
					top : ((iframeHeight-th)/2),
					width : tw,
					height : th
				},
				pos2 = {
					left : pos.left<0 ? 0 : pos.left,
					top : pos.top<0 ? 0 : pos.top,
					width : tw,
					height : th
				};
				
				jQueryImg.css (pos2);
				//debugger;
				na.sp.containerSizeChanged(jQuery('#iframeContent')[0],true, true); 
				na.sp.scrollToPos(jQuery('#iframeContent')[0],undefined,undefined,undefined,pos.top,pos.left);
			}
		},
		mousewheel : function (evt) {
				var 
				s = na.pa.settings.perDiv[evt.currentTarget.id],
				rolled = 0,
				direction = 1;
				
				if ('wheelDelta' in evt) {
					rolled = event.wheelDelta;
				} else {
					rolled = -1 * evt.detail;
				};
				rolled = (na.m.userDevice.isInvertedMousewheel ? 1 : -1) * rolled;
				if (rolled<0) direction = -1;
				direction = -1 * direction;
				//
				
				//rolled = rolled * 0.57;

				if (s.zoomPercentage) s.zoomPercentage = s.zoomPercentage + ( direction * ((s.zoomPercentage/100)*3) );
				na.pa.lowlevel.ui.update(s);
		}
	}
};
