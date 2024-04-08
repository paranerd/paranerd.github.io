---
title: 'Decrypting Files With AES-256 In PHP'
date: '2018-10-01'
author: paranerd
categories:
  - 'how-to'
  - 'php'
---

This post is part of a series about symmetric encryption with AES-256 in PHP.

In this last part of our series we're going to learn how to decrypt files we previously encrypted using our Crypto class.

<!--more-->

Check out the code:

```php { linenos=table }
public static function decrypt_file($path, $secret, $filename_encrypted = false, $destination = "") {
	// Read ciphertext from file
	$ciphertext = file_get_contents($path);

	// Decrypt
	$decrypted = self::decrypt($ciphertext, $secret);
	if ($decrypted === null) {
		return null;
	}

	// Determine destination path
	$filename = (substr($path, -4) === ".enc") ? substr(basename($path), 0, -4) : basename($path);
	$filename = ($filename_encrypted) ? self::decrypt($filename, $secret) : $filename;
	$decrypted_path = ($destination) ? $destination . $filename : dirname($path) . "/" . $filename;

	// Write plaintext to file
	if ($filename && file_put_contents($decrypted_path, $decrypted, LOCK_EX) !== false) {
		return $decrypted_path;
	}

	return null;
}
```

Looks a lot like the function we used to encrypt files, doesn't it?! In fact it's just as simple.#

Of course we need the path to a file we're supposed to decrypt as well as the secret that file had been encrypted with. If the filename is encrypted, we need to tell the function (otherwise an encrypted filename would be considered a gibberish but valid one).

After getting the encrypted content and running the actual decryption, we determine where to put the resulting plain content by decrypting the filename if required (taking into account an optionally passed destination).

After successfully writing the file, we return it's path and be done.

### Conclusion

There we go! With this series you're now able to encrypt and decrypt text and files using AES-256 in PHP. Sticking to standards and built-in functionalities wherever possible allowed us to keep the code short and simple but yet highly secure. I hope you enjoyed learning about it. Let me know if you discovered any security flaws.
