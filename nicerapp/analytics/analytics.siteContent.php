<script type="text/javascript">
na.m.waitForCondition('na loaded', function () {
    return na.m.settings.initialized.site === true;
}, function () {
	na.vcc.settings['siteContent'].canAutoHeight = false;
	na.vcc.settings['siteContent'].canResize = false;
	na.vcc.settings['siteContent'].containsIframe = false;
    na.analytics.view.prepare(jQuery('#siteContent')[0]);
}, 200);
</script>
