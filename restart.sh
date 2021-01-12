#!/bin/sh 
sudo mount -t tmpfs -o size=5M tmpfs nicerapp/selfHealer/1.0.0/appData/RAM
sudo chown -R rene:www-data nicerapp/selfHealer/1.0.0/appData/RAM
sudo chmod -R 777 nicerapp/selfHealer/1.0.0/appData/RAM
