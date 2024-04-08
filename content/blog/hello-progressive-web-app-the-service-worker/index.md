---
title: 'Hello Progressive Web App | The Service Worker'
date: '2018-10-05'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

This is part 3 of the series "Hello Progressive Web App".

**Table of Contents**

1. [Introduction](/blog/2018/10/05/hello-progressive-web-app-introduction/)
2. [Manifest](/blog/2018/10/05/hello-progressive-web-app-the-manifest/)
3. **Service Worker**
4. [Caching Strategies](/blog/2018/10/05/hello-progressive-web-app-caching-strategies/)
5. [Debugging](/blog/2018/10/05/hello-progressive-web-app-debugging/)

A service worker is a type of web worker. Its job is to intercept network requests, cache files, retrieve those files from cache and deliver push messages.

A great introduction to this technology can be found [here](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker).

This is what a basic service worker looks like:

```js { linenos=table }
var cacheVersion = 'v1';
var cacheStatic = 'pwa-static-';
var filesToCache = [
  '/',
  '/pwa/',
  '/pwa/index.html',
  '/pwa/manifest.json',
  '/pwa/service-worker.js',
  '/pwa/css',
  '/pwa/css/design.css',
  '/pwa/js',
  '/pwa/js/app.js',
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheStatic).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key.startsWith(cacheStatic) && !key.endsWith(cacheVersion)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
```

There are a few events to be taken care of with service workers. The following are the most important ones:

### Registration

This part is actually not done in the \`service-worker.js\` but in the \`app.js\`. Registering the service worker basically connects it to our application.

```js { linenos=table }
(function () {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function () {
      console.log('Service Worker Registered');
    });
  }
})();
```

### Installation

When we first access our app in the browser, the service worker will be installed. During installation it creates and opens a cache called 'pwa-static-' and adds to it all the files we want to be cached. Those files are the basic framework for our app, the so called 'App Shell'. You can add anything you want: images, fonts, scripts, ... Just make sure you don't go overboard with this as it's meant to load quick. Note that the paths are relative to the webserver's document root.

### Activation

Activation follows installation. It's executed when there's been changes in the service worker (as there is on first launch because there wasn't a worker in place before at all). When we change the list of files to be cached, we also change the cache version. We can then use this listener to remove any old caches by comparing their names (keys).

### Handling requests

When it comes to handling requests, there are a [whole lot](https://jakearchibald.com/2014/offline-cookbook/) of different [strategies](https://developer.mozilla.org/de/docs/Web/API/Service_Worker_API/Using_Service_Workers#Umgang_mit_fehlgeschlagenen_Cache-Anfragen). The approach I chose in the example above does the following: "Go check if we have the request cached, otherwise go to the network to fetch it!". That's as simple as it gets when it comes to caching. It's called [Cache, falling back to network](https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network). Also check out out the [next post](/blog/2018/10/05/hello-progressive-web-app-caching-strategies/) for alternatives.

Be aware that you can only cache GET-requests (sending a POST without access to the server wouldn't make much sense, would it?!)

### Conclusion

With the service worker we now have a basic Progressive Web App! The technology behind all of this is pretty amazing, the implementation is pretty straight forward and experimenting with it can be a lot of fun. If you want to see a PWA in action, take a look at my reverse engineering project for the game [2048](/blog/portfolio-items/2048/). To learn more about different caching strategies, check out the [next post](/blog/2018/10/05/hello-progressive-web-app-caching-strategies/) of this series!
