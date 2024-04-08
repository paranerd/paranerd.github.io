---
title: "How To Create Your Own HTTPS-Certificate With Let's Encrypt"
date: '2018-09-11'
categories:
  - 'server'
coverImage: 'lets_encrypt-1.png'
---

Making your website secure has been one of the major tasks in web developement since... ever. And it's only gotten more relevant over time.

[Google has even begun](https://security.googleblog.com/2018/02/a-secure-web-is-here-to-stay.html) tagging http-Sites as "Not secure" as of July 2018. And for good reason: encrypting traffic to and from your site using SSL is one big step towards a more secure web.

Sadly, this could easily end up being a time- and money-consuming exercise as setting up an HTTPS-Certificate was not always easy and sometimes cost quite a bit.

Luckily, now there's Let's Encrypt!

### About Let's Encrypt

Let's Encrypt is a certificate authority founded by two Mozilla employees back in 2012. They issued its first certificate in January 2015. Up to June 2017 they already issued over 100 million certificates.

Let's Encrypt is free, super easy to setup and recognized by all major browsers! All you need is a server. I've set up a certificate for my home server that I am accessing via a dynamic DNS service. Just make sure your server is accessible on ports 80 (http) and 443 (https) and set up port forwarding if needed.

Let's go get us a certificate! To do that we need a tool called 'certbot' that automates most of the steps necessary to obtain a certificate.

The following instructions assume that you're running Apache2 - if you're using Nginx instead, simply replace "apache" with "nginx".

### Install Certbot on Ubuntu 18.04

With Ubuntu 18.04 it's ridiculously simple to get an HTTPS-Certificate. We only need one single package.

```bash
sudo apt install certbot python-certbot-apache
```

### Install Certbot on Ubuntu 16.04 LTS

If you're on the latest LTS-Version of Ubuntu, there's some preparation required as certbot is not included in the main repository.

Therefore we need to add the official certbot-repo

```bash
sudo add-apt-repository ppa:certbot/certbot
```

If the above command fails because of 'unknown command', you need another package first:

```bash
sudo apt-get install software-properties-common (this necessary?)
```

Now we can update our system and install certbot

```bash
sudo apt-get update
sudo apt-get install python-certbot-apache
```

### Install Certbot on Raspbian

For the current version of Raspbian, which is based on Debian 9 (Stretch), the setup process is the same as for Ubuntu 18.04.

For the older version, that is based on Debian 8 (Jessie), however, getting certbot installed is not quite as straightforward.

First, we need to add a repository to our sources.list:

```bash
sudo sed -i "$ a\deb http://ftp.debian.org/debian jessie-backports main" /etc/apt/sources.list
```

If we were to run an update now, we would end up with a GPG error because Raspbian doesn't have the public key for the Debian repositories, so we add them manually:

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 8B48AD6246925553
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7638D0442B90D010
```

Now we update our system and install certbot from the backports

```bash
sudo apt-get update
sudo apt install certbot -t jessie-backports
```

### Get the certificate

The 'webroot' authenticator challenge creates a temporary file in the webroot of our server. Then the Let's Encrypt validation server makes HTTP requests to validate that the DNS for each requested domain resolves to the server running certbot.

```bash
sudo certbot --authenticator webroot --installer apache
```

I always use this method because it never failed on me. You can check out [the official documentation](https://certbot.eff.org/docs/using.html#webroot) for more information about this and other challenges.

We just follow the process and do as we're told. Enter your E-Mail, domain name, enter your webroot (/var/www/html is the default for Apache2) and - as always - agree to the Terms of Service.

Now certbot will try to confirm that you're actually in control of the provided domain. This is where forwarding port 80 becomes important. When successful, it will store your certificate under `/etc/letsencrypt/live/[your-domain-name]/` and create a configuration in `/etc/apache2/sites-available/000-default-le-ssl.conf` (obviously different for Nginx, but it will tell you where it's at).

The only thing left to do is to decide if you want to redirect all incoming requests to HTTPS. I recommend doing that to make your website HTTPS-only.

### Renew the certificate

The certificate from Let's Encrypt is valid for 90 days. With the installation of certbot we automatically get a cronjob that triggers the renewal twice a day. Might be overkill and you could change it to whatever interval you like but it's what they recommend.

Note that it only **checks** for updates twice a day but runs the actual renewal only if there are less than 30 days left before the certificate expires.

If for whatever reason the cronjob was not created, you can add it manually:

```bash
0 0 * * 0 letsencrypt renew
```

This checks for renewal once a week (absolutely sufficient if you ask me), every sunday at midnight.

### Conclusion

That's it! Not that hard being part of a more secure web, is it?!
