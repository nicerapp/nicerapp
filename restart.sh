#!/bin/sh 
cd /home/rene/data1/htdocs/nicerapp_v2

if [ ! -f "../RAM_disk/exists_true" ]; then
sudo mkdir ../RAM_disk
sudo mount -t tmpfs -o rw,size=10M tmpfs ../RAM_disk
touch ../RAM_disk/exists_true
else
rm -rf ../RAM_disk/*
fi

sudo chown -R rene:www-data ../RAM_disk
sudo chmod -R 777 ../RAM_disk

sudo nice -n -19 php nicerapp/selfHealer/run.php &
