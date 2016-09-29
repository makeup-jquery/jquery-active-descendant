# jquery-active-descendant

<p>
    <a href="https://travis-ci.org/ianmcburnie/jquery-active-descendant"><img src="https://api.travis-ci.org/ianmcburnie/jquery-active-descendant.svg?branch=master" alt="Build Status" /></a>
    <a href='https://coveralls.io/github/ianmcburnie/jquery-active-descendant?branch=master'><img src='https://coveralls.io/repos/ianmcburnie/jquery-active-descendant/badge.svg?branch=master&service=github' alt='Coverage Status' /></a>
    <a href="https://david-dm.org/ianmcburnie/jquery-active-descendant"><img src="https://david-dm.org/ianmcburnie/jquery-active-descendant.svg" alt="Dependency status" /></a>
    <a href="https://david-dm.org/ianmcburnie/jquery-active-descendant#info=devDependencies"><img src="https://david-dm.org/ianmcburnie/jquery-active-descendant/dev-status.svg" alt="devDependency status" /></a>
</p>

jQuery collection plugin that implements one or two dimensional aria-activedescendant keyboard navigation. A common scenario for aria-activedescendant is a combobox input (with or without autocomplete behaviour) or date picker grid.

## Install

```js
npm install jquery-active-descendant
```

## Experimental

This plugin is still in an experimental state, until it reaches v1.0.0 you must consider all minor releases as breaking changes. Patch releases may introduce new features, but will be backwards compatible.

## Signature

```js
$(input).activeDescendant(focusableItemSelector, descendantItemsSelector, options);
```

## Params

* `focusableItemSelector` - selector for focusable item in relation to widget
* `descendantItemsSelector` - selector for pseudo-focusable descendant items in relation to widget
* `options.isGrid` - set to true to use two-dimensional navigation (default: false)

## Triggers

* `activeDescendantChange` - when active descendant has changed

## Observes

* `activeDescendantItemsChange` - when collection of active descendant items has been updated

## Example - One Dimensional

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
    <input role="combobox" aria-owns="nid-3" />
    <ul role="listbox" id="nid-3">
        <li role="option" id="nid-0">A</li>
        <li role="option" id="nid-1">B</li>
        <li role="option" id="nid-2">C</li>
    </ul>
</div>
```

First down arrow key produces:

```html
<div class="widget">
    <input role="combobox" aria-owns="nid-3" aria-activedescendant="nid-0" />
    <ul role="listbox" id="nid-3">
        <li role="option" id="nid-0" aria-selected="true">A</li>
        <li role="option" id="nid-1">B</li>
        <li role="option" id="nid-2">C</li>
    </ul>
</div>
```

Next down arrow key produces:

```html
<div class="widget">
    <input role="combobox" aria-owns="nid-3" aria-activedescendant="nid-1" />
    <ul role="listbox" id="nid-3">
        <li role="option" id="nid-0">A</li>
        <li role="option" id="nid-1" aria-selected="true">B</li>
        <li role="option" id="nid-2">C</li>
    </ul>
</div>
```

## Example - Two Dimensional

Input HTML:

```html
<div class="widget">
    <input type="text">
    <table>
        <tbody>
            <tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>
            <tr><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr>
            <tr><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td></tr>
        </tbody>
    </table>
</div>
```

Execute plugin:

```js
$('.widget').activeDescendant('table', 'td', {isGrid: true});
```

## Dependencies

* [jquery](https://jquery.com/)
* [jquery-grid-navigation](https://github.com/ianmcburnie/jquery-grid-navigation)
* [jquery-linear-navigation](https://github.com/ianmcburnie/jquery-linear-navigation)
* [jquery-next-id](https://github.com/ianmcburnie/jquery-next-id)

## Development

Run `npm start` or `npm run tdd` for local development. All tests are located in `test.js`.

Execute `npm run` to view all available CLI scripts:

* `npm start` runs local server and re-syncs browser on any source file change
* `npm test` runs tests & generates reports (see reports section below)
* `npm run tdd` test driven development: watches code and re-tests after any change
* `npm run lint` lints code for syntax and style
* `npm run fix` attempts to auto fix style errors
* `npm run build` minifies code and generates jsdocs

The following hooks exist, and do not need to be invoked manually:

* `npm prepublish` cleans, lints, tests and builds on every `npm publish` command
* `pre-commit` cleans, lints, tests and builds on every `git commit` command

## CI Build

https://travis-ci.org/ianmcburnie/jquery-active-descendant

## Code Coverage

https://coveralls.io/github/ianmcburnie/jquery-active-descendant?branch=master

## Test Reports

Local test and coverage reports are generated under `.test_reports` folder.

## JSDocs

Local JSDocs are generated under `./jsdoc` folder.
