#!/bin/bash

# if you're new to the bash programming language, 
# just look up things like :
#   bash variables
#   bash if statements
#   bash for loop
# on google or whatever searchengine you prefer :)

# prevent alarms in .../nicerapp/selfHealer/index.php going off
sudo killall php

source ./upgrade_globals_manufacturer.sh
ROOT_PATH="/home/$NA_MAIN_USER/$NA_MAIN_HTDOCS_RELATIVE_PATH/$NA_MAIN_SITE_FOLDER"
echo $ROOT_PATH

for f in $(ls $ROOT_PATH/do_upgrade_globalsClient_*.sh)
do
    echo "BEGIN INCLUDING $f"
    source $f
    echo "DONE INCLUDING $f"
done

git fetch --all
git reset --hard origin/main

rm lastModified.*
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenHumanReadable.txt
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenJS.txt
chgrp -R $NA_MAIN_GROUP *
chmod -R $NA_MAIN_PERMISSIONS *
./setPermissions.sh

for f in $(ls $ROOT_PATH/do_upgradeSite_*.sh)
do
    echo "NOW UPDATING $f"
    $f
    echo "DONE UPDATING $f"
done

# start the apps (selfHealer only for now)
for f in "$ROOT_PATH/${NA_SITE_APPS[@]}"
do
    echo "NOW STARTING $f"
    $f
    echo "DONE STARTING $f"
done
