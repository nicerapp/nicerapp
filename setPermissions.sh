#!/bin/bash
source ./do_upgrade_globals_manufacturer.sh
ROOT_PATH="/home/$NA_MAIN_USER/$NA_MAIN_HTDOCS_RELATIVE_PATH/$NA_MAIN_SITE_FOLDER"
if [ ! -d $ROOT_PATH ]; then
	ROOT_PATH="/var/www/nicerapp"
fi

if [ ! -d $ROOT_PATH/nicerapp/siteData ]; then 
	mkdir $ROOT_PATH/nicerapp/siteData
fi
chmod 750 $ROOT_PATH/nicerapp/siteData
chown rene:www-data $ROOT_PATH/nicerapp/siteData

if [ ! -d $ROOT_PATH/nicerapp/siteData/nicerapp ]; then 
	mkdir $ROOT_PATH/nicerapp/siteData/nicerapp
fi
chmod 750 $ROOT_PATH/nicerapp/siteData/nicerapp
chown rene:www-data $ROOT_PATH/nicerapp/siteData/nicerapp
if [ ! -d $ROOT_PATH/nicerapp/apps/nicer.app/news/newsItems ]; then 
	mkdir $ROOT_PATH/nicerapp/apps/nicer.app/news/newsItems 
fi
if [ ! -d $ROOT_PATH/nicerapp/apps/nicer.app/webmail-1.0.0/temp ]; then 
	mkdir $ROOT_PATH/nicerapp/apps/nicer.app/webmail-1.0.0/temp 
fi

touch $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.dark.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.light.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.js 
chmod -R 770 $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.dark.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.light.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.js
touch $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.dark.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.light.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.js
chmod -R 770 $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.dark.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.cssTheme.light.css $ROOT_PATH/nicerapp/domainConfigs/nicer.app/index.combined.js 
chmod -R 770 $ROOT_PATH/nicerapp/siteMedia/backgrounds/iframe/youtube $ROOT_PATH/nicerapp/siteMedia/backgrounds.offline $ROOT_PATH/nicerapp/siteMedia.thumbs $ROOT_PATH/nicerapp/siteCache $ROOT_PATH/nicerapp/siteData

touch $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.css $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.cssTheme.dark.css $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.cssTheme.light.css $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.js
chmod -R 770 $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.css $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.cssTheme.dark.css $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.cssTheme.light.css $ROOT_PATH/nicerapp/domainConfigs/said.by/index.combined.js 
chmod -R 770 $ROOT_PATH/nicerapp/apps/nicer.app/news/newsItems $ROOT_PATH/nicerapp/apps/nicer.app/webmail-1.0.0/temp
