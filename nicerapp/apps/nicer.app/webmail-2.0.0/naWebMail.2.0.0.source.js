var naWebMail = nawm = {
    about : {
        copyright : 'Copyright (c) Rene A.J.M. Veerman <rv.nicer.app@gmail.com>',
        license : 'MIT, see https://opensource.org/licenses/MIT',
        version : '2.0.0',
        firstCreated : {
            version1 : '2021 March',
            version2 : '2021/07jul/10'
        }
    },
    
    settings : { 
        current : {}
    },
    
    onload : function (el) {
        if (el.id=='siteDateTime') {
            var header = 
                '<div class="header" style="padding:5px;margin:10px;margin-right:5px;height:2.8em;background:rgba(0,0,0,0.4);border-radius:8px;">'
                    +'<span class="appTitle" style="float:left; padding-left:10px;font-size:2em; text-shadow:2px 2px 2px rgba(0,0,0,0.7)">'+$('#siteToolbarLeft h1').html()+'</span>'
                    +'<img src="/nicerapp/siteMedia/btnBack.png" style="float:right;width:35px;"/>'
                +'</div>';
            $('#siteToolbarLeft .vividDialogContent').html('');
            $('#siteToolbarLeft').prepend (header);

            $('#wmLeft').detach().appendTo('#siteToolbarLeft .vividDialogContent');
            $('#td_left').hide();
            
            var 
            origBG = $('#siteToolbarLeft .vdBackground'),
            origBGval = origBG.css('background');
            /*
            if (origBGval.indexOf('rgba(0, 0, 0, 0)')===-1) {*/
                $('#siteToolbarLeft').css({
                    background : origBGval
                });
                origBG.css({ background : 'none' });
            //};
            
            webmail.init();
        }
    }    
};
nawm.s = nawm.settings;
nawm.s.c = nawm.s.current;
