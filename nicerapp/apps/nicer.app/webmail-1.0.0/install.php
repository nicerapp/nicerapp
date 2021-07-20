<?php
    require_once (dirname(__FILE__).'/functions.php');
?>
<html>
<head>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link type="text/css" rel="StyleSheet" media="screen" href="install.css?changed=<?php echo cm_get_current_datetime_stamp();?>">
    <script src="jquery-3.5.1.js"></script>
    <script src="jquery-ui-1.12.1/jquery-ui.js"></script>
    <script src="pouchdb/pouchdb-7.2.1.js"></script>
    <script type="text/javascript"  src="install.js?changed=<?php echo cm_get_current_datetime_stamp();?>"></script>
</head>
<body onload="cm.install.readConfig('config.json');" onclick="cm.install.losefocus();">
<center>
    <h1 style="opacity:0.001">couchdbMail : POP and IMAP Email and Instant Messaging for PHP, Javascript and the CouchDB platform</h1>

    <div id="logo">
        <table style="width:1000px;" border="0">
        <tr>
            <td>&nbsp;</td>
            <td style="width:500px;"><img src="images/logo/logo-1.4.1.png"/></td> <!-- logo version number is NOT the couchdbMail version number! -->
        </tr>
        </table>
    </div>
    
    <div id="login">
        <table style="width:1000px;" border="0" cellpadding="5">
        <tr>
            <td colspan="2" style="font-weight:bold;">Configuration Login</td>
        </tr>
        <tr>
            <td style="width:200px;">login name</td>
            <td class="login" style="width:800px;">
                <input id="input_login" readonly="readonly" value="admin"  onclick="cm.install.highlightField_doesntNeedChanging('#input_login');" style="width:100%;border-radius:5px;background:#CCC;"/>
            </td>
        </tr>
        <tr>
            <td style="width:200px;"></td>
            <td><div id="explanation__input_login__dontNeedChanging" style="display:none;padding:3px;">This does not need changing!</div></td>
        </tr>
        <tr>
            <td style="width:200px;">password</td>
            <td style="width:800px;"><input type="password" id="input_password" style="width:100%;border-radius:5px;"/></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td><button id="button_login" type="button" onclick="cm.install.login();" style="float:right;margin-right:10px;">Login</button></td>
        </tr>
        </table>
    </div>
    
    <div id="login_change_password">
        <table style="width:1000px;" border="0" cellpadding="5">
        <tr>
            <td colspan="200" style="font-weight:bold;">Configuration Login Change Password</td>
        </tr>
        <tr>
            <td style="width:200px;">login name</td>
            <td class="login" style="width:800px;">
                <input id="input_login_1" readonly="readonly" value="admin"  onclick="cm.install.highlightField_doesntNeedChanging('#input_login_1');" style="width:100%;border-radius:5px;background:#CCC;"/>
            </td>
        </tr>
        <tr>
            <td style="width:200px;"></td>
            <td><div id="explanation__input_login_1__dontNeedChanging" style="display:none;padding:3px;">This does not need changing!</div></td>
        </tr>
        <tr>
            <td style="width:200px;">password</td>
            <td style="width:800px;"><input type="password" id="input_password_1" onchange="cm.install.passwordChangeEntered();" style="width:100%;border-radius:5px;"/></td>
        </tr>
        <tr>
            <td style="width:200px;">confirm password</td>
            <td style="width:800px;"><input type="password" id="input_password_2" onchange="cm.install.passwordChangeEntered();" style="width:100%;border-radius:5px;"/></td>
        </tr>
        <tr>
            <td style="width:200px;"></td>
            <td><div id="explanation__passwordChange__error" style="display:none;padding:3px;"></div></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:right;">
            You are strongly encouraged to use a strong password to access this configuration page in the future.<br/>
            Your password to this configuration page is stored unencrypted in<br/>
            <?php echo dirname(__FILE__).'/config.json';?>
            </td>
        </tr>
        <!--
        <tr>
            <td>&nbsp;</td>
            <td>            
                <button id="button_change_password" type="button" onclick="cm.install.changePassword();" style="float:right;margin-right:10px;">Save</button>
            </td>
        </tr>
        -->
        </table>
    </div>

    <div id="settings">
        <table style="width:1000px;" border="0" cellpadding="5">
        <tr>
            <td colspan="2" style="font-weight:bold">Settings</td>
        </tr>
        <tr>
            <td style="width:200px;">CouchDB server</td>
            <td style="width:800px;"><input id="input_couchdb_server" onchange="cm.install.pouchdb.testServer()" style="width:100%;border-radius:5px;"/></td>
        </tr>
        <tr>
            <td style="width:200px;vertical-align:top;">IMAP/POP server(s)</td>
            <td id="td_mail_servers" style="width:800px;">
                <textarea id="textarea_mail_server__0" class="primary_server mail_server" style="width:100%;height:10em;border-radius:5px;margin-bottom:5px;" onfocus="cm.install.focusServer();" onchange="cm.install.serverAltered()"></textarea>
                <div id="textarea_mail_server__0__msg" style="display:none;padding:3px;"></div>
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>            
                <button id="button_add_mail_server" type="button" onclick="cm.install.addServer();" style="float:right;margin-right:10px;">Add</button>
                <button id="button_delete_mail_server" type="button" onclick="cm.install.deleteServer();" style="float:right;margin-right:10px;">Remove</button>
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>            
                <button id="button_save_config" type="button" onclick="cm.install.writeConfig();" style="float:right;margin-right:10px;">Save</button>
            </td>
        </tr>
        <tr>
            <td id="msg" colspan="2" style="height:1em;border-radius:5px;text-align:right;"></td>
        </tr>
        </table>
    </div>
</center>
</body>
</html>
