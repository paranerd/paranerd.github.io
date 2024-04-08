---
title: 'How to Use Tailwind CSS With Angular 10'
date: '2020-10-01T09:01:34+01:00'
draft: false
author: paranerd
categories: 
  - "general"
---

**IMPORTANT UPDATE:** Since the release of this article, some things changed, so the solution described below will very likely no longer work. But don’t worry, I got you covered with my follow-up article!

Some time ago I started using Tailwind CSS to style my web projects. But while Tailwind is a pleasure to use, it was a major pain to get it to work nicely with Angular.

## Installing dependencies

Assuming you have your Angular app installed, in the app’s root folder run:

```bash { linenos=table }
npm i -D tailwindcss postcss-import postcss-loader postcss-scss@2.1.1 @angular-builders/custom-webpack @fullhuman/postcss-purgecss
```

That little `@2.1.1` there solved an issue I spent hours upon hours trying to fix. Most tutorials I found on the web omitted the version tag and seemed to be working fine – when they were written. But as it happens, just 4 days before I attempted my installation, postcss-scss got an update to 3.0.0 which apparently showed some incompatibilities with the rest of the setup leading to all kinds of cryptic error messages.

## Configs

First, run

```bash { linenos=table }
npx tailwind init
```

which will create a file called `tailwind.config.js` in your app’s root directory. Make sure the file’s content looks like this:

```js { linenos=table }
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.html',
    './src/**/*.js',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
```

The purging part is very important, we’ll come back to that in a bit.

Next create a `webpack.config.js`, also in the app’s root, like this:

```js { linenos=table }
const purgecss = require('@fullhuman/postcss-purgecss')({
    // Specify the paths to all of the template files in your project
    content: [
        './src/**/*.html',
        './src/**/*.vue',
        './src/**/*.jsx',
        './src/**/*.component.ts',
        // etc.
    ],

    // This is the function used to extract class names from your templates
    defaultExtractor: content => {
        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []

        return broadMatches.concat(innerMatches)
    }
});

module.exports = (config, options) => {
    config.module.rules.push({
        test: /\.scss$/,
        loader: "postcss-loader",
        options: {
            postcssOptions: {
                ident: "postcss",
                syntax: "postcss-scss",
                plugins: [
                    require("postcss-import"),
                    require("tailwindcss"),
                    require("autoprefixer"),
                    ...(config.mode === 'production' ? [purgecss] : [])
                ],
            },
        },
    });

    return config;
};
```

What this does is using `autoprefixer` to add all the necessary vendor prefixes to your styles, then using `tailwindcss` to process the Tailwind classes and then run everything through `postcss` converting SCSS to plain CSS.

One of the most important steps, however, is using `purgecss` to get rid of unused classes. More on that in the next section.

## Getting rid of the clutter

You can get Tailwind CSS to work without `purgecss`, but I would definitely not recommend it. Utilizing it brought the size of my bundled `styles.scss` from ~2.2MB to ~15kB in one of my projects, so the difference is quite significant!

## Letting Angular know

Now that we have a lot of new files in place, we have to actually let Angular know they exist. You could go ahead and edit your `angular.json` manually (as I did on my first couple of attempts – not particularly joyful!) or simply run the following commands (make sure to adjust the `angular-tailwind-example` part of each line if necessary):

```bash { linenos=table }
ng config projects.angular-tailwind-example.architect.build.builder @angular-builders/custom-webpack:browser
ng config projects.angular-tailwind-example.architect.build.options.customWebpackConfig.path webpack.config.js
ng config projects.angular-tailwind-example.architect.serve.builder @angular-builders/custom-webpack:dev-server
ng config projects.angular-tailwind-example.architect.serve.options.customWebpackConfig.path webpack.config.js
```

Last thing to do is to incorporate Tailwind into our `styles.scss` by putting the following right at the top:

```css { linenos=table }
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

## Conclusion

You should now be all set up to use Tailwind CSS in your Angular project. I hope you found this tutorial before wasting valuable hours of your life trying to make sense of the mess you created! Head over to their amazing [documentation](https://tailwindcss.com/docs) to learn more about how to leverage Tailwind to its full potential. Do you get stuck setting up Tailwind (things might likely not be up-to-date 6 months from now^^), please let me know in the comments so we can update this guide!
