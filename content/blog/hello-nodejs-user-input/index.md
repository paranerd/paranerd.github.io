---
title: 'Hello NodeJS | User Input'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

Displaying a login-screen is one thing, but it doesn't help us all that much if we can't process the user's input, right?! Let's add this feature now!

First, we need to install another package that allows us to extract data from POST-requests:

```bash { linenos=table }
npm install body-parser
```

We need to include the body-parser in our `server.js` so we can use it:

```js { linenos=table }
var express = require('express');
var app = express();
var http = require('http').Server(app);
// Include body-parser
var bodyParser = require('body-parser');

// Tell express to use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'views' });
});
// ...
```

With this in place we can add yet another routing-rule in our `server.js`:

```js { linenos=table }
app.post('/login', function (req, res) {
  console.log('Username: ' + req.body.username);
  console.log('Password: ' + req.body.password);
  res.redirect('/');
});
```

What are we doing here? We're telling express to listen for POST-requests to localhost:8080/login. From the body of those requests we're extracting 'username' and 'password' (since that's what we named our `input`\-Elements in `login.html`). Check out your console to see both of them displayed there. Then we're redirecting the user to our landing page. We can now process this information however we like. Proper authentication would be nice, right? Don't worry, we'll get to that in a little bit!
