---
title: 'Hello NodeJS | Mongoose'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

Using basic Mongo in our project is definitely doable but not very efficient in terms of maintainability. As you can see there's a lot of boilerplate code required for even basic tasks as checking for a user.

Mongoose is a wrapper for MongoDB that makes it a lot easier to handle database-queries

```bash { linenos=table }
npm install mongoose
```

Mongoose uses so-called models that act as middlemen between the application and the database. It adds a layer of abstraction so that we don't have to deal with database-queries throughout your entire code. Instead we choose the object-oriented-approach of using models and methods to make the code much more readable and maintainable.

First we need a connection to the Mongo-database. We establish that in `config/database.js`

```js { linenos=table }
var mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/node_tutorial`);
```

Link it to the `server.js` using this line:

```js { linenos=table }
var db = require('./config/database');
```

Next up is the model. Finally we're using that `models/` folder! We are creating a so-called 'schema' for users with only the most basic attributes of username and password each of type String. You can get as complex as you wish with this, have nested attributes and a whole lot of other types. Check out [the documentation](http://mongoosejs.com/docs/schematypes.html) for more information.

For the purpose of this tutorial these two attributes will suffice. The following piece of code goes in `models/user.js`

```js { linenos=table }
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a model from the schema and make it publicly available
module.exports = mongoose.model('users', UserSchema);
```

With this in place, checking if a user exists boils down to just the following (adjust the require-path according to the location of the script you put this in):

```js { linenos=table }
var User = require('./models/user');
User.findOne({ username: 'alice' }, function (err, user) {
  if (err) throw err;

  if (user) {
    console.log('user exists');
  } else {
    console.log('user does not exist');
  }
});
```

Much less code compared to the original approach in pure mongo, much more readable all most of all: you don't have to connect and disconnect to and from the database with every query.

### Custom methods

And the fun doesn't end there! The example above was pretty simple, but what if we would extend that to: 'Check, if the user exists - if not: create it!". While using mongoose will already greatly improve our code compared to pure mongo, it would still be a huge mess (especially if this action occurs more than once in our project).

**Custom methods to the rescue!**

In our schema we can add methods to encapsulate complex logic to avoid boilerplate-code even further. Let's modify our `models/user.js`

```js { linenos=table }
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
});

UserSchema.statics.findOrCreate = function (data, callback) {
  // We can't use 'this' inside the function, so create an alias
  var User = this;

  this.findOne(data, function (err, user) {
    if (err) throw err;

    if (!user) {
      // User does not exist - create it!
      user = new User(data);
      user.save();
    }

    // Return result
    callback(user);
  });
};

// Create a model based on the schema and make it publicly available
module.exports = mongoose.model('users', UserSchema);
```

Frankly, the `findOrCreate` is not that much code but it would still clutter our files if we were to use it in multiple places.

If we want to work with the result of this method, we must provide a callback-function because `findOne()` works asynchronously and returns 'undefined' immediately before processing.

We access this functionality by using merely three lines of code (plus whatever we want to do with the result):

```js { linenos=table }
var User = require('./models/user');

var alice = {
  firstName: 'Alice',
  lastName: 'Cooper',
  username: 'alice',
  password: 'secret',
};

User.findOrCreate(alice, function (user) {
  // This either returns an existing or a newly created 'alice'
  console.log(user);
});
```

**But wait! There's even more!**

Static methods (which we've used so far - hence the keyword 'statics') require you to add some sort of identification if you want to run actions on single users. There's a better way to handle this. Going OOP again, we give each \_\_instance\_\_ access to a dynamic method by using the... well... `methods` keyword:

```js { linenos=table }
UserSchema.methods.getFullName = function () {
  return this.firstName + ' ' + this.lastName;
};
```

Assuming we got a user in any way (like from the findOrCreate() used above), we can now do the following:

```js { linenos=table }
user.getFullName();
```

to get - you guessed it - Alice's full name.

Binding methods (static and dynamic) to a Mongoose-Model is a very powerful feature and provides us with the ability to write even better and cleaner code! Feel free to play around with it to get a feeling of just how powerful this is!
