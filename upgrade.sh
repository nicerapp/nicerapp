#!/bin/bash

rm lastModified.*
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenHumanReadable.txt
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenJS.txt

rm geoLite2.log.txt

#sudo chown -R rene:www-data nicerapp/siteData nicerapp/siteCache nicerapp/logs nicerapp/apps/nicerapp/news/appContent/newsApp/2.0.0/newsItems

git fetch --all
git reset --hard origin/master

cd php-couchdb
git fetch --all
git reset --hard origin/main

cd ..

sudo rm nicerapp/siteCache/sa-vcc-*.*
sudo rm nicerapp/siteCache/vividThemes.json

#sudo killall php
#sudo killall php
#sudo rm nicerapp/apps/nicerapp/news/appContent/newsApp/1.0.0/loop_getFreshContent_lock.txt
#sudo rm nicerapp/apps/nicerapp/news/appContent/newsApp/2.0.0/crontabEntry_manageDatabase.lock.txt

#sudo chown -R www-data:www-data nicerapp/siteData nicerapp/siteCache nicerapp/logs nicerapp/apps/nicerapp/news/appContent/newsApp/2.0.0/newsItems

