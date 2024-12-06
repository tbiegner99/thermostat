#! /bin/bash
set -x

node $PWD/check-health.js

if [ $? -eq 0 ]; then
  ;

else
  echo "Healthcheck failed rebooting"
  reboot
fi