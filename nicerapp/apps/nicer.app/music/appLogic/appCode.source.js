/*na.apps.tools = {
	settings : {
		current :{}
	},
	
	init : function (settings) {
		na.apps.tools.settings = na.m.negotiateOptions (na.apps.tools.settings, settings);
		na.apps.tools.loadDB();
	},
	
	loadDB : function () {
		var ajaxCommand = {
			type : 'GET',
			url : na.m.globals.urls.app + 'apps/search/appLogic/boot_treeDB.php',
			success : na.m.traceFunction(function (retData, ts2) {
				na.json.decode.small (retData, null, 'na.apps.tools.loadDB::ajaxCommand.success()', null, function (data) {
					na.apps.tools.settings.db = data;
				});
			})
		};
		jQuery.ajax (ajaxCommand);
	},
	
	onPage : function (page, callback) {
		//if (na.apps.tools.settings.page !== page) {
			na.apps.tools.settings.page = page;
			var css = {
				height : 200
			};
			switch (page) {
				case 'json' :
					na.apps.settings.usingToolbar = true;
					na.apps.tools.createToolbar();					
					na.s.c.setVisible ([{element:'#siteTools',visible:true}], true, na.m.traceFunction(function(){na.s.c.resizeToolbar(css);}));//,undefined, function() { na.apps.tools.onPageCallback(callback) } );
					break;
				default:
					//na.s.c.removeToolbar();
					na.s.c.setVisible ([{element:'#siteTools',visible:false}], true, na.m.traceFunction(function(){na.s.c.resizeToolbar(css);}));//,undefined, function() { na.apps.tools.onPageCallback(callback) } );
					break;
			}
		//}
	},
	
	onResize : function () {
		var page = na.apps.tools.settings.page;
		switch (page) {
			case 'json':
				na.apps.tools.resizeToolbar();
				break;
		}
	},
	
	resizeToolbar : function () {
		var 
		jQuerysiteTools = jQuery('#siteTools__dialog'),
		w = jQuerysiteTools.width(),
		h = jQuerysiteTools.height(),
		jQueryinput = jQuery('#inputJSON',jQuerysiteTools);
		
		var
		iw = w-110, //jQueryinput.width(),
		ih = h-100, //jQueryinput.height(),
		t = Math.round((jQuerysiteTools.height() - ih)/2),
		borderWidth = 4;		


		//jQuery('#btnFormSearchSubmit').css({left:(w-230),top:Math.round((jQuerysiteTools.height() - 30)/2)});
		//debugger;
		jQuery('#siteTools').css ({ left : 80, top : 0, width : iw, height : ih });
		jQuery('#bgToolbar1').css({left : 0, top : t, width:iw,height:ih});
		jQuery('#bgToolbar2').css({left : borderWidth+1, top : t+borderWidth+1, width:iw-2-borderWidth,height:ih-2-borderWidth});
		jQuery('#bgToolbar3').css({left : borderWidth+2, top : t+2, width:iw-4-borderWidth,height:ih-4-borderWidth});
		jQuery('#bgToolbar4').css({left : borderWidth+3, top : t+3, width:iw-6-borderWidth,height:ih-6-borderWidth});
		jQuery('#bgToolbar3').css({left : borderWidth+4, top : t+4, width:iw-8-borderWidth,height:ih-8-borderWidth });
		jQuery('#btnFormSearchSubmit').css({top : ih + t + 10, left : iw - 225});
		jQueryinput.css({left : borderWidth+4, top : borderWidth+t+4, width:iw-8-borderWidth,height:ih-8-borderWidth });
	},
	
	createToolbar : function () {
		var 
		cssInput = '',
		h = window.location.hash.substr(1);
		
		var
		url = (
			typeof h==='string'
			&& h.indexOf('http://')!==-1
			? h
			: 'http://nicer.app/nicerapp/com/ui/tools/jsonViewer/jv_sample_data.json.php'
		);
		delete na.vcc.settings['btnFormSearchSubmit'];
		var
		html = 
			//'<div id="toolbar" style="width:100%;height:100%;opacity:0.01">'
			'<textarea id="inputJSON" type="text" style="'+cssInput+'">'+url+'</textarea><br/>'
			+'<div id="btnFormSearchSubmit" class="vividButton vividTheme__menu_001" style="postion:relative;"><a href="javascript:na.apps.tools.validateJSON(jQuery(\'#inputJSON\').val());">Validate</a></div>';
			//+'</div>';
		na.s.c.createToolbar (html, {height:200,inputHeight:120}, '#inputJSON');
	},
	
	validateJSON : function (val) {
/ *		if (false && val.indexOf('http://')!==-1) {
			var addressURLencoded = jQuery('#inputJSON').val();
			addressURLencoded = addressURLencoded.replace('http://','');
			//window.location.hash = '#'+addressURLencoded;
			
			//History.Adapter.unbind('hashchange', History.onHashChange);
			//window.location.hash = '#'+addressURLencoded;
			//!!! na.apps.tools.settings.contentPage === iframe #nicerapp_appContent
			na.apps.tools.settings.contentPage.validateJSON (val);
//			History.pushState ({val:val}, addressURLencoded, '#'+addressURLencoded);
			//jQuery(window).bind('hashchange', History.hashchange);
		} else {
			na.apps.tools.settings.contentPage.validateJSON (val);
		}
* /
		//!!! na.apps.tools.settings.appContentCode === iframe #nicerapp_appContent
		//debugger;
		na.apps.tools.settings.appContentCode.validateJSON (val);
	},
	
	/ *validateJSON : function (val) {
		debugger;
		if (typeof val!=='string') return false;
		na.m.waitForCondition ('window.parent.window.na.apps.tools.settings.db loaded', function () {
			return (
				typeof window.parent.window.na.apps.tools.settings.db !== 'undefined'
				&& !na.desktop.settings.animating
			);
				
		}, function () {
			var db = eval('('+val+')');//window.parent.window.na.apps.search.settings.db;
			var opt = { 
				htmlID : 'yum', 
				opacity : 0.65 
			}
			hm (db, 'JSON input', opt );
		}, 400);		
	},

	forTerm : function (searchterm) { // from apps/search!!!
		var ajaxCommand = {
			type : 'GET',
			url : na.m.globals.urls.app + 'apps/search/appLogic/ajax_search.php',
			data : {
				searchterm : searchterm
			},
			success : na.m.traceFunction(na.apps.tools.process.forTerm)
		};
		debugger;
		jQuery.ajax (ajaxCommand);
		
	},* /
	
	process : {
		forTerm : function (retData, ts2) {
			na.json.decode.small (retData, null, 'na.apps.tools.loadDB::ajaxCommand.success()', null, function (data) {
				na.apps.tools.settings.db = data;
			});
		}
	}
};
jQuery(document).ready(function () {
	na.apps.tools.init();
});*/
