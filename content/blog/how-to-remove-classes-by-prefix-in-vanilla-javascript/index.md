---
title: 'How To Remove Classes By Prefix In Vanilla JavaScript'
date: '2018-10-04'
author: paranerd
categories:
  - 'how-to'
  - 'javascript'
---

Removing a class from an HTML-Element with JavaScript is easy enough. You could use jQuery for it by calling

```js { linenos=table }
$(node).removeClass(className);
```

or, just as simple, go vanilla with:

```js { linenos=table }
var node = document.getElementById(id);
node.classList.remove(className);
```

But what if you wanted to remove all classes starting with a prefix? Assume we have a DOM-Node like this:

```html { linenos=table }
<div id="demonode" class="one test two test-1 test-2 three"></div>
```

We want to remove all the classes starting with "test-", how do we achieve that?

Not even jQuery has a straight-forward answer to that question and doing it with pure JavaScript is even more difficult - or is it? I came up with a nice little function that does just that.

### The Magic Of Regular Expressions

```js { linenos=table }
function removeClassByPrefix(node, prefix) {
  var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
  node.className = node.className.replace(regx, '');
  return node;
}
```

It takes the node and the prefix for the classes you want removed. Behold the power of RegEx! The query I constructed basically checks for the prefix followed by any character except whitespaces (\[^ \]\*) followed by one or more whitespaces (\[ \]?).

### An Example

Here's how that changes the classList:

```js { linenos=table }
var demonode = document.getElementById('demonode');
console.log(demonode.classList + ''); // one test two test-1 test-2 three
removeClassByPrefix(demonode, 'test-');
console.log(demonode.classList + ''); // one test two three
```

### Conclusion

There you go! We have a simple yet effective to remove classes by prefix without the need for third-party libraries.
