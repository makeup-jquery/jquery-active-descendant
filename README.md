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
$(widgetSelector).activeDescendant(focusableItemSelector, ownedItemSelector, descendantItemsSelector, options);
```

## Params

* `focusableItemSelector` - selector for focusable item in relation to widget
* `ownedItemSelector` - selector for the item that is programmatically owned by the focusable item (i.e. 'aria-owns')
* `descendantItemsSelector` - selector for pseudo-focusable descendant items in relation to widget
* `options.autoInit`: set initial activedescendant state when plugin executes (default: false)
* `options.autoReset`: reset activedescendant state when focus exits widget (default: true)
* `options.autoWrap`: reaching end of collection will wrap back to beginning, and vice versa (default: false)
* `options.axis` - 'x', 'y' or 'both' (default: 'both')
* `options.disableHomeAndEndKeys`: disable HOME and END key functionality (default: false)
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
$('.widget').activeDescendant('[role=combobox]', '[role=listbox]', '[role=option]', { axis: 'y'});
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
$('.widget').activeDescendant('input', 'td', {isGrid: true});
```

## Dependencies

* [jquery](https://jquery.com/)
* [jquery-grid-navigation](https://github.com/ianmcburnie/jquery-grid-navigation)
* [jquery-linear-navigation](https://github.com/ianmcburnie/jquery-linear-navigation)
* [jquery-next-id](https://github.com/ianmcburnie/jquery-next-id)
* [jquery-prevent-scroll-keys](https://github.com/ianmcburnie/jquery-prevent-scroll-keys)

## Development

Useful NPM task runners:

* `npm start` for local browser-sync development.
* `npm test` runs tests & generates reports (see reports section below)
* `npm run tdd` test driven development: watches code and re-tests after any change
* `npm run build` cleans, lints, tests and minifies

Execute `npm run` to view all available CLI scripts.

## CI Build

https://travis-ci.org/ianmcburnie/jquery-active-descendant

## Code Coverage

https://coveralls.io/github/ianmcburnie/jquery-active-descendant?branch=master

## Test Reports

Local test and coverage reports are generated under `.test_reports` folder.

## JSDocs

Local JSDocs are generated under `./jsdoc` folder.
