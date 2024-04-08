---
title: 'How To Build A QR-Code-Generator In PHP'
date: '2018-09-26'
author: paranerd
categories:
  - 'how-to'
  - 'php'
---

I'm sure all of you know Quick Response Codes (or QR-Codes for short). They're everywhere and a great way to encode information that's hard to read and/or remember for humans in a way machines can process. There are plenty of online services that will generate QR-codes for us. But what if we wanted to be able to do this ourselves to use such a feature in our own application?

To save some time we will be using a library to do the heavy lifting for us. It's conveniently called "PHP QR Code" and you can get it from [here](http://phpqrcode.sourceforge.net/). Setup is easy. We just create a new project-folder and extract the downloaded .zip into that folder. Next to these we add two files named `generator.php` and `index.html`. In the end our folder-structure should look like this:

```bash { linenos=table }
myqrgenerator/
|-- phpqrcode/
|-- generator.php
|-- index.html
```

First let's edit the `index.html`:

```html { linenos=table }
<!DOCTYPE html>
<head>
    <title>My QR-Generator</title>
</head>
<body>
    <form class="qr-form" action="#">
        <input type="text" name="msg" placeholder="Enter message" />
        <input type="hidden" name="type" value="text" />
        <button>Encode Text</button>
    </form>

    <div id="result"></div>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
</body>
</html>
```

We've added a form to handle our input as well as an area to take the result. Using jQuery makes some of the following tasks easier, so we'll include it from a CDN. So we got our layout. Extremely basic, yes, but great to focus on actual functionality. On to the backend!

```php { linenos=table }
<?php
include 'phpqrcode/qrlib.php';

class QR_Generator {
    private static $filename = 'tmp.png';

    public static function generate($content) {
        QRcode::png($content, self::$filename);

        $data = file_get_contents(self::$filename);

        unlink(self::$filename);

        return base64_encode($data);
    }
}

if ($_POST['type'] == 'text') {
    exit(QR_Generator::generate($_POST['msg']));
}
else {
    header($_SERVER['SERVER_PROTOCOL'] . ' 400 Unknown request');
}
```

Since the hard work is done in the library all we have to do is provide an interface to it. We take the to-be-encoded content from the client and pass it to the library to create the QR-Code and save it in \`self::$filename\`. Then we read this data, delete the temporary file and send the base64-encoded image-data back to the client. Obviously you could also save the code for later reuse, anything is possible here!

Now that we've got our backend in place, let's connect it to the layout by adding some JavaScript. I leave it up to you if you want to include the JavaScript in the \`index.html\` or put it in a seperate file and link to it. What matters is the content:

```js { linenos=table }
$('.qr-form').on('submit', function (e) {
  e.preventDefault();
  var form = this;

  $.ajax({
    url: 'generator.php',
    method: 'post',
    data: $(form).serialize(),
  })
    .done(function (data) {
      var img = new Image();
      img.src = 'data:image/png;base64, ' + data;
      $('#result').append(img);
    })
    .fail(function (err) {
      $('#result').text('Something went wrong...');
    });
});
```

We interrupt the submission of our form to fire a POST-request to the \`generator.php\`. We pass it the form-data which contains the type of the request ('text') as well as the message we want encoded. The server then processes our request as explained above and, if everything went well, sends us a base64-encoded image. We create a \`new Image()\`, set the source to be our base64-content and append it to the results-section.

That's it! This is the most basic way of creating QR-Codes. Keep on reading if you want to learn about other usecases besides encoding plain text. For example encoding contact information, E-Mails, WiFi-Logins and many more.

All we need to know is the correct syntax for each case.

### QR-Code for contact information

To add the feature of encoding contact information. let's start with the backend this time:

```php { linenos=table }
public static function generate_contact($name, $number) {
    $vcard = "BEGIN:VCARD\n";
    $vcard .= "VERSION:2.1\n";
    $vcard .= "FN:" . $name . "\n";
    $vcard .= "TEL;CELL:" . $number . "\n";
    $vcard .= "END:VCARD\n";

    return self::generate($vcard);
}
```

Our QR_Generator gets a new static function that takes a name and number. It then puts it in the correct format and uses the already in place `self::generate()` function to generate the QR-Code and send the base64-encoded image back to the client.

Of course we need to tell the server to expect a new type coming in:

```php { linenos=table }
else if ($_POST['type'] == 'contact') {
    exit(QR_Generator::generate_contact($_POST['name'], $_POST['number']));
}
```

For the user to be able to input contact information we add another form:

```html { linenos=table }
<form class="qr-form" action="#">
  <input type="text" name="name" placeholder="Enter name" />
  <input type="text" name="number" placeholder="Enter number" />
  <input type="hidden" name="type" value="contact" />
  <button>Encode Contact</button>
</form>
```

Not much changed compared to the already existing one. Notice the type with 'contact' as value.

The JavaScript doesn't need to be modified because we basically want to achieve the same thing: send form-data to our server and get an image back for it. And since our function already handles submissions of forms with class \`qr-form\`, there's nothing to add here.

```
[example_image]
```

Every QR-vCard starts with \`BEGIN:VCARD\` and ends with \`END:VCARD\`. There are many In between There are many more attributes to append our vCard like phone numbers, addresses, email, etc. [Here's](https://en.wikipedia.org/wiki/VCard) a full list of them.

### QR-Code for E-Mail

Using QR-Codes you can prepare an entire E-Mail - amazing, isn't it?! People would only have to scan your code, choose their favourite Mail-App and hit send! Instead you might just want to set your mail-address and the subject and leave the message to the one scanning your code. Imagine you would put up an ad on a billboard, magazine or some other print outlet: people could just scan your code without the hassle of copying your email to their phone to get in touch with you.

Instead of giving you all of the code here, I will only give you the most relevant part. The implementation is analogue to the previous two formats:

```php { linenos=table }
public static function generate_mail($recipient, $subject, $body) {
    $mail = "MATMSG:TO:" . $recipient . ";SUB:" . $subject . ";BODY:" . $body . ";;";

    return self::generate($mail);
}
```

### QR-Code for WiFi-Login

Having your WiFi-Credentials encoded in a QR-Code is a brilliant idea for public hotspots but also for your home! Usually one of the first questions when someone visits is "Can I have your WiFi-Password?". If you've setup your WiFi securely (which you definitely should!^^) you would now have to enter a very long string of numbers, letters and special characters which can get really annoying when there are multiple phones you need to setup that way.

If only there was a better way of doing that - oh wait! There is! Let's encode our WiFi-Credentials in a QR-Code for easy access! As in the previous section, here's only the relevant code, I'm confident you can figure out the rest yourselves:

```php { linenos=table }
public static function generate_wifi($ssid, $password) {
    $wifi = "WIFI:T:WPA;S:" . $ssid . ";P:" . $password . ";;";

    return self::generate($wifi);
}
```

### Conclusion

Encoding information in a QR-Code can be very helpful, userfriendly or just fun to play with. Setting up our own QR-Code-Generator using PHP is very easy thanks to [phpqrcode](http://phpqrcode.sourceforge.net/)
