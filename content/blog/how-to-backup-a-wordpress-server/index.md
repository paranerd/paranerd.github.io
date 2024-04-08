---
title: 'How To Backup A (Wordpress-) Server'
date: '2018-09-24'
author: paranerd
categories:
  - 'server'
---

Backups are crucial. I hope we agree on that one. When I started this website, one of the major things that occupied my mind was "How do I make sure, all the work I put into this project is safe from an attack, system failure or me accidentaly clicking 'Delete All! Now!'?"

Sadly, knowing, that you **should** make a backup doesn't necessarily mean you actually **do** it, am I right?! I wanted to care about backups only once, then have it running automatically and never come back to it again (because that would likely mean something went wrong).

When I composed the script, I'm going to show you in just a moment, I primarily had a WordPress-Installation in mind, but it can easily be applied to any other server-environment.

### Backup on the server

Without further ado, here's the script:

```bash { linenos=table }
#!/bin/bash
datestamp=`date '+%Y-%m-%d-%H%M%S'`
webroot=[YOUR_WEBROOT]

ssh_user=[YOUR_SSH_USER]
ssh_host=[YOUR_SSH_HOST]
ssh_pass=[YOUR_SSH_PASS]

db_name=[YOUR_DB_NAME]
db_user=[YOUR_DB_USER]
db_host=[YOUR_DB_HOST]
db_pass=[YOUR_DB_PASS]

# Create destination folder
mkdir -p backups/${datestamp}

# Backup the database into that folder
mysqldump ${db_name} --add-drop-table -h ${db_host} -u ${db_user} -p'${db_pass}' > backups/${datestamp}/${datestamp}_database.sql"

# Backup all the files into that folder (excluding the backups)
zip -r backups/${datestamp}/${datestamp}_files.zip ${webroot} -x ${webroot}/backups/\*"

# Remove all but the last 4 backups
ls -tp -d -1 ${webroot}/backups/** | tail -n +4 | xargs -d '\n' -r rm -r --
```

There's nothing really special in here, I tried to keep it as simple as possible. What this does is it creates a folder for each backup named with the current timestamp, i.e. "2018-09-24-062413" in a parent "backups"-folder. Adding the "-p" to mkdir tells it to recursively create every given folder if it doesn't exist.

With that folder structure in place we tell mysqldump to write the backup of our database into that folder. Next we create a full backup of all the files in the webroot (excluding the backup folder itself).

To not overflow our server with backups, we remove all but the most recent 4 backups (modify this value to your needs). Note that we don't remove "backups older than x"! If for whatever reason the backup a couple times, this approach might leave us with none at all!

In order to run this script without interaction we need to have passwords included in clear text. This is obviously far from ideal but necessary. I highly recommend you put this script in a secure location, outside document root, to avoid having your passwords exposed.

Simply backing up the entire database and all of the files might seem like a very broad approach and not very smart. You could get selective here and exclude things that you could easily re-install after a crash.

But think about your future self whose website just went down for some reason and who now has to install, setup and tweak all those things that you forgot was such a big pain the first time around. Wouldn't that future self not come back to this point in time, slap you in the face and make you just backup ALL the things?

Storage is cheap these days and if it doesn't occupy too many resources to run a full backup, I would strongly recommend you do just that!

### Backup from remote

What we did so far was creating a backup of all the data we need for recovering from failure. That already enables us to easily roll back to a working state after some misconfiguration. But what if the server itself fails and leaves files corrupted? All our backups are sitting right next to the "live" data, so chances are if those files get damaged, our backups will, too!

A rule of thumb when it comes to backups is to never put all your eggs in one basket! With that in mind I decided to modify the existing script so that I can run it from another server.

To make it easier to just copy the code, I give you the entire script here:

```bash { linenos=table }
#!/bin/bash
datestamp=`date '+%Y-%m-%d-%H%M%S'`
webroot=[YOUR_WEBROOT]
local_backup_dir=[PATH_FOR_BACKUP_SYNC]

ssh_user=[YOUR_SSH_USER]
ssh_host=[YOUR_SSH_HOST]
ssh_pass=[YOUR_SSH_PASS]

db_name=[YOUR_DB_NAME]
db_user=[YOUR_DB_USER]
db_host=[YOUR_DB_HOST]
db_pass=[YOUR_DB_PASS]

# Backup the database into that folder
sshpass -p ${ssh_pass} ssh ${ssh_user}@${ssh_host} -o StrictHostKeyChecking=no "mkdir -p backups/${datestamp} && mysqldump ${db_name} --add-drop-table -h ${db_host} -u ${db_user} -p'${db_pass}' > backups/${datestamp}/${datestamp}_database.sql"

# Backup all the files into that folder (excluding the backups)
sshpass -p ${ssh_pass} ssh ${ssh_user}@${ssh_host} -o StrictHostKeyChecking=no "mkdir -p backups/${datestamp} && zip -r backups/${datestamp}/${datestamp}_files.zip ${webroot} -x ${webroot}/backups/\*"

# Remove all but the last 4 backups
sshpass -p ${ssh_pass} ssh ${ssh_user}@${ssh_host} -o StrictHostKeyChecking=no "ls -tp -d -1 ${webroot}/backups/** | tail -n +5 | xargs -d '\n' -r rm -r --"

# Pull backups
rsync -a -e "sshpass -p ${ssh_pass} ssh -o StrictHostKeyChecking=no" --delete ${ssh_user}@${ssh_host}:${webroot}/backups/ ${local_backup_dir}
```

What I did here was basically just passing the commands from the original script through ssh. We need sshpass to pipe the password to ssh so we can run the script in the background without any interaction.

The mysqldump would normally run without the need of ssh (since we provide the database host), but my hoster only allows connections to the database server from "within the network". If you don't have that restriction, you may remove that wrapper to reduce unnecessary overhead.

After creating the backup on the remote server, we use rsync to pull it from there.

### Recovery

What good is the best backup if you don't know how to apply it? Luckily, recovering files you backed up with this script is a trivial task: just extract the archive and you're done. To restore your database you need the following command (executed on the live server)

```bash { linenos=table }
mysql -u [YOUR_DATABASE_USER] -p < [BACKUP_FILE].sql
```

### Conclusion

Backing up your server is important, can save you a ton of stress and doesn't have to be difficult. All there is left to do for automating the process is to setup a cronjob that starts our script periodically.

Disclaimer: it should be obvious but I still want to mention, that in the end you yourself are responsible for your own backups and can not hold me accountable for anything breaking when using my script.
