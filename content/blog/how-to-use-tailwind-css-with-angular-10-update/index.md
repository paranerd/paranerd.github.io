---
title: 'How to Use Tailwind CSS With Angular 10 (Update)'
date: '2020-10-25T09:01:34+01:00'
draft: false
author: paranerd
---

This is an update to my previous article on how to set up TailwindCSS with Angular 10. Apparently, packages since got updates, which change some of the steps required. Also I’ll show you a hassle-free one-line-solution that takes care of all the configuration. Amazing content coming up!

## The easy way

First let me show you the lazy man’s solution. From within your project folder simply call:

```bash
ng add @ngneat/tailwind
```

This will install all the necessary packages as well as add and update configurations accordingly. When being promped, select SCSS as your “stylesheet flavor”. That’s right, that’s all there is to it. Thanks to the awesome team from [ngneat](https://github.com/ngneat/tailwind) for providing this!

You could stop here, but if you want to know what exactly is happening “under the hood” not least to be able to tweak things down the road, you should keep on reading!

## Angular prerequisites

For this tutorial I assume you already have Angular 10 installed on your machine. You can check the [official documentation](https://angular.io/guide/setup-local) if you don’t or [this tool](https://update.angular.io/) if you need to upgrade. You can either follow along with your existing project or create a new one from scratch by running:

```bash
ng new angular-tailwind-example --style=scss --routing=true
```

This creates a project named `angular-tailwind-example` for us. You may call it however you like, just make sure to set it accordingly in some of the folling commands.

## Installing dependencies

```bash
npm i -D tailwindcss postcss postcss-import postcss-loader postcss-scss @angular-builders/custom-webpack
```

## Setting up the configuration

We still need two files to control our Tailwind setup: `tailwind.config.js` and `webpack.config.js`. The content differs greatly, however.

First, create a file named `tailwind.config.js` in your project’s root and enter the following content:

```js
module.exports = (isProd) => ({
    prefix: '',
    future: {
      removeDeprecatedGapUtilities: true,
      purgeLayersByDefault: true
    },
    purge: {
      enabled: isProd,
      content: ['**/*.html', '**/*.ts']
    },
    theme: {},
    plugins: [
        require('@tailwindcss/custom-forms'),
    ],
});
```

Next create a file named `webpack.config.js`, also in project root, with the following content:

```js
const merge = require('webpack-merge');

module.exports = (config) => {
  const isProd = config.mode === "production";
  const tailwindConfig = require("./tailwind.config.js")(isProd);

  return merge(config, {
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              ident: 'postcss',
              syntax: 'postcss-scss',
              plugins: [
                require('postcss-import'),
                require('tailwindcss')(tailwindConfig),
                require('autoprefixer'),
              ]
            }
          }
        }
      ]
    }
  });
};
```

The end result of what those files do is exactly the same as in the previous version, but now we’re leveraging Tailwind’s integrated purging instead of setting it up ourselves

## Tell Angular

As before, to let Angular know about our custom config, run the following commands (after adjusting the `angular-tailwind-example` part to match the name of your project):

```bash
echo "Enter project name:" && read projectname && \
ng config projects.${projectname}.architect.build.builder @angular-builders/custom-webpack:browser && \
ng config projects.${projectname}.architect.build.options.customWebpackConfig.path webpack.config.js && \
ng config projects.${projectname}.architect.serve.builder @angular-builders/custom-webpack:dev-server && \
ng config projects.${projectname}.architect.serve.options.customWebpackConfig.path webpack.config.js
```

Now your `angular.json` is updated to use the custom configs and you’re ready to

```bash
ng serve
```

Congratulations! You just successfully set up TailwindCSS in Angular!

## Conclusion

The current solution outlined in this post is far superior to the previous one because we can use up-to-date dependencies and leverage more built-in functionality instead of implementing our own, which usually saves us some trouble and compatibility issues. When going the ngneat/tailwind route, things could hardly get any easier and I would highly recommend it simply for being less error prone.

Did this setup work for you? Do you have an even easier way of doing it? Let me know in the comments!
