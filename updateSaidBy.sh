#!/bin/sh
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteData
chmod -R 770 /home/rene/data1/htdocs/said.by/nicerapp/siteData

cp -rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/apps/nicerapp/cms/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cms/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cms/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cms/*

cp -rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/apps/nicerapp/cmsText/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cmsText/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cmsText/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cmsText/*

cp -rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/apps/nicerapp/cmsViewMedia/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cmsViewMedia/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cmsViewMedia/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/cmsViewMedia/*

cp -rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/apps/nicerapp/diskText/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/diskText/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/diskText/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/diskText/*

cp -rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/apps/nicerapp/analytics/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/analytics/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/analytics/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicerapp/analytics/*

cp -Rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/domainConfigs/* /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/*
rm /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.*
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.js
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.cssTheme.dark.css
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.cssTheme.light.css
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.css
chmod 777 /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.*

cp -Rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/userInterface/* /home/rene/data1/htdocs/said.by/nicerapp/userInterface/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/userInterface/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/userInterface/*

cp -Rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/siteMedia/*.png /home/rene/data1/htdocs/said.by/nicerapp/siteMedia
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.png
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.png

cp /home/rene/data1/htdocs/nicerapp_v2/nicerapp/siteMedia/*.jpg /home/rene/data1/htdocs/said.by/nicerapp/siteMedia
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.jpg
chmod 755 /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.jpg

cp /home/rene/data1/htdocs/nicerapp_v2/nicerapp/siteMedia/*.gif /home/rene/data1/htdocs/said.by/nicerapp/siteMedia
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.gif
chmod 755 /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.gif

cp /home/rene/data1/htdocs/nicerapp_v2/nicerapp/jsEngineeringMath/* /home/rene/data1/htdocs/said.by/nicerapp/jsEngineeringMath/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/jsEngineeringMath/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/jsEngineeringMath/*

cp -Rf /home/rene/data1/htdocs/nicerapp_v2/nicerapp/selfHealer/* /home/rene/data1/htdocs/said.by/nicerapp/selfHealer/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/selfHealer/*
chmod -R 755 /home/rene/data1/htdocs/said.by/nicerapp/selfHealer/*

cp /home/rene/data1/htdocs/nicerapp_v2/nicerapp/*.php /home/rene/data1/htdocs/said.by/nicerapp
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/*.php
chmod 755 /home/rene/data1/htdocs/said.by/nicerapp/*.php

cp /home/rene/data1/htdocs/nicerapp_v2/nicerapp/*.js /home/rene/data1/htdocs/said.by/nicerapp
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/*.js
chmod 755 /home/rene/data1/htdocs/said.by/nicerapp/*.js

cp /home/rene/data1/htdocs/nicerapp_v2/nicerapp/*.css /home/rene/data1/htdocs/said.by/nicerapp
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/*.css
chmod 755 /home/rene/data1/htdocs/said.by/nicerapp/*.css

cp /home/rene/data1/htdocs/nicerapp_v2/*.php /home/rene/data1/htdocs/said.by
chown rene:www-data /home/rene/data1/htdocs/said.by/*.php
chmod 755 /home/rene/data1/htdocs/said.by/*.php

cd /home/rene/data1/htdocs/said.by/nicerapp/3rd-party/sag
git pull

cd /home/rene/data1/htdocs/nicerapp_v2
