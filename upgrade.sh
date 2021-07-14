#!/bin/bash

# prevent alarms in .../nicerapp/selfHealer/index.php going off
sudo killall php

rm lastModified.*
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenHumanReadable.txt
date +%Y-%m\(%B\)-%d\(%A\)\ %H:%M:%S\ Amsterdam.NL\ timezone > lastModified.whenJS.txt


git fetch --all
git reset --hard origin/main

for f in $(ls /home/rene/data1/htdocs/localhost_v2/updateSite_*.sh)
do
    echo "NOW UPDATING $f"
    $f
    echo "DONE UPDATING $f"
done

# start the apps (selfHealer only for now)
./restart.sh
