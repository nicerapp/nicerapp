#!/bin/sh 
if [ ! -f "../RAM_disk/exists_true" ]; then
sudo mkdir ../RAM_disk
sudo mount -t tmpfs -o rw,size=10M tmpfs ../RAM_disk
touch ../RAM_disk/exists_true
else
rm -rf ../RAM_disk/*
fi

sudo chown -R rene:www-data ../RAM_disk
sudo chmod -R 777 ../RAM_disk

./setPermissions.sh
#sudo nice -n -19 php nicerapp/selfHealer/run.php &

sudo rm nicerapp/apps/nicer.app/news/crontabEntry_manageDatabase.lock.txt
nice -n 19 php nicerapp/apps/nicer.app/news/crontabEntry_manageDatabase.php & 
