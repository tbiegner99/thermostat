#! /bin/bash
set -e

path=`pwd`

NODE_DIR=`which node`

cp $path/temperature.service $path/tmp #/etc/systemd/system

./setup-config.sh
./setup-controllers.sh


sed -i "s|\$PWD|$path|g" /etc/systemd/system/temperature.service

sed -i "s|\$NODE_DIR|$NODE_DIR|g" /etc/systemd/system/temperature.service

cd ./server
npm i

systemctl enable temperature
systemctl start temperature