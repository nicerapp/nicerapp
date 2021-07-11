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
                '<div class="header" style="margin:10px;background:rgba(0,0,0,0.4);border-radius:8px;">'
                    +'<h1 style="padding-left:10px;text-shadow:2px 2px 2px rgba(0,0,0,0.7)">'+$('#siteToolbarLeft h1').html()+'</h1>'
                +'</div>';
        
            $('#siteToolbarLeft .vividDialogContent').html('');
            $('#siteToolbarLeft').prepend (header);
            $('#wmLeft').detach().appendTo('#siteToolbarLeft .vividDialogContent');
            $('#td_left').hide();
            webmail.init();
        }
    }    
};
nawm.s = nawm.settings;
nawm.s.c = nawm.s.current;
