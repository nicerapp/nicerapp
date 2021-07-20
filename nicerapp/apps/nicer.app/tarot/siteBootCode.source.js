$('#javascriptEnabledTest').css({color:'white'}).html ('This free tarot game will finish loading soon.');
fwa.settings.logLevel = 2; //increase to 3 to see all debug information in your console log or in #siteBootLog to your visitors

// position on the screen the boot-up message and possibly the #siteBootLog as well:
var $slm = $('#siteLoadingMsg');
$slm.css({
	top : (($(window).height() - $slm.height())/6) + 'px',
	left : (($(window).width() - $slm.width())/2) + 'px'
});
var $sbl = $('#siteBootLog');
var $cm = $('#consoleMsg');
$sbl.css({
	top : (($(window).height() - $cm.height())/2) + 'px',
	left : (($(window).width() - $cm.width())/2) + 'px'
});

// show spinning icon while artwork loads and site initializes:
var loaderIconTheme = {
	centerGapRadius: 30,
	stripes: [
		fwa.globals.urls.os + '/com/ui/vivid/themes/spinner/transGreenOuter/stripe_1.png', 
		fwa.globals.urls.os + '/com/ui/vivid/themes/spinner/transGreenOuter/stripe_2.png', 
		fwa.globals.urls.os + '/com/ui/vivid/themes/spinner/transGreenOuter/stripe_3.png',
	]
};
/*
as.settings.loaderIcon = fwa.acs.addIcon(
	true, //whether or not to absolutely position
	document.body, //parent element to stick icon to (will be positioned in the middle of the parent element)
	180, 180, //width and height in pixels
	loaderIconTheme, //see var theme above
	true //start running immediately
);
*/