---
title: 'How To Read Files With JavaScript And FileReader'
date: '2018-10-29T08:01:34+01:00'
draft: false
author: paranerd
---

Analysing files in PHP is easy. But what if you want to access the content of a file without the overhead of sending it to a server first (e.g. for displaying a thumbnail before uploading an image)?

JavaScript provides a neat little API to achieve just that. It's called [FileReader](https://developer.mozilla.org/de/docs/Web/API/FileReader). Let's find out what it can do!

## The Layout

Here's the basic layout for this project. Don't judge me for the design, as usual this post is mainly about functionality – you're free to add all the bells and whistles you like!

```html { linenos=table }
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>FileReader</title>

  <style>
    input {
      display: none;
    }
  </style>
</head>
<body>
  <h1>FileReader</h1>

  <button id="text-loader"><input type="file" />Load Text</button>

  <pre id="result"></pre>
</body>
</html>
```

When you open this page in your browser, you’ll see a heading and a non-functional button. Let’s change the latter!

## Reading Text Files

This is the JavaScript that makes the button come to life:

```js { linenos=table }
window.onload = function () {
  // Init text loader
  document.getElementById("text-loader").addEventListener('click', function () {
    this.querySelector('input').click();
  });

  document.querySelector('#text-loader input').addEventListener('change', function () {
    readFile(this.files[0], displayText);
  });
};
```

The first part makes clicking the button open your browser’s file-dialog, while the second one calls a function `readFile`. Curious about what this does? Check it out:

```js { linenos=table }
function readFile(file, callback) {
    let reader = new FileReader();

    reader.onload = function() {
        callback(reader.result);
    };

    if (file.type.match(/^text/)) {
        reader.readAsText(file);
    }
}
```

`readFile` has two arguments: a file from the file-input and a callback function. In it we first get a FileReader instance and tell it to call our callback with the result once it finished loading the file. Lastly we check the file-type to only process those we can process and read the file as text.

The callback function in this case is `displayText`:

```js { linenos=table }
function displayText(text) {
    document.getElementById('result').innerText = text;
}
```

It gets the text-content of the file and simply puts it into the `result` container.

## Reading Image Files

As if getting plain text from files wasn’t exciting enough, we’re can even go a step further and load an entire image!

To prepare for that, we first extend our layout:

```html { linenos=table }
<button id="image-loader">
  <input type="file" />
  Load Image
</button>

<div id="thumbnails"></div>
```

We added another button as well as another result container. Ready for some more event listeners? Here they come!

```js { linenos=table }
// Init image loader
document.getElementById("image-loader").addEventListener('click', function () {
    this.querySelector('input').click();
});

document.querySelector('#image-loader input').addEventListener('change', function () {
    readFile(this, displayImage);
});
```

Calling `readFile` again. To also handle image files, we need to add a condition:

```js { linenos=table }
else if (file.type.match(/^image/)) {
  reader.readAsDataURL(file);
}
```

`readAsDataURL` returns the base64 encoded representation of the file content. The already existing `onload` listener passes this data to the `displayImage` callback for further processing:

With the encoded data we create a new image and add it to the `thumbnails` container.

## Conclusion

This has been a basic introduction to the FileReader-API. You can [download the full script](/snippets/how_to_read_files_with_javascript_and_filereader.html) (right click and save as) to play around with it. Let me know in the comments what you ended up creating with this cool feature!
