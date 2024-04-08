---
title: 'Hello NodeJS | Controllers'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

Controllers allow organizing your site's routing into smaller, more maintainable chunks. Now we can finally use that `controllers/` folder!

What this system does is separating our routes into controllers, each with a specific job. For example, in a webshop you might have one controller for handling requests to articles, another for account-management and yet another for customer-support.

Let's create our first controller `controllers/users.js`!

```js { linenos=table }
var express = require('express');
var router = express.Router();

router.get('/login', function (req, res) {
  res.sendFile('login.html', { root: 'views' });
});

router.post('/login', function (req, res) {
  console.log('Username: ' + req.body.username);
  console.log('Password: ' + req.body.password);
  res.redirect('/');
});

module.exports = router;
```

This should all look very familiar, as it's just regular "advanced routing" that we saw in the previous chapter.

Next up we create `controllers/index.js`

```js { linenos=table }
var express = require('express');
var router = express.Router();

// Including all our controllers here
router.use('/user', require('./user'));

// Handle "top-level-requests"
router.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'views' });
});

module.exports = router;
```

This will be responsible for including the user-router. To do that it requires our `user.js` (the file-extension can be omitted, NodeJS is that smart!) and binds it to all requests coming in for 'localhost:8080/user'.

That is important to remember as the route the user-controller is taking care of is NOT 'localhost:8080/login' but rather 'localhost:8080/user/login'. Might be a bit confusing at first, but it's useful down the road.

In addition, the `index.js` will handle all the requests that we don't have a controller for (such as the landing page).

To let express know about the change in our routing-system, we edit our `server.js` like so:

```js { linenos=table }
// Include our router-file
//var routes = require('./router.js');

// Let it handle all requests
//app.use('/', routes);

// Include controllers
app.use(require('./controllers'));
```

When requiring a folder, NodeJS will by default look for an `index.js` in it, so we don't have to specify the filename here. Because we're including the user-controller in that file, this is sort of like a requirements-chain and we end up with express knowing about all routers.

Check it out: go to [localhost:8080/user/login](localhost:8080/user/login) and see that... well... nothing really changed visually. But under the hood we got a lot cleaner, way more structured code that will be way more maintainable when working on bigger projects and with other developers.
