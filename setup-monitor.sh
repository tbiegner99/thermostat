#! /bin/bash
PWD=`pwd`

sudo rm -f /etc/cron.d/monitor-thermostat
sudo touch /etc/cron.d/monitor-thermostat
sudo echo "*/1 * * * * root $PWD/check-health.sh >> /var/log/monitor-thermostat.log 2>&1" > /etc/cron.d/monitor-thermostat
sudo chmod 600 /etc/cron.d/monitor-thermostat
echo "Chron set up"