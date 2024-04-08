---
title: 'Hello NodeJS | Adding CSS And JavaScript'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

Even if our HTML-Hello-World is very cool, it does still look a little boring. Time to add some styling!

In our `public/` folder we first add subfolder called `css/`. In there we create a file `design.css` with the following content:

```js { linenos=table }
h1 {
    color: red;
}
```

We reference this file in our `views/index.html` as we normally would:

```js { linenos=table }
<head>
    <link rel="stylesheet" type="text/css" href="/css/design.css">
</head>
```

In a vanilla HTML-Appliction this would do, but in NodeJS we still have to tell express where to look for our public assets. To do this we add this to our `server.js` somewhere between the variable declarations and the server startup

```js { linenos=table }
app.use(express.static(__dirname + '/public'));
```

`__dirname` is a NodeJS-variable that gives us the absolute path of the parent-directory of the file it is called in (meaning its value is different depending on the file). Not hardcoding the path to our project allows it to be portable between different systems.

Start the server, fire up the browser and look at this magnificent red!

Now that express already knows where our public files are, including JavaScript in our `index.html` is very easy. For the sake of a clear structure I recommend putting your JavaScript-files into a designated folder as well. Create a file `main.js` inside the to-be-created folder `public/js/`:

```js { linenos=table }
alert('I. Am. JavaScript!');
```

Reference it in the `index.html`:

```js { linenos=table }
<body>
    <!-- All other code -->
    <script src="js/main.js" type="text/javascript"></script>
</body>
```

You might want to disable the alert after you checked that it actually works, because it would be rather annoying to have this popping up throughout the rest of this tutorial.

Since the scope of this tutorial is NodeJS, we won't be covering CSS or (client-side) JavaScript more than necessary. I will leave it to you to get crazy with awesome designs and amazing functions.
