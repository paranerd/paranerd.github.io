---
title: 'Hello NodeJS | Project Structure'
date: '2018-09-17'
author: paranerd
categories:
  - 'hello-world'
  - 'javascript'
---

Before we go any further, let's have a quick look into the general structure of a NodeJS-Project. When you search the web for suggestions on that, you will be flooded with a miriad of opinions on what's the best way to organize your code. To be honest, I don't claim perfection for my approach. I simply took the best out of all that I could find on this topic and what I came up with works great for me. So in the end you're getting just another opinion here^^. Feel free to go out there and find your own way - just make sure that you actually DO have any sort of organization in your project and don't just throw everything in one folder.

For the sake of this tutorial, we'll be using the following structure:

```bash { linenos=table }
project/
|-- config/
|-- controllers/
|-- models/
|-- public/
|-- views/
|-- package.json
|-- server.js
```

Let me explain...

### config/

As the name suggests, this is where all your configuration files go, for example database-credentials, access-tokens and the like. It's great to have all these in one place and not scattered all over the place.

### controllers/

We will cover controllers in another chapter, so just the basics at this point. Controllers are a great way to handle the routing of your site. They may seem overkill on very small applications but trust me, you're going to love them once you've got more than a handful of routes to take care of. I suggest you use them no matter the size of your project. That way all your projects are going to have the same 'skeleton' which helps tremendously when maintaining. Besides it's a real pain to rework your previously tiny no-structure project into a structured one because you lost track of all your files when that sneaky little app quietly grew bigger. But again: more on all of that in its own chapter.

### models/

Some more slightly more advanced stuff in here. Models provide a layer of abstraction between your code and the database. They make sure you don't have to mess around with database-specific stuff. That gives you some freedom in choosing your database and keeps your code clean. We will be covering this in a dedicated chapter as well.

### public/

This is where all your CSS, JavaScript, images and all the other static assets live. It's called 'public' because the files in there usually require to be directly publicly available (as compared to the code in your models, that you might want to keep private).

### views/

If you're not completely new to web development, you might have noticed: we're working with an MVC-Framework here. M for Model, C for Controller and V for... you guessed it: View. Views are basically your HTMLs (or templates, but we'll get to that later).

### package.json

Very important file, especially when it comes to working in a team or when publishing your code. We will be covering this in more detail in its own chapter (that's just how important it is!). Basically this file holds some general information about your project, such as its name, the current version, a description, the developers name. In addition (and perhaps more important) it contains details about the packages your project depends on. With this setup other developers don't have to manually figure out what to install but can instead simply use a tool called 'npm' to do this automatically. More on that in a dedicated chapter.

### server.js

This is the starting point of your application. It's what you call when you fire up your server (hence the name^^) and it acts as a root that connects all the other pieces.
