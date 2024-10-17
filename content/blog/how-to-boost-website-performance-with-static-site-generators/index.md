---
title: 'How to boost website performance with Static Site Generators'
date: '2024-10-17'
author: paranerd
categories:
  - 'general'
---

Maybe you can relate to the following scenario:

You are a web developer and want to set up a simple web page, perhaps a blog, a portfolio site or really anything else that is mostly static content. You look around to find a suitable way for setting it up. Being a web developer you could of course fire up a Next.js stack and build everything from scratch but since you don't want to do anything fancy this soon seems like a lot of overkill.

You keep searching and find some hosted website builders that you would have to pay for but you don't want that. And then it hits you: Why not just use WordPress? It's very common, battle tested and easy to use. But you would still need some place to host it. You remember the server you have laying in your closet and figure that this would make for a great self-hosting project.

After setting up an OS, installing Docker and running WordPress in a container you set everything up and build the site. You are happy with your work, lean back, enjoying the warm fuzzy feeling of being done... But then it hits you: You are never really going to be done with this project!

What about updates? What about backups? Or disaster recovery? Maintaining the operating system and the server itself? Not to mention setting up a reverse proxy the make the site public in the first place. It starting to get overwhelming and you wonder if you should ditch it all and just pay for one of the hosted solutions instead.

But wait! I think there may be a better solution! A solution that comes with implicit backup and the ability to rollback easily in case someting went wrong. One that is more flexible than any of the builders, yet not as tedious as starting from scratch with something like Next.js. A solution that is pretty much unbeatable when it comes to performance and security.

Enter: The JAMStack and Static Site Generators!

### What is the JAMStack?

As a developer you may know about the LAMP Stack (Linux, Apache, MySQL and PHP) - which is actually how I started as a Full Stack Developer. I then switched over to the MEAN Stack (MongoDB, Express, Angular, Node) while many may prefer the MERN Stack (using React instead of Angular).

Every one of those stacks work just fine and they all come with their own pros and cons, so there's no right or wrong here, only options.

The term "JAMStack" was first coined by Matt Biilmann in 2015. JAM stands for: JavaScript, APIs and Markdown. Typically you would add some HTML and CSS but that's not strictly necessary.

### What is a Static Site Generator?

A static site generator (SSG) is a tool that generates a full static HTML website based on raw data and a set of templates. Essentially you build your HTML, CSS and JavaScript once, add some content in the form of Markdown files and let the SSG handle all the building, rendering and routing.

There are many different flavors of SSGs. From those that I would call "strictly static" which are easy to set up but don't support the concept of dynamic content at all to those providing all the dynamic-ness (is that a word?) you could ask for but come with some more complexity. There are also some focused on a specific use case, like documentation.

All those flavors have at least one thing in common though: They take your code and content, bundle it up and serve it as a static website

### Advantages of Static Site Generators

1. **Backups and Disaster Recovery**

The way you deploy a Static Site usually involves a Git-based backend on top of which you would have a runner/worker build the site on commit and then serve it via GitHub Pages, Cloudflare Pages or the like. The code for this very website, for example, sits in a GitHub repository monitored by Cloudflare Pages to build and serve.

The very nature of Git (and GitHub for that matter) provide you not only with an implicit backup but also the ability to do rollbacks or disaster recovery with little to no effort.

You may, of course, want to back up your GitHub repos to another location, but that's a whole other topic entirely.

2. **Performance**

Performance benefits come in two ways: Firstly, deploying a Static Site with a service like GitHub Pages or Cloudflare Pages will give it a huge boost in performance. Those platforms are used to handling huge loads worldwide to millions and millions of users. To achieve that they have edge locations all around the globe. Not only are their servers probably much more powerful than your self-hosted machine but they are very likely also a lot closer to the end-user than you.

The difference may not be as drastic when you compare it with a hosting provider instead of self-hosted but I assume it will still be very much noticable.

The second way SSGs improve page speed lies again in the fact that they are bundled, mostly self-contained packages. There is no overhead talking to a backend, no lag querying a database and no slow-down from any unnecessary convenience libraries. In the very extreme a Static Site is just an index.html displaying "Hello, World!" on the screen. Try doing that with a WordPress installation. You're not even close in a speed comparison.

To really get my point across, here are my Lighthouse scores of this website both from when I self-hosted it as a WordPress page

![Lighthouse Scores before](lighthouse-scores-before.png 'Lighthouse Scores before')

and now using Hugo on Cloudflare Pages

![Lighthouse Scores after](lighthouse-scores-before.png 'Lighthouse Scores after')

3. **Security**

There's not much to say about security, really. The fact that you don't need a database to run a Static Site and that you don't have an actual backend  already takes away the vast majority of security concerns. No SQL-injections, no XSS-attacks, no server breaches.

Keep in mind, though, that when making use of external APIs, some of those concerns may come back but still they're out of scope for the SSG itself.

4. **Maintenance**

... or rather: the lack thereof, because as already mentioned: no database, no backend server. The only maintenance you may want to do is the occasional version update of the Generator itself. Other than that it's a real breeze.

5. Cost Savings

GitHub: free

GitHub Pages / Cloudflare Pages: also free

Enough said.

### Disadvantages of Static Site Generators

1. **Ease of use**

I started this post with "You are a web developer..." and that's for a reason. Using an SSG will probably almost never be as easy to use as a drag-and-drop website builder or even WordPress, which has its own complexities.

Once you have the site itself built, adding more content is smooth sailing but to get there you'll need to bring some frontend developer skills.

2. **Plugins / Extensibility**

Coming from the WordPress universe where it only takes a couple of clicks to add more functionality to your website it's going to be a shock entering the world of SSGs. There is no dashboard, no curated catalog of extensions, no click-and-deploy way of doing things. It's all just code, for better and for worse.

### Some Examples

I mentioned in the beginning that there are lots of flavors to choose from when it comes to Static Site Generators. Here is a (very short) list of some that I checked out on my journey

1. **Hugo**

Hugo is one of the "strictly static" variants. While you can call APIs at build time to get some dynamic data added to your site it is more or less static from that point onwards. You're obviously free to call any external APIs using JavaScript at any time.

This is the one I prefer because it's straight forward, simple and very easy to use once you understand the underlying concepts. One of the more difficult tasks was to get a hold of the Go templating syntax. It took a while but by now I feel quite confident working with it.

2. **Astro**

Astro kind of covers the middle ground here because it is mostly static but on top of that comes with components and partially hydrated content. What's more is that you can use your favorite frontend framework like Vue, React, Svelte and more - or even a mixture of them.

Unlike Hugo, Astro is based on JavaScript which may make it more suitable for any frontend developer

3. **Next.js**

Next.js is a full-blown alternative to the first two. It's not strictly an SSG at all and normally doesn't work with Markdown files but provides enough flexibility to be made into one and parse Markdown to your liking.

However the flexibility, as it so often is, comes at the price of complexity. Things that work out-of-the-box in Hugo (like content parsing) require lots more work in Next.js. If you're not a Next.js developer already and all you want is a simple blog this may be overkill.

4. **MkDocs**

MkDocs is one of the more specialized flavors. While you can basically build any type of website with it, as the name suggests it is aimed at hosting documentation pages.

From a complexity perspective this is even easier to get into than all the other ones. Their own documentation is on point, getting started was as smooth as it could have been.

### Conclusion

If you're tired of overly complex setups for what is supposed to be just a simple web page, you're looking for unrivaled speed and security or you're just curious to try out something new: Static Site Generators may just be what you're looking for!
