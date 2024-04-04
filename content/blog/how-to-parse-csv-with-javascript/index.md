---
title: 'How To Parse CSV With JavaScript'
date: '2018-11-29T08:01:34+01:00'
draft: false
author: paranerd
---

CSV files (short for Comma-Seperated Values) are a great way to exchange tabular data in a plain text file.

This is what it might look like:

```csv
name,age,location
john,36,chicago
pierre,31,paris
james,27,newcastle
```

The first row of this file is called the header, telling us what each column is about. The rest of the rows are just data.

What do we need to do to parse this text into a structure we can work with in JavaScript?

## Extracting The Rows

First, we need to separte the rows. Regular Expressions are a great way to do that!

```js { linenos=table }
let lines = raw.split(/(?:\r\n|\n)+/).filter(function(el) {return el.length != 0});
```

Simply split the string at an end of line delimiter (`\r\n` for Windows, `\n` for most other operating systems). By filtering the result we make sure we don’t end up with empty entries.

By calling `splice` on the `lines` array we also remove this first line from the result-set, thus making the next part easier.

## Extracting The Values

The regular expression we use to extract the values is quite complex. I encourage you to dissect it using an online regex tool like [regex101](https://regex101.com/). You ready? Here comes:

```js { linenos=table }
let valuesRegExp = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g;
```

It checks two cases: quoted values and unquoted values. Unquoted values are just regular values. Quoted values are surrounded by double quotes and may even contain additional “double double quotes” (sounds stupid, but is just an encoded single double quote – which sounds even more stupid...).

Using this Regular Expression gives us all the values in a single line. We then add the corresponding header-key and create neat little object.

```js { linenos=table }
let elements = [];

for (let i = 0; i < lines.length; i++) {
    let element = {};
    let j = 0;

    while (matches = valuesRegExp.exec(lines[i])) {
        var value = matches[1] || matches[2];
        value = value.replace(/\"\"/g, "\"");

        element[headers[j]] = value;
        j++;
    }

    elements.push(element);
}
```

In the end the `elements` array contains an object for each row that we can easily work with in JavaScript

```json { linenos=table }
[
    {
        "name": "john",
        "age": "36",
        "location": "chicago"
    },
    {
        "name": "pierre",
        "age": "31",
        "location": "paris"
    },
    {
        "name": "james",
        "age": "27",
        "location": "newcastle"
    }
]
```

## Conclusion

There we go! A basic but fully functional CSV-Parser. Working with CSV data in JavaScript only requires a couple lines of code and the power of Regular Expressions. You can try this parser in a live demo!
