#! /bin/bash
PWD=`pwd`

sudo rm -f /etc/cron.d/monitor-thermostat
sudo touch /etc/cron.d/monitor-thermostat
sudo echo "*/1 * * * * root $PWD/check-health.sh" > /etc/cron.d/monitor-thermostat
sudo chmod 600 /etc/cron.d/monitor-thermostat
echo "Chron set up"