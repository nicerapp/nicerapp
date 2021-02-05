#!/bin/sh
chown -R rene:www-data *
chmod -R 750 *
touch nicerapp/domainConfigs/localhost_v2/index.combined.css nicerapp/domainConfigs/localhost_v2/index.combined.cssTheme.dark.css nicerapp/domainConfigs/localhost_v2/index.combined.cssTheme.light.css nicerapp/domainConfigs/localhost_v2/index.combined.js
chmod -R 777 nicerapp/domainConfigs/localhost_v2/index.combined.css nicerapp/domainConfigs/localhost_v2/index.combined.cssTheme.dark.css nicerapp/domainConfigs/localhost_v2/index.combined.cssTheme.light.css nicerapp/domainConfigs/localhost_v2/index.combined.js
touch nicerapp/domainConfigs/nicerapp_v2/index.combined.css nicerapp/domainConfigs/nicerapp_v2/index.combined.cssTheme.dark.css nicerapp/domainConfigs/nicerapp_v2/index.combined.cssTheme.light.css nicerapp/domainConfigs/nicerapp_v2/index.combined.js
chmod -R 777 nicerapp/domainConfigs/nicerapp_v2/index.combined.css nicerapp/domainConfigs/nicerapp_v2/index.combined.cssTheme.dark.css nicerapp/domainConfigs/nicerapp_v2/index.combined.cssTheme.light.css nicerapp/domainConfigs/nicerapp_v2/index.combined.js
chmod -R 777 nicerapp/siteMedia/backgrounds/iframe/youtube nicerapp/siteMedia/backgrounds.offline
#chown -R root:root nicerapp/selfHealer
#chmod -R 640 nicerapp/selfHealer
