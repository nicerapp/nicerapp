#!/bin/sh 
cd /home/rene/data1/htdocs/nicerapp_v2

if [ ! -d "../RAM_disk" ]; then
sudo mkdir ../RAM_disk
sudo mount -t tmpfs -o rw,size=10M tmpfs ../RAM_disk
else
rm -rf ../RAM_disk/*
fi

sudo chown -R rene:www-data ../RAM_disk
sudo chmod -R 777 ../RAM_disk

sudo nice -n -19 php nicerapp/selfHealer/1.0.0/run.php &
