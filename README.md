# @ebay/jquery-active-descendant

<p>
    <a href="https://travis-ci.org/ianmcburnie/jquery-active-descendant"><img src="https://api.travis-ci.org/ianmcburnie/jquery-active-descendant.svg?branch=master" alt="Build Status" /></a>
    <a href='https://coveralls.io/github/ianmcburnie/jquery-active-descendant?branch=master'><img src='https://coveralls.io/repos/ianmcburnie/jquery-active-descendant/badge.svg?branch=master&service=github' alt='Coverage Status' /></a>
</p>

jQuery collection plugin that implements dynamic aria-activedescendant keyboard navigation. A common scenario for aria-activedescendant is a combobox input (with or without autocomplete behaviour).

```js
$(input).activeDescendant($collection);
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
<input id="input" />
<ul id="input-suggestions">
    <li>A</li>
    <li>B</li>
    <li>C</li>
</ul>
```

Execute plugin:

```js
$('#input').activeDescendant($('#input-suggestions li'));
```

Output HTML:

```html
<input id="input" aria-activedescendant="input-suggestions-activedescendant" />
<ul id="input-suggestions">
    <li>A</li>
    <li>B</li>
    <li>C</li>
</ul>
```

First down arrow key produces:

```html
<input id="input" aria-activedescendant="input-suggestions-activedescendant" />
<ul id="input-suggestions">
    <li id="input-suggestions-activedescendant">A</li>
    <li>B</li>
    <li>C</li>
</ul>
```

Next down arrow key produces:

```html
<input id="input" aria-activedescendant="input-suggestions-activedescendant" />
<ul id="input-suggestions">
    <li>A</li>
    <li id="input-suggestions-activedescendant">B</li>
    <li>C</li>
</ul>
```

To listen for active descendant change:

```js
$('#input').on('activeDescendantChange', function(e, newActiveDescendant) {});
```

To update the active descendant collection:

```js
$('#input').trigger('updateActiveDescendantCollection', [$newCollection]);
```

## Params

* `collection` - the collection of descendants (not always DOM siblings!)

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
* `npm run lint` lints code and reports to jshint.txt
* `npm run minify` builds minified version of code
* `npm run build` cleans, lints, tests and minifies (called on `npm prepublish` hook)
* `npm run clean` deletes all generated test reports and coverage files

## Reports

Each test run will generate the following reports:

* `/test_reports/coverage` contains Istanbul code coverage report
* `/test_reports/html` contains HTML test report
* `/test_reports/junit` contains JUnit test report

## CI Build

https://travis-ci.org/ianmcburnie/jquery-active-descendant

## Code Coverage

https://coveralls.io/github/ianmcburnie/jquery-active-descendant?branch=master
