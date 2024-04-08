---
title: 'Hello NodeJS | Templates'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

So far our pages have been very static, meaning we just deliver HTML without any dynamic content whatsoever. What we need is an easy way for our server to send data to the client. This is where templates come in.

There are many template engines available. Some of the more popular ones are:

- [Handlebars](https://handlebarsjs.com/)
- [Pug (Jade)](https://pugjs.org/api/getting-started.html)
- [EJS](https://www.npmjs.com/package/ejs)
- [Dust](http://www.dustjs.com/)

Since I found handlebars to be the most comprehensible and easiest for a beginner to understand, we will use it in this tutorial. Feel free to check out the others to find the engine that works best for you.

As almost always with new features, we first install a package:

```bash { linenos=table }
npm install express-hbs
```

We then tell our `server.js` that we want to use this package

```js { linenos=table }
var hbs = require('express-hbs');
```

For it to be working properly, we need to add some more details:

```js { linenos=table }
// Create a handlebars-instance
app.engine('hbs', hbs.express4({ extname: '.hbs' }));
// Set it to be the view (template) engine
app.set('view engine', 'hbs');
// Tell it where our views are located
app.set('views', __dirname + '/views');
```

The default extension for handlebars-files is '.handlebars'. That's pretty verbose, so we change that and tell the engine to look for files ending with '.hbs' instead. Not mandatory at all, but a little easier on the eyes.

### Templates in action

For our template engine to recognize our view files as such we first need to rename them according to our chosen extension:

- `views/main/index.html` -> `views/main/index.hbs`

- `views/user/login.html` -> `views/user/login.hbs`

One great thing about handlebars over the also very popular pug - at least in my opinion - is that it doesn't require rewriting HTML-markup. So we basically use standard HTML and add pieces handlebars in some places making it easily readable even for other developers not familiar with handlebars.

To use handlebars to display a view we need to modify our routing.

First in `controllers/index.js`

```js { linenos=table }
router.get('/', function (req, res) {
  res.render('main/index', { greeting: 'Hello Again!' });
});
```

We're replacing 'sendFile' with 'render'. While their syntaxes look very alike, they're behaving quite differently.

Most noticably we don't specify the parent-folder of our view as 'root' in the curly brackets anymore. Instead we defined the root to **all** our views in the `server.js` and are passing the relative path to our view based on that root as the first parameter to 'render()'.

The second parameter is where the actual magic happens. Here we're passing a variable 'greeting' with its value to be used in our HTML

Changes in `controllers/user.js` accordingly:

```js { linenos=table }
router.get('/login', function (req, res) {
  res.render('user/login', {});
});
```

We're not providing any variables here, to we leave the curly brackets empty.

Refreshing the browser on [localhost:8080](localhost:8080) won't show any differences because it doesn't use the passed variable yet. To change that, let's modify our `<body>`-section in `views/main/index.hbs`:

```html { linenos=table }
<body>
  <h1>Hello World!</h1>
  <h2>{{greeting}}</h2>
</body>
```

The double curly braces (which look like the handlebars of a motorbike tilted 90 degrees - hence the name) are handlebars-syntax. It tells the template engine to replace this part with the value of the variable passed we passed it. If we wouldn't have passed this variable, handlebars would replace it with an empty string.

There's more to learn about handlebars that would be beyond the scope of this NodeJS-Tutorial. If you're interested, check out [the projects homepage](https://handlebarsjs.com/) for more information.
