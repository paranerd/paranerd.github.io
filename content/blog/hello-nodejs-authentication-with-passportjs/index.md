---
title: 'Hello NodeJS | Authentication with PassportJS'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'html'
  - 'javascript'
---

The so-called 'Login-System' that we put up so far isn't quite... secure, to say the least. The way it is currently implemented, anyone could come by, 'login' and have an account created. Let's toughen that up and replace it with some proper authentication mechanisms.

First things first - we need more packages!

```js { linenos=table }
npm install passport passport-local bcrypt-nodejs connect-flash
```

We use passport, because it provides an easy to use **and** secure way to add authentication to ExpressJS.

Bcrypt is the recommended hashing algorithm for storing passwords. Sticking with standards is always wise when it comes to crypto.

Connect-flash lets us generate (error-)messages, store them in session and have them automatically deleted after they've been displayed to the user.

### Secure hashing

To be able to generate and validate secure passwords from within our user-model, we edit our `models/user.js`:

```js { linenos=table }
var bcrypt = require('bcrypt-nodejs');

// Generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
```

All we did was providing an interface to methods of the bcrypt-package. Using `hashSync` we get a securely generated and salted password-hash to store in the database. The `compareSync` checks if the hash calculated from a given password matches the one stored for the user.

### Strategies

To use passport, we need to setup a config first. Our database-config gets some company by the `config/passport.js`:

```js { linenos=table }
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
  // Serialize the user for the session
  passport.serializeUser(function (user, done) {
    // What should be saved in session (the ID in this case)
    done(null, user.id);
  });

  // Deserialize the user
  passport.deserializeUser(function (id, done) {
    // Get the user-object by using the ID in the session-store
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Define the registration-strategy
  passport.use(
    'register',
    new LocalStrategy(
      {
        // Allow passing back the request to the callback
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        // Check if user exists
        User.findOne({ username: username }, function (err, user) {
          if (err) return done(err);

          // If it does, return an error message
          if (user) {
            return done(
              null,
              false,
              req.flash('signupMessage', 'Username already exists.')
            );
          } else {
            // Create user
            var newUser = new User();

            // Set credentials
            newUser.username = username;
            newUser.password = newUser.generateHash(password);

            req.session.username = username;

            // Save user
            newUser.save(function (err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      }
    )
  );

  // Define the login-strategy
  passport.use(
    'login',
    new LocalStrategy(
      {
        // Allow passing back the request to the callback
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          // Return errors if any
          if (err) return done(err);

          // If no user was found or the password is incorrect, return an error message
          if (!(user && user.validPassword(password)))
            return done(
              null,
              false,
              req.flash('loginMessage', 'Invalid credentials.')
            );

          // Successful login
          req.session.username = username;
          return done(null, user);
        });
      }
    )
  );
};
```

Now THAT's a lot of code! Let's break it down:

**Serializing** usually means converting an object into a byte stream to store it or save it to memory, database, etc. In passport serializing the user means saving a reference to the user (e.g. the ID) in session-store. When **deserializing**, we use that stored ID to retrieve the user from the database. So `id` in `deserializeUser` refers to `user.id` in `serializeUser`.

PassportJS uses its own session-store independent from the express-session we already implemented, so we can use both at the same time.

Next up we define our **registration-strategy**. First parameter is the name of the strategy so we can refer to it in other parts of the code. The `passReqToCallback` parameter enables passing the request-object in the following callback-function so we can access it in there. We're not using this feature in this tutorial but it might come in handy in the future, so we'll just leave it here.

Most of code in the actual strategy should look familiar by now, because it's basically an extended version of our `findOrCreate()`. In case the username already exists, we create a flash-message named `signupMessage` in session using `req.flash`. If not, we generate a secure password-hash using our newly implemented `generateHash` function and save the user to the database.

The **login-strategy** follows the same general structure as the registration-strategy. We're trying to find the user in the database by username. If it exists and the provided password is valid, the login is successful. Otherwise store an error message called `loginMessage` to be displayed to the user.

Notice: in a lot of other tutorials you will see the use of `process.nextTick()`. This is only to demonstrate that asynchronous authentication is possible with passport. It is by no means required, so we'll just leave it out.

With `req.session.username = username` in both strategies we're making the current username available in session for future use.

### Telling the server

Now that we've configured passport, we tell our `server.js` that we want to use it:

```js { linenos=table }
var flash = require('connect-flash');
var passport = require('passport');

// Setup passport (after calling 'app.use(session);'!)
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
```

We include the two packages, then setup passport and tell expressJS to use both of them. It's crucial to use the passport-session **after** using the express-session to have it working properly.

### New routes!

In our `controllers/user.js` we also include passport and replace the existing rules with the following:

```js { linenos=table }
var passport = require('passport');

router.get('/register', function (req, res) {
  res.render('user/register', { message: req.flash('signupMessage') });
});

router.post(
  '/register',
  passport.authenticate('register', {
    successRedirect: '/chat',
    failureRedirect: 'register',
    failureFlash: true,
  })
);

router.get('/login', function (req, res) {
  res.render('user/login', { message: req.flash('loginMessage') });
});

router.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/chat',
    failureRedirect: '/user/login',
    failureFlash: true,
  })
);

router.get('/logout', function (req, res) {
  // This is a built-in function from passportJS
  req.logout();
  res.redirect('/user/login');
});
```

In the GET-routes for login and register we get the respective messages stored via the passport-config and pass it to the template.

Handling POST-requests for login and register is mostly left to our passport-strategies. In here we just define where to go on success or failure.

### Actually checking for authentication

Restricting access to a page is implemented by adding an authentication-check to that specific route. Here's how that looks in the `controllers/user.js`:

```js { linenos=table }
router.get('/', isLoggedIn, function (req, res) {
  res.render('user/index');
});
```

We don't have an index-page for the user just yet, but we'll get to that in a bit!

The `isLoggedIn()` will be called **before** the callback. We'll also put it in the `controllers/user.js`:

```js { linenos=table }
// Check if user is logged in
function isLoggedIn(req, res, next) {
  // Another passport-method
  if (req.isAuthenticated()) {
    // User is logged in. Continue!
    return next();
  }

  // User is not logged in. Redirect to login!
  res.redirect('/user/login');
}
```

This is more or less our gatekeeper. It does what the name suggests: checking if a user is currently logged in. If not, it will redirect the request to the login-page.

### The layout

We already have a template for our login-page att `views/user/login.hbs` but we'll tweak it a little:

```js { linenos=table }
<!-- head, heading, etc. -->
{{#if message}}
    <div>Error: {{message}}</div>
{{/if}}
<!-- login-form-->
<a href="/user/register">Signup here</a>
```

It checks if it has been passed a message and, if so, displays it. This is using handlebars-syntax; the div will only show up in the rendered markup if a message is provided. We also added a handy link to the registration-form.

What registration-form, you ask? Well, this one right here in `views/user/register.hbs`:

```html { linenos=table }
<!DOCTYPE html>
<head>
    <title>Register | My first NodeJS-App</title>
</head>
<body>
    <h1>Register</h1>
    {{#if message}}
        <div>Error: {{message}}</div>
    {{/if}}

    <form action="register" method="post">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">

        <button type="submit">Register</button>
    </form>
</body>
</html>
```

The part where we're displaying error-messages is handlebars-syntax. The div will only show up in the rendered markup if a message is provided.

To showcase a private page we setup a basic `views/user/index.hbs` that will only be displayed if the user is logged in (otherwise our controller will redirect the request to the login-page).

```js { linenos=table }
<!DOCTYPE html>
<head>
    <title>Register | My first NodeJS-App</title>
</head>
<body>
    <h1>You are logged in</h1>
</body>
</html>
```
