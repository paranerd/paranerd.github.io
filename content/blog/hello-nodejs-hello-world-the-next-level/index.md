---
title: 'Hello NodeJSP | Hello World - The Next Level'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

Our first Hello World example was great and all, but while the console is extremely helpful for debugging, we actually want to put things in the browser, don't we? So let's do that now!

To be able to access our code from a webbrowser we will need a server. The standard-server for NodeJS is ExpressJS, so that's what we will be using as well. We install it using npm from within your project-directory:

```bash { linenos=table }
npm install express
```

Now we just completely override our `server.js` with the following piece of code:

```js { linenos=table }
// Include express
var express = require('express');

// Create an instance
var app = express();

// Create the server
var http = require('http').Server(app);

// Take requests to our server-root and answer by sending back "Hello World!"
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Start the server on port 8080
http.listen(8080, function () {
  console.log('listening on *:8080');
});
```

Fire up the server (if not still running) using

```bash { linenos=table }
npm start
```

then open your browser, visit [localhost:8080](localhost:8080), check out all the cool things that are happening and be amazed! Well, it's really just text so far, so don't waste your time waiting for something special to come up here^^ - but don't worry, there are special things to come!
