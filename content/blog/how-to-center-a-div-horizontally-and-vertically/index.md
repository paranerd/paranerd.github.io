---
title: 'How To Center A DIV horizontally and vertically'
date: '2018-09-25'
author: paranerd
categories:
  - 'css'
  - 'how-to'
  - 'html'
---

When searching the web for ways to center a DIV I found a ton of suggestions. Many kind of solved one problem but at the same time introduced others, some made the code unreadable and others straight up didn't work at all.

Eventually I got frustrated and decided to tinker around for a couple hours myself on a problem that seems like there should be a native solution for it - but there isn't.

### My Goals

- intuitive code - no complex conditions I would understand 6 months down the road

- Unintrusive markup - no weird structures

- Usable on top level DIVs as well as on nested ones

### The Code

```css { linenos=table }
.center {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
}

.center > * {
  position: relative;
}

.center::before,
.center::after {
  content: '';
  margin: auto; /* Make it push flex items to the center */
}

.center > * {
  flex: 0 0 auto;
  margin: 40px 0 40px 0;
}
```

I'm leveraging the powers of Flexbox for this task. For this to work, each parent of the '.center'ed element needs to have the 'position' attribute set (or else the 'absolute' value will use the body as reference). Adding a margin of 40px to top and bottom of each centered descendant makes for better visuals, you may remove that if you like.

The CSS-rule regarding '.center::before' and '.center::after' is the heart of this setup. It's the best I could find for making sure vertical alignment works without flaws.

To better understand how it's used, let's look at an example markup:

```html { linenos=table }
<body>
  <div class="center">
    <p>I am centered</p>
  </div>
</body>
```

See? Very not-complex implementation, easy on the coder's eyes!

### Horizontally only

As a bonus, here's another class centering only horizontally:

```css { linenos=table }
.center-hor {
  position: relative;
  width: 100%;
  display: flex;
  overflow: auto;
  justify-content: center;
}
```

There's really no magic to this one, as it's mostly based on basic Flexbox but it's a convenient class to have nonetheless!

### Conclusion

The search is over! Here are your classes to handle centering of DIVs easily.
