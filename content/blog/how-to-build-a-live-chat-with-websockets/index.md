---
title: 'How To Build A Live Chat With WebSockets'
date: '2018-10-17T08:01:34+01:00'
draft: false
author: paranerd
---

WebSockets are a fascinating technology, a TCP-based network protocol that allows for asynchronous bi-directional communication. The client starts a connection, sends a request and gets a response – just like HTTP. But much unlike HTTP this connection is kept alive! This has many advantages, like

- Faster responses (no re-establishing connections)
- Less trafic (no overhead for HTTP-headers)
- Live updates (no periodic polling, but push notifications)

If you want to learn more about WebSockets, I recommend this [introduction](https://blog.teamtreehouse.com/an-introduction-to-websockets). In this post we’re focussing on utilizing WebSockets to build a simple chat application.

## Prerequisites

We’re building this project on top of the [Hello NodeJS Tutorial Series](/blog/hello-nodejs-installation), so we can focus exclusively on adding chat-functionality.

## Socket.IO

To make working with WebSockets a breeze, there’s a project called ‘socket.io’ that provides a convenient wrapper for it. And of course, there’s an npm package for it as well!

```bash { linenos=table }
npm install --save socket.io
```

While we’re at it, let’s also install another package that allows us to work with the express-session in the socket.io context:

```bash { linenos=table }
npm install express-socket.io-session
```

In `server.js` we tell the server that we would like to use those packages like so:

```js { linenos=table }
var io = require('socket.io')(http);
var ioSession = require("express-socket.io-session");
```

In order to have changes we make to the session in socket.io available in express-session as well, we need this piece of code:

```js { linenos=table }
io.use(ioSession(session, {
    autoSave:true
}));
```

## Listen And Emit

Now here is where the fun really kicks off:

```js { linenos=table }
io.on('connection', function(socket) {
    console.log(socket.handshake.session.username + " (" + socket.id + ") connected");

    // Tell everyone who joined
    socket.broadcast.emit('broadcast', socket.handshake.session.username + ' connected');

    // Greet new user
    socket.emit('system', 'hello ' + socket.handshake.session.username);

    socket.on('disconnect', function() {
        console.log(socket.handshake.session.username + ' disconnected');
        socket.broadcast.emit('broadcast', socket.handshake.session.username + ' disconnected');
        delete socket.handshake.session.username;
    });

    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', {username: socket.handshake.session.username, msg: msg});
    });
});
```

When socket.io detects a new connection, it executes this function. First it grabs the name of the currently logged in user from the session and writes it to console. It then sends a broadcast telling everyone about the new guy in town and greets the user itself. Using `socket.broadcast.emit` sends messages to everyone **BUT** the current user, while `socket.emit` sends messages to **ONLY** the current user. You can also send messages to **ALL** connected clients by calling `io.emit()`.

The first parameter can be considered the “group” of the message. This is so the receiver(s) can handle different groups differently (it gets clearer with the JavaScript implementation in a moment!). The second parameter is of course the message itself.

When the user disconnects, there’s a console entry again as well as a broadcast to inform all users (except the one disconnecting) about what’s happening.

Same behaviour on chat messages coming in: “Broadcast the message to all connected clients but the one sending it!”

Notice how socket.io is not just capable of transmitting plain text but also JSON-Objects. When the server receives a chat message, it manipulates the content by adding the sender’s username.

Let that sink in! If you’re like me and get confused about all this `broadcast.emit`, `socket.emit`, `io.emit` stuff, here’s a nice little [Cheatsheet](https://socket.io/docs/emit-cheatsheet/) from the official docs to help you!

## Adding A Route

Before we continue with the client-part of socket.io, let’s add a route for our chat! Remember: we manage our routes in the `controllers` folder. In there we add a file called `chat.js` and write the following to it:

```js { linenos=table }
var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res) {
    res.render('chat/index', {username: req.session.username});
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/user/login');
}

module.exports = router;
```

If you followed my [Hello NodeJS Tutorial](https://thegermancoder.com/blog/hello-nodejs-installation), this should look familiar. All we do is check if the user is logged in and if so, render the chat view. Of course, for this route to take effect, we have to add it to `controllers/index.js`:

```js { linenos=table }
router.use('/chat', require('./chat'));
```

And since we’re here, lets’s also redirect requests to the main page to the chat:

```js { linenos=table }
router.get('/', function(req, res) {
    res.redirect('/chat');
});
```

## Adding A View

After we’ve got our route installed, we need to make sure there’s actually content to be found there! For that we create a view for our chat. We do this by creating a folder `views/chat/` and a file `index.hbs` inside that folder with the following content:

```html { linenos=table }
<!DOCTYPE html>
<html>
<head>
    <title>Node chat</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css">
    <link rel="stylesheet" type="text/css" href="/css/design.css">
</head>
<body>
    <div class="center">
        <div id="chat">
            <ul id="messages"></ul>

            <form id="msg-form" action="">
                    <input id="msg" autocomplete="off" placeholder="Write message..."/>
                    <span id="send" class="fa-stack fa-1.5x">
                        <i class="fa fa-location-arrow"></i>
                    </span>
            </form>
        </div>
    </div>

    <div class="top-right">
        <span>Hello {{username}}!</span>
        <a href="/user/logout">(Logout)</a>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
    <script src="/js/chat.js"></script>
</body>
</html>
```

There’s nothing special in this markup, just a container for messages, an input box for adding new ones, a box to display the user’s name (we passed that in here using the render()-function in our chat-route) and a link to log out.

The styling for this page can be found in [`public/css/design.css`](https://github.com/paranerd/node-chat/blob/master/public/css/design.css). It’s quite long, so I won’t put it here as it would only distract from the essential code.

## Sending Messages

Remember the code block in `server.js` where messages were distributed by the server? Here comes the client part in `public/js/chat.js`! First, this is how we send messages:

```js { linenos=table }
$(function() {
    var socket = io();
    $('form').submit(function(){
        socket.emit('chat message', {username: username, msg: $('#msg').val()});
        addMessage($("#msg").val(), username, 'own');
        $('#msg').val('');
        return false;
    });
});
```

With the socket instance we emit messages (send to everyone but ourself).

Displaying the message in our chat-box is handled seperately in `addMessage()`

```js { linenos=table }
function addMessage(msg, username, type) {
    username = (type == 'own') ? "" : username;
    $("#messages").append($('<li class="' + type + '">').append($('<div>').append($('<span class="msg-user">').text(username)).append($('<span class="msg-text">').text(msg)).append($('<span class="msg-time">').text(getTime()))));
    $("#messages").animate({scrollTop: $("#messages").prop('scrollHeight')});
}

function getTime() {
    var d = new Date();
    return d.getHours() + ":" + d.getMinutes();
}
```

This basically just formats and adds the message to the chat-box.

## Receiving Messages

We don’t want to talk to ourselves, do we? So let’s see how we handle incoming messages:

```js { linenos=table }
socket.on('system', function (msg) {
    addMessage(msg, 'system');
});

socket.on('broadcast', function (msg) {
    addMessage(msg, 'broadcast');
});

socket.on('chat message', function(msg) {
    addMessage(msg);
});
```

This is, where the message “types” come into play. Depending on the type of the message we display them with different colors. Also, when the client receives a ‘chat message’ it expects a JSON-Object and extracts the actual message body and the sender’s username from it.

## Conclusion

There we go! A basic chat application using NodeJS and WebSockets with Socket.IO. Check out the [final project](https://github.com/paranerd/node-chat) on GitHub!
