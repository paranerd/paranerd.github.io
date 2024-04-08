---
title: 'Hello Progressive Web App | The Manifest'
date: '2018-10-05'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

This is part 2 of the series "Hello Progressive Web App".

**Table of Contents**

1. [Introduction](/blog/2018/10/05/hello-progressive-web-app-introduction/)
2. **Manifest**
3. [Service Worker](/blog/2018/10/05/hello-progressive-web-app-the-service-worker/)
4. [Caching Strategies](/blog/2018/10/05/hello-progressive-web-app-caching-strategies/)
5. [Debugging](/blog/2018/10/05/hello-progressive-web-app-debugging/)

The manifest of a web app is a JSON file which provides information about that app. Here's an example of a basic `manifest.json`:

```json { linenos=table }
{
    "name": "PWA Tutorial",
    "short_name": "PWA Tutorial",
    "start_url": ".",
    "display": "standalone",
    "background_color": "#fff",
    "description": "A tutorial for PWAs",
    "icons": [{
        "more on those later"
    }]
}
```

Most of the attributes are self explanatory. The 'start_url' defines where the application lives. Relative parts in this attribute start from the manifest's location. Setting 'display' to 'standalone' means that when launching the app from the homescreen it will look like a native app. If you want your app to open in a browser, you may set 'display' to 'browser'. All the possible attributes are described in more detail [here](https://developer.mozilla.org/de/docs/Web/Manifest).

### Adding Icons

To be able to add our app to the homescreen we need to provide a set of icons of various sizes. All of them have to be named properly and added to the manifest.json. This can be quite the task if you were to do it all yourself. Luckily there's a brilliant little tool that takes away most of the pain! With the [Manifest Builder](https://app-manifest.firebaseapp.com/) you only need one 512x512 pixel icon. It will not only scale that to all the other resolutions but also - as the name suggests - generate a nicely formatted manifest.json!

### Linking the Manifest

Now that we have a proper manifest, we have to link it to our application. This is crucial as it lets the browser know this is not a regular website but an application. This is done in the index.html:

```html { linenos=table }
<!DOCTYPE html>
<meta charset="UTF-8" />
<html>
  <head>
    <title>PWA Tutorial</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/design.css" />

    <!-- Add to home screen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="apple-mobile-web-app-title" content="PWA Tutorial" />
    <link rel="apple-touch-icon" href="images/icons/icon-152x152.png" />
    <meta
      name="msapplication-TileImage"
      content="images/icons/icon-144x144.png"
    />
    <meta name="msapplication-TileColor" content="#2F3BA2" />

    <!-- Link your manifest here -->
    <link rel="manifest" href="manifest.json" />
  </head>

  <body>
    <h1>PWA Tutorial</h1>
    <script type="text/javascript" src="js/app.js"></script>
  </body>
</html>
```

Pretty much basic HTML-layout. Linking the manifest is done in a single line, there's nothing more to that. But since we're already here, there are some tags to be added if you want the "Add to homescreen"-feature for Safari on iOS. Linking the stylesheet is optional, of course. It's not required by the PWA.

### Conclusion

Adding a manifest is essential for the app to be recognized as 'more than a website'. Now that we have it in place, let's dive into a bit more complex stuff with the [service worker](/blog/2018/10/05/hello-progressive-web-app-the-service-worker/)!
