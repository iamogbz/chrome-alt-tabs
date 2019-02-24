# Contributing [:fire:](https://github.com/iamogbz/chrome-alt-tabs/graphs/contributors)

Suggestions and pull requests are highly encouraged! [Open issues](https://github.com/iamogbz/chrome-alt-tabs/issues) are a good place to start.

## Required reading [:notebook:](#getting-started)

- You will need to be familiar with [npm](https://docs.npmjs.com/getting-started/), [webpack](https://webpack.js.org/guides/getting-started/) and [jest](https://jestjs.io/docs/en/getting-started).
- The extension can be build and loaded into Chrome or Firefox locally for QA

## Getting started [:electric_plug:](#check-changes)

Clone the repo and install dependencies:

```sh
git clone git@github.com:iamogbz/chrome-alt-tabs.git
cd chrome-alt-tabs
npm install
```

While making changes or switching branches, run watch to auto build new code:

```sh
npm run watch
```

Start coding!

## Check changes [:hammer_and_wrench:](#writing-test)

Load or reload it in your browser of choice to try out your changes. You will have to reload the extension after making changes, as browsers do not auto reload extensions yet.

| Chrome                                             | Firefox                                              |
| -------------------------------------------------- | ---------------------------------------------------- |
| `chrome://extensions`                              | `about:debugging#addons`                             |
| Check the <strong>Developer mode</strong> checkbox |
| Click on the **Load unpacked extension** button    | Click on the **Load Temporary Add-on** button        |
| Select the folder `chrome-alt-tabs/dist`           | Select the file `chrome-alt-tabs/dist/manifest.json` |

## Writing tests [:construction:](#contributing)

Jest is used and are placed in the `./tests` folder with the same relative path as the file being tests.

Happy contributing :tada:
