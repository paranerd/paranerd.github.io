---
title: 'How To Start Scripts On USB-Connect'
date: '2018-10-08'
author: paranerd
categories:
  - 'bash'
  - 'how-to'
  - 'server'
---

Having a script executed when a USB device is inserted can be quite helpful. I, for example, have an export script that syncs files to a flash drive without any interaction (except putting the drive in, of course).

Here's how you do it:

### Adding The Rule

In `/etc/udev/rules.d/` we add a rules-file. The name doesn't matter at all, as long as it has the `.rules` extension. The following goes into that file:

```bash { linenos=table }
ACTION=="add", SUBSYSTEM=="usb", ATTRS{idVendor}=="****", ATTRS{idProduct}=="****", RUN+="/usr/local/bin/myscript.sh"
```

What this does is it listens to any `usb` device being `add`ed so it can run `myscript.sh`. You'll have to create this script first, of course. Remember to add executable permissions!

Now restart the udev service by executing

```bash { linenos=table }
sudo service udev restart
```

Insert a USB device and your script will be started.

### Specific Devices

What if you wanted to run the script only for a certain USB device? Not a problem at all! For that we need some information about the device.

```bash { linenos=table }
lsusb
```

That gives us an output like this one:

```bash { linenos=table }
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

The `1d6b` is the vendor ID, `0002` is the product ID. If we replace the `****` in our rule with these values, the script is only run for this specific device.

### Working With The Drive

If your script is supposed to work with files on the connected USB device, the above solution will not work! That's because running the script blocks the mounting process, so files are only available **after** the script finished. To circumvent this, we use a tool called "at".

```bash { linenos=table }
sudo apt install at
```

This tool is used to run programs at a specific time. It helps us with our problem when we modify the "RUN" part of our rule like so:

```bash { linenos=table }
RUN+="/usr/bin/at -M -f /usr/local/bin/myscript.sh now"
```

Remember to restart the udev service. Although `at` runs the script immediately, it doesn't block the mounting anymore - amazing, isn't it?! There's one caveat to using `at`: it runs scripts with sh instead of bash! Shouldn't be an issue in most cases but it's important to keep it in mind if you're running into weird errors.

### Conclusion

Running scripts on USB-connect can be a great way to automate things. You might still want to check the mount status in your script because both processes are running at the same time now and there's no guarantee that mounting is done before your script is started.
