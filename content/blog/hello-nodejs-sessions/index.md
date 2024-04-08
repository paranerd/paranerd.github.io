---
title: 'Hello NodeJS | Sessions'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

Sessions are a simple way of persisting information between page requests. They make it easy to save a value in some part of your website and retrieve that value at a completely different place without having to manually send it there.

A session is nothing magical, just an array of key-value-pairs saved on the server accessed by the browser via a Session-ID which is stored in a cookie. The Session-ID enables us to have different sessions for different users of our website at the same time.

To use sessions in our express-server, we need another package:

```bash { linenos=table }
npm install express-session
```

Setting up the session in our `server.js` is super easy. First we need to tell it that we're using this new package now:

```js { linenos=table }
var expressSession = require('express-session');
```

Then we give it some details about how we want it to be set up:

```js { linenos=table }
var session = expressSession({
  secret: 'mylittlesecret',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 3600 },
});

app.use(session);
```

Let's break this down so we know what's going on:

The 'secret' parameter is used to sign the Session-ID-Cookie to verify access. In the real world you might want to use something a little (well, actually A LOT^^) stronger than what we use here.

Setting 'resave' to true forces the session to be saved back to session store even if the session was not modified during a request. We would normally set this to false but as I happen to know of a future usecase that requires it to be true, we will use this setting for now.

Having 'saveUninitialized' set to true would result in the session being saved to the store even if has not been initialized yet (we did not yet modify it in any way). This would cause querying the session-store more than necessary and waste precious space on disk.

A 'maxAge' of 3600 for our cookie will invalidate the session after an hour (a kind of auto-logout).

Apart from 'cookie' these are all required options, so you have to give them a value. There's a bunch of others that you can check out in the \[documentation\](https://www.npmjs.com/package/express-session)

Now let's see a session in action, shall we?!

In our `controllers/user.js` we modify our POST-route to login as follows:

```js { linenos=table }
router.post('/login', function (req, res) {
  req.session.username = req.body.username;
  res.redirect('/');
});
```

We access the session through the request-object to store the passed username in it.

To display the username, we change our `controllers/index.js`

```js { linenos=table }
router.get('/', function (req, res) {
  res.render('main/index', { username: req.session.username });
});
```

Finally, we adjust our template:

```html { linenos=table }
<body>
  <h1>Hello {{username}}</h1>
</body>
```

**That's all!**

Now we go to [localhost:8080/user/login](localhost:8080/user/login), enter a username, hit 'Login' and lose our minds to see that our website knows who we are!
