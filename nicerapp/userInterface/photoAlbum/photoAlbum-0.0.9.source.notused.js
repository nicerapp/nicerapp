/*	
	printAlbum_preloadAll : function (settings) {
		var 
		album = settings.db.albumsContents[settings.album],
		numHor = Math.floor(jQuery('#iframeContent').width() / settings.lowres.width) - 1,
		numVer = Math.floor(jQuery('#iframeContent').height() / settings.lowres.height) - 1,
		numPage = numHor * numVer,
		beginIdx = (
			na.photoAlbum.settings.beginIdx
			? na.photoAlbum.settings.beginIdx
			: (settings.page -1) * numPage
		),
		imgs = {
			loadCount : 0,
			imgs : []
		};
		
		na.photoAlbum.settings.perDiv[settings.div].imgs = imgs;
		if (!na.photoAlbum.settings.beginIdx) na.photoAlbum.settings.beginIdx = beginIdx;
		
		if (numHor==0) return false;
		var i = beginIdx;
		while (i < beginIdx + numPage) {
			//html += '<tr>';
			for (var j=0; j<numHor; j++) {
				if (i<album.length) {
					var
					img = album[i],
					elImg = document.createElement('img'),					
					hires = na.m.globals.urls.app + 'photo/' + img.replace(/\//g,'_') + '--' + settings.page,
					lowres = settings.rootURL + img.replace(settings.album, settings.album+'/lowres');
					
					imgs.imgs[imgs.imgs.length] = elImg;
					
					jQuery(elImg).load({settings:settings,hires:hires,lowres:lowres}, function (evt) {
						imgs.loadCount++;
						//debugger;
						if (this.naturalWidth > this.naturalHeight) {
							this.html = '<td style="z-index:1;"><a href="'+evt.data.hires+'" class="saPhotoAlbum_thumbnail" style="display:block;"><img class="saPhotoAlbum_thumbnail" src="'+evt.data.lowres+'" style="width:'+evt.data.settings.lowres.width+'px"/></a></td>';
						} else {
							this.html = '<td style="z-index:1;"><a href="'+evt.data.hires+'" class="saPhotoAlbum_thumbnail" style="display:block;"><img class="saPhotoAlbum_thumbnail" src="'+evt.data.lowres+'" style="height:'+evt.data.settings.lowres.height+'px"/></a></td>';
						};
						//console.log ('t52', imgs.loadCount, elImg.html);
						
						setTimeout (function() {na.photoAlbum.checkPageImagesLoaded(settings); }, 200);
					});
					elImg.src = lowres;
					if (elImg.naturalWidth>0) jQuery(elImg).trigger('load'{settings:settings,hires:hires,lowres:lowres});
					//console.log ('t51', i, elImg.naturalWidth);
					
				};
				i++;
			}
		};
	},
	
	checkPageImagesLoaded_preloadAll : function (settings) {
		var
		s = na.photoAlbum.settings.perDiv[settings.div];

		//console.log ('t54', s.imgs.imgs.length, s.imgs.loadCount);

		if (
			s.imgs.imgs.length == s.imgs.loadCount
			|| ( s.imgs.imgs.length * 2 ) == s.imgs.loadCount 
		) {
			var
			html = 
				'<table id="saPhotoAlbum_table" style="width:inherit;height:inherit;">'
				+'<tr style="height:*"><td>&nbsp;</td></tr>';
				
			var 
			album = settings.db.albumsContents[settings.album],
			numHor = Math.floor(jQuery('#iframeContent').width() / settings.lowres.width) - 1,
			numVer = Math.floor(jQuery('#iframeContent').height() / settings.lowres.height) - 1,
			numPage = numHor * numVer,
			beginIdx = (
				na.photoAlbum.settings.beginIdx
				? na.photoAlbum.settings.beginIdx
				: (settings.page -1) * numPage
			);
			
			if (!na.photoAlbum.settings.beginIdx) na.photoAlbum.settings.beginIdx = beginIdx;
			
			
			if (numHor==0) return false;
			var i = 0;
			while (i < numPage) {
				html += '<tr>';
				for (var j=0; j<numHor; j++) {
					if (i<s.imgs.imgs.length) {
						var
						img = album[i];
						
						html += s.imgs.imgs[i].html;
						
					};
					i++;
				}
				html += '</tr>';
			};
			html +=
				'<tr style="height:*"><td>&nbsp;</td></tr>'
				+'</table>'
				+'<a id="btnPagePrevious" href="#" style="position:absolute;top:50%;z-index:10000;width:40px;"><img src="'+na.m.globals.urls.app+'/nicerapp/com/ui/photoAlbum/btnPrevious.png" style="width:40px;"/></a>'
				+'<a id="btnPageNext" href="#" style="position:absolute;top:50%;right:0px;z-index:10000;width:40px;"><img src="'+na.m.globals.urls.app+'/nicerapp/com/ui/photoAlbum/btnNext.png" style="width:40px;"/></a>';
				
				
			//debugger;
			jQuery('#'+settings.div).html(html);
			na.photoAlbum.setPageButtonLinks(settings);
		}
	},
*/
