#!/bin/bash
if [ ! -d nicerapp/siteData ]; then 
	mkdir nicerapp/siteData
fi
chmod 750 nicerapp/siteData
chown rene:www-data nicerapp/siteData

if [ ! -d nicerapp/siteData/nicerapp ]; then 
	mkdir nicerapp/siteData/nicerapp
fi
chmod 750 nicerapp/siteData/nicerapp
chown rene:www-data nicerapp/siteData/nicerapp
if [ ! -d nicerapp/apps/nicerapp/news/newsItems ]; then 
	mkdir nicerapp/apps/nicerapp/news/newsItems 
fi
if [ ! -d nicerapp/apps/nicerapp/webmail-1.0.0/temp ]; then 
	mkdir nicerapp/apps/nicerapp/webmail-1.0.0/temp 
fi

touch nicerapp/domainConfigs/nicerapp/index.combined.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.dark.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.light.css nicerapp/domainConfigs/nicerapp/index.combined.js 
chmod -R 770 nicerapp/domainConfigs/nicerapp/index.combined.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.dark.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.light.css nicerapp/domainConfigs/nicerapp/index.combined.js
touch nicerapp/domainConfigs/nicerapp/index.combined.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.dark.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.light.css nicerapp/domainConfigs/nicerapp/index.combined.js
chmod -R 770 nicerapp/domainConfigs/nicerapp/index.combined.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.dark.css nicerapp/domainConfigs/nicerapp/index.combined.cssTheme.light.css nicerapp/domainConfigs/nicerapp/index.combined.js 
chmod -R 770 nicerapp/apps/nicerapp/news/newsItems nicerapp/siteMedia/backgrounds/iframe/youtube nicerapp/siteMedia/backgrounds.offline nicerapp/siteMedia.thumbs nicerapp/siteCache nicerapp/siteData

touch nicerapp/domainConfigs/said.by/index.combined.css nicerapp/domainConfigs/said.by/index.combined.cssTheme.dark.css nicerapp/domainConfigs/said.by/index.combined.cssTheme.light.css nicerapp/domainConfigs/said.by/index.combined.js
chmod -R 770 nicerapp/domainConfigs/said.by/index.combined.css nicerapp/domainConfigs/said.by/index.combined.cssTheme.dark.css nicerapp/domainConfigs/said.by/index.combined.cssTheme.light.css nicerapp/domainConfigs/said.by/index.combined.js 
chmod -R 770 nicerapp/apps/nicerapp/news/newsItems nicerapp/apps/nicerapp/webmail-1.0.0/temp



#chown -R root:root nicerapp/selfHealer
#chmod -R 640 nicerapp/selfHealer
