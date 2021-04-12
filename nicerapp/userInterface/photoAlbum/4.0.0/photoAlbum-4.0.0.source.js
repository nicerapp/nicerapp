if (!na) var na = {};
na.photoAlbum = {
    settings : {},
    
    onload : function () {
        var
        jQueryImg = $('#viewMedia'),
        s = na.photoAlbum.settings,
        w = jQueryImg[0].naturalWidth,
        h = jQueryImg[0].naturalHeight,
        iframeWidth = $('#siteContent .vividDialogContent').width(),
        iframeHeight = $('#siteContent .vividDialogContent').height(),
        imgpw = Math.floor((w*100)/iframeWidth),
        imgph = Math.floor((h*100)/iframeHeight);
        
        s.naturalWidth = w;
        s.naturalHeight = h;

        //na.m.log (1, 't12', iframeWidth, w, iframeHeight, h, imgpw, imgph);
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
        s.minZoom = s.zoomPercentage;
        
        na.photoAlbum.updateZoom();
        na.m.hookScrollwheel ($('#viewMedia')[0], na.photoAlbum.mousewheel, false, true);
        document.onmousedown = na.photoAlbum.startDrag;
		document.onmouseup = na.photoAlbum.stopDrag;
        
    },
    
	startDrag : function (e) {
        // determine event object
        if (!e) {
            var e = window.event;
        }
        if(e.preventDefault) e.preventDefault();

        // IE uses srcElement, others use target
        targ = e.target ? e.target : e.srcElement;

        if (targ.id != 'viewMedia') {return};
        // calculate event X, Y coordinates
            na.photoAlbum.settings.offsetX = e.clientX;
            na.photoAlbum.settings.offsetY = e.clientY;

        // calculate integer values for top and left 
        // properties
        na.photoAlbum.settings.coordX = $('#siteContent .vividDialogContent')[0].scrollLeft;
        na.photoAlbum.settings.coordY = $('#siteContent .vividDialogContent')[0].scrollTop;
        na.photoAlbum.settings.drag = true;
        // move div element
            document.onmousemove=na.photoAlbum.dragDiv;
        return false;
        
    },
    dragDiv : function (e) {
        if (!na.photoAlbum.settings.drag) {return};
        if (!e) { var e= window.event};
        // var targ=e.target?e.target:e.srcElement;
        // move div element
        $('#siteContent .vividDialogContent')[0].scrollLeft = na.photoAlbum.settings.coordX+e.clientX-na.photoAlbum.settings.offsetX;
        $('#siteContent .vividDialogContent')[0].scrollTop = na.photoAlbum.settings.coordY+e.clientY-na.photoAlbum.settings.offsetY;
        return false;
    },
	stopDrag : function () {
        na.photoAlbum.settings.drag=false;
    },
    
    mousewheel : function (evt) {
        var 
        s = na.photoAlbum.settings,
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
        if (s.zoomPercentage<s.minZoom) s.zoomPercentage=s.minZoom;
        na.photoAlbum.updateZoom();
    },
    
    
    updateZoom : function () {
        var
        jQueryImg = $('#viewMedia'),
        s = na.photoAlbum.settings,
        w = jQueryImg[0].naturalWidth,
        h = jQueryImg[0].naturalHeight,
        iframeWidth = $('#siteContent .vividDialogContent').width(),
        iframeHeight = $('#siteContent .vividDialogContent').height(),
        imgpw = Math.floor((iframeWidth*100)/w),
        imgph = Math.floor((iframeHeight*100)/h),
        th = false,
        tw = false;
        if (imgph>imgpw) {
            if (h>iframeHeight) {
                th = ((h)/100) * s.zoomPercentage;
                tw = jQueryImg.css({width:'',left:0,height:th}).width();
            } else if (w>iframeWidth) {
                tw = ((w)/100) * s.zoomPercentage;
                th = jQueryImg.css({top:0,width:tw,height:''}).height();
            } else if (w>h) {
                tw = ((w)/100) * s.zoomPercentage;
                th = jQueryImg.css({top:0,width:tw,height:''}).height();
            } else {
                th = ((h)/100) * s.zoomPercentage;
                tw = jQueryImg.css({width:'',left:0,height:th}).width();
            }
        } else {
            if (w>iframeWidth) {
                tw = ((w)/100) * s.zoomPercentage;
                th = jQueryImg.css({top:0,width:tw,height:''}).height();
            } else if (h>iframeHeight) {
                th = ((h)/100) * s.zoomPercentage;
                tw = jQueryImg.css({width:'',left:0,height:th}).width();
            } else if (w>h) {
                tw = ((w)/100) * s.zoomPercentage;
                th = jQueryImg.css({top:0,width:tw,height:''}).height();
            } else {
                th = ((h)/100) * s.zoomPercentage;
                tw = jQueryImg.css({width:'',left:0,height:th}).width();
            }
        };
        s.th = Math.round(th*1000)/1000;
        s.tw = Math.round(tw*1000)/1000;
        
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
        $('#naPhotoAlbum__control__naturalWidth').html ( 'NaturalWidth : ' + s.naturalWidth);
        $('#naPhotoAlbum__control__naturalHeight').html ( 'NaturalHeight : ' + s.naturalHeight);
        $('#naPhotoAlbum__control__width').html ( 'Width : ' + s.tw);
        $('#naPhotoAlbum__control__height').html ( 'Height : ' + s.th);
        $('#naPhotoAlbum__control__zoomPercentage').html ( 'Zoom : ' + Math.round(s.zoomPercentage*1000)/1000 + '%');
    }
    
};
