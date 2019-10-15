---
date: "2019-10-14"
title: Foolproof Method to Connect Alexa to "xfinitywifi" Public Hotspot
---

After wasting nearly an hourly repeatedly trying to connect my Amazon Alexa to an "xfinitywifi" hotspot in my building through the typical wifi setup in the Alexa app, I opted for another method which worked like a charm.  The issue I had with the app was that I could never get the xfinitywifi login page to come up on my phone after connecting my Alexa to that network.  To connect a new device to a public hotspot like this it's often necessary to login in to a webpage the first time you connect to the network.  So I needed another method of logging in to authenticate my Alexa on the network...

## The Solution:
I used my laptop (running linux) to spoof the mac address of my Alexa, connect to xfinitywifi, and log in to the xfinity login page.  This added the Mac address of my Alexa to the list of permitted devices on the hotspot.  Here are the steps for doing this in linux:

* First you must obtain the Mac Address of your Alexa.  In the Alexa App on your phone go to the settings for your Alexa and click "About", and note the value under the "MAC Address" field.
* Then run the following commands:

---
### Fedora Instructions:
````bash
sudo dnf install macchanger
# then forget the network xfinitywifi on my computer and turn off Alexa to be safe
sudo ifconfig -a  # note the name of the network interface device your using (mine was "wlp1s0")
sudo service NetworkManager stop && sudo ifconfig wlp1s0 down
sudo macchanger -m <mac_address> <interface_name>     # (using Alexa's mac address)
#sudo macchanger -m xx:xx:xx:xx:xx:xx wlp1s0          # (the command I ran)

sudo ifconfig <interface_name> up && sudo service NetworkManager start
# now connect to xfinitywifi and visit http://httpforever.com to force xfinity login page to come up
sudo macchanger -s <interface_name>  # verify desired max address is still set
````
* now restart laptop to revert its mac address, and turn on your Alexa
* if Alexa doesn't connect to the network automatically then set up the connection through the app and it should work

---
### Ubuntu Instructions:
````bash
sudo apt install macchanger
# then forget the network xfinitywifi on my computer and turn off Alexa to be safe
sudo ifconfig -a  # note the name of the network interface device your using (mine was "wlp1s0")
sudo service network-manager stop && sudo ifconfig wlp1s0 down
sudo macchanger -m <mac_address> <interface_name>     # (using Alexa's mac address)
#sudo macchanger -m xx:xx:xx:xx:xx:xx wlp1s0          # (the command I ran)

sudo ifconfig <interface_name> up && sudo service network-manager start
# now connect to xfinitywifi and visit http://httpforever.com to force xfinity login page to come up
sudo macchanger -s <interface_name>  # verify desired max address is still set
````
* now restart laptop to revert its mac address, and turn on your Alexa
* if Alexa doesn't connect to the network automatically then set up the connection through the app and it should work
