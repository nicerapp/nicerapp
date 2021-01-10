<h1 class="tooltip" tooltipTheme="mainTooltipTheme" title="revolutionary web app framework">nicer.app web apps framework</h1>
<?php 
    $a = 'abc';
    echo $a;
?>
<form id="siteSettings" action="/" method="POST">
    <select id="siteTheme" name="siteTheme" form="siteSettings" onchange="this.form.submit()">
        <optgroup>
        <option value="light" <?php echo array_key_exists('siteTheme', $_POST) && $_POST['siteTheme']=='light' ? 'selected' : '';?>>Light</option>
        <option value="dark" <?php echo array_key_exists('siteTheme', $_POST) && $_POST['siteTheme']=='dark' ? 'selected' : '';?>>Dark</option>
        </optgroup>
    </select>
</form>
