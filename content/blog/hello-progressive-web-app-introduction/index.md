---
title: 'Hello Progressive Web App | Introduction'
date: '2018-10-05'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

In this series I want to introduce you to a technology called "Progressive Web App". I will give you a general overview of what Progressive Web Apps are as well as detailed instructions on how to implement this.

**Table of Contents**

1. **Introduction**
2. [Manifest](/blog/2018/10/05/hello-progressive-web-app-the-manifest/)
3. [Service Worker](/blog/2018/10/05/hello-progressive-web-app-the-service-worker/)
4. [Caching Strategies](/blog/2018/10/05/hello-progressive-web-app-caching-strategies/)
5. [Debugging](/blog/2018/10/05/hello-progressive-web-app-debugging/)

### Introduction to PWAs

Progressive Web Apps (or PWAs for short) could possibly be the future of mobile app development. At its core a PWA is simply a website with some special features added to it. It is a website that can be installed to a device's homescreen without an app store.

The "progressive"-part means that even if your browser doesn't support Progressive Web Apps, you will still see the website. You will not get any of the special features, but you shouldn't encounter any errors because of it either.

If your browser **does** support PWAs, however, there's some magic going on under the hood! When accessing a PWA in a compatible browser, it will cache a bunch of stuff in the background. Not only does the page load noticably faster when you visit it again later, but parts of it, like the layout, will even be available when you're offline!

You can add a PWA to your home screen, like a bookmark - but so much more! It's a 'lightweight-installation' without having to fiddle around with an app store. Unlike a bookmark, when opening it, you don't see your browser launching. Instead it looks and feels like starting a native app! Similar to a 'real' app all the static content has been installed (aka cached) on the device making it load instantly even in poor network conditions.

There’s a lot to learn about Progressive Web Apps. If you want to dive deeper into theory I recommend you start with [this article](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/). It describes the fundamentals of PWAs and what makes them so great.

The rest of this tutorial is going to be rather practical as to give you the basic frame you need to get started with developing PWAs. No bells and no whistles, so we can focus only on the crucial parts.

### The Basics

Although most of the tutorials I went through were awesome demonstrations of what PWAs are capable of, usually they would have huge amounts of code in them and so sometimes added more confusion than they helped understanding the basics.

After digging through a lot of examples I found that despite there always being so much code, building a Progressive Web App actually doesn't require all that much.

It boils down to only those 3 main components:

- a manifest
- a service-worker
- a set of icons

### Project structure

Here's what a basic Progressive Web App looks like:

```bash { linenos=table }
css/
  |-- design.css
images/
  |-- icons/
        |-- [icon files]
js/
  |-- app.js
index.html
manifest.json
service-worker.js
```

Looks just like any other web app, doesn't it? Only that it's not!

### Conclusion

There's not very much involved to boost a regular website to a powerful Progressive Web App. A manifest, service worker and a couple icons are all it takes. We're going over all those components in the following sections.
