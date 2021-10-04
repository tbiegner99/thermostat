#!/bin/bash
#First enable autologin from raspi-config
#run as sudo
#https://desertbot.io/blog/raspberry-pi-touchscreen-kiosk-setup
apt-get install -y --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox chromium-browser
echo "xset -dpms            # turn off display power management system" >> /etc/xdg/openbox/autostart
echo "xset s noblank        # turn off screen blanking" >> /etc/xdg/openbox/autostart
echo "xset s off            # turn off screen saver" >> /etc/xdg/openbox/autostart
echo "sed -i 's/\"exited_cleanly\":false/\"exited_cleanly\":true/' ~/.config/chromium/'Local State'" >> /etc/xdg/openbox/autostart
echo "sed -i 's/\"exited_cleanly\":false/\"exited_cleanly\":true/; s/\"exit_type\":\"[^\"]\+\"/\"exit_type\":\"Normal\"/' ~/.config/chromium/Default/Preferences" >> /etc/xdg/openbox/autostart
echo "chromium-browser  --noerrdialogs --check-for-update-interval=31536000 --disable-background-networking --disable-component-update --disable-infobars --kiosk $KIOSK_URL"  >> /etc/xdg/openbox/autostart
cat  /etc/xdg/openbox/autostart

echo "export KIOSK_URL=http://127.0.0.1/thermostat">>/etc/xdg/openbox/environment

touch /home/pi/.bash_profile
echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor' >> /home/pi/.bash_profile
source /home/pi/.bash_profile 
reboot
