---
title: 'Hello Progressive Web App | Caching Strategies'
date: '2018-10-05'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

This is the last part of the series "Hello Progressive Web App".

**Table of Contents**

1. [Introduction](/blog/2018/10/05/hello-progressive-web-app-introduction/)
2. [Manifest](/blog/2018/10/05/hello-progressive-web-app-the-manifest/)
3. [Service Worker](/blog/2018/10/05/hello-progressive-web-app-the-service-worker/)
4. **Caching Strategies**
5. [Debugging](/blog/2018/10/05/hello-progressive-web-app-debugging/)

There are a bunch of caching strategies out there. Here are two of them that I found particularly useful:

### Cache Then Network Then Cache

```js { linenos=table }
this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).catch(function () {
      return fetch(event.request).then(function (response) {
        return caches.open(cacheStatic + cacheVersion).then(function (cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
```

What this does is it first checks if the request is already cached. If so, the cached version is returned. If not, it goes to the network to fetch it. On success it puts the response in the cache and returns it to the browser. Note that we have to clone the response as it can be consumed only once.

### Cache Then Network

While the above approach works great in many cases, there are some scenarios where it fails. Imagine you had a news feed. On first launch your app is checking for updates, gets the latest news and caches them. But what happens the next time it asks for updates? The request will be found in cache and the user gets the same articles as before. There's got to be a better way of handling this. And there is!

```js { linenos=table }
this.addEventListener('fetch', function (event) {
  e.respondWith(
    caches.open(cacheStatic + cacheVersion).then(function (cache) {
      return fetch(e.request).then(function (response) {
        cache.put(e.request.url, response.clone());
        return response;
      });
    })
  );
});
```

This one's called ["Cache Then Network"](https://jakearchibald.com/2014/offline-cookbook/#cache-then-network). Notice that is's almost identical to the one above, but this time we don't return a cached response in here. For it to work as expected, there's a special way of requesting the resource:

```js { linenos=table }
var networkDataReceived = false;

// Fetch fresh data
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    // Do something with the data
  });

// Fetch cached data
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    if (!networkDataReceived) {
      // Only do something with the data if there's no fresh data yet
    }
  })
  .catch(function () {
    // No cached data available - try the network
    return networkUpdate;
  })
  .catch(showErrorMessage);
```

So we're sending two requests more or less simultaniously: one to the cache, another to the network. If the request has been cached, we display it right away. When there's an update from the network, we update. This is great for our news feed example! Users would see cached articles right away and get updates when they arrive.

### Multiple Caches

To separate the cached App Shell from this 'dynamic' data, we can introduce a second cache:

```js { linenos=table }
var cacheDynamic = 'pwa-dynamic-';
```

Now let's implement some sort of 'cache-routing' to account for multiple caches:

```js { linenos=table }
self.addEventListener('fetch', function (e) {
  if (e.request.url.indexOf('https://myserver.com/api/get_cool_stuff') > -1) {
    e.respondWith(
      caches.open(cacheDynamic + cacheVersion).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});
```

Requests to your API at 'myserver.com' will be handled by the "Cache Then Network" strategy and are cached in our 'dynamic' cache. All other requests will be served from cache if they exist (like the App Shell) or fetched from the network but not cached (like POST requests or anything else you don't want to be cached).

### Conclusion

Including the one from the last section we learned 3 caching strategies. Those are the ones I think are most relevant, but there are a lot more variants. And you are free to get creative here as well, of course! Let me know in the comments which strategy you prefer and why!
