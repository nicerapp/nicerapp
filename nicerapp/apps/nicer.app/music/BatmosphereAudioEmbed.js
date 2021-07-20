// Batmosphere Embedded Media Player, version 2006-05-31 
// Written by David Battino, www.batmosphere.com
// OK to use if this notice is included

// This function reads an MP3 URL and title from the referring page and generates embedding code to play back the audio file.
// Windows browsers (except for Internet Explorer) will play back the file with the Windows Media Player *plugin.* Internet Explorer will use Windows Media Player.
// Non-Windows browsers will play back the file with their standard audio handler for the MIME type audio/mpeg. On Macs, that handler will usually be QuickTime.

var audioFolder = ""; // If you have a default audio directory, e.g., http://www.your-media-hosting-site.com/sounds/, you can put it here to make links on the referring page shorter.

function embedPlayer(id, MP3URL) { 

	// Get Operating System 
	var isWin = navigator.userAgent.toLowerCase().indexOf("windows") != -1
	var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1
	if (isWin) { // Use MIME type application/x-mplayer2
		visitorOS="Windows";
	} else { // Use MIME type audio/mpeg, audio/x-wav, etc.
		visitorOS="Other";
	}

	var audioURL = audioFolder + MP3URL;

	var objTypeTag = "application/x-mplayer2"; // The  MIME type to load the WMP plugin in non-IE browsers on Windows
	if (visitorOS != "Windows") { objTypeTag = "audio/mpeg"}; // The MIME type for Macs and Linux 

	var html = '';
	html +="<div>";
	html +="<object width='280' height='"+(isIE?16:69)+"'>"; // Width is the WMP minimum. Height = 45(WMP controls) + 24 (WMP status bar) 
	html +="<param name='type' value='" + objTypeTag + "'>";
	html +="<param name='src' value='" + audioURL + "'>";
	html +="<param name='autostart' value='0'>";
	html += '<PARAM NAME="ClickToPlay" VALUE="True"><PARAM NAME="InvokeURLs" VALUE="False"> ';
	html +="<param name='showcontrols' value='1'>";
	html +="<param name='showstatusbar' value='1'>";
	html +="<embed src ='" + audioURL + "' type='" + objTypeTag + "' autoload='false' autoplay='false' autostart='0' width='280' height='"+(isIE?16:69)+"' controller='1' showstatusbar='1' bgcolor='#ffffff'></embed>"; // Firefox and Opera Win require both autostart and autoplay
	html +="</object>";
	html +="</div>";
	document.getElementById (id).innerHTML = html;
}
