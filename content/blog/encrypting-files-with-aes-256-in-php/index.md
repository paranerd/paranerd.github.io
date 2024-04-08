---
title: 'Encrypting Files With AES-256 In PHP'
date: '2018-10-01'
author: paranerd
categories:
  - 'how-to'
  - 'php'
---

This post is part of a series about symmetric encryption with AES-256 in PHP.

Now that we covered how to [encrypt text in PHP](/blog/2018/09/28/encrypting-text-with-aes-256-in-php/), you might want to also be able to encrypt files. Luckily, most of the logic to do that already exists in the class we created, so implementing this feature is relatively easy.

As always, here's the code:

```php { linenos=table }
public static function encrypt_file($path, $secret, $sign = false, $encrypt_filename = false, $destination = "") {
	// Read plaintext from file
	$data = file_get_contents($path);

	// Encrypt
	$encrypted = self::encrypt($data, $secret, $sign);

	// Determine destination path
	$filename = ($encrypt_filename) ? self::encrypt(basename($path), $secret) . '.enc' : basename($path) . '.enc';
	$encrypted_path = ($destination) ? $destination . $filename : dirname($path) . "/" . $filename;

	// Write ciphertext to file
	if (file_put_contents($encrypted_path, $encrypted, LOCK_EX) !== false) {
		return $encrypted_path;
	}

	return "";
}
```

The actual encryption requires only two lines of code: one to get the contents of the file and a second to encrypt that content (which is basically 'plaintext').

Next, we determine the filename to write the ciphertext into. For the optional filename encryption we simply run our encrypt-function again on the filename, otherwise we just add '.enc' to the current filename.

If writing the ciphertext to file was successful, we return the destination path, or else an empty string.

### Conclusion

Since the actual encryption is done in a separate function, encrypting files boils down to getting the plain data and writing back the encrypted one. If you want to know how to get back at your precious content, stay tuned for the \[last part\] of this series!
