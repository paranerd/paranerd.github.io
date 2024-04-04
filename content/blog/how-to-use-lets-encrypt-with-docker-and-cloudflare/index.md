---
title: "How to Use Let's Encrypt With Docker and Cloudflare"
date: '2021-08-09T08:51:59+01:00'
draft: false
author: paranerd
---

I wrote about Let’s Encrypt SSL certificates before on this blog but I recently discovered an even better way of doing things!

Apart from actually having a domain that you could issue a certificate for, all you need for this to work is a (free) Cloudflare account to manage your DNS records as well as have Docker installed on your server.

On that server create a folder e.g. `/home/username/certbot/`. In that folder create a sub-folder and name it `certs` as well as a file called `cloudflare.ini`.

The content of `cloudflare.ini` should look like this:

```ini { linenos=table }
dns_cloudflare_api_token = abcde12345
```

Check out [Cloudflare’s help](https://developers.cloudflare.com/api/tokens/create) page on how to create an API token.

With that structure in place, run the following command:

```bash { linenos=table }
sudo docker run -it --rm --name certbot -v "/home/<username>/certbot/certs:/etc/letsencrypt" -v "/home/<username>/certbot/cloudflare.ini:/cloudflare.ini" certbot/dns-cloudflare certonly --dns-cloudflare --dns-cloudflare-credentials /cloudflare.ini -m <your-mail-address> --agree-tos --no-eff-email --dns-cloudflare-propagation-seconds 20 --cert-name <your-domain> -d <your-domain>
```

Replace `<username>`, `<your-mail>` and `<your-domain>` with your respective values, of course.

If you want to issue a wildcard certificate you can add subdomains by appending `-d '*.yourdomain.com' -d '*.sub.yourdomain.com'` and so on.

You will notice that the certbot container does not persist (because of the `--rm` flag) and it doesn’t need to.

To renew your certificate simply run:

```bash { linenos=table }
sudo docker run -it --rm --name certbot -v "/home/<username>/certbot/certs:/etc/letsencrypt" -v "/home/<username>/certbot/cloudflare.ini:/cloudflare.ini" certbot/dns-cloudflare renew --dns-cloudflare --dns-cloudflare-credentials /cloudflare.ini
```

Put that command into a cron job and you don’t have to worry about manually updating your certificates anymore.

To let your webserver pick up the renewed certificates you will probably have to restart/reload it.

I have Nginx also running in a container, so I would run the following command:

```bash { linenos=table }
sudo docker exec -it nginx nginx -s reload
```

Sadly, I didn’t find a way to use certbot’s `--deploy` hooks in a Docker environment. If you happen to know how to do that, please let me know!
