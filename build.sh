#! /bin/bash
cd ./server 
npm ci
cd ../ui
npm ci
npm run build