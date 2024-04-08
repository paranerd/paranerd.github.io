---
title: 'Encrypting Text With AES-256 In PHP'
date: '2018-09-28'
author: paranerd
categories:
  - 'how-to'
  - 'php'
---

This post is the first part of a series about symmetric encryption with AES-256 in PHP.

There are plenty usecases for having encryption in your application, but be aware of the golden rule of cryptography: If you don't know what you're doing, don't do it! Simply labeling your application "AES256-encrypted" doesn't necessarily mean, it's secure because you may have intruduced attack vectors in your implementation. Still, it's fun to play around with it to understand what's required to encrypt a text or file.

For this project we will be using PHP-native OpenSSL-functions to stick to standards as much as possible (so we're not implementing the actual encryption ourselves, which would be a silly idea!). What we'll end up with is a class that is as general as possible to be used in other environments as well.

### The wrapper

Let's start with our foundation:

```php { linenos=table }
class Crypto {
	static $encryption_method = 'aes-256-cbc';
	static $block_size        = 16;
	static $key_size          = 32; // in bytes - so 256 bit for aes-256
	static $iterations        = 2048;
}
```

### The code

This class-wrapper will be the home for all our future methods. We're setting our desired encryption method to be AES with 256 Bit in Cipher-Block-Chaining mode. There are [other modes](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation) available, I chose CBC for security and ease of use. All other variables I will explain when they're being used.

First, we want to be able to encrypt data, so here's how that would work:

```php { linenos=table }
public static function encrypt($plaintext, $secret, $sign = false) {
	// Generate IV
	$iv = openssl_random_pseudo_bytes(self::$block_size);

	// Generate Salt
	$salt = openssl_random_pseudo_bytes(self::$block_size);

	// Generate Key
	$key = hash_pbkdf2('sha1', $secret, $salt, self::$iterations, self::$key_size, true);

	// Encrypt
	$ciphertext = openssl_encrypt($plaintext, self::$encryption_method, $key, OPENSSL_RAW_DATA, $iv);

	// Encode
	$ciphertext64 = self::base64_url_encode($iv . $salt . $ciphertext);

	// Sign
	if ($sign) {
		$ciphertext64 = $ciphertext64 . ":" . self::sign($ciphertext64, $key);
	}

	return $ciphertext64;
}
```

This function requires a couple parameters. Plaintext of course, so it has something to encrypt. Next it requires a secret, meaning the password you want to encrypt with. You may also tell it to sign the ciphertext. We will cover why that might be important to you in a bit.

So let's get to action! First we need an initialization vector. The length of that vector is crucial and depends on the encryption method. For AES-256 we need an IV of 16 bytes. Same goes for the salt that we're generating next. Please stay away from implementing your own function. Using the method provided by OpenSSL will provide the best security.

Both these values have to be randomly generated for each encryption so that the same plaintext results in different ciphertexts on multiple executions. They also help strengthening weak passwords to some extent by making them less susceptible to [rainbow table](https://en.wikipedia.org/wiki/Rainbow_table) attacks.

### Generating a key

Encrypting with OpenSSL doesn't work with that simple secret-string we provided - we need to generate a key first. PBKDF2 applies a pseudorandom function to our secret and salt to derive said key using a hashing algorithm (SHA-1 in our case).

The iteration count is used to increase the cost of producing keys from a password and thus increasing the difficulty of an attack. The required length of the key again depends on the encryption method. For AES-256 we need a 256 bit key. As the function takes this value in bytes, we pass 32 as the key-size.

Passing "true" as the final parameter sets the output format to "raw binary" as this is what we will need in the next step. If you want to learn PBKDF2 in more detail, I highly recommend you read the [RFC](https://www.ietf.org/rfc/rfc2898.txt).

### Encrypting

Now that we got all our ingrediences, we can finally encrypt our plaintext. We're using OPENSSL_RAW_DATA to get back binary data instead of Base64-encoded data, because we're encoding ourselves in the next step. Note that without using OPENSSL_ZERO_PADDING we automatically get PKCS#7 padding (this might be important when decrypting on other platforms).

### Encoding

Since raw binary data is hard to exchange between clients, we encode the resulting ciphertext together with IV and salt in Base64. We use a convenience function to do just that:

```php { linenos=table }
private static function base64_url_encode($str) {
    return strtr(base64_encode($str), '+/', '-_');
}
```

To be able to share our ciphertext on the web, we replace "dangerous" characters like '+' and '/' with safer alternatives like '-' and '\_' in the encoded string to not break URLs.

As you can see, both IV and salt are encoded but not encrypted. That's because they are required as input values for decryption as we will discover in a moment. Having them exposed does not weaken security in any way. An attacker would still have to brute force the password to get the key as rainbow tables don't really work when using a salt. Just make sure you use a reasonably strong password and you'll be fine!

### Signing

As an optional step we could now sign the encoded ciphertext. According to the [RFC](https://tools.ietf.org/html/rfc2104) signing provides "a way to check the integrity of information transmitted over or stored in an unreliable medium". It's not limited to encrypted data exclusively, as it simply serves as proof that a message has not been tampered with. To achieve this we use a hash-based message authentication code (HMAC).

```php { linenos=table }
public static function sign($data, $key) {
    return hash_hmac('sha256', $data, $key);
}
```

The build-in hashing method takes an algorithm (SHA-256), the message to be signed as well as the key we generated earlier. This signature is then appended to the ciphertext seperated by a ':'.

### Conclusion

And that's it for basic encryption! Might seem complex at first, but not so much once you figured out what everything does. Now that we have ciphertext, we need a way to get back our plaintext from it. Let's do that in the next section!
