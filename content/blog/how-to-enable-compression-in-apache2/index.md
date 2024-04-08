---
title: 'How To Enable Compression In Apache2'
date: '2018-09-21'
author: paranerd
categories:
  - 'server'
---

When running a professional website, one of the major things that you want to do, is making it as fast as possible! Fast loading times lead to more user engagement, satisfied viewers/customers and higher conversion rates. In addition, provided you deliver good content, the faster your page loads, the higher it's ranked in the Google search results. That obviously leads to more visitors in the first place.

Speeding up your website can be done in a myriad of ways. These include caching, limiting the use of images and their resolution and having a sharp eye on installed plugins. One of the easiest ones to implement, however, is compressing as much data sent to the client as possible.

### How does it work?

Without compression enabled, this is what happens, when your navigate to a website:

Browser: "Hey Server! Could you pass me that amazing landing page?"

Server: "Sure! Here you go!"

Waiting...

Some more waiting...

Even more waiting...

Browser: "That took forever! But thanks anyways, I guess..."

There are several methods data can be compressed, two of them are called "deflate" and "gzip". Pretty much all modern browsers support both of them. Here's how this conversation would go down:

Browser: "Hey Server! Could you pass me that amazing landing page? If you could compress it using either 'deflate' or 'gzip', that would be great!"

Server: "Sure! Here you go! I used 'deflate'!"

Browser: "Wow! That was blazing fast! Thank you so much!"

### How to implement it?

In this example, we're running Apache2 and using the 'deflate' method, since it's the easiest to implement. First, we need to enable deflate:

```bash { linenos=table }
a2enmod deflate
```

You might have to restart Apache2 after that

```bash { linenos=table }
sudo service apache2 restart
```

Next, we add the following piece to our .htaccess (make sure you have 'AllowOverride' enabled in your apache2.conf)

```bash { linenos=table }
# Enable Compression
SetOutputFilter DEFLATE

# Compress Text, HTML, JavaScript, CSS and XML
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
```

And that's already it. Pretty simple, wasn't it?

### Real world example

Let's have a look at some real numbers here to see the what compression can do. Before I enabled compression to this website, all the files served to the client when loading the landing page summed up to a whooping total of 6.00MB. And that's despite the fact that all the images had already been compressed. That might not sound like much, but in web development it's huge. Especially on mobile devices and in areas with poor internet connection this might render my page unaccessable for some users. After compression this came down to 3.43MB - that's down to 57%! Here's a neat little chart to illustrate the fact:

![alt text](apache2-compression-comparison-full-page.png 'Apache2 Compression Comparison Full Page')

Remember: the amount of data is "only" halved because some of the data (especially images) had been compressed in the first place. If we were to look at a single "raw" file, like the index-file for example (that's text and thus is being deflated), the numbers are even more amazing! The file itself is a mere 76.54KB in size. This is what will be transferred uncompressed. Enabling deflate brings that down to only 13.73KB - that's 18%!

![alt text](apache2-compression-comparison-single-file.png 'Apache2 Compression Comparison Single File')

### Conclusion

Adding compression to your website is an easy and yet very effective way of speeding up loading times and saving your user's bandwidth. It's also a crucial feature if you want Google to list your page in the top results.
