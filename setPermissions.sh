#!/bin/bash
if [ ! -d nicer.app/siteData ]; then 
	mkdir nicer.app/siteData
fi
chmod 750 nicer.app/siteData
chown rene:www-data nicer.app/siteData

if [ ! -d nicer.app/siteData/nicerapp ]; then 
	mkdir nicer.app/siteData/nicerapp
fi
chmod 750 nicer.app/siteData/nicerapp
chown rene:www-data nicer.app/siteData/nicerapp
if [ ! -d nicer.app/apps/nicer.app/news/newsItems ]; then 
	mkdir nicer.app/apps/nicer.app/news/newsItems 
fi
if [ ! -d nicer.app/apps/nicer.app/webmail-1.0.0/temp ]; then 
	mkdir nicer.app/apps/nicer.app/webmail-1.0.0/temp 
fi

touch nicer.app/domainConfigs/nicer.app/index.combined.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.dark.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.light.css nicer.app/domainConfigs/nicer.app/index.combined.js 
chmod -R 770 nicer.app/domainConfigs/nicer.app/index.combined.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.dark.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.light.css nicer.app/domainConfigs/nicer.app/index.combined.js
touch nicer.app/domainConfigs/nicer.app/index.combined.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.dark.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.light.css nicer.app/domainConfigs/nicer.app/index.combined.js
chmod -R 770 nicer.app/domainConfigs/nicer.app/index.combined.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.dark.css nicer.app/domainConfigs/nicer.app/index.combined.cssTheme.light.css nicer.app/domainConfigs/nicer.app/index.combined.js 
chmod -R 770 nicer.app/apps/nicer.app/news/newsItems nicer.app/siteMedia/backgrounds/iframe/youtube nicer.app/siteMedia/backgrounds.offline nicer.app/siteMedia.thumbs nicer.app/siteCache nicer.app/siteData

touch nicer.app/domainConfigs/said.by/index.combined.css nicer.app/domainConfigs/said.by/index.combined.cssTheme.dark.css nicer.app/domainConfigs/said.by/index.combined.cssTheme.light.css nicer.app/domainConfigs/said.by/index.combined.js
chmod -R 770 nicer.app/domainConfigs/said.by/index.combined.css nicer.app/domainConfigs/said.by/index.combined.cssTheme.dark.css nicer.app/domainConfigs/said.by/index.combined.cssTheme.light.css nicer.app/domainConfigs/said.by/index.combined.js 
chmod -R 770 nicer.app/apps/nicer.app/news/newsItems nicer.app/apps/nicer.app/webmail-1.0.0/temp



#chown -R root:root nicer.app/selfHealer
#chmod -R 640 nicer.app/selfHealer
