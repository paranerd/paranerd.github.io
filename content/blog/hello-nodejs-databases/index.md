---
title: 'Hello NodeJS | Databases'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

### Quick introduction to MongoDB

MongoDB is a so-called NoSQL-Database (in contrast to SQL-Databases like MySQL). Unlike traditional databases these don't require fixed table relations or a pre-defined schema which makes them more flexible to work with. While NoSQL is not out there to replace SQL there are use cases where they're better suited for the job. Using MongoDB with NodeJS is great because it works extremely well with JavaScript. Entries in a MongoDB-Database are called 'documents' which are JSON-Objects in binary form (called BSON). This makes exchanging data between code and database almost seemless. A document to store a user might look like this:

```json { linenos=table }
{
  "username": "John",
  "password": "a789dbe97890ffc"
}
```

Documents are grouped in collections, so we can have a collection 'users' containing all the... well... users^^ The flexible, schema-less nature of MongoDB enables us to simply add another attribute (e.g. 'interests') to one document without affecting all other documents. In MySQL this would require a migration and potential downtime of the entire database. In MongoDB it's perfectly okay for documents to have a varying set of attributes, which is just not possible in MySQL.

MongoDB allows for easier mapping of real world objects to a database-entry because related information is stored together, which is especially great for object oriented programming:

```json { linenos=table }
{
  "username": "John",
  "password": "a789dbe97890ffc",
  "address": {
    "street": "5th Ave",
    "number": 350,
    "zip": "NY 10118"
  },
  "interests": ["reading", "biking", "hiking"]
}
```

For a more in-depth introduction to MongoDB as well as a comparison between MongoDB and MySQL, check out [this great article](https://www.mongodb.com/compare/mongodb-mysql)!

### Setting up MongoDB

First we need the linux-packages

```bash { linenos=table }
sudo apt install mongodb mongodb-clients
```

This will install the MongoDB-Server as well as a client to be able to check our database from the command line

Then we start the server

```bash { linenos=table }
sudo service mongodb start
```

Install the node-package

```bash { linenos=table }
npm install mongodb
```

### Using MongoDB

```js { linenos=table }
// Include the mongodb-package
var mongo = require('mongodb').MongoClient;

// Connect to the mongodb-server that listens on port 27017
var mongoUrl = 'mongodb://localhost:27017';

mongo.connect(mongoUrl, function (err, db) {
  // Throw an error if something went wrong
  if (err) throw err;

  // Otherwise we're good
  console.log('MongoDB connected');

  // Use the database 'node_tutorial'
  // It doesn't exist yet, but don't worry, mongodb automatically creates it for us
  var dbo = db.db('node_tutorial');

  // Create a new user
  var user = {
    username: 'John',
    password: 'a789dbe97890ffc',
  };

  // Insert it into the collection 'users' (mongodb creates this on the fly as well)
  dbo.collection('users').insertOne(user, function (err, res) {
    if (err) throw err;

    console.log('inserted');
  });

  // Close the database-connection
  db.close();
});
```

Seems like a lot of code, but it's not that complicated. This is a good example of MongoDB integrating well with JavaScript. Passing a JSON-object that JavaScript understands to the database is just super easy.

Querying documents is not exactly rocketscience either:

```js { linenos=table }
// Give me all the users with username 'John'
dbo.collection('users').find({username: 'John'}}, function(err, res) {
    if (err) throw err;

    if (res) {
        console.log("User exists");
    }
    else {
        console.log("User does not exist");
    }
});
db.close();
```

Aside from code it's sometimes nice to have some sort of 'direct' access to our database, e.g. for degugging. To do this, we open another terminal window and connect to the MongoDB-Server

```bash { linenos=table }
mongo
```

We tell the server that we want to access our 'node_tutorial' database

```bash { linenos=table }
use node_tutorial
```

Inside this database we can now more or less use the same command that we used in JavaScript to get our newly inserted user:

```js { linenos=table }
db.users.find({ username: 'John' });
```

For more information about querying MongoDB, check out [the documentation](https://docs.mongodb.com/manual/crud/)

If you're coming from a MySQL background, you will find this [mapping of SQL-commands to MongoDB](https://docs.mongodb.com/manual/reference/sql-comparison/) to be helpful.

We've covered the most basic way NodeJS can communicate with MongoDB and it works perfectly fine. But as it can get a little verbose and we love clean code, we choose to do it slightly different...
