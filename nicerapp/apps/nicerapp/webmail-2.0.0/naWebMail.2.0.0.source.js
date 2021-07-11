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
    
    onload : function (event) {
        $('.lds-facebook').fadeOut('normal', 'swing');
        $('#siteToolbarLeft').html('');
        $('#wmLeft').detach().appendTo('#siteToolbarLeft');
        $('#td_left').hide();
        webmail.init();
    }    
};
nawm.s = nawm.settings;
nawm.s.c = nawm.s.current;
