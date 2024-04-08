---
title: 'Hello NodeJS | Installation'
date: '2018-09-17'
categories:
  - 'hello-world'
  - 'javascript'
coverImage: 'nodejs.png'
---

Welcome to this introduction to NodeJS! In the following chapters I covered all the basics you need to get started in development for NodeJS. I tried to be as precise as possible, leaving out all the cluttering bells and whistles in an attempt to give you a clear view of only the important parts.

Here's what you're up for:

1. [Installation](/blog/2018/09/17/hello-nodejs-installation/)
2. [Hello World](/blog/2018/09/17/hello-nodejs-hello-world/)
3. [The Package Manager](/blog/2018/09/17/hello-nodejs-the-package-manager/)
4. [Hello World - The Next Level](/blog/2018/09/17/hello-nodejs-hello-world-the-next-level/)
5. [Project Structure](/blog/2018/09/17/hello-nodejs-project-structure/)
6. [Working With HTML](/blog/2018/09/17/hello-nodejs-working-with-html/)
7. [Adding CSS and JavaScript](/blog/2018/09/17/hello-nodejs-adding-css-and-javascript/)
8. [Basic Routing](/blog/2018/09/17/hello-nodejs-basic-routing/)
9. [User Input](/blog/2018/09/17/hello-nodejs-user-input/)
10. [Advanced Routing](/blog/2018/09/17/hello-nodejs-advanced-routing/)
11. [Controllers](/blog/2018/09/17/hello-nodejs-controllers/)
12. [Organizing Views](/blog/2018/09/17/hello-nodejs-organizing-views/)
13. [Templates](/blog/2018/09/17/hello-nodejs-templates/)
14. [Sessions](/blog/2018/09/17/hello-nodejs-sessions/)
15. [Databases](/blog/2018/09/17/hello-nodejs-databases/)
16. [Mongoose](/blog/2018/09/17/hello-nodejs-mongoose/)
17. [Authentication With PassportJS](/blog/2018/09/17/hello-nodejs-authentication-with-passportjs/)
18. [Conclusion](/blog/2018/09/17/hello-nodejs-conclusion/)

Let's start at the beginning: Installing NodeJS on our system (I'm working with Ubuntu here, commands might differ depending on your distribution). Since the package in the official repository isn't always up-to-date, we have to get the latest version using this command:

```bash { linenos=table }
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```

This will install the current version:

```bash { linenos=table }
sudo apt-get install -y nodejs
```

Now we need a folder to give our project a home. You can obviously call it whatever you like, I will be using `node_tutorial`

```bash { linenos=table }
mkdir node_tutorial
```
