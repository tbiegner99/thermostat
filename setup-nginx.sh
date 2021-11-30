#! /bin/bash
apt-get install nginx
cp ./nginx/nginx.conf /etc/nginx/conf.d
cd ./ui
npm i
npm run build
cp ./build/* /var/www