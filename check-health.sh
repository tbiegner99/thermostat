#! /bin/bash
set -x

PWD=$1

node $PWD/check-health.js

if [ $? -eq 0 ]; then
  echo "Command succeeded"

else
  echo "Healthcheck failed rebooting"
  reboot
fi