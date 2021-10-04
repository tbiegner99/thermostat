#!/bin/bash
mkdir -p database
rm -f database/settings.json

echo '{
    "margin": 0.6,
    "heatThreshold": 15,
    "coolingThreshold": 30
}' > database/settings.json

#docker setup
sudo apt-get update && sudo apt-get upgrade
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker pi
su - pi
sudo apt-get install -y libffi-dev libssl-dev
sudo apt install -y python3-dev
sudo apt-get install -y python3 python3-pip
sudo pip3 install docker-compose

docker-compose up -d