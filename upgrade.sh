#!/bin/bash

# prevent alarms in .../nicerapp/selfHealer/index.php going off
sudo killall php

rm lastModified.*
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenHumanReadable.txt
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenJS.txt


git fetch --all
git reset --hard origin/main

#cd nicerapp/3rd-party/php-couchdb
#git fetch --all
#git reset --hard origin/main
#cd ../../..

# start the apps (selfHealer only for now)
./restart.sh
