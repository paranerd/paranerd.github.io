---
title: 'How To Take A Screenshot With JavaScript'
date: '2018-10-09'
author: paranerd
categories:
  - 'how-to'
  - 'javascript'
---

Wouldn't it be great if you could allow users to create screenshots of your website?! Apart from being a fun exercise this feature could come in handy when you're providing some kind of visual editor. After users customized their individual product, you could show them an image of what they created on checkout.

### Enter html2canvas

There's a JavaScript library called "[html2canvas](https://html2canvas.hertzen.com/)" that lets us convert HTML-markup to an image. We can then use this data to do all sorts of things with it.

```js { linenos=table }
this.shoot = function (id) {
  var element = id
    ? document.getElementById(id)
    : document.getElementsByTagName('body')[0];
  html2canvas(element).then(function (canvas) {
    var img = canvas.toDataURL('image/png');
    self.display('preview');
  });
};
```

You can include the library in your HTML like so:

```html { linenos=table }
<script
  type="text/javascript"
  src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"
></script>
```

And here's how the conversion is done:

```js { linenos=table }
var element = document.getElementById('container_id');
html2canvas(element).then(function (canvas) {
  var img = canvas.toDataURL('image/png');
});
```

And that's it. Basically 3 lines of code for the actual conversion.

Now let's check out what we can do with this!

### Display

The easiest way of processing the image data is to display it directly in the browser. To do that, we modify the code from above:

```js { linenos=table }
html2canvas(element).then(function (canvas) {
  var img = canvas.toDataURL('image/png');
  self.display('preview', img);
});
```

We create an image node with the image data set as the source and append it to a node of our choice ("#preview" in this case).

Here's how we actually display it:

```js { linenos=table }
this.display = function (id, content) {
  var img = document.createElement('img');
  img.src = content;

  var node = document.getElementById(id);
  node.appendChild(img);
};
```

### Upload

Instead of - or even in addition to - displaying the image, we can upload it to a server:

```js { linenos=table }
this.upload = function (img) {
  var img64 = img.replace(/^data:image\/(png|jpg);base64,/, '');

  $.ajax({
    url: 'upload.php',
    type: 'post',
    data: { image64: img64 },
  })
    .done(function (data, statusText, xhr) {
      // All good
    })
    .fail(function (xhr, statusText, error) {
      // Handle error
    });
};
```

You will need jQuery for this one (but might as well choose any other upload method). The important part is to trim the image data so we're left with the Base64-encoded image only.

To create an image file with this representation in PHP, we need to decode the Base64 data first:

```js { linenos=table }
// To save raw image, use:
file_put_contents('/path/to/img.png', base64_decode($_POST['image64']));
```

### Download

The most interesting way of handling the image would probably be downloading it - right from the browser, no server needed! The following piece of code lets us do just that!

```js { linenos=table }
this.download = function (content) {
  var element = document.createElement('a');
  element.setAttribute('href', content);
  element.setAttribute('download', self.getFilename());
  element.style.display = 'none';
  document.body.appendChild(element);

  // Trigger download
  element.click();

  // Clean up
  document.body.removeChild(element);
};
```

To trigger a download via JavaScript we need an anchor node referencing the image data and with a filename set as `download` attribute. Appending, clicking and then removing might seem a bit cumbersome, but it's the only way I know of that is working reliably. I'm open for better suggestions in the comments, though!

You can choose any filename you like, I thought it would be a nice idea to generate a new one including a timestamp each time a screenshot is taken:

```js { linenos=table }
this.getFilename = function () {
  var today = new Date();
  return (
    'screenshot_' +
    today.getFullYear() +
    (today.getMonth() + 1) +
    today.getDate() +
    '-' +
    today.getHours() +
    today.getMinutes() +
    today.getSeconds() +
    '.png'
  );
};
```

### Conclusion

There we go, an easy way to create screenshots via JavaScript and process them in different ways. You can download the [app](https://thegermancoder.com/wp-content/uploads/2018/10/app.js) where all the above pieces are put together in a neat little class (right click -> Save target).
