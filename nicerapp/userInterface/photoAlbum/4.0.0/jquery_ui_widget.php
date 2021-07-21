<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" style="width:100%;height:100%;">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>

<title>Plupload - jQuery UI Widget</title>

<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/jquery-ui.css" type="text/css" />
<link rel="stylesheet" href="/nicerapp/userInterface/photoAlbum/4.0.0/jquery.ui.plupload.css" type="text/css" />

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>

<!-- production -->
<script type="text/javascript" src="/nicerapp/3rd-party/plupload-2.3.6/js/plupload.dev.js"></script>
<script type="text/javascript" src="/nicerapp/3rd-party/plupload-2.3.6/js/jquery.ui.plupload/jquery.ui.plupload.js"></script>

<!-- debug 
<script type="text/javascript" src="../../js/moxie.js"></script>
<script type="text/javascript" src="../../js/plupload.dev.js"></script>
<script type="text/javascript" src="../../js/jquery.ui.plupload/jquery.ui.plupload.js"></script>
-->

</head>
<body style="font: 13px Verdana;width:100%;height:100%;overflow:hidden;margin:0px;padding:0px;">
<form id="form" method="post" action="../dump.php" style="width:100%;height:100%;text-align:center">
	<div id="uploader" style="height:100%;">
		<p>Your browser doesn't have Flash, Silverlight or HTML5 support.</p>
	</div>
	<br />
	<!--<input type="submit" value="Submit" />-->
</form>

<script type="text/javascript">
// Initialize the widget when the DOM is ready
$(function() {
	var uploader = $("#uploader").plupload({
		// General settings
		runtimes : 'html5,flash,silverlight,html4',
		url : './upload.php?basePath=<?php echo $_GET['basePath']?>',

		// User can upload no more then 20 files in one go (sets multiple_queues to false)
		max_file_count: 10 * 1000,
		
		chunk_size: '1mb',

		// Resize images on clientside if we can
		/*
		resize : {
			width : 200, 
			height : 200, 
			quality : 90,
			crop: true // crop to exact dimensions
		},
		*/
		
		filters : {
			// Maximum file size
			max_file_size : '20000mb',
			// Specify what files to browse for
			mime_types: [
				{title : "Image files", extensions : "jpg,jpeg,gif,png"},
				{title : "Zip files", extensions : "zip"}
			]
		},

		// Rename files by clicking on their titles
		rename: true,
		
		// Sort files
		sortable: true,

		// Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
		dragdrop: true,

		// Views to activate
		views: {
			list: true,
			thumbs: true, // Show thumbs
			active: 'thumbs'
		},

		// Flash settings
		flash_swf_url : '../../js/Moxie.swf',

		// Silverlight settings
		silverlight_xap_url : '../../js/Moxie.xap',
		
        init: {
            PostInit: function() {
                /*document.getElementById('uploader').onclick = function() {
                    uploader.start();
                    return false;
                };*/
            },
            BeforeUpload: function (up, file) {
                // send relativePath along
                if(map[file.name] !== undefined) {
                    up.setOption('multipart_params', {
                        relativePath: map[file.name].shift()
                    });
                }
            },
            
            UploadComplete : function (up, files) {
                window.top.na.blog.mediaUploadComplete (up, files);
            }
        }		
	});
var map = {};
	
// all relative paths are built here
traverseFileTree = function (item, path) {
var dirReader = null;
    path = path || '';
    if (item.isFile) {
        item.file(function(file) {
            // careful here, could be several files of the same name
            // we assume files will be in the same order here than in plupload
            if(map[file.name] === undefined) {
                map[file.name] = [];
            }
            map[file.name].push(path);
        });
    } else if (item.isDirectory) {
        dirReader = item.createReader();
        dirReader.readEntries(function (entries) {
            var n = 0;
            for (n = 0; n < entries.length; n++) {
                traverseFileTree(entries[n], path + item.name + "/");
            }
        });
    }
};

// bind another handler to the drop event to build an object representing the folder structure
document.getElementById('uploader').addEventListener('drop', function(e) {
    var items = e.dataTransfer.items, n, item;
    for(n = 0; n < items.length; n++) {
        item = items[n].webkitGetAsEntry();
        if(item) {
            traverseFileTree(item);
        }
    }
}, false);	

	// Handle the case when form was submitted before uploading has finished
	$('#form').submit(function(e) {
		// Files in queue upload them first
		if ($('#uploader').plupload('getFiles').length > 0) {

			// When all files are uploaded submit form
			$('#uploader').on('complete', function() {
				$('#form')[0].submit();
			});

			$('#uploader').plupload('start');
		} else {
			alert("You must have at least one file in the queue.");
		}
		return false; // Keep the form from submitting
	});
});
</script>
</body>
</html>
