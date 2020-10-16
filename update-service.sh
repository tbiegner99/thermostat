#! /bin/bash

git pull origin
cd ./server
npm i
sudo service temperature restart

cd ../ui
npm i
npm run build
cp ./build/* /var/www