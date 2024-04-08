---
title: 'How To Reset The MySQL root password'
date: '2018-09-13'
author: paranerd
categories:
  - 'mysql'
  - 'server'
---

The number of times I lost access to my MySQL-Database because I forgot the password is probably rather embarrassing. In uncounted web-searches I came up with several solutions to reset it. Some of them worked but were utterly difficult and some plainly didn't work at all.

To save you the hassle of finding the best solution, I will just give it to you right now. It's meant for a Debian-based Linux (Ubuntu in my case) but may work for other distributions as well.

First we stop the MySQL-Server. Notice: in my case this procedure only worked if the MySQL-Server had been running and I stopped it, not if is hadn't been running at all after boot.

```bash { linenos=table }
sudo service mysql stop
```

Restart it in safe mode using the [\--skip-grant-tables](https://dev.mysql.com/doc/refman/8.0/en/server-options.html#option_mysqld_skip-grant-tables) option.

```bash { linenos=table }
sudo mysqld_safe --skip-grant-tables &
```

This option enables anyone to connect without a password. Login as root without giving a password

```bash { linenos=table }
mysql -uroot
```

Finally set a new root-password via the mysql-console

```bash
> FLUSH PRIVILEGES;
> ALTER USER 'root'@'localhost' IDENTIFIED BY 'mynewpassword';
> quit
```

Source: [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html)

### Possible Errors

I will try to keep this post updated with any errors I encounter on various distributions.

The first of those errors is the following:

```bash { linenos=table }
ERROR 1524 (HY000): Plugin 'auth_socket' is not loaded
```

This happened to me after trying to alter the user. We fix this by executing this bit:

```bash { linenos=table }
USE mysql;
UPDATE user SET plugin="mysql_native_password";
FLUSH PRIVILEGES;
```

After that we execute the "ALTER USER" line again and should be fine.

### Conclusion

Let me know in the comments if you found an even easier way of resetting the MySQL root password! Also share if you encountered any error - and if you've already solved it, I'd also be curious how you did it!
