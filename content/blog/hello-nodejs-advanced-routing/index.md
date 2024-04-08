---
title: 'Hello NodeJS | Advanced Routing'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

As we've already learnt, the basic approach to routing can make our `server.js` unreadable in bigger projects. In this chapter we'll get to know a slightly better way to do it (spoiler alert: there's an EVEN better version, but we'll get to that later).

To keep our `server.js` nice and clean, it's usually better to handle routing in a dedicated place

For that we create a `routes.js` in our project-root with the following content:

```js { linenos=table }
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'views' });
});

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

Notice that the routes themselves are just copied and pasted with 'app' being replaced by 'router'

Now we have to remove all the routes from our `server.js` and tell it to use our new `routes.js`.

The final result will look like this:

```js { linenos=table }
// Include a bunch of stuff
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Include our router-file
var routes = require('./routes.js');

// Let it handle all requests
app.use('/', routes);

// Start a server that listens to port 8080
http.listen(8080, function () {
  console.log('listening on *:8080');
});
```

While this is already a lot better and makes the `server.js` a lot more readable, we would still end up with one huge file for all the requests.

This is where controllers come in...
