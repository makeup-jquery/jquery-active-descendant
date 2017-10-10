/**
* @file jQuery collection plugin that implements one-dimensional aria-activedescendant keyboard navigation
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.16.1
* @requires jquery
* @requires jquery-linear-navigation
* @requires jquery-grid-navigation
* @requires jquery-next-id
*/
(function($, window, document, undefined) {
    var pluginName = 'jquery-active-descendant';

    /**
    * jQuery collection plugin that implements aria-activedescendant keyboard navigation on given widgets
    *
    * @method "jQuery.fn.activeDescendant"
    * @param {string} focusItemSelector - targets the focusable descendant item (in relation to widget)
    * @param {string} descendantItemsSelector - targets the descendant items (in relation to widget) that can be active
    * @param {string} [options.activeIndex] - specify the initial active item by index position (default: 0)
    * @param {boolean} [options.autoInit] - initialise the navigation model before a key is pressed (default: false)
    * @param {boolean} [options.autoReset] - reset the navigation model when focus is lost (default: true)
    * @param {boolean} [options.autoWrap] - keyboard focus wraps from last to first & vice versa (default: false)
    * @param {string} [options.axis] - set arrow key axis to x, y or both (default: both)
    * @param {boolean} [options.disableHomeAndEndKeys] - disable HOME and END key functionality (default: false)
    * @fires activeDescendantChange - when active descendant changes
    * @fires gridNavigationBoundary - when a grid boundary is hit
    * @listens linearNavigationItemsChange - for changes to linear navigation items
    * @listens gridNavigationItemsChange - for changes to grid navigation items
    * @return {jQuery} chainable jQuery class
    */
    $.fn.activeDescendant = function activeDescendant(
        focusItemSelector, ownedItemSelector, descendantItemsSelector, options
    ) {
        options = $.extend({
            activeIndex: 0,
            autoInit: false,
            autoReset: true,
            autoWrap: false,
            axis: 'both',
            debug: false,
            disableHomeAndEndKeys: false,
            isGrid: false
        }, options);

        return this.each(function onEachActiveDescendant() {
            if ($.data(this, pluginName) === undefined) {
                // the widget is the root level element/container
                var $widget = $(this);

                // the focus item is the focusable element that has active descendants
                var $focusItem = $widget.find(focusItemSelector);

                // we keep a reference to the element that is programmatically 'owned' by the focus item
                var $ownedElement = $widget.find(ownedItemSelector);

                // we keep a reference to the actual items that can be navigated
                var $descendantItems;

                // all dom manipulation after keyboard input is done here
                var updateByIndex = function updateByIndex(fromIndex, toIndex) {
                    if (toIndex >= 0) {
                        var $currentActiveDescendant = $($descendantItems.eq(fromIndex));
                        var $newActiveDescendant = $($descendantItems.eq(toIndex));

                        // update the aria-activedescendant pointer
                        $focusItem.attr('aria-activedescendant', $newActiveDescendant.prop('id'));

                        // update the aria-selected state (needed for voiceover)
                        $currentActiveDescendant.removeAttr('aria-selected');
                        $newActiveDescendant.attr('aria-selected', 'true');

                        // inform observers of change
                        $newActiveDescendant.trigger('activeDescendantChange', {
                            fromIndex: fromIndex,
                            toIndex: toIndex
                        });
                    }
                };

                var onNavigationReset = function onNavigationReset(e, data) {
                    var $currentActiveDescendant = $($descendantItems.eq(data.fromIndex));
                    $currentActiveDescendant.removeAttr('aria-selected');
                };

                var onNavigationChange = function onNavigationChange(e, data) {
                    updateByIndex(data.fromIndex, data.toIndex);
                };

                // initialise or update descendant items reference
                var updateActiveDescendantItems = function updateActiveDescendantItems() {
                    // update our cached items
                    $descendantItems = $widget.find(descendantItemsSelector);

                    // ensure items have an id
                    $descendantItems.nextId();
                };

                var onNavigationItemsChange = function onNavigationItemsChange(e, data) {
                    updateActiveDescendantItems(data || {});
                };

                // ensure container has an id
                $ownedElement.nextId();

                // focus item must programatically 'own' the container of descendant items
                $focusItem.attr('aria-owns', $ownedElement.prop('id'));

                // listen for updates from linear-navigation plugin
                $widget.on('linearNavigationItemsChange gridNavigationItemsChange', onNavigationItemsChange);

                // remove active descendant attr and class when widget loses focus
                if (options.autoReset === true) {
                    $focusItem.on('blur', function onFocusItem() {
                        $focusItem.removeAttr('aria-activedescendant');
                        $widget.find('[aria-selected=true]').removeAttr('aria-selected');
                    });
                }

                $widget.on('linearNavigationReset gridNavigationReset', onNavigationReset);

                // listen to linearNavigationChange & gridNavigationChange events
                $widget.on(
                    'linearNavigationInit gridNavigationInit linearNavigationChange gridNavigationChange',
                    onNavigationChange
                );

                // initialise descendant item state on first pass
                updateActiveDescendantItems();

                // Use a navigation plugin. This plugin holds state.
                if (options.isGrid === true) {
                    $widget.gridNavigation(descendantItemsSelector, options);
                } else {
                    $widget.linearNavigation(descendantItemsSelector, options);
                }

                // prevent textbox caret from moving when controlling active descendant with arrow keys
                $focusItem.on('keydown', function onFocusItemKeyDown(e) {
                    var keyCode = e.keyCode;
                    if (options.axis === 'x' && (keyCode === 37 || keyCode === 39)) {
                        e.preventDefault();
                    } else if (options.axis === 'y' && (keyCode === 38 || keyCode === 40)) {
                        e.preventDefault();
                    } else if (options.axis === 'both' && keyCode >= 37 && keyCode <= 40) {
                        e.preventDefault();
                    }
                });

                // store data on widget
                $widget.data(pluginName, { installed: true });
            } else if (options.debug === true) {
                console.log('info: {pluginName} is already installed on {element}'.replace('{pluginName}', pluginName)
                    .replace('{element}', this));
            }
        });
    };
}(jQuery, window, document));

/**
* The jQuery plugin namespace.
* @external "jQuery.fn"
* @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
*/

/**
* activeDescendantChange event
*
* @event activeDescendantChange
* @type {object}
* @property {object} event - event object
* @property {object} newActiveDescendant - new active descendant element
*/

/**
* gridNavigationBoundary event
* @event gridNavigationBoundary
* @type {object}
* @property {object} event - event object
* @property {object} data - event data params
* @param {string} [data.boundary] - top, bottom, left or right
* @param {string} [data.fromIndex] - old collection idx position
* @param {string} [data.toIndex] - new collection idx position
*/
