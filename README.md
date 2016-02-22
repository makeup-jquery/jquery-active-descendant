# @ebay/jquery-active-descendant

<p>
    <a href="https://travis-ci.org/ianmcburnie/jquery-active-descendant"><img src="https://api.travis-ci.org/ianmcburnie/jquery-active-descendant.svg?branch=master" alt="Build Status" /></a>
    <a href='https://coveralls.io/github/ianmcburnie/jquery-active-descendant?branch=master'><img src='https://coveralls.io/repos/ianmcburnie/jquery-active-descendant/badge.svg?branch=master&service=github' alt='Coverage Status' /></a>
</p>

jQuery collection plugin that implements dynamic aria-activedescendant keyboard navigation. A common scenario for aria-activedescendant is a combobox input (with or without autocomplete behaviour).

```js
$(input).activeDescendant(focusableItemSelector, descendantItemsSelector);
```

## Experimental

This plugin is still in an experimental state, until it reaches v1.0.0 you must consider all minor releases as breaking changes. Patch releases may introduce new features, but will be backwards compatible.

## Install

```js
npm install @ebay/jquery-active-descendant
```

## Example

Input HTML:

```html
<div class="widget">
    <input role="combobox" />
    <ul role="listbox">
        <li role="option">A</li>
        <li role="option">B</li>
        <li role="option">C</li>
    </ul>
</div>
```

Execute plugin:

```js
$('.widget').activeDescendant('[role=combobox]', '[role=option]');
```

Output HTML:

```html
<div class="widget">
    <input role="combobox" />
    <ul role="listbox">
        <li role="option" id="nid-0">A</li>
        <li role="option" id="nid-1">B</li>
        <li role="option" id="nid-2">C</li>
    </ul>
</div>
```

First down arrow key produces:

```html
<div class="widget">
    <input role="combobox" aria-activedescendant="nid-0" />
    <ul role="listbox">
        <li role="option" id="nid-0" class="activedescendant">A</li>
        <li role="option" id="nid-1">B</li>
        <li role="option" id="nid-2">C</li>
    </ul>
</div>
```

Next down arrow key produces:

```html
<div class="widget">
    <input role="combobox" aria-activedescendant="nid-1" />
    <ul role="listbox">
        <li role="option" id="nid-0">A</li>
        <li role="option" id="nid-1" class="activedescendant">B</li>
        <li role="option" id="nid-2">C</li>
    </ul>
</div>
```

To listen for active descendant change:

```js
$('.widget').on('activeDescendantChange', function(e, newActiveDescendant) {});
```

To update the active descendant collection:

```js
$('.widget').trigger('updateActiveDescendantCollection', [$newCollection]);
```

## Params

* `focusableItemSelector` - selector for focusable item in relation to widget
* `descendantItemsSelector` - selector for pseudo-focusable descendant items in relation to widget

## Events

* `activeDescendantChange` - when active descendant has changed
* `updateActiveDescendantCollection` - update the active descendant collection

## Dependencies

* [jquery](https://jquery.com/)
* [@ebay/jquery-next-id](https://github.com/ianmcburnie/jquery-next-id)
* [@ebay/jquery-common-keydown](https://github.com/ianmcburnie/jquery-common-keydown)

## Development

Run `npm start` for test driven development. All tests are located in `test.js`.

Execute `npm run` to view all available CLI scripts:

* `npm start` test driven development: watches code and re-tests after any change
* `npm test` runs tests & generates reports (see reports section below)
* `npm run lintsyntax` lints code for syntax and style (reports errors to jshint.txt)
* `npm run lintstyle` lints code for syntax (reports errors to jscs.txt)
* `npm run lint` lints code for syntax and style
* `npm run fixstyle` attempts to auto fix style errors
* `npm run minify` builds minified version of code
* `npm run jsdoc` generates jsdocs
* `npm run build` minifies code and generates jsdocs
* `npm run clean` deletes all generated files

The following hooks exist, and do not need to be invoked manually:

* `npm prepublish` cleans, lints, tests and builds on every `npm publish` command
* `pre-commit` cleans, lints, tests and builds on every `git commit` command

## Test Reports

Each test run will generate the following reports:

* `/test_reports/coverage` contains Istanbul code coverage report
* `/test_reports/html` contains HTML test report
* `/test_reports/junit` contains JUnit test report

## JSDocs

JSDocs are generated under `./jsdoc` folder.

## CI Build

https://travis-ci.org/ianmcburnie/jquery-active-descendant

## Code Coverage

https://coveralls.io/github/ianmcburnie/jquery-active-descendant?branch=master
