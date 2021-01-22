#!/bin/bash
rm lastModified.*
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenHumanReadable.txt
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenJS.txt

git fetch --all
git reset --hard origin/main

#cd nicerapp/3rd-party/php-couchdb
#git fetch --all
#git reset --hard origin/main
#cd ../../..

sudo killall php
./restart.sh
