<?php 
require_once (dirname(__FILE__).'/../../../boot.php');
$app = json_decode (base64_decode_url($_GET['apps']), true);

$ip = (array_key_exists('X-Forwarded-For',apache_request_headers())?apache_request_headers()['X-Forwarded-For'] : $_SERVER['REMOTE_ADDR']);
/*if (
    $ip !== '::1'
    && $ip !== '127.0.0.1'
    && $ip !== '80.101.238.137'
) {
    header('HTTP/1.0 403 Forbidden');
    echo '403 - Access forbidden.';
    die();
}*/


?>
<div class="lds-facebook"><!-- thanks for allowing CC0 license usage : https://loading.io/css/ --><div></div><div></div><div></div></div> 
<link type="text/css" rel="StyleSheet" href="/nicerapp/domainConfigs/nicerapp/index.css?c=<?php echo date('Ymd_His',filemtime(realpath(dirname(__FILE__).'/../../../').'/domainConfigs/nicerapp/index.css'))?>">
<link type="text/css" rel="StyleSheet" href="/nicerapp/domainConfigs/nicerapp/index.dark.css?c=<?php echo date('Ymd_His',filemtime(realpath(dirname(__FILE__).'/../../../').'/domainConfigs/nicerapp/index.dark.css'))?>">
<script type="text/javascript" src="/nicerapp/apps/nicerapp/cms/na.folderView.source.js?c=<?php echo date('Ymd_His',filemtime(dirname(__FILE__).'/na.folderView.source.js'));?>"></script>
<script type="text/javascript" src="/nicerapp/apps/nicerapp/cms/na.blog.source.js?c=<?php echo date('Ymd_His',filemtime(dirname(__FILE__).'/na.blog.source.js'));?>"></script>
<script type="text/javascript" src="/nicerapp/userInterface/photoAlbum/4.0.0/photoAlbum-4.0.0.source.js?c=<?php echo date('Ymd_His',filemtime(dirname(__FILE__).'/photoAlbum-4.0.0.source.js'));?>"></script>

<script type="text/javascript" src="/nicerapp/3rd-party/tinymce-4.9.11/js/tinymce/tinymce.min.js"></script>
<div id="folder"></div>
<div id="upload">
    <div id="mediaFolder_navBar" class="navBar">
        <img id="btnUpload" class="navBar_button" src="/nicerapp/siteMedia/btnInsertMedia2.png" onclick="na.blog.onclick_btnUpload(event);"/>
        <img id="btnViewMedia" class="navBar_button" src="/nicerapp/siteMedia/btnViewMedia.png" onclick="na.blog.onclick_btnViewMedia(event);"/>
        <label id="mediaFolderTitle_label" for="mediaFolderTitle">name : </label>
        <input id="mediaFolderTitle" type="text" onchange="na.jsTree.onchange_mediaFolderTitle(event);"></input>
    </div>
    <iframe id="jQueryFileUpload" class="jQueryFileUpload" src="" style="overflow:hidden;width:100%;height:100%" allowtransparency="true"></iframe>
</div>
<div id="document">
    <div id="document_navBar" class="navBar">
        <img id="btnInsertLink" class="navBar_button" src="/nicerapp/siteMedia/btnInsertLink.png" onclick="tinymce.activeEditor.execCommand('mceLink');"/>
        <img id="btnInsertMedia" class="navBar_button" src="/nicerapp/siteMedia/btnInsertMedia.png" onclick="na.blog.onclick_insertMedia()"/>
        <img id="btnInsertPageBackground" class="navBar_button" src="/nicerapp/siteMedia/btnInsertPageBackground.png"/>
        <img id="btnPublish" class="navBar_button" src="/nicerapp/siteMedia/iconPublish.png" onclick="na.blog.onclick_publish(event);"/>
        <label id="documentTitle_label" for="documentTitle">Document name : </label>
        <input id="documentTitle" type="text" onchange="na.blog.onchange_documentTitle(event);"></input>
    </div>
    <textarea id="tinymce" onchange="na.blog.saveEditorContent();"></textarea>

    <script type="text/javascript">
    //document.addEventListener('DOMContentLoaded', () => {
    setTimeout (function() {
        //$(document).ready(function() {
            var useDarkMode = true;
            tinymce.ready = false;
            tinymce.baseURL = '/nicerapp/3rd-party/tinymce-4.9.11/js/tinymce';
            tinymce.suffix = '.min';
            tinymce.init({
                selector: 'textarea#tinymce',
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor textcolor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table contextmenu paste code help'
                ],
                external_plugins : {
                    'emoticons' : '/nicerapp/3rd-party/tinymce-4/plugins/naEmoticons/plugin.min.js'
                },
                resize : true,
                menubar: false,//'file edit view insert format tools table help',
                toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                toolbar_sticky: true,
                height: $('#siteContent .vividDialogContent').height() - $('#document_navBar').height(),
                editor_css : '/nicerapp/3rd-party/tinymce-4/themes/charcoal/editor.na.css',
                skin_url : '/nicerapp/3rd-party/tinymce-4/themes/charcoal',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                
                content_css: [
                    '/nicerapp/3rd-party/tinymce-4/themes/charcoal/content.min.css',
                    'https://fonts.googleapis.com/css?family=ABeeZee|Aclonica|Acme|Actor|Advent+Pro|Akronim|Alex+Brush|Architects+Daughter|Archivo+Black|Baloo|Bebas+Neue|Caveat|Chewy|Cookie|Cormorant|Courgette|Covered+By+Your+Grace|Dancing+Script|El+Messiri|Exo|Exo+2|Galada|Gloria+Hallelujah|Great+Vibes|Handlee|Indie+Flower|Kalam|Kaushan+Script|Khula|Knewave|Krona+One|Lacquer|Lemonada|Lusitana|M+PLUS+1p|Marck+Script|Merienda+One|Modak|Montserrat|Montserrat+Alternates|Mr+Dafoe|Nanum+Pen+Script|Noto+Serif+JP|Odibee+Sans|Oleo+Script|Orbitron|PT+Sans|Parisienne|Pathway+Gothic+One|Permanent+Marker|Playball|Pridi|Quattrocento+Sans|Rock+Salt|Sacramento|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Satisfy|Shadows+Into+Light|Shadows+Into+Light+Two|Sigmar+One|Signika+Negative|Slabo+27px|Source+Code+Pro|Special+Elite|Spectral|Spinnaker|Sriracha|Unica+One|Acme|Lato:300,300i,400,400i|Montserrat|Mukta+Malar|Ubuntu|Indie+Flower|Raleway|Pacifico|Fjalla+One|Work+Sans|Gloria+Hallelujah&display=swap',
                    '/nicerapp/3rd-party/tinymce-4/themes/charcoal/content.na.css'
                ],
                font_formats: 'ABeeZee=ABeeZee;Aclonica=Aclonica;Actor=Actor;Advent Pro=Advent Pro;Akronim=Akronim;Alex Brush=Alex Brush;Architects Daughter=Architects Daughter;Archivo Black=Archivo Black;Baloo=Baloo;Bebas Neue=Bebas Neue;Caveat=Caveat;Chewy=Chewy;Cookie=Cookie;Cormorant=Cormorant;Courgette=Courgette;Covered By Your Grace=Covered By Your Grace;Dancing Script=Dancing Script;El Messiri=El Messiri;Exo=Exo;Exo 2=Exo 2;Galada=Galada;Great Vibes=Great Vibes;Kalam=Kalam;Kaushan Script=Kaushan Script;Khula=Khula;Knewavel=Knewavel;Krona One=Krona One;Lacquer=Lacquer;Lemonada=Lemonada;Lusitana=Lusitana;M PLUS 1p=M PLUS 1p;Marck Script=Marck Script;Merienda One=Merienda One;Modak=Modak;Montserat Alternates=Montserrat Alternates;Mr Dafoe=Mr Dafoe;Nanum Pen Script=Nanum Pen Script;Noto Serif JP=Noto Serif JP;Odibee Sans=Odibee Sans;Oleo Script=Oleo Script;Orbitron=Orbitron;PT Sans=PT Sans;Parisienne=Parisienne;Pathway Gothic One=Pathway Gothic One;Permanent Marker=Permanent Marker;Playball=Playball;Pridi=Pridi;Quattrocento Sans=Quattrocento Sans;Rock Salt=Rock Salt;Sacramento=Sacramento;Saira Condensed=Saira Condensed;Saira Extra Condensed=Saira Extra Condensed;Saira Semi Condensed=Saira Semi Condensed;Satisfy=Satisfy;Shadows Into Light=Shadows Into Light;Shadows Into Light Two=Shadows Into Light Two;Sigmar Once=Sigmar One;Signika Negative=Signika Negative;Slabo 27px=Slabo 27px;Source Code Pro=Source Code Pro;Special Elite=Special Elite;Spectral=Spectral;Spinnaker=Spinnaker;Sriracha=Sriracha;Unica One=Unica One;Acme=Acme;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Fjalla One=Fjalla One;Georgia=georgia,palatino;Gloria Hallelujah=Gloria Hallelujah;Helvetica=helvetica;Impact=impact,chicago;Indie Flower=Indie Flower;Montserrat=Montserrat;Mukta Malar=Mukta Malar;Pacifico=Pacifico;Raleway=Raleway;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Ubuntu=Ubuntu;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;Work Sans=Work Sans',
                link_list : na.blog.tinymce_link_list,
                relative_urls : false,
                init_instance_callback : function(editor) {
                    $(editor.editorContainer).addClass('fade-in'); 
                    $('#siteContent .lds-facebook').fadeOut('slow');
                    tinymce.ready = true;   
                    na.blog.onresize();
                }
            });
       // });
    }, 500);
    </script>
</div>
