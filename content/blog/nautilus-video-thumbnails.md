---
date: "2019-10-04"
title: How to force nautilus to display video thumbnails
---

Out of the box, nautilus file browser will display thumbnails for photos in a directory, but not videos.  To fix this behaviour simply run the following commands on your linux machine:

### On Fedora:
````bash
sudo dnf install ffmpegthumbnailer
sudo mv /usr/share/thumbnailers/totem.thumbnailer /tmp/
sudo ln -s /usr/share/thumbnailers/ffmpegthumbnailer.thumbnailer /usr/share/thumbnailers/totem.thumbnailer
rm -rf ~/.cache/thumbnails
````
Then close and reopen nautilus and you should be good to go.

### On Ubuntu:
````bash
sudo apt-get install ffmpegthumbnailer
sudo mv /usr/share/thumbnailers/totem.thumbnailer /tmp/
sudo ln -s /usr/share/thumbnailers/ffmpegthumbnailer.thumbnailer /usr/share/thumbnailers/totem.thumbnailer
rm -rf ~/.cache/thumbnails
````

If you want to revert this change later simply reinstall totem or run the following command:
````bash
sudo rm /usr/share/thumbnailers/totem.thumbnailer /tmp/
sudo mv /tmp/totem.thumbnailer /usr/share/thumbnailers/
````
