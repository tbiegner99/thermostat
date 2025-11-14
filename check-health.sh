#! /bin/bash
SCRIPT_DIR=$(dirname $0s)
node $PWD/check-health.js

if [ $? -ne 0 ]; then
  echo "Healthcheck failed rebooting"
  /usr/sbin/reboot
fi
