---
title: 'Encrypting Text With AES-256 In JavaScript'
date: '2018-10-01'
author: paranerd
categories:
  - 'how-to'
  - 'javascript'
---

Maybe you followed my series on symmetric encryption with AES in PHP. You can check it out [here](/projects/aes-encryption-in-php/) if you're interested! What if I told you, that you don't even need a server to do that but might as well encrypt text using AES right in your browser? Sounds crazy? Well, you're in for a treat!

### Dependencies

I can't stress this enough, so here I go again: when it comes to cryptography, there are two main rules:

- Stick to standards wherever possible!
- Don't do it unless you know what you're doing!

I really don't feel qualified to implement AES in JavaScript on my own. Luckily, there's a project called [CryptoJS](https://github.com/brix/crypto-js) that calls itself the "JavaScript library of crypto standards" - so exactly what we're looking for!

There really are plenty of standards included in the library, such as MD5, HMAC and the entire SHA-family. We don't need all those files though. To keep our project clean, we just include the ones we actually use. These are:

- src/aes.js
- src/pbkdf2.js
- src/sha1.js
- src/sha256.js

We're going to build a helper class for using the provided functionality a little more conveniently.

One important thing about CryptoJS: it works with 'Words' or 'WordArrays' in some places. Words are 32bit long, calling for conversion here and there. So everytime you see a '32' in the code, it's because of that.

### The wrapper

What we'll end up with is a JavaScript 'class' that can be used pretty much independently in all your JavaScript-projects.

Here's the base for this project:

```js { linenos=table }
var Crypto = {
  blockSize: 128,
  keySize: 256,
  iterations: 2048,
};
```

Just like in the PHP-version we're defining the size of blocks and the key as well as the iteration count. I chose the same values as we did for PHP to have the output transferable inbetween platforms. Note that blockSize and keySize are set in Bits, not Bytes as we did in PHP!

### The code

Let's start with encryption. I tried to keep the structure of the code similar to the PHP version to make it easier to follow. I'm not going to cover all the details of what's happening - you can read about that [here](/blog/2018/09/28/encrypting-text-with-aes-256-in-php/).

```js { linenos=table }
	encrypt: function(msg, secret, sign) {
		// Generate IV (16 Bytes)
		var iv = CryptoJS.lib.WordArray.random(this.blockSize / 8);

		// Generate salt (16 Bytes)
		var salt = CryptoJS.lib.WordArray.random(this.blockSize / 8);

		// Generate key
		var key = this.generateKey(secret, salt);

		// Encrypt
		var encrypted = CryptoJS.AES.encrypt(
			msg,
			key,
			{
				iv: iv,
				padding: CryptoJS.pad.Pkcs7,
				mode: CryptoJS.mode.CBC
			}
		);

		// Encode (iv + salt + payload)
		var ciphertext64 = this.base64UrlEncode(
			atob(CryptoJS.enc.Base64.stringify(iv)) +
			atob(CryptoJS.enc.Base64.stringify(salt)) +
			atob(encrypted.toString())
		);

		// Sign
		if (sign) {
			ciphertext64 = ciphertext64 + ":" + this.sign(ciphertext64, key);
		}

		return ciphertext64;
	},
```

CryptoJS provides its own method to get random data for our IV and salt. Unfortunately, it takes its values in bytes, so we convert.

### Generating a key

The code for generating a key is a bit bulky and we're going to need it again when decrypting, so I put it in a seperate function to keep things clean:

```js { linenos=table }
generateKey: function(secret, salt) {
    return CryptoJS.PBKDF2(
        secret,
        salt,
        {
            keySize: this.keySize / 32, // size in Words
            iterations: this.iterations,
            hasher: CryptoJS.algo.SHA1
        }
    );
},
```

Using [PBKDF2](https://www.ietf.org/rfc/rfc2898.txt) with SHA1 as hashing algorithm to generate the key. Be aware that the keySize is expected in 'Words'!

### Encrypting

CryptoJS' encrypt() method also requires quite some parameters. Note that we need to explicitly name what padding we want to be applied (unlike in PHP where PKCS5 was used by default). Also note that PKCS5 and PKCS7 are interchangeable, so encrypting with one and decrypting with the other works just fine.

The returned ciphertext will be an array of Words.

### Encoding

To be able to safely transfer the encrypted ciphertext around the web, we're going to encode it using a modified version of Base64. But since IV, salt and ciphertext are WordArrays, we need to convert them first.

This is easy regarding the ciphertext as it comes with a built-in 'toString()' function that returns the Base64-encoded version of it. For IV and salt we first have to convert them to Base64 by hand.

To get raw data from all of the three, we decode them using atob(). This raw data we pass to our base64UrlEncode:

```js { linenos=table }
base64UrlEncode: function(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_');
},
```

This replaces '+' with '-' and '/' with '\_' to avoid problems in URLs.

### Signing

Signing our resulting encoded IV, salt and ciphertext for integrity is easy in CryptoJS:

```js { linenos=table }
sign: function(str, key) {
	return CryptoJS.HmacSHA256(str, key);
},
```

This gives us a SHA256-HMAC for our Base64-string that we append to it separated by a ':' for easy extraction later.

### Usage

Using this library is very straightforward. Simply link all JavaScript files, call `Crypto.encrypt()` and you’re done! Here’s an example markup:

```js { linenos=table }
<!DOCTYPE html>
<head>
	<title>AES-256</title>
</head>
<body>
	<h1>AES-256 Encryption with CryptoJS</h1>

	<form id="encrypt" action="#">
		<input id="plaintext" type="text" name="plaintext" placeholder="Plaintext" /></br>
		<input id="secret" type="password" name="secret" placeholder="Secret" /></br>
		<input type="submit" value="Encrypt!" />
	</form>

	<script type="text/javascript" src="util/aes.js"></script>
	<script type="text/javascript" src="util/pbkdf2.js"></script>
	<script type="text/javascript" src="util/sha1.js"></script>
	<script type="text/javascript" src="util/sha256.js"></script>
	<script type="text/javascript" src="aes.js"></script>

	<script>
		document.getElementById("encrypt").onsubmit = function(e) {
			e.preventDefault();
			var plaintextInput = document.getElementById("plaintext");
			var secretInput = document.getElementById("secret");
			var encrypted = Crypto.encrypt(plaintextInput.value, secretInput.value, true);
			alert(encrypted);
		};
	</script>
</body>
</html>
```

### Conclusion

And that's it! We now have a convenient way of encrypting strings in JavaScript. To decrypt them, you can either use the class we built in PHP, or check out the \[next post\](link)!
