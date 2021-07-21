#!/bin/sh
cp -rf /home/rene/data1/htdocs/nicer.app/nicerapp/apps/nicer.app/cms/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cms/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cms/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cms/*

cp -rf /home/rene/data1/htdocs/nicer.app/nicerapp/apps/nicer.app/cmsText/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cmsText/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cmsText/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cmsText/*

cp -rf /home/rene/data1/htdocs/nicer.app/nicerapp/apps/nicer.app/cmsViewMedia/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cmsViewMedia/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cmsViewMedia/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/cmsViewMedia/*

cp -rf /home/rene/data1/htdocs/nicer.app/nicerapp/apps/nicer.app/diskText/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/diskText/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/diskText/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/diskText/*

cp -rf /home/rene/data1/htdocs/nicer.app/nicerapp/apps/nicer.app/analytics/* /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/analytics/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/analytics/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/apps/nicer.app/analytics/*

cp -Rf /home/rene/data1/htdocs/nicer.app/nicerapp/domainConfigs/* /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/*
rm /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.*
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.js
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.cssTheme.dark.css
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.cssTheme.light.css
touch /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.css
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.*
chmod 770 /home/rene/data1/htdocs/said.by/nicerapp/domainConfigs/said.by/index.combined.*

cp -Rf /home/rene/data1/htdocs/nicer.app/nicerapp/3rd-party/plupload-2.3.6/examples/upload.php /home/rene/data1/htdocs/said.by/nicerapp/3rd-party/plupload-2.3.6/examples
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/3rd-party/plupload-2.3.6/examples/upload.php
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/3rd-party/plupload-2.3.6/examples/upload.php


cp -Rf /home/rene/data1/htdocs/nicer.app/nicerapp/userInterface/* /home/rene/data1/htdocs/said.by/nicerapp/userInterface/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/userInterface/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/userInterface/*

cp -Rf /home/rene/data1/htdocs/nicer.app/nicerapp/siteMedia/*.png /home/rene/data1/htdocs/said.by/nicerapp/siteMedia
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.png
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.png

cp /home/rene/data1/htdocs/nicer.app/nicerapp/siteMedia/*.jpg /home/rene/data1/htdocs/said.by/nicerapp/siteMedia
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.jpg
chmod 740 /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.jpg

cp /home/rene/data1/htdocs/nicer.app/nicerapp/siteMedia/*.gif /home/rene/data1/htdocs/said.by/nicerapp/siteMedia
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.gif
chmod 740 /home/rene/data1/htdocs/said.by/nicerapp/siteMedia/*.gif

cp /home/rene/data1/htdocs/nicer.app/nicerapp/jsEngineeringMath/* /home/rene/data1/htdocs/said.by/nicerapp/jsEngineeringMath/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/jsEngineeringMath/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/jsEngineeringMath/*

cp -Rf /home/rene/data1/htdocs/nicer.app/nicerapp/selfHealer/* /home/rene/data1/htdocs/said.by/nicerapp/selfHealer/
chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/selfHealer/*
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/selfHealer/*

cp /home/rene/data1/htdocs/nicer.app/nicerapp/*.php /home/rene/data1/htdocs/said.by/nicerapp
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/*.php
chmod 740 /home/rene/data1/htdocs/said.by/nicerapp/*.php

cp /home/rene/data1/htdocs/nicer.app/nicerapp/*.js /home/rene/data1/htdocs/said.by/nicerapp
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/*.js
chmod 740 /home/rene/data1/htdocs/said.by/nicerapp/*.js

cp /home/rene/data1/htdocs/nicer.app/nicerapp/*.css /home/rene/data1/htdocs/said.by/nicerapp
chown rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/*.css
chmod 740 /home/rene/data1/htdocs/said.by/nicerapp/*.css

cp /home/rene/data1/htdocs/nicer.app/*.php /home/rene/data1/htdocs/said.by
chown rene:www-data /home/rene/data1/htdocs/said.by/*.php
chmod 740 /home/rene/data1/htdocs/said.by/*.php

cd /home/rene/data1/htdocs/said.by/nicerapp/3rd-party/sag
git pull

cp -R /home/rene/data1/htdocs/nicer.app/nicerapp/3rd-party/plupload*.* /home/rene/data1/htdocs/said.by/nicerapp/3rd-party

chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/3rd-party
chmod -R 740 /home/rene/data1/htdocs/said.by/nicerapp/3rd-party

chown -R rene:www-data /home/rene/data1/htdocs/said.by/nicerapp/siteData
chmod -R 770 /home/rene/data1/htdocs/said.by/nicerapp/siteData

cd /home/rene/data1/htdocs/nicer.app
