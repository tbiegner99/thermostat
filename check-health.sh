#! /bin/bash

SHELL_DIR=$(dirname $0)
node $SHELL_DIR/check-health.js


if [ $? -ne 0 ]; then
  echo "Healthcheck failed rebooting"
  /usr/sbin/reboot
fi
