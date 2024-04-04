---
title: 'Tailwind CSS – Just another Framework?'
date: '2020-10-01T08:01:34+01:00'
draft: false
author: paranerd
---

Using a CSS framework makes the life of a web developer a whole lot easier. There are a bunch of them out there, most of you probably know about Twitter’s Bootstrap, which I’ve been using for the past decade or so. But there’s a new kid on the block: Tailwind CSS.

## What is Tailwind CSS

Tailwind CSS is a CSS framework like many other but also totally different. It made its debut about 3 years ago, while reaching stable 1.0 only a year ago. To learn more about what it is and how to use it you should definitely check out their [website](https://tailwindcss.com/#what-is-tailwind) as well as their amazingly crafted [documentation](https://tailwindcss.com/docs).

## Do we need yet another framework?

What makes Tailwind unique to me is that it’s super unopinionated. For example: if you wanted to style a button with Bootstrap, you would apply `.btn` classes of various sorts to your `<button>` and Bootstrap would do the rest for you. No real knowledge of CSS is required here. This makes it extremely easy to get your page up and running in no time. One big disadvantage of doing things this way is the fact that you can spot pages based on Bootstrap very easily as they all kind of look alike.

Tailwind CSS takes a different approach: To style your button, you actually need a good understanding of CSS. There are no `.btn` classes. Tailwind simply provides class shortcuts to CSS styles, so instead of doing `el { width: 100% }` you would apply a class `.w-full` for example. Instead of `el { display: flex }` just use `.flex`.

The real power of Tailwind, at least in my opinion, comes from combining those convenient classes with responsive modifiers. You may use `.w-full lg:w-1/2` rendering the element full width on small devices but only 50% width on large devices and up. No need to write tedious media queries on your own.

## Conclusion

Tailwind CSS is an amazing framework well worth a try. I’ve built a [To-Do List](https://github.com/paranerd/to-do-list) app based on it. Check out their comprehensive [documentation](https://tailwindcss.com/docs) to learn more. What do you think of Tailwind CSS? Did you try it? Do you actively use it? Or do you go pure CSS without the need of any framework whatsoever? Let me know in the comments!
