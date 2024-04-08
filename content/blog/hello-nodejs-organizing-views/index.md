---
title: 'Hello NodeJS | Organizing Views'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

So far we only have to manage two views - no big deal. But imagine having dozens of different pages, which is not at all unusual. Having all those views in one single views-folder would be a huge mess and very difficult to manage and maintain. Therefore it's usually better to use sub-folders to organize our views.

Following the pattern of our controllers, we create two folders: `views/main/` and `views/user/`. Similar to the `controller/index.js` the `views/main/` will contain all views that we don't have a specific controller for.

We move our `views/index.html` to `views/main/` and `views/login.html` to `views/user/` respectively. For our controllers to find them we need to update their paths.

`controllers/index.js`:

```js { linenos=table }
router.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'views/main' });
});
```

`controllers/user.js`:

```js { linenos=table }
router.get('/login', function (req, res) {
  res.sendFile('login.html', { root: 'views/user' });
});
```

Checking out the changes in our browser, hopefully we won't be noticing any differences as they were purely 'under the hood' for the sake of clean code, efficient development and our sanity when managing growing projects.
