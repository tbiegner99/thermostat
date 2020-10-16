#! /bin/bash
apt-get install nginx
cp ./nginx.conf /etc/nginx
cd ./ui
npm i
cp ./build/* /var/www