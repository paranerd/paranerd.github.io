---
title: 'Hello NodeJS | Working With HTML'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

So far we only sent plain text to the browser. Already kind of exciting but we want to be able to serve really cool HTML, don't we?! Let's go do that right now!

In our `views/` directory we add a file called `index.html`:

```html { linenos=table }
<!DOCTYPE html>
<head>
    <title>My first NodeJS-App</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
```

Now we modify our `server.js` and replace the old routing with this one:

```js { linenos=table }
app.get('/', function (req, res) {
  // This time don't send plain text, but this file
  res.sendFile('index.html', { root: 'views' });
});
```

This tells the express-server: "If a visitor comes to our website, show him the `index.html` from folder `views/`"

Check it out yourself on [localhost:8080](localhost:8080)!

We are greeted with a nice "Hello World!" again but this time it's not plain text but some really cool HTML \\\*wooow\\\* To make this even more amazing, let's go ahead and add some design to our page!
