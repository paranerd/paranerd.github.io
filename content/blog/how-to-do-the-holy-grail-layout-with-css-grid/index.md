---
title: 'How To Do The Holy Grail Layout With CSS-Grid'
date: '2018-09-14'
author: paranerd
categories:
  - 'css'
  - 'html'
---

I already gave an introduction to what the Holy Grail layout actually is in my [previous post](/blog/2018/09/14/how-to-do-the-holy-grail-layout-with-flexbox/). So in this post we're mainly going to focus on building the exact same thing, only this time with CSS-Grids. But first, a little introduction to CSS-Grids:

### What are CSS-Grids?

The CSS-Grid-Layout is a fairly new layout system in CSS. It wasn't supported without vendor prefixes October of 2017. Unlike Flexbox, which is a 1-dimensional layout system (you can work with column **or** row direction), CSS-Grid works in 2 dimensions at the same time and is therefore much more powerful.

Let's see it in action, shall we?!

```html { linenos=table }
<header>head</header>
<nav>nav</nav>
<main>main</main>
<aside>side</aside>
<footer>footer</footer>
```

Looks almost like the markup we had for Flexbox. What immediately stands out though, is that we don't have a wrapper around the middle section as we had with Flexbox. So the code is already cleaner.

### The CSS

In the previous post I already mentioned that going "Mobile First" is basically mandatory these days, so let's implement this from the beginning.

We'll start with the smallest screen where we want to have all sections stacked up.

```css { linenos=table }
body {
  display: grid;
  height: 100vh;
  font-family: Arial, sans-serif;

  grid-template-areas:
    'header'
    'nav'
    'main'
    'side'
    'footer';
  grid-template-columns: auto;
  grid-template-rows: 100px 50px 1fr 50px 100px;
}

header {
  grid-area: header;
  background: #3cb371;
  color: white;
}

nav {
  grid-area: nav;
  background: #ddd;
}

main {
  grid-area: main;
}

aside {
  grid-area: side;
  background: #ddd;
}

footer {
  grid-area: footer;
  background: #333;
  color: white;
}

header,
nav,
aside,
main,
footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

Our `body` is our grid-container. In it we define 5 grid-areas: header, nav, main, side and footer. We can name these however we like as they are only used as a reference.

Setting `grid-template-columns` to `auto` means 'Use all the space available for width' (since we only have one column). We could override the auto-width in the CSS of each section if we wanted to.

With `grid-template-rows` we define the height for each row: header and footer are going to be 100px, nav and side will be 50px each. What's interesting and new here, is the `1fr`\-part ('one fraction'). In our basic layout it has the same effect as setting it to `auto`, meaning 'Take up the remaining space'. But with the fr-unit we can compose more complex scenarios: if we were to assign `1fr` to the second row (nav) as well, it would share the remaining space equally with the main-section. If we would give `2fr` to nav, it would get two thirds (there are a total of 3 fractions to be distributed, nav gets 2, main gets 1).

In the CSS for each individual section we link them to their respective area by using the name we assigned it with `grid-template-areas`.

You see I used flexbox again to center the text in each section. That's to show that CSS-Grid works perfectly together with flexbox.

That's it for our base view. You should end up with this:

![alt text](screenshot_holy_grail_grid_mobile.png 'Holy Grail Grid Mobile')


### The Big Screen

```css { linenos=table }
@media (min-width: 1200px) {
  body {
    grid-template-areas:
      'header header header'
      'nav main side'
      'footer footer footer';

    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 100px 1fr 100px;
  }
}
```

It gets a lot more interesting here. As you can see from the formatting of the `grid-template-areas`, we will have three columns and three rows. First and third row are all header and footer respectively, middle row is shared between navigation, main and side.

With `grid-template-columns` we set the first and third column to have a width of 200px. The column in the middle should take up the space left again.

Accordingly we set the heights of the first and third rows to be 100px with `grid-template-rows`, the middle-row gets the rest.

If we refresh our page now, it should look like this (you probably recognize it from the [previous post](/blog/2018/09/14/how-to-do-the-holy-grail-layout-with-flexbox/)):

![alt text](screenshot_holy_grail.png 'Holy Grail')

This concludes the guide of how to implement the Holy Grail layout with CSS-Grid. Compared to Flexbox it's not all too different and you might not see much advantage of using it. Check out this next example to see CSS-Grid shine!

### Beyond Holy Grail

We're adding a new layout to be used for screens with a width of 768px to 1200px:

```css { linenos=table }
@media (min-width: 768px) and (max-width: 1200px) {
  body {
    grid-template-areas:
      'header header side'
      'nav main main'
      'footer footer footer';

    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 100px 1fr 100px;
  }
}
```

Column- and row-sizes remained the same, but we moved the right sidebar up to the top column next to the header and extended the main-section to stretch across two columns now. We could have done the same using Flexbox but it would have been significantly harder to achieve and required multiple nested flexboxes resulting in ugly code.

![alt text](screenshot_grid_tablet.png 'Holy Grail Grid Tablet')
### Conclusion

CSS-Grid is the answer to all our prayers for a decent native layout system. Once you get the hang of it, you wouldn't want to go back.

For a complete overview of what CSS-Grid has to offer check out [this amazing article](https://css-tricks.com/snippets/css/complete-guide-grid/)!
