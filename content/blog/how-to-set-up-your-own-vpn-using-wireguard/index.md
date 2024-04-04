---
title: 'How to Set Up Your Own VPN Using WireGuard'
date: '2021-08-09T08:57:22+01:00'
draft: false
author: paranerd
---

Setting up your own private VPN got so much easier with the rise of WireGuard. Let me show you how it’s done!

I’m sure there are numerous reasons why you would set up a VPN yourself. In my particular case, I wanted to be able to connect to my home network remotely. This enables me to maintain and occasionaly fix things without the need to be physically present. Sure, for a lot of the services running on my network I could have simply just set up port forwarding to log into directly but a self-hosted VPN provides a whole lot more security and doesn’t affect usability all too much besides clicking one more button to connect (apart from the initial setup process, of course).

Whatever your reason might be, setting up WireGuard VPN is super simple and fairly straight forward.

The easiest way, IMHO, to do this is using Docker and Docker Compose. I’m assuming you already have both installed and set up.

To install WireGuard all you need is to create a file, call it `docker-compose.yaml` and put the following into it:

```yaml { linenos=table }
---
version: "2.1"
services:
  wireguard:
    image: ghcr.io/linuxserver/wireguard
    container_name: wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/London
      - SERVERURL=wireguard.domain.com #optional
      - SERVERPORT=51820 #optional
      - PEERS=1 #optional
      - PEERDNS=auto #optional
      - INTERNAL_SUBNET=10.13.13.0 #optional
      - ALLOWEDIPS=0.0.0.0/0 #optional
    volumes:
      - /path/to/appdata/config:/config
      - /lib/modules:/lib/modules
    ports:
      - 51820:51820/udp
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
    restart: unless-stopped
```

This has been taken directly from [WireGuard’s Docker Hub page](https://hub.docker.com/r/linuxserver/wireguard) where you can also find additional information about the parameters.

I will just mention the most important ones here:

`SERVERURL`: Set this to the domain you want WireGuard to be reached at. This is important for connecting clients later on

`PEERS`: This can be either just a single number or a comma separated list of devices (e.g. phone, tablet, laptop). When launching the container WireGuard will generate client configurations in the folder you mounted for config

`TZ`: You should probably update your timezone, though I’m not entirely sure what happens if you leave it at default...

To actually create the container run the following command inside the folder you created the `docker-compose.yaml` in:

```bash { linenos=table }
docker-compose up -d
```

For the clients to be able to connect to your server you need to forward port 51820 (if you left it at default) in your router.

Connecting clients is amazingly simple. In the folder you mounted for `config` there are sub-folders for all peers. Each of them contains a .png with a QR-Code you could scan as well as a peer_*.conf in case your client doesn’t have a camera.

Both options tell the client everything it needs to know. After connecting successfully, simply activate the VPN and you’re good to go.

I tested this on Windows and Android and the process could not have been easier.

Setting up your very own self-hosted VPN has never been easier. If you regularly have the need to access your home network from the go, check out WireGuard, it’s super simple, fast and of course: secure.
