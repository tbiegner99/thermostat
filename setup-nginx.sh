#! /bin/bash
apt-get install nginx
cp ./nginx/nginx.conf /etc/nginx/conf.d
cd ./ui
npm i
cp ./build/* /var/www