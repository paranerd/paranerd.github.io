---
title: 'How To Detect Swipes In JavaScript'
date: '2018-10-08'
categories:
  - 'how-to'
  - 'javascript'
coverImage: 'hand_point_up.png'
---

When working on my [reverse engineering of 2048](/projects/2048/) for browsers I wanted it to be playable on mobile devices as well. Problem was, that while you could perfectly use your keyboard to control the tile movement on a desktop, this was not possible on smartphones! Digging through the web I found some partially working solutions but nothing quite good. So I decided to craft it myself and the results work flawlessly!

All I needed was a way to get the coordinates of where a 'touchdown' occurred and those of the position the finger left the screen. JavaScript has listeners for these events available, they're called 'touchstart' and 'touchend'. The rest was just basic maths.

I decided to wrap all of it in a JavaScript 'class' to be easily used in other projects as well:

```js
var Swipe = new (function () {
  var self = this;
  this.start = { x: null, y: null };

  this.init = function () {};
})();
```

The 'start' variable takes the coordinates of the 'touchstart'. How do we get those? By adding an event listener to our empty init() function!

```js
document.addEventListener('touchstart', function (e) {
  var touch = e.touches[0] || e.changedTouches[0];
  self.start.x = touch.pageX;
  self.start.y = touch.pageY;
});
```

Figuring out how to obtain touch positions on mobile turned out to be quite tricky, but in the end I stumbled across this line and it works well.

When the user stops the swipe, we obtain the position of the 'touchend' in a similar way:

```js
document.addEventListener('touchend', function (e) {
  var touch = e.touches[0] || e.changedTouches[0];

  self.process({ x: touch.pageX, y: touch.pageY });
});
```

### Enter Mathematics

The end-coordinates are then passed to another function that processes them:

```js
this.process = function (end) {
  var diffX = Math.abs(self.start.x - end.x);
  var diffY = Math.abs(self.start.y - end.y);

  if (diffX >= diffY) {
    if (self.start.x < end.x) {
      // Swipe right
    }
    if (self.start.x > end.x) {
      // Swipe left
    }
  } else {
    if (self.start.y > end.y) {
      // Swipe up
    } else if (self.start.y < end.y) {
      // Swipe down
    }
  }
};
```

By calculating the absolute values of the coordinates we get the distance travelled while touching on both axes. This is to determine whether the movement was primarily horizontal or vertical. Coordinate origin is the top left corner of the screen, as usual. So if the x-value of touchstart is smaller than that of touchend, it means the user swiped right. Same goes for all other directions.

### Callbacks

Detecting swipes is great and all, but what good is it really, if we don't execute code based on that? For best flexibility we're going to extend our class to use callbacks:

```js
this.callbacks = { up: null, right: null, down: null, left: null };
```

And some setter functions to initialize them:

```js
this.onUp = function (callback) {
  self.callbacks.up = callback;
};

this.onRight = function (callback) {
  self.callbacks.right = callback;
};

this.onDown = function (callback) {
  self.callbacks.down = callback;
};

this.onLeft = function (callback) {
  self.callbacks.left = callback;
};
```

In our `process` function we call the callbacks - pun intended - like so:

```js
if (self.start.x < end.x) {
  if (self.callbacks.right) {
    self.callbacks.right();
  }
}
```

### Usage

After we've linked the swipe detector file in our index.html, index.php or what have you, we set it up like so:

```js
Swipe.init();
Swipe.onLeft(leftAction);
Swipe.onUp(upAction);
Swipe.onRight(rightAction);
Swipe.onDown(downAction);
```

After initializing we simply add our callback functions and let the fun begin! That's all there is to it.

### Conclusion

Adding detection for swipes to a website can be a great way to improve user interactions, especially in games. It should be used with caution, though, because of 'reserved inputs', like swiping down from the top of a page on mobile browsers to refresh it, for example.

For the full script check out the implementation in my [project 2048](https://github.com/paranerd/2048/blob/master/js/swipe_detector.js)!
