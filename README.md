# NicerApp
this is a revolutionary and constantly evolving, well-maintained repository of HTML, CSS, JS and PHP code with which you can build websites that use a tiled image, photo or youtube video as site background for information and apps that are put over that background in a semi-transparent way.

# Installation
nicerapp can be run on both windows and linux and macOS systems, all it requires is a webserver that can serve up PHP scripts. 
on windows, the https://wampserver.com/en LAMP stack is well-suited, 
and it can also be done on linux systems from the **terminal** window, as such :
( if you have no linux system yet, know that a core-i5 with a modest amount of RAM and SSD space runs the latest version just fine, and i recommend to install https://ubuntu.com or kubuntu in case you want semi-transparent windows in your OS )

> apt update
> 
> apt upgrade
> 
> apt dist-upgrade
> 
> apt install apache2 php libapache2-mod-php php7.4-mbstring php-imap curl git imagemagick npm letsencrypt
> 
> a2enmod headers rewrite

> curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc | sudo apt-key add -
> 
> echo "deb https://apache.bintray.com/couchdb-deb bionic main" | sudo tee -a /etc/apt/sources.list

> apt update 
> 
> apt install couchdb
> 
> npm install -g add-cors-to-couchdb
> 
> add-cors-to-couchdb -u admin -p YOURADMINPASSWORDFORCOUCHDB

# installing the nicerapp source files
make a folder equivalent to /home/rene/data1/htdocs/localhost 
    meaning : use your own ubuntu username and possibly the name of your 
    domain (internet site) instead of localhost. 
    localhost is usually used for development setups, 
    and should ideally be run on a different machine than 
    your live server that hosts your domain.


put the nicerapp source files in that folder.


copy the following into /etc/apache2/sites-available/001.localhost.conf 
(everything between the /---- lines)
(be sure to modify ServerAdmin and DocumentRoot in both places (mid-way through the text and at the bottom in <Directory>))
(this particular server is running on the un-encrypted port 80, port 443 is the encrypted SSL port but it requires more configuration effort, see the manuals for **letsencrypt** and **certbot**)

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

# Modifying the HTML for a nicerapp site
This is done by modifying .../nicerapp/domainConfigs/YOUR_DOMAIN_NAME/index.template.php
and .../nicerapp/domainConfigs/YOUR_DOMAIN_NAME/desktop.source.js

# Adding new URLs and apps into a nicerapp site
all apps and pages on a nicerapp site are loaded through a URL that looks somewhat like this :
http://localhost/apps/eyJtdXNpYyI6eyJzZXQiOiJpbmRleCJ9fQ

you will notice the "strange" sequence after /apps/ in that URL.
it's strange because it's base64-encoded JSON, allowing for multiple settings to be passed into the nicerapp PHP code, while avoiding the "old" practice of using http://localhost/apps/someApp.php?setting1=x&setting2=y

if you want to simplify things for use in Search Engine Optimization (SEO), you can have http://localhost/abc automatically translated into http://localhost/apps/eyJtdXNpYyI6eyJzZXQiOiJpbmRleCJ9fQ in **.../.htaccess** - there are already some examples supplied.

you would store any new apps that you might create under .../nicerapp/apps/YOURNAME/APPNAME/app.dialog.siteContent.php or .../nicerapp/apps/YOURNAME/APPNAME/app.dialog.siteToolbarLeft.php or any other main DIV name with class="vividDialog" as found in .../nicerapp/domainConfigs/YOUR_DOMAIN_NAME/index.template.php

and .../ajax_get_content.php is responsible for mapping your http://localhost/apps/eyJtdXNpYyI6eyJzZXQiOiJpbmRleCJ9fQ to the right code.

one would ask, rightfully so, how to create these /apps/* URLs.
in PHP, that's done with the always available .../nicerapp/functions.php::**base64_encode_url()** and .../nicerapp/functions.php::**base64_decode_url()**
in JavaScript, it's done with the always available **na.m.base64_encode_url()** and **na.m.base64_decode_url()**

# Questions, bug-reports, feature-requests?

you can post these to rene.veerman.netherlands@gmail.com, and i will try to respond within 72 hours, even on weekends.

if you need a quick solution towards getting yourself a collection of background images, you can look for 'wallpaper' on https://rarbg.to and use a torrent client (like transmission on ubuntu, or utorrent on windows) to download them.

i will consider making the 15GB of photos and tiled images that is currently served on https://nicer.app available on https://rarbg.to
