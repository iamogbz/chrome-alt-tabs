# Contributing [:fire:](https://github.com/iamogbz/chrome-alt-tabs/graphs/contributors)

Suggestions and pull requests are highly encouraged! [Open issues](https://github.com/iamogbz/chrome-alt-tabs/issues) are a good place to start.

## Required reading [:notebook:](#1)

- You will need to be familiar with [npm](https://docs.npmjs.com/getting-started/), [webpack](https://webpack.js.org/guides/getting-started/) and [jest](https://jestjs.io/docs/en/getting-started).
- The extension can be build and loaded into Chrome or Firefox locally for QA

## Getting started [:electric_plug:](#2)

Clone the repo and install dependencies:

```sh
git clone git@github.com:iamogbz/chrome-alt-tabs.git
cd chrome-alt-tabs
npm install
```

While making changes or switching branches, `run watch` to auto build new code:

```sh
npm run watch
```

Start coding!

## Check changes [:hammer_and_wrench:](#3)

Load or reload it in your browser of choice to try out your changes. You will have to reload the extension after making changes, as browsers do not auto reload extensions yet.

| Chrome                                          | Firefox                                              |
| ----------------------------------------------- | ---------------------------------------------------- |
| `chrome://extensions`                           | `about:debugging#addons`                             |
| Check the **Developer mode** checkbox           |
| Click on the **Load unpacked extension** button | Click on the **Load Temporary Add-on** button        |
| Select the folder `chrome-alt-tabs/dist`        | Select the file `chrome-alt-tabs/dist/manifest.json` |

## Writing tests [:construction:](#0)

Linting and testing is run on commits. To add tests for a file, create a `[name].test.js` file in the `./tests` folder, with the same relative path as the file in the `./src` folder being tested.

```sh
npm run test # to run all tests
```

```sh
npx jest "filename" # to run specific test
```

Happy contributing! :tada:
