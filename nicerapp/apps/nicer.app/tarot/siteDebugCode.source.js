var UC_CONTEXT = {};
var as = {
	globals : {
		rootURL : fwa.globals.urls.app,
		subURL : window.location.href.replace (fwa.globals.urls.app, ''),
		fadeTime : 1000
	},
	settings :{
		
	},
	startApp : function () {
		var sp = as.globals.subURL.split('/');
		sp.pop();
		as.globals.subURL = sp.join('/')+'/';
		
		fwa.settings.logLevel = 3;

		fwa.ultiCache.scan ('ultiCache_data');
		as.transformLinks(document.body);
		
		// Set up automated resizing of the site's background image:
		$(window).resize(function () {
			as.onWindowResize();
		});
		as.onWindowResize();
		
		as.globals.$bg1 = $('#siteBackground_img1');
		as.globals.$bg2 = $('#siteBackground_img2');
		as.globals.$bg2.load(as.showNewBackground);
		
		// use HTML5 History API if available:
		History.Adapter.bind(window,'statechange',function(){ 
			var state = History.getState(); 
			//History.log(state.data, state.title, state.url);
			as.loadContent (state.url);
		});				
		
		// For browsers that do not support the HTML5 History API:
		if (window.location.hash!=='') as.loadContent (window.location.hash.replace(/#/,''));

		// Define the desktop components for automated resizing of the windows/dialogs/components when the browser window changes;
		fwa.desktop.options = {
			desktop : { size : { width : 1000, height : 1000 }, margin : 5 },
			'#siteMenu' : {	snapTo : [ { element : 'body', edge: 'left' }, {element:'body',edge:'top'} ]	},
			'#siteLogo' : { snapTo : [ { element : 'body', edge : 'right' },{ element : 'body', edge : 'top' } ] },
			'#siteContent' : { snapTo : [ { element : 'body', edge : 'left' }, { element : '#siteLogo', edge : 'bottom' } ], growTo : 'max' }
		};
		fwa.desktop.init({
			afterResize : function () {
			}
		}); // will bind itself to window.resize as well
		
		fwa.animatedJavascriptControlCenter.setOptions('siteMenu',{ level_0_global : { orientation : 'horizontal', animspeed : 400 } });
		fwa.animatedJavascriptControlCenter.init(document.body, as.animatedJavascriptsInitialized);
	},
	
	selfTest : function (testNumber) {
		switch (testNumber) {
			case 1 : as.selfTest_1(); break;
		}
	},
	
	selfTest_1 : function () {
		var db = fwa.ramoodb;
		
		db.init ("Brian's Art Gallery");
		db.login ('Guest');
		db.load(function () {
			var tid = db.startTransaction();
			db.set (tid, 'data/works/work1', 'currentPrice', 200);
			db.set (tid, 'data/works/work1/bids', null, { bidPrice : 160, bidderIP : 'xxx.yyy.zzz', bidderName : 'fancywebapps.com', bidderEmail : 'fancywebapps@xs4all.nl' });
			db.processTransaction (tid, function (result) {
				$('#output')[0].innerHTML += '<div id="output_'+tid+'"></div>';
				hm (result, 'transaction '+tid, { htmlID : 'output_'+tid } );
			});
		});
	},
	
	animatedJavascriptsInitialized : function () {
		
		// initially the comment editor is hidden:
		//$('#comment_editor').slideUp (1);
		//$('#comments, #comments__container').css ({height:($('#infoWindow_comments__dialog').height()-130) + 'px'});
		//fwa.ajss.containerSizeChanged($('#comments')[0]);
		
		//fwa.ajss.initAutomatedScrolling ($('#siteAds__scrollpane')[0], 'vertical', true);
		
		as.loadWorks();
		fwa.hms.startProcessing();
		
		//$('#output')[0].innerHTML+=fwa.auth.createHash ('test');
		
		//as.selfTest(1);
		
		fwa.auth.createWidgets();
		$('#formLogin_username').val('Administrator');
		$('#formLogin_password').val('admin');
		//fwa.auth.login($('#formLogin')[0]);
		
		fwa.lah.initialize();
		fwa.lah.show();

		as.editorInitialized();
		return false;
		
		// note paths to tinyMCE CSS files
		var css_e = fwa.globals.urls.os + '/lib/tinymce-3.5b3/jscripts/tiny_mce/themes/advanced/skins/default/ui_rajmvTransparency.css';
		var path = fwa.globals.urls.os + "/lib/tinymce-3.5b3/rajmvTransparency/";
		var css_c = path + 'editor_comment.css,';
		if (navigator.userAgent.match(/MSIE/)) {
			css_c += path + 'editor_comment_ie5.css';
		} else {
			css_c += path + 'editor_comment_css3.css';
		};

		tinyMCE.init({
			mode : "textareas",
			theme : "advanced",
			init_instance_callback : as.editorInitialized, 
			theme_advanced_buttons1 : "inlinepopups,bold,italic,underline,strikethrough,indent,outdent,bullist,numlist,justifyleft,justifycenter,justifyright,justifyfull,link,unlink",
			theme_advanced_buttons2: "fontselect,fontsizeselect,forecolor,backcolor,undo,redo",
			theme_advanced_buttons3: "",
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
		});				
	},

	editorInitialized : function () {
		as.hideCommentsEditor();

		fwa.desktop.resize();
		$('#siteLoadingMsg,#siteBootLog').fadeOut (350);
		$('#siteBackground_img1').fadeIn (1500);
		setTimeout (function() {
			// now show the previously hidden site widgets and dialogs
				$('#dialog-content').css ({overflow:'hidden'}); // #dialog-content holds an <iframe> in this webapp, so to prevent double scrollbars we do this
				$('#siteLoadingMsg, #siteBootLog').fadeOut('normal');
				as.globals.$bg1.css ({visibility:'visible',display:'none'}).fadeIn('slow');
				var ids = '#aswift_0, #aswift_1, #aswift_2';
				for (var id in fwa.desktop.options) {
					if (id!=='desktop') {
						if (ids!='') ids+=', ';
						ids += id+', '+id+'__dialog';
					}
				}
				$(ids).css({display:'none',visibility:'visible'}).fadeIn(1500);
				
				setTimeout (function() {
					fwa.desktop.resize();
					fwa.settings.initialized.site = true;

					setTimeout (as.changeBackground, 20 * 1000);
					fwa.serviceLog.makeLogEntry();
					
					// use HTML5 History API if available:
					History.Adapter.bind(window,'statechange',function(){ 
						var state = History.getState(); 
						fwa.googleAnalyticsMakeHit();
						fwa.serviceLog.makeLogEntry();
					});
					// For browsers that do not support the HTML5 History API:
					if (window.location.hash!=='') as.selectMP3fromLocation (window.location.hash.replace(/#/,''));
					// For browsers that do support the HTML5 History API:
					if (window.location.href.match('play/')) as.selectMP3fromLocation(window.location.href.replace(fwa.globals.urls.os,'').replace(/#.*/,''));
				},1510);
		},1510);
	},
	
	enterNewComment : function () {
		var ed = tinyMCE.get('newComment');
		var entry = {
			subscription : 'all',
			from : $('#newCommentFrom')[0].value,
			when : '' + (new Date()),
			comment : ed.getContent()
		};
		fwa.comments.newComment (entry, function (result, statusAsText) {
			$('#comments').prepend (result);
			as.hideCommentsEditor();
		});
	},
	
	removeComment : function (subscriptionName, commentIdx, result, statusAsText) {
		var $c = $('#fwaComment_subscription_' + subscriptionName + '_item_' + commentIdx);
		$c.slideUp('slow', function () {
			$c.remove();
			fwa.ajss.containerSizeChanged($('#comments')[0]);
		});
	},
	
	hideCommentsEditor : function () {
		$('#comment_editor').slideUp ('slow');
		$('#newCommentShowEditor_td').animate ({height:'35px'},'slow',function() {
			$('#newCommentShowEditor').fadeIn ('slow');
			$('#comments, #comments__container').animate ({height:($('#dialog-comments__dialog').height()-130) + 'px'},'fast',function() {
				fwa.ajss.containerSizeChanged($('#comments')[0]);
			});					
		});
	},
	
	showCommentsEditor : function () {
		$('#comments, #comments__container').animate ({height:($('#dialog-comments__dialog').height()-510) + 'px'}, 'slow', function () {
			fwa.ajss.containerSizeChanged($('#comments')[0]);
		});
		$('#newCommentShowEditor').fadeOut ('slow', function () {
			$('#newCommentShowEditor_td').animate ({height:'1px'},'slow');
			$('#comment_editor').show ('slow');
		});
	},
	
	logoClicked : function () {
		as.changeBackground();
		window.History.pushState (null, 'Fancy Web Apps Opensource Websites Framework', fwa.globals.urls.app);
	},
	changeBackground : function () {
		var ac = {
			type : 'GET',
			url : fwa.globals.urls.app + '/ajax_newBackground.php',
			success : function (dataAsText, statusAsText) {
				as.globals.$bg2.css ({display:'none',visibility:'visible'});
				as.globals.$bg2[0].src = dataAsText;
			}
		}
		jQuery.ajax (ac);
	},
	showNewBackground : function () {
		as.globals.$bg2.fadeIn (3000);
		setTimeout (function () {
			as.globals.$bg1[0].src = as.globals.$bg2[0].src;
			as.globals.$bg2.css ({display:'none'});
			setTimeout (as.changeBackground, 2 * 60 * 1000)
		},3005)
	},
	loadContent : function (url) {
		var ajaxCommand = {
			type : 'GET',
			url : fwa.globals.urls.app + '/get_content.php?url='+url.replace(fwa.globals.urls.app,'')+'&rootURL='+fwa.globals.urls.app,
			success : function (data, ts) {
				var d = document.getElementById ('siteContent');
				d.innerHTML = data;
				as.transformLinks(d);
			}
		};
		fwa.uc.ajax (ajaxCommand);
	},
	loadWorks : function (url) {
		var ajaxCommand = {
			type : 'GET',
			url : fwa.globals.urls.app + '/get_works.php',
			success : function (data, ts) {
				if (typeof data!=='object') {
					data = eval ('('+data+')');
				}
				as.settings.works = data;
				as.displayWorks (as.settings.works);
			}
		};
		fwa.uc.ajax (ajaxCommand);
	},
	displayWorks : function (works) {
		var html = 
			'<table class="works" cellpadding="0" cellspacing="5">'
			+'<tr>'
			+'<td width="*">&nbsp;</td>';
		
		var perLine = 3;
		var i = 1;
		for (workName in works.works) {
			var workSettings = works.works[workName];
			
			html +=
				'<td class="work" style="width:210px;">'
				+'<div class="workTitle">'+workName+'</div>'
				+'<img src="works/'+workName+'.jpg" class="work"/><br/>'
				+'<span class="workPriceTitle">Current price<span> <span class="workColon">:</span> <span class="workPrice">'+worksettingsPrice+'</span><br/>'
				+'<div id="btn_'+workName+'" class="workBidBtn animatedJavascriptButton animatedTheme__menu_004"><a href="javascript:as.bidOn(\''+workName+'\');">Bid</a></div>'
				+'</td>';
			if (i/perLine==Math.round(i/perLine)) {
				html +=
					'<td width="*">&nbsp;</td>'
					+'</tr>'
					+'<tr class="worksVerticalSpacer"><td colspan="'+(perLine+2)+'" class="worksVerticalSpacer">&nbsp;</td></tr>'
					+'<tr>'
					+'<td width="*">&nbsp;</td>';
			}
			i++;
		}
		html += '</tr></table>';
		$('#works').html (html);
		for (workName in works.works) {
			var workSettings = works.works[workName];
			fwa.ajcc.init ($('#btn_'+workName)[0]);
		}
	},
	bidOn : function (workName) {
		as.initBidForm (workName);
		$('#works').fadeOut (as.globals.fadeTime);
		setTimeout (function () {
			$('#workBidTab').fadeIn (as.globals.fadeTime);
			setTimeout (function () {
				fwa.ajss.containerSizeChanged($('#siteContent__scrollpane')[0]);
			}, as.globals.fadeTime);
		}, as.globals.fadeTime);
	},
	showWorks : function () {
		$('#workBidTab').fadeOut (as.globals.fadeTime);
		setTimeout (function () {
			$('#works').fadeIn (as.globals.fadeTime);
			setTimeout (function () {
				fwa.ajss.containerSizeChanged($('#siteContent__scrollpane')[0]);
			}, as.globals.fadeTime);
		}, as.globals.fadeTime);
	},
	initBidForm : function (workName) {
		$('.workBid_workName').html (workName);
		$('#workBid_currentBid').html (as.getWorksSetting(workName,'currentPrice'))
		$('#workBid_image')[0].src = 'works/'+workName+'.jpg';
		$('#workBid_bid').val  (as.getWorksSetting(workName,'currentPrice')+as.getWorksSetting(workName,'bidIncrease'));
	},
	getWorksSetting : function (workName, settingName) {
		var useDefault = false;
		if (!as.settings.works) useDefault=true;
		var w = as.settings.works.works[workName];
		if (!w || !w[settingName]) useDefault=true; else return w[settingName];
		
		if (useDefault) {
			switch (settingName) {
				case 'bidIncrease' : return 5;
			}
		}
		
		return null;
	},
	positionBidForm : function () {
		var $bw = $('#workBidWindow__dialog');
		$bw.css ({
			top : Math.round (  ($(window).height() - $bw.height()) / 2 ),
			left : Math.round (  ($(window).width() - $bw.width()) / 2 )
		})
	},
	onWindowResize : function () {
		var ds = as.getDesktopDimensions();
		$('#siteBackground_img1, #siteBackground_img2').css({
			width : ds.width + 'px',
			height : ds.height + 'px'
		});
		as.positionBidForm();
	},
	getDesktopDimensions : function() {
		var myWidth = 0, myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
		// "standards browsers":
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if( document.documentElement && document.documentElement.clientWidth ) {
		//IE 6+ in 'standards compliant mode':
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && document.body.clientWidth ) {
		//IE 4 compatible:
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		};
		return {
			width : myWidth,
			height : myHeight
		};
	},
	transformLinks : function (rootElement) {				
		$('a', rootElement).each (function (idx) { 
			if (this.href.match(as.globals.rootURL)) {
				if ($(this).parents('.animatedJavascriptButton, .animatedJavascriptMenu').length>0) {
				// animatedJavascript* links, allways internal to this app in this app :
					var o = this.href;
					this.href = 
						'javascript:window.History.pushState (null, \'' 
						+ this.title + '\', \''+fwa.globals.urls.app+'/' 
						+ this.href.replace(fwa.globals.urls.app+as.globals.subURL,'') + '\');';
					fwa.log (3, 'as.transformLinks() : changed animatedJavascript* href ' + o + ' to ' + this.href);
				} else {
				// regular internal links:
					fwa.log (3, 'as.transformLinks(): binding click for ajaxification of ' + this.href);
					if (this.addEventListener) {
					//Chrome, FireFox, Safari, "standards browsers":
						this.addEventListener ('click', function (evt) {
							fwa.log ('as.transformLinks(): '+this.href+' fired! ajaxifying! :)');
							evt.preventDefault();
							window.History.pushState (null, this.title, this.href);
						});
					} else if (this.attachEvent) {
					//Internet Explorer:
						this.attachEvent ('onclick', function (evt) {
							fwa.log ('as.transformLinks(): '+this.href+' fired! ajaxifying! :)');
							evt.preventDefault();
							window.History.pushState (null, this.title, this.href);
						});							
					}
				}
			} else if (this.href.substr(0,4)==='http') {
			// external links:
				$(this).fancybox({
					'width' : '85%',
					'height'	: '85%',
					'autoScale' : false,
					'transitionIn' : 'none',	
					'transitionOut' : 'none',
					'type' : 'iframe'
				});
				fwa.log ('as.transformLinks() : for ' + this.href + ' added fancybox');
			}
		});
	}
}
