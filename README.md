# NicerApp
this is a revolutionary and constantly evolving, well-maintained repository of HTML, CSS, JS and PHP code with which you can build websites that use a tiled image, photo or youtube video as site background for information and apps that are put over that background in a semi-transparent way.

# Installation - overview
Nicerapp can be run on windows, linux and macOS systems, possibly even on smartphones,
and all it requires is a webserver that can serve up PHP scripts,
and the **couchdb database server[0]** which works with **JSON data**.

However, it can be augmented with a **SQL server** like mysql or postgresql[1] **which puts data in tables, rows and columns**.

[0] see https://docs.couchdb.org/en/stable/install/index.html

[1] see https://adodb.org

The default database for nicerapp is couchdb. I find it more flexible and a lot easier to use than SQL data.

One guiding principle of developing web-apps with nicerapp is that we shield our database servers from the outside world as much as possible.
This means all requests for data by the browsers go via the **browser's jQuery.com** (.../nicerapp_v2/nicerapp/3rd-party/jQuery) **AJAX** (asynchronous javascript and XML) code **to PHP scripts** that are all specific to the requested functionality, **and from there to the actual database server** and back to PHP and finally to the **browser**, which in non-debug mode **gets back only FAILED or SUCCESS (or the requested data)**.
All error handling, database sanity, and cleanliness code is in the PHP scripts and the PHP libraries used to access the database.

The couchdb server software and it's instructions can be found on https://couchdb.apache.org

# Installation 

On windows, the https://wampserver.com/en WAMP stack (windows, apache, mysql, php) is well-suited, 
and it can also be done on **linux systems[2]** from the **terminal** OS-level app, as such :

[2] if you have no linux system yet, know that a core-i5 with a modest amount of RAM and SSD space runs the latest version just fine, and i recommend to install https://ubuntu.com or kubuntu in case you want semi-transparent windows in your OS



> sudo su -
> 
> apt update
> 
> apt upgrade
> 
> apt dist-upgrade
> 
> apt install apache2 php libapache2-mod-php php7.4-mbstring php-imap curl git imagemagick npm
> 
> a2enmod headers rewrite

> sudo apt update && sudo apt install -y curl apt-transport-https gnupg
> 
> curl https://couchdb.apache.org/repo/keys.asc | gpg --dearmor | sudo tee /usr/share/keyrings/couchdb-archive-keyring.gpg >/dev/null 2>&1
source /etc/os-release
>
> echo "deb [signed-by=/usr/share/keyrings/couchdb-archive-keyring.gpg] https://apache.jfrog.io/artifactory/couchdb-deb/ ${VERSION_CODENAME} main" | sudo tee /etc/apt/sources.list.d/couchdb.list >/dev/null
>    
> apt update 
> 
> apt install couchdb
> 
> npm install -g add-cors-to-couchdb
> 
> add-cors-to-couchdb -u admin -p YOURADMINPASSWORDFORCOUCHDB

# installing the nicerapp source files
make a folder equivalent to /home/rene/data1/htdocs/nicerapp_v2 
    meaning : use your own ubuntu username and possibly the name of your 
    domain (internet site) instead of localhost. 
    localhost is usually used for development setups, 
    and should ideally be run on a different machine than 
    your live server that hosts your domain.


put the nicerapp source files in that folder :

> cd /home/rene/data1/htdocs
>
> git clone https://github.com/nicerapp/nicerapp_v2
> 
> cd /home/rene/data1/htdocs/nicerapp_v2/nicerapp/3rd-party/jQuery
> 
> git clone https://github.com/bgrins/spectrum
> 
> cd ..
> 
> git clone https://github.com/zingchart/zingtouch
> 
> cd /home/rene/data1/htdocs/nicerapp_v2


copy the following into /etc/apache2/sites-available/001.localhost.conf 
(everything between the /---- lines)
(be sure to modify ServerAdmin and DocumentRoot in both places (mid-way through the text and at the bottom in <Directory>))
(this particular server is running on the unencrypted port 80, port 443 is the encrypted SSL port but it requires more configuration effort, see the manuals for **letsencrypt** and **certbot** and the example further down on this page you're reading now)

````
/----
<VirtualHost:80>
	# The ServerName directive sets the request scheme, hostname and port that
	# the server uses to identify itself. This is used when creating
	# redirection URLs. In the context of virtual hosts, the ServerName
	# specifies what hostname must appear in the request's Host: header to
	# match this virtual host. For the default virtual host (this file) this
	# value is not decisive as it is used as a last resort host regardless.
	# However, you must set it for any further virtual host explicitly.
	ServerName localhost

	ServerAdmin rene.veerman.netherlands@gmail.com
	DocumentRoot /home/rene/data1/htdocs/localhost

	# Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
	# error, crit, alert, emerg.
	# It is also possible to configure the loglevel for particular
	# modules, e.g.
	#LogLevel info ssl:warn

	ErrorLog ${APACHE_LOG_DIR}/error.localhost.log
	CustomLog ${APACHE_LOG_DIR}/access.localhost.log combined

	# For most configuration files from conf-available/, which are
	# enabled or disabled at a global level, it is possible to
	# include a line for only one particular virtual host. For example the
	# following line enables the CGI configuration for this host only
	# after it has been globally disabled with "a2disconf".
	#Include conf-available/serve-cgi-bin.conf
	<Directory /home/rene/data1/htdocs/localhost>
		AllowOverride All
		Require all granted
	</Directory>
</VirtualHost>
/----
````

after that, you can enable the site with :

>sudo a2ensite 001-localhost.conf
>sudo service apache2 restart

and launch your web-browser to http://localhost

# Adding background image files
The backgrounds are stored under 
.../nicerapp/siteMedia/backgrounds/landscape, 
.../nicerapp/siteMedia/backgrounds/tiled, 
and .../nicerapp/siteMedia/backgrounds/iframe/youtube (as *.txt files containing only one youtube video URL each)

These backgrounds are not included with the distribution of nicerapp, otherwise i'd run out of storage space on github.

# serving the site from an encrypted setup using HTTPS:// (SSL)
	
> sudo apt install nginx letsencrypt certbot
	
https://nginx.com is a gateway server, which you can put in front of your webserver software and database servers.
We need it to serve database connections over SSL connections, and to be able to serve multiple domain names (nicer.app, zoned.at, said.by, etc) from just one outgoing aka public IP address.

Next : put the following code snippet as a template in **/etc/nginx/sites-available/00-default-ssl.conf**
After that : 
> ln -s /etc/nginx/sites-available/na-default-ssl.conf /etc/nginx/sites-enabled/na-default-ssl.conf
	
````
#
# Note: This file must be loaded before other virtual host config files,
#
# HTTPS
#server {
    #listen 80;
    #server_name zoned.at, www.zoned.at;
    #return 301 https://zoned.at$request_uri;
#}
#done in .htaccess (see nicer.app's .../nicerapp_v2/.htaccess)

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name nicer.app;
  root /home/rene/data1/htdocs/nicerapp_v2;
    
  add_header Content-Security-Policy "worker-src https: data: 'unsafe-inline' 'unsafe-eval' blob:;";

  ssl_certificate /etc/letsencrypt/live/nicer.app/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/nicer.app/privkey.pem;

  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
  ssl_ciphers 'kEECDH+ECDSA+AES128 kEECDH+ECDSA+AES256 kEECDH+AES128 kEECDH+AES256 kEDH+AES128 kEDH+AES256 DES-CBC3-SHA +SHA !aNULL !eNULL !LOW !kECDH !DSS !MD5 !RC4 !EXP !PSK !SRP !CAMELLIA !SEED';
  ssl_prefer_server_ciphers on;
  ssl_dhparam /etc/nginx/dhparam.pem;

  add_header 'Access-Control-Allow-Origin' 'https://fiddle.jshell.net' always;
  add_header 'Access-Control-Allow-Credentials' 'true' always;
  add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
  add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
  # required to be able to read Authorization header in frontend
  #add_header 'Access-Control-Expose-Headers' 'Authorization' always;

  location / {
    # forward traffic to your server's LAN (Local Area Network) apache2 port 447:
    proxy_pass https://192.168.178.21:447/;
	
    proxy_redirect off;
    proxy_buffering off;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Ssl on;

    proxy_connect_timeout 159s;
    proxy_send_timeout   60;
    proxy_read_timeout   60;
    send_timeout 60;
    resolver_timeout 60;
  }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name said.by;
    root /home/rene/data1/htdocs/said.by;


  add_header Content-Security-Policy "worker-src https: data: 'unsafe-inline' 'unsafe-eval' blob:;";
  large_client_header_buffers 4 32k;

  ssl_certificate /etc/letsencrypt/live/said.by/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/said.by/privkey.pem;

  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
  ssl_ciphers 'kEECDH+ECDSA+AES128 kEECDH+ECDSA+AES256 kEECDH+AES128 kEECDH+AES256 kEDH+AES128 kEDH+AES256 DES-CBC3-SHA +SHA !aNULL !eNULL !LOW !kECDH !DSS !MD5 !RC4 !EXP !PSK !SRP !CAMELLIA !SEED';
  ssl_prefer_server_ciphers on;
  ssl_dhparam /etc/nginx/dhparam.pem;

  location / {
    # forward traffic to your server's LAN (Local Area Network) apache2 port 444:
    proxy_pass https://192.168.178.21:444/;
	
    proxy_redirect off;
    proxy_buffering off;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Ssl on;

    proxy_connect_timeout 159s;
    proxy_send_timeout   60;
    proxy_read_timeout   60;
    send_timeout 60;
    resolver_timeout 60;
   }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name zoned.at;
    root /home/rene/data1/htdocs/zoned.at;
    
    large_client_header_buffers 4 32k;

    ssl_certificate /etc/letsencrypt/live/zoned.at/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zoned.at/privkey.pem;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
    ssl_ciphers 'kEECDH+ECDSA+AES128 kEECDH+ECDSA+AES256 kEECDH+AES128 kEECDH+AES256 kEDH+AES128 kEDH+AES256 DES-CBC3-SHA +SHA !aNULL !eNULL !LOW !kECDH !DSS !MD5 !RC4 !EXP !PSK !SRP !CAMELLIA !SEED';
    ssl_prefer_server_ciphers on;
    ssl_dhparam /etc/nginx/dhparam.pem;

    location / {
      # forward traffic to your server's LAN (Local Area Network) apache2 port 448 :	
      proxy_pass https://192.168.178.21:448/;
      proxy_redirect off;
      proxy_buffering off;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Ssl on;
      proxy_connect_timeout 159s;
      proxy_send_timeout   60;
      proxy_read_timeout   60;
      send_timeout 60;
      resolver_timeout 60;
    }
}
````

# To put an SSL encryption layer on the database server, do this :

put the following in **/etc/nginx/sites-available/couchdb.conf**
after that do this :
> sudo ln -s /etc/nginx/sites-available/couchdb.conf /etc/nginx/sites-enabled/couchdb.conf
	
````
server {
  listen 7205;
  server_name nicer.app;
    ssl_certificate /etc/letsencrypt/live/nicer.app/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/nicer.app/privkey.pem; # managed by Certbot

  ssl on;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
  ssl_ciphers 'kEECDH+ECDSA+AES128 kEECDH+ECDSA+AES256 kEECDH+AES128 kEECDH+AES256 kEDH+AES128 kEDH+AES256 DES-CBC3-SHA +SHA !aNULL !eNULL !LOW !kECDH !DSS !MD5 !RC4 !EXP !PSK !SRP !CAMELLIA !SEED';
  ssl_prefer_server_ciphers on;
  ssl_dhparam /etc/nginx/dhparam.pem;

  location / {
    # forward traffic to your server's LAN (Local Area Network) couchdb port 5984 (the default, unencrypted port) :
    proxy_pass http://localhost:5984;
    proxy_redirect off;
    proxy_buffering off;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Ssl on;
  }
}
````

**don't forget : you need to tell apache to run on the right ports, 
which are 444, 447 and 448 in this example case, 
and those ports should NOT be forwarded from your modem / ADSL router / fiber internet connection device to your LAN. 
port 80 should be disabled in **all** /etc/apache2/sites-available/*.* entries**
	
i'll provide an example apache2 config file for https://zoned.at (a URL shortener service that i run)
the following is in /etc/apache2/sites-available/001-zoned.at.conf
````
<VirtualHost *:448>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        #ServerName www.example.com
        ServerName zoned.at

        ServerAdmin rv.nicer.app@gmail.com
        DocumentRoot /home/rene/data1/htdocs/zoned.at

        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn
        #LogLevel info ssl:warn
        LogLevel info ssl:warn

        #ErrorLog ${APACHE_LOG_DIR}/error.448.log
        #CustomLog ${APACHE_LOG_DIR}/access.448.log combined
	SetEnvIf X-Forwarded-For "^.*\..*\..*\..*" forwarded
	LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
	LogFormat "%{X-Forwarded-For}i %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" forwarded
	ErrorLog ${APACHE_LOG_DIR}/error.448.log
	CustomLog ${APACHE_LOG_DIR}/access.448.log combined env=!forwarded
	CustomLog ${APACHE_LOG_DIR}/access.448.log forwarded env=forwarded

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        <Directory /home/rene/data1/htdocs/zoned.at>
                Options -Indexes +FollowSymLinks
                AllowOverride All
                Require all granted
        </Directory>

        SSLEngine on
        SSLProtocol all -SSLv2 -SSLv3
        SSLHonorCipherOrder on
        SSLCipherSuite "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS +RC4 RC4"

        SSLCertificateFile /etc/letsencrypt/live/zoned.at/cert.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/zoned.at/privkey.pem
        SSLCertificateChainFile /etc/letsencrypt/live/zoned.at/fullchain.pem
</VirtualHost>
````

**Finally**, you need to create the actual encryption keys. 
This is free and fairly simple.
You can choose between **certbot** or **letsencrypt**.
You can find tutorials on how to use them via google searches for either 'certbox example' or 'letsencrypt example'.

	
# Modifying the HTML for a nicerapp site
This is done by modifying .../nicerapp/domainConfigs/YOUR_DOMAIN_NAME/index.template.php
and .../nicerapp/domainConfigs/YOUR_DOMAIN_NAME/desktop.source.js

# Adding new URLs and apps into a nicerapp site
All apps and pages on a nicerapp site are loaded through a URL that looks somewhat like this :
http://localhost/apps/eyJtdXNpYyI6eyJzZXQiOiJpbmRleCJ9fQ

You will notice the "strange" sequence after /apps/ in that URL.
It's strange because it's base64-encoded JSON, allowing for multiple settings to be passed into the nicerapp PHP code, while avoiding the "old" practice of using http://localhost/apps/someApp.php?setting1=x&setting2=y

If you want to simplify things for use in Search Engine Optimization (SEO), you can have http://localhost/abc automatically translated into http://localhost/apps/eyJtdXNpYyI6eyJzZXQiOiJpbmRleCJ9fQ in **.../.htaccess** - there are already some examples supplied.

You would store any new apps that you might create under .../nicerapp/apps/YOURNAME/APPNAME/app.dialog.siteContent.php or .../nicerapp/apps/YOURNAME/APPNAME/app.dialog.siteToolbarLeft.php or any other main DIV name with class="vividDialog" as found in .../nicerapp/domainConfigs/YOUR_DOMAIN_NAME/index.template.php

And .../ajax_get_content.php is responsible for mapping your http://localhost/apps/eyJtdXNpYyI6eyJzZXQiOiJpbmRleCJ9fQ to the right code.

One would ask, rightfully so, how to create these /apps/* URLs.
in PHP, that's done with the always available .../nicerapp/functions.php::**base64_encode_url()** and .../nicerapp/functions.php::**base64_decode_url()**
in JavaScript, it's done with the always available **na.m.base64_encode_url()** and **na.m.base64_decode_url()**

# Questions, bug-reports, feature-requests?

you can post these to rv.nicer.app@gmail.com, and i will try to respond within 72 hours, even on weekends.

if you need a quick solution towards getting yourself a collection of background images, you can look for 'wallpaper' on https://rarbg.to and use a torrent client (like transmission on ubuntu, or utorrent on windows) to download them.

i will consider making the 15GB of photos and tiled images that is currently served on https://nicer.app available on https://rarbg.to
