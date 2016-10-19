/**
* @file jQuery collection plugin that implements one-dimensional aria-activedescendant keyboard navigation
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.15.0
* @requires jquery
* @requires jquery-linear-navigation
* @requires jquery-grid-navigation
* @requires jquery-next-id
* @requires jquery-prevent-scroll-keys
*/
(function($, window, document, undefined) {
    var pluginName = 'jquery-active-descendant';

    /**
    * jQuery collection plugin that implements aria-activedescendant keyboard navigation on given widgets
    *
    * @method "jQuery.fn.activeDescendant"
    * @param {string} focusItemSelector - targets the focusable descendant item (in relation to widget)
    * @param {string} descendantItemsSelector - targets the descendant items (in relation to widget) that can be active
    * @fires activeDescendantChange - when active descendant changes
    * @listens activeDescendantItemsChange - for changes to descendant items
    * @return {jQuery} chainable jQuery class
    */
    $.fn.activeDescendant = function activeDescendant(focusItemSelector, ownedItemSelector, descendantItemsSelector, options) {
        options = $.extend({
            autoWrap: false,
            axis: 'both',
            isGrid: false,
            autoReset: true,
            autoInit: false,
            debug: false,
            disableHomeAndEndKeys: false
        }, options);

        return this.each(function onEach() {
            if ($.data(this, pluginName) === undefined) {
                // the widget is the root level element/container
                var $widget = $(this);

                // the focus item is the focusable element that has active descendants
                var $focusItem = $widget.find(focusItemSelector);

                // we keep a reference to the actual items that can be navigated
                var $descendantItems;

                // we keep a reference to the element that is programmatically 'owned' by the focus item
                var $ownedElement = $widget.find(ownedItemSelector);

                // ensure container has an id
                $ownedElement.nextId();

                // focus item must programatically 'own' the container of descendant items
                $focusItem.attr('aria-owns', $ownedElement.prop('id'));

                // all dom manipulation after keyboard input is done here
                var update = function(currentActiveDescendant, newActiveDescendant, data) {
                    var $currentActiveDescendant = $(currentActiveDescendant);
                    var $newActiveDescendant = $(newActiveDescendant);

                    // update the aria-activedescendant pointer
                    $focusItem.attr('aria-activedescendant', $newActiveDescendant.prop('id'));

                    // update the aria-selected state (needed for voiceover)
                    $currentActiveDescendant.removeAttr('aria-selected');
                    $newActiveDescendant.attr('aria-selected', 'true');

                    // inform observers of change
                    $newActiveDescendant.trigger('activeDescendantChange', data);
                };

                var onNavigationChange = function(e, data) {
                    if (data.toIndex >= 0) {
                        update($descendantItems.eq(data.fromIndex), $descendantItems.eq(data.toIndex), data);
                    }
                };

                // initialise or update descendant items reference
                var updateActiveDescendantItems = function() {
                    $descendantItems = $widget.find(descendantItemsSelector);

                    // ensure items have an id
                    $descendantItems.nextId();

                    // Use a navigation plugin. This plugin holds state.
                    if (options.isGrid === true) {
                        $widget.trigger('gridNavigationItemsChange');
                        $widget.gridNavigation(descendantItemsSelector, options);
                    } else {
                        $widget.trigger('linearNavigationItemsChange');
                        $widget.linearNavigation(descendantItemsSelector, options);
                    }
                };

                // listen for updates to descendants (e.g. new autocomplete values)
                // in future maybe use mutation observers?
                $widget.on('activeDescendantItemsChange', updateActiveDescendantItems);

                // remove active descendant attr and class when widget loses focus
                $focusItem.on('blur', function() {
                    $focusItem.removeAttr('aria-activedescendant');
                    $widget.find('[aria-selected=true]').removeAttr('aria-selected');
                });

                // listen to linearNavigationChange & gridNavigationChange events
                $widget.on('linearNavigationInit gridNavigationInit linearNavigationChange gridNavigationChange', onNavigationChange);

                // use plugin to prevent arrow keys from scrolling page
                $widget.preventScrollKeys(focusItemSelector);

                // initialise state on first pass
                updateActiveDescendantItems();

                // prevent textbox caret from moving when controlling active descendant with arrow keys
                $focusItem.on('keydown', function(e) {
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
                $widget.data(pluginName, {installed: true});
            } else if (options.debug === true) {
                console.log('info: {pluginName} is already installed on {element}'.replace('{pluginName}', pluginName).replace('{element}', this));
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
* activeDescendantItemsChange event
*
* @event activeDescendantItemsChange
* @type {object}
* @property {object} event - event object
*/
