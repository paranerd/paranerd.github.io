---
title: 'Hello NodeJS | Basic Routing'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

So far we've only set up a single landing page. In some cases this is sufficient, but usually you might want to have other pages on your website as well. To demonstrate how this works with Node and Express, we will prepare a nice little login form.

For that we need a file `views/login.html` with the following content:

```js { linenos=table }
<!DOCTYPE html>
<head>
    <title>Login | My first NodeJS-App</title>
</head>
<body>
    <h1>Login</h1>
    <form action="login" method="post">
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button>Login</button>
    </form>
</body>
</html>
```

Only basic HTML there. We have a form containing two input fields named 'username' and 'password'. Clicking 'Login' will not result in anything right now, because our server doesn't know how to handle it yet. This chapter focusses on displaying, we'll add functionality in the next one.

Despite the `login.html` being in the same directory as the `index.html`, express wouldn't know what to do with it, so we need to tell it. For that we add another routing-rule after the one handling requests to '/':

```js { linenos=table }
app.get('/login', function (req, res) {
  res.sendFile('login.html', { root: 'views' });
});
```

Fairly straight forward compared to the other rule. This one listens to localhost:8080/login and returns our `views/login.html` upon request. Try it - go to [localhost:8080/login](localhost:8080/login) and check out our new login-form! Not very pretty, but functional - and since you already know how to add styling to your page, knock yourselves out and make this the best-looking login-screen the world has ever seen! You can also play around and add more HTMLs and more routes - you'll see that it's not all that complicated to add new pages.

Just as a sidenote: while adding all your routes to the `server.js` works perfectly well for small pages with only a couple of routes, things get messy very quickly when your site starts to grow. For now we can work with this approach, but I will show you a better way of organizing our routes in a later chapter.
