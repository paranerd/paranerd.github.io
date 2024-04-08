---
title: 'Hello NodeJS | The Package Manager'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

With the installation of the nodejs-package also came a tool called 'npm' (Node Package Manager). We will be using this quite a bit when developing for NodeJS. For a start it helps us setting up our project properly.

Now we can let the npm-magic happen:

```bash { linenos=table }
npm init
```

This will ask you for a couple of things. You should at least enter your project's name, the current version and your name as the author. Setting the **entry point** to `server.js` helps anyone working with your project to have this information easily accessible without having to search through all your files. The rest of the fields can be left blank for now.

When finished we will end up with a `package.json` in our project-root based on our inputs. Let's have a closer look into that.

Opening the `package.json` you will see something similar to this:

```json { linenos=table }
{
  "name": "node_tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "paranerd",
  "license": "ISC"
}
```

Never mind that 'Error'-part in the 'scripts'-section. You could replace it with your own command to run tests on your project. We don't have those right now, so we'll just ignore it.

### Installing packages

Apart from setting up a project, npm (as the name suggests) is mostly used for managing packages. To demonstrate, let's install nodemon:

```bash { linenos=table }
npm install nodemon
```

Nodemon is a really helpful tool for developing in NodeJS. Normally, when changing something in your code, you would have to kill and restart node for the changes to apply. Doesn't sound like a lot of effort, but trust me, it adds up and gets really annoying really fast. Similarly when you have a bug in your code (which will happen A LOT), node would just crash and you'll have to manually restart it.

Nodemon takes this burden off your chest. It monitors your files and automatically restarts the server on changes. When it encounters a bug, it goes into halt, waits for you to update the file and tries again.

Running the command will create a folder `node_modules/` in our project-root and install nodemon there.

Checking your `package.json` you can see that there is a new section 'dependencies' looking something like:

```json { linenos=table }
{
  "dependencies": {
    "nodemon": "^1.18.3"
  }
}
```

By default npm adds every package you install to that section. This is especially great when working with lots of packages. The `node_modules/` folder can get quite big and you don't necessarily want it in your backup, your version management or have to move it around to everyone that wants a copy of your code.

With the `package.json` in place you can omit the `node_modules/` entirely and a simple call to

```bash { linenos=table }
npm install
```

will automatically re-install all dependencies for you. Give it a try: remove `node_modules/`, run the install-command and watch the folder and its contents magically re-appear!

### Setting a startup script

Having nodemon installed we can tweak our `packages.json` a bit:

```json { linenos=table }
{
  "scripts": {
    "start": "nodemon server.js"
  }
}
```

Now when anyone calls

```bash { linenos=table }
npm start
```

from within your project-folder, it starts the server without them having to figure out its entry point.

There is so much more npm is capable of, but diving into all of it would be beyond the scope of this tutorial. For anyone who's interested, check out their [documentation](https://docs.npmjs.com).
