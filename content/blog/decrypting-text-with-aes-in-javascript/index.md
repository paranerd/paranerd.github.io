---
title: 'Decrypting Text With AES In JavaScript'
date: '2018-10-01'
author: paranerd
categories:
  - 'how-to'
  - 'javascript'
---

After encrypting text in the previous post, here's how you get your plaintext back.

The code

```js { linenos=table }
decrypt: function(encryptedString, secret) {
	// Separate payload from potential hmac
	var separated = encryptedString.trim().split(":");

	// Extract HMAC if signed
	var hmac = (separated[1]) ? separated[1] : "";

	// Decode
	var raw = this.base64UrlDecode(separated[0]);

	// Extract IV
	var iv = CryptoJS.lib.WordArray.create(raw.words.slice(0, this.blockSize / 32));

	// Extract Salt
	var salt = CryptoJS.lib.WordArray.create(raw.words.slice(this.blockSize / 32, this.blockSize / 32 + this.blockSize / 32));

	// Extract ciphertext
	var ciphertext = CryptoJS.lib.WordArray.create(raw.words.slice(this.blockSize / 32 + this.blockSize / 32));

	// Generate key
	var key = this.generateKey(secret, salt);

	if (hmac && !(this.sign(separated[0], key) == hmac)) {
		return null;
	}

	// Init cipher
	var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: ciphertext});

	// Decrypt
	var plaintextArray = CryptoJS.AES.decrypt(
	  cipherParams,
	  key,
	  {iv: iv}
	);

	// Encode
	return CryptoJS.enc.Utf8.stringify(plaintextArray);
},
```

### Decoding

After checking for a signature and saving it for later if there is one, we decode the Base64-encoded string back to raw.

```js { linenos=table }
base64UrlDecode: function(str) {
	return CryptoJS.enc.Base64.parse(str.replace(/\-/g, '+').replace(/\_/g, '/'));
}
```

CryptoJS kindly does the actual decoding just after we reversed our URL-save replacements. Knowing each of their positions in the string, we can easily recover our IV, salt and ciphertext. To get them to work in CryptoJS, we have to create a WordArray out of them, but the library offers a method to do just that.

### Generating a key

Just like when encrypting, we generate a key using the exact same parameters.

### Verifying the signature

If there was a signature, we verify it by re-signing the ciphertext and comparing the output to the HMAC provided. Abort, if this doesn't match!

### Decrypt

Having all the preparations done, we can finally decrypt now. CryptoJS' decrypt() method (just like the encrypt()) returns a WordArray that needs to be converted to a regular UTF-8 encoded string for further use.

### Usage

Using the decrypt functionality is just as simple as encrypting. Refer to my example in the previous post for an [example implementation](/blog/2018/10/01/encrypting-text-with-aes-256-in-javascript/).

### Conclusion

We did it! Encrypting and decrypting text with AES directly in the browser! Let me know in the comments if you found this useful and what mighty applications you're using this in!
