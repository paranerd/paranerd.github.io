---
title: 'Simple Collision Detection in JavaScript'
date: '2019-04-05T08:01:34+01:00'
draft: false
author: paranerd
categories: 
  - "how-to"
  - "javascript"
---

I’ve been playing around developing some simple games (pun intended^^) from time to time, just for the fun of it. To do that I very often come across some kind of collision detection. I thought I’d show you an easy way of detecting collisions in JavaScript!

## What is a collision?

Before we even start coding, we need to think about what it actually is that we want to detect. We need some conditions. For this example I’m assuming the two objects colliding are both rectangles. They have x- and y-coordinates as well as a width and a height. So far, so good. That was easy enough. Now the far more important part: how do we know if two rectangles collided?

Two rectangles collided, when they are overlapping in some way. Having their positions and dimensions we can define the conditions for overlapping. Let’s name our rectangles R1 and R2 for better readability. For R1 and R2 to overlap, there are 4 conditions to be met:

1. R1’s right edge needs to be to the right of R2’s left edge
2. At the same time, R1’s left edge needs to be to the left of R2’s right edge
3. Likewise, R1’s bottom edge needs to be lower than R2’s top edge and
4. R1’s top edge needs to be higher than R2’s bottom edge

If this doesn’t make sense while reading, I suggest sketching, it helps tremendously.

The first two conditions check for horizontal overlapping, while the others check for it vertically. Notice, that if we were to only check the first condition for horizontal overlapping, R1’s right might be to the right of R2’s right… but R1’s left might be as well, simply putting R1 to the right of R2, without them overlapping at all. This applies to rules 3 and for in the same way.

## Translating into code

Now that we have our conditions outlined, the toughest part is actually already done. All that’s left is directly translating English to Code:

```js { linenos=table }
function collision(r1, r2) {
  if (r1.x + r1.width >= r2.x &&
  	  r1.x <= r2.x + r2.width &&
	  r1.y + r1.height >= r2.y &&
  	  r1.y <= r2.y + r2.height)
  {
	return true;
  }
  
  return false;
}
```

That’s is all it takes to detect between two very simple objects. Very easy, very straightforward.

We could be done now, but let’s go ahead and add one more convenient feature!

## Where did that come from?

In addition to the fact that a collision occurred at all you oftentimes need to also determine where that collision happend exactly. In my attempt at a Jump ‘n’ Run, for example, it made a huge difference whether my character hit the enemy from above or any other side (a matter of life and death, if you will!). So here’s what I came up with to get that information:

```js { linenos=table }
// Check for collision up here

const bottom_diff = r2.y + r2.height - r1.y;
const top_diff = r1.y + r1.height - r2.y;
const left_diff = r1.x + r1.width - r2.x;
const right_diff = r2.x + r2.width - r1.x;
const min = Math.min(bottom_diff, top_diff, left_diff, right_diff);

let collision = {
	bottom: top_diff == min,
	right: left_diff == min,
	left: right_diff == min,
	top: bottom_diff == min
}
```

What am I doing here?

First I’m calculating the distances between the edges of each side: bottom_diff represents the distance from R1’s bottom edge to R2’s top edge, left_diff on the other hand represents the distance between R1’s left edge and R2’s right edge. To turn this information into a direction, I first need to find the smallest distance of them all. Imagine R1 being my character and R2 being an enemy: if the character jumps on an enemy, bottom_diff is going to be way smaller than top_diff. If the character has a height of 20px, bottom_diff might be 0 or 1 while top_diff would be 20 or 19.

Bare in mind that this information is somewhat “directed”. The above example tells you “R1 collided with R2 from above” because the character was R1. If you were to pass the enemy as R1 and the character as R2 you would get the exact opposite!

To wrap this up, let’s put it all in a neat little function that you can re-use whenever you need to check for collisions between two rectangles:

```js { linenos=table }
function collision(r1, r2) {
  if (r1.x + r1.width >= r2.x &&
  	  r1.x <= r2.x + r2.width &&
  	  r1.y + r1.height >= r2.y &&
  	  r1.y <= r2.y + r2.height)
  {
    const top_diff = r2.y + r2.height - r1.y;
    const bottom_diff = r1.y + r1.height - r2.y;
    const left_diff = r2.x + r2.width - r1.x;
    const right_diff = r1.x + r1.width - r2.x;

    const min = Math.min(bottom_diff, top_diff, left_diff, right_diff);

    return {
      	bottom: bottom_diff == min,
        right: right_diff == min,
        left: left_diff == min,
        top: top_diff == min
    }
  }
  return null;
}
```

## Conclusion

There you go! Once you get your head around the conditions of collisions in theory, coding it is a piece of cake. The actual challenge in collision detection lies prediction, minimizing computation and all other kinds of really exciting stuff that would be beyond the scope of this article.

If you want to see the above code in action, check out my attempt at a Breakout clone.

Happy coding!
