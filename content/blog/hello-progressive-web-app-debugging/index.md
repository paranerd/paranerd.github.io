---
title: 'Hello Progressive Web App | Debugging'
date: '2018-10-05'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

This is the last post of the series "Hello Progressive Web App".

**Table of Contents**

1. [Introduction](/blog/2018/10/05/hello-progressive-web-app-introduction/)
2. [Manifest](/blog/2018/10/05/hello-progressive-web-app-the-manifest/)
3. [Service Worker](/blog/2018/10/05/hello-progressive-web-app-the-service-worker/)
4. [Caching Strategies](/blog/2018/10/05/hello-progressive-web-app-caching-strategies/)
5. **Debugging**

Last but not least I want to share with you some tricks and places you need to know when debugging your Progressive Web App. First and foremost I recommend using the Chrome Browser for this task as I found it to be much more convenient.

### Manually Adding To Homescreen

Sometimes the browser doesn't show the popup asking if you want to add the app to your homescreen. There are several possible reasons for this. When the popup is being displayed is determined by a heuristic measuring the user's interaction with the page. Sometimes you trigger the popup, sometimes you don't - I couldn't figure out a reliable way of reproducing this behaviour.

Luckily there's a manual way to do it: Open the Developer's Console (F12), go to "Application" -> "Manifest" -> "Add to homescreen".

If, however, the reason for the popup not being displayed is an error in your app, this approach will not work either. But the Console will still help you figure it out!

### Updating The Service Worker

Under "Application" -> "Service Worker" in the Developer's Console you see which service worker is currently used and manually update it to the most recent version. If you want the service worker to be updated on each page refresh, you tick the box labeled "Update on reload".

### See Cached Files

If you want to know which files are added to your cache, go to "Application" -> "Cache" -> "Cache Storage" -> \[cache name\]. All the files are listed there and can be removed individually or all together.

### Uninstalling

After adding the app to your homescreen, simply deleting the icon doesn't fully remove the PWA, so you woudn't be able to re-add it. What you have to do instead is to go to [chrome://apps](chrome://apps) and remove it from there.

### Conclusion

This concludes the series introducing Progressive Web Apps. I hope, you learned something new. Let me know, if you found it useful and what amazing projects you build using this technology!
