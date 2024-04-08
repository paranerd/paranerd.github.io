---
title: 'Decrypting Text With AES-256 In PHP'
date: '2018-09-28'
author: paranerd
categories:
  - 'how-to'
  - 'php'
---

This post is part of a series about symmetric encryption with AES-256 in PHP.

After encrypting text in the previous post, we now want to be able to decrypt that as well.

<!--more-->

First things first - here's the code:

```php { linenos=table }
public static function decrypt($msg, $secret) {
	if (!$msg) {
		return "";
	}

	// Separate payload from potential hmac
	$separated = explode(":", trim($msg));

	// Extract HMAC if signed
	$hmac = (isset($separated[1])) ? $separated[1] : null;

	// Convert data-string to array
	$data = self::base64_url_decode($separated[0]);

	// Extract IV
	$iv = substr($data, 0, self::$block_size);

	// Extract Salt
	$salt = substr($data, self::$block_size, self::$block_size);

	// Extract ciphertext
	$ciphertext = substr($data, self::$block_size * 2);

	// Generate Key
	$key = hash_pbkdf2('sha1', $secret, $salt, self::$iterations, self::$key_size, true);

	// Ensure integrity if signed
	if ($hmac && !hash_equals(self::sign($separated[0], $key), $hmac)) {
		return "";
	}

	// Decrypt
	return openssl_decrypt($ciphertext, self::$encryption_method, $key, OPENSSL_RAW_DATA, $iv);
}
```

Our decrypt function only needs two parameters: an encrypted message and a secret. Since IV, salt and signature are embedded in the message, this is all it takes.

We start by checking if we actually got something to decrypt, as we would run into nasty errors later, if we didn't. Next we extract the HMAC-signature from the message. If there is none, \`$hmac\` will simply not be set.

### Decoding

In any case we will have our Base64-encoded IV-salt-cipertext-composition in the \`$separated\`-array. After we reversed the url-safe Base64 encoding with this little piece of code

```php { linenos=table }
private static function base64_url_decode($str) {
	return base64_decode(strtr($str, '-_', '+/'));
}
```

we can extract IV, salt and the actual ciphertext. This is easy because we know their individual positions in the string.

### Generating a key

With key and salt in place we can now generate a key again using the same parameters we used when encrypting. What we'll get is a key that is equal to the one we previously generated.

### Verifying the signature

If we found a signature above, we re-sign the given ciphertext and use \`hash_equals\` to check if it matches the signature provided to ensure integrity. We use \`hash_equals\` in favour of a simple string comparison to mitigate timing attacks.

### Decrypting

All that's left to do is to pass all those ingrediences to the \`openssl_decrypt\`, let that magic happen in the background and get back our plaintext in return.
