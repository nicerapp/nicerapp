<html>
<head>
    <link href="https://fonts.googleapis.com/css?family=ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Architects+Daughter|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap" rel="stylesheet"> <!-- see index.css and na.site.code.source.js (tinyMCE section) for where it's (primarily) used -->
    <link type="text/css" rel="StyleSheet" media="screen" href="http://localhost/nicerapp/lib/jquery-ui-1.12.1/jquery-ui.min.css?changed=20200502-211310">	
<link type="text/css" rel="StyleSheet" media="screen" href="http://localhost/nicerapp/lib/tooltipster/dist/css/tooltipster.bundle.min.css?changed=20200502-211308">	
<link type="text/css" rel="StyleSheet" media="screen" href="http://localhost/nicerapp/lib/tinymce-4/themes/charcoal/editor.na.css?changed=20200502-211308">	
<link type="text/css" rel="StyleSheet" media="screen" href="http://localhost/nicerapp/lib/jsTree/dist/themes/default/style.min.css?changed=20200502-211301">	
<link type="text/css" rel="StyleSheet" media="screen" href="http://localhost/nicerapp/lib/color-picker/color-picker.min.css?changed=20200502-211308">	
<link type="text/css" rel="StyleSheet" media="screen" href="http://localhost/nicerapp/index.css?changed=20200502-201251">	
<link type="text/css" rel="StyleSheet" media="screen" href="http://localhost/nicerapp/saErrorHandler.css?changed=20200502-201251">	

    <!--
	<script src="//cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js"></script>	
    <script
    src="https://code.jquery.com/jquery-3.3.1.min.js"
    integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
    crossorigin="anonymous"></script>    
    <script
    src="https://code.jquery.com/userInterface/1.12.1/jquery-ui.min.js"
    integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="
    crossorigin="anonymous"></script>
    -->

  <script type="text/javascript" src="http://localhost/nicerapp/ecmascriptExtensions.source.js?changed=20200502_201251"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/jquery-3.3.1.min.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/jquery-ui-1.12.1/jquery-ui.min.js?changed=20200502_211310"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/jquery.easing.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/jquery.tubeplayer-1.1.6.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib//jquery.history/jquery.history.js?changed=20200502_211312"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/jQuery.jPlayer-2.5.0/jquery.jplayer.min.js?changed=20200502_211311"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/color-picker/color-picker.min.js?changed=20200502_211308"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/tooltipster/dist/js/tooltipster.bundle.min.js?changed=20200502_211308"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/pouchdb.min.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/jquery-cookie/jquery.cookie.js?changed=20200502_211310"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/createjs-1.0.1.min.js?changed=20200502_211314"></script>	
<script type="text/javascript" src="https://code.createjs.com/1.0.0/easeljs.min.js?changed=19700101_010000"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/tinymce-4.8.0/js/tinymce/tinymce.min.js?changed=20200502_211302"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/lib/jsTree/dist/jstree.min.js?changed=20200502_211301"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/saCore-1.0.0.source.js?changed=20200503_005253"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/saDesktop-2.1.1.source.js?changed=20200502_210405"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/siteManager/1.0.0/siteManager-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/na.data_models/naDocument/1.0.0/na.data_models.naDocument-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/na.data_models/naMediaAlbum/1.0.0/na.data_models.naMediaAlbum-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/saTree/1.0.0/saTree-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/sitePopups/sitePopups-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/sitePopups/sitePopups.pageSettings-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/sitePopups/sitePopups.messages-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/businessLogic/sitePopups/sitePopups.chat-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/databases/json/treeDB/treeDB-1.0.0.source.js?changed=20200503_005625"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/accounts/saAccounts-1.0.0.source.js?changed=20200502_201251"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/saBackgrounds-1.0.0.source.js?changed=20200502_201251"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/searchYoutube/saSearchYoutube-1.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividProgressbar/vividProgressbar-1.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/comments/saComments-1.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/databases/json/saJSON/saJSON-1.0.0.source.js?changed=20200502_211300"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/colorGradients/saColorGradients-1.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/quickbar/na.quickbar-1.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividSpinner/vividSpinner-1.1.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividControls-1.0.0.source.js?changed=20200503_121635"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividButton/vividButton-2.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividDialog/vividDialog-2.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividMenu/vividMenu-1.0.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividScrollpane/vividScrollpane-1.0.0.source.js?changed=20200503_122128"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/vividText/vividText-1.1.0.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/jsonViewer/jsonViewer.source.js?changed=20200502_211317"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/apps/nicerapp/tools/appLogic/appCode.source.js?changed=20200502_210405"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/apps/nicerapp/search/appLogic/appCode.source.js?changed=20200502_210405"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/siteLogic/na.site.backgrounds.source.js?changed=20200502_210628"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/siteLogic/na.site.desktopLayout.source.js?changed=20200502_210628"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/siteLogic/na.site.code.source.js?changed=20200503_121824"></script>	
<script type="text/javascript" src="http://localhost/nicerapp/userInterface/canvasLogo-1.0.0.source.js?changed=20200502_211317"></script>	

</head>
<body>
    <style>
        p {
            color : white;
        }
        
        p a {
            color : white;
            font-size : 180%;
            font-weight : bold;
        }
        
        p a:hover {
            color : cyan;
            font-size : 180%;
            font-weight : bold;
        }
        
        p a:visited {
            color : #CCC;
            font-size : 180%;
            font-weight : bold;
        }
    </style>
    <center>
    <h1 id="pageTitle" style="font-family:Krona One;font-size:200%;">nicer.app music collections</h1><br/>
    <script type="text/javascript">
    
        window.top.na.vcc.settings['siteContent'].containsIframe = true;
    
        var vividTextCmd = {
                document : document,
                el : jQuery('#pageTitle', document.body)[0],
                theme : window.top.na.cg.themes.saColorgradientSchemeOrangeYellow, 
                animationType : window.top.na.vividText.globals.animationTypes[0],
                animationSpeed : 4 * 1000
        };
        //debugger;
        window.top.na.vividText.initElement (vividTextCmd);	
    </script>
    <br/>
    <p>
    <a href="#1" onclick="event.preventDefault(); event.stopImmediatePropagation(); window.top.na.s.c.pushState(null, 'Beautiful Chill Mixes', '/apps/eyJtdXNpY1BsYXllciI6eyJzZXQiOiJCZWF1dGlmdWxfQ2hpbGxfTWl4ZXMifX0'); return false;">Beautiful Chill Mixes</a><br/>
    <br/>
    <a href="#2" onclick="event.preventDefault(); event.stopImmediatePropagation(); window.top.na.s.c.pushState(null, 'Deep House', '/apps/eyJtdXNpY1BsYXllciI6eyJzZXQiOiJEZWVwX0hvdXNlIn19'); return false;">Deep House</a><br/>
    <br/>
    <a href="#3" onclick="event.preventDefault(); event.stopImmediatePropagation(); window.top.na.s.c.pushState(null, 'DJ FireSnake', '/apps/eyJtdXNpY1BsYXllciI6eyJzZXQiOiJESl9GaXJlU25ha2UifX0'); return false;">DJ FireSnake</a><br/>
    </p>
    </center>
</body>
</html>
