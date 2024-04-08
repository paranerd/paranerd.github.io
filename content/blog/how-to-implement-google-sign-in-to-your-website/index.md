---
title: 'How To Implement Google Sign-In To Your Website'
date: '2018-09-19'
author: paranerd
categories:
  - 'how-to'
  - 'html'
  - 'javascript'
  - 'php'
---

You've probably seen this button around the web:

![alt text](sign_in_with_google.png 'Sign In With Google')

Websites that use this button let you login using your Google Account as an alternative to creating an account on that particular page.

### Why use Google Sign-In?

In the ever pacing world of the internet, to get customers to use your website, it needs to be fast. Fast not only in terms of the time it takes to load the page but also regarding user-interactions. Every additional step towards an action your visitors want to complete increases the chance of them just leaving your site. That's why One-Click-Checkouts are so popular, for example. And Google Sign-In also does just that: removing a step towards logging in.

Most internet users are tired of forms and yet another account to manage. Signing in with Google eliminates those burdens.

### Prerequisites

Google Sign-In is based on the OAuth 2.0 protocol for authentication. Therefore to use it in our project, we need to first generate a Client-ID. If you don't know how to do that, check out my [step-by-step tutorial](https://thegermancoder.com/2018/09/19/how-to-create-a-google-api-project/)! Now fire up the server of your choice and let's get coding!

### What is going to happen?

The user comes to our login page, sees the "Sign In With Google"-Option, is happy about not having to fiddle around with any registration forms and hits the button. A new tab or popup will appear for the user to allow our app to connect to the Google account. When confirmed, Google will then provide a response containing some information about the user. Most importantly, however, we get an authorization token that we will send to yet another Google-API for verification. Once this is done, we consider the user logged in and grant access to any restricted areas. May sound a bit complex at first, but trust me, the implementation is rather straight-forward.

### The Frontend

The basic layout is fairly simple. Let's create an \`index.php\` and add the following code to it:

```html { linenos=table }
<!DOCTYPE html>
<head>
    <meta charset="utf-8" />
    <meta name="google-signin-client_id" content="YOUR_CLIENT_ID_GOES_HERE" />
    <script src="https://apis.google.com/js/platform.js" async defer></script>
</head>
<body>
    <div class="g-signin2" data-onsuccess="onSignIn"></div>
</body>
</html>
```

The Client-ID we acquired in the previous step goes in the meta-tag so Google can identify our app. To keep things simple and secure, we're going to include Google's \`platform.js\` in the head-section. This does all the heavy lifting for us, including designing the sign-in-button. Clicking the button sets of some magic in the background with a callback to a function called "onSignIn" when successful. Right now this function does not exist, so a successful connect to the Google-account would merely change the button to say 'Signed In' but wouldn't trigger any login-functionality whatsoever on our own server.

Let's change that!

```html { linenos=table }
<script>
  function onSignIn(googleUser) {
    var idToken = googleUser.getAuthResponse().id_token;

    // Validate token
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://lvh.me/sign_in_with_google/login.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          window.location = 'private.php';
        } else {
          alert('Error: ' + xhr.statusText);
        }
      }
    };
    xhr.send('idtoken=' + idToken + '&method=google');
  }
</script>
```

The `onSignIn` gets passed an object containing some information about the user, such as name, e-mail-address, the unique Google-ID and a so-called id-token. This token is what we're interested in right now because we want to send it to our backend for verification. If that's successful, we're going to redirect the user to our to-be-created `private.php`.

Which backend, you ask? Exactly! So let's get that in place!

### The Backend

Before we can continue coding we need to get the Google-API-Library for PHP real quick. We could download it from [Github](https://github.com/googleapis/google-api-php-client) but the recommended method of getting it is through composer. To do that, we run the following command from within our projects directory:

```bash { linenos=table }
composer require google/apiclient:"^2.0"
```

Using the library we can now focus on the essentials:

```php { linenos=table }
<?php
require_once 'vendor/autoload.php';

$CLIENT_ID = "YOUR_CLIENT_ID_GOES_HERE";

// Get the id-token from the POST-request
$id_token = $_POST['idtoken'];

// Use the library to create a Google client that will verify our token
$client = new Google_Client(['client_id' => $CLIENT_ID]);
$payload = $client->verifyIdToken($id_token);

// Check if token is intended for our app
if ($payload && $payload['aud'] == $CLIENT_ID) {
    $email = $payload['email'];

    /*
     * Check if user already exists in database and create otherwise!
     */

    session_start();
    $_SESSION['email'] = $email;
}
// Return an error otherwise
else {
    header($_SERVER['SERVER_PROTOCOL'] . ' 400 Login failed');
}
```

So what did we do here?

Utilizing composer's autoload-feature we included the API library into our project. With our OAuth Client-ID and the token we got from the frontend we can fire an API-request to verify our token.

Why don't we just the unique Google-ID we got from the JavaScript-request to store and identify the user? Because an attacker could easily send arbitrary user IDs trying to impersonate users. To mitigate that we're sending Google the token asking "Is this user connected to my app?". If so, Google's response will contain all the information the user granted our app permission to access. You can read about this process in more detail [here](https://developers.google.com/identity/sign-in/web/backend-auth).

Now that we confirmed the login-request is legit, we can check for the user in our database or create a new account on the fly. I will leave this part of the implementation to you as it would only clutter our code right now but isn't required for demonstrating the functionality. To complete the login, we start a session and store the e-mail-address in it.

### Back to the Frontend

Remember the \`private.php\` we're redirecting the user to after successful verification? That's still missing, so let's create it!

```php { linenos=table }
<?php
session_start();
if (!isset($_SESSION['email'])) {
    header('Location: index.php');
}
?>
<!DOCTYPE html>
    <head>
        <title>Private</title>
    </head>
    <body>
        <h1>Hello <?= $_SESSION['email']; ?></h1>
    </body>
</html>
```

Basic stuff in here. We're checking if the user is logged in (which is true when there's an e-mail-address stored in the session). If not, we're redirecting to the index page.

If the user is already logged in, the login page should not be displayed, so let's add a redirection to \`index.php\` as well:

```php { linenos=table }
<?php
session_start();
if (isset($_SESSION['email'])) {
    header('Location: private.php');
}
?>
<!DOCTYPE html>
<!-- The rest of the login page -->
```

### Logging out

Note that when the user logs out of the connected Google account, it will will automatically be disconnected from all linked apps. Allowing the user to logout of our app without having to log out of the Google account is also possible. It added way more code than I expected, but here it comes, in case you're interested. For simplicity's sake, here's the entire `private.php` with added logout-functionality:

```php { linenos=table }
<?php
session_start();
if (!isset($_SESSION['email'])) {
    header('Location: index.php');
}
?>
<html>
    <head>
        <title>Private</title>
        <meta charset="utf-8" />
        <meta name="google-signin-client_id" content="YOUR_CLIENT_ID_GOES_HERE" />
        <script src="https://apis.google.com/js/platform.js?onload=onLoad" async defer></script>
    </head>
    <body>
        <h1>Hello <?= $_SESSION['email']; ?></h1>
        <button id="signout">Sign Out</button>

        <script>
            function onLoad() {
                gapi.load('auth2', function() {
                    gapi.auth2.init();
                });
            }

            signout.addEventListener("click", function() {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function() {
                    signOut();
                });
            });

            function signOut() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'logout.php');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function(e) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            window.location = "index.php";
                        }
                        else {
                            alert("Error: " + xhr.statusText);
                        }
                    }
                }
                xhr.send();
            }
        </script>
    </body>
</html>
```

Disconnecting our app from Google requires the `platform.js` again, but this time we add a callback to our function `onLoad()` on account of asynchronous loading.

In the `onLoad()` we're doing some initialization so everything is ready when the user hits the "Sign Out" button.

This will first logout the user from our site as far as Google is concerned. Once that's done, we take care of the logout from our own server with a call to `logout.php` and a redirection to the `index.php`.

Our `logout.php` does nothing fancy, just blindly throwing away the current session:

```php { linenos=table }
<?php
session_start();
session_destroy();
```

### Conclusion

There we have it! A fully functional Google Sign-In. You can use it as the only way to login or as an alternative to your standard mail-password-login. All in all there's not a lot of code required to make your website even more accessible.
