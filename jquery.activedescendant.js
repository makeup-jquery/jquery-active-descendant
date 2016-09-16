/**
* @file jQuery collection plugin that implements one-dimensional aria-activedescendant keyboard navigation
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.12.1
* @requires jquery
* @requires jquery-linear-navigation
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
    * @fires activeDescendantChange - when active descendant changes
    * @listens activeDescendantItemsChange - for changes to descendant items
    * @return {jQuery} chainable jQuery class
    * @todo maybe offer an option to listen to 'input' events on the focus item (i.e. autocomplete use-case)
    */
    $.fn.activeDescendant = function activeDescendant(focusItemSelector, descendantItemsSelector) {
        return this.each(function onEach() {
            // the widget is the root level element/container
            var $widget = $(this);

            // the focus item is the focusable element that has active descendants
            var $focusItem = $widget.find(focusItemSelector);

            // we keep a reference to the actual items that can be navigated
            var $descendantItems;

            // we keep a reference to the common ancestor of the items
            var $descendantItemsContainer;

            // retrieve the common ancestor of descendant items (i.e. the container element)
            function getDescendantItemsCommonAncestor() {
                return $descendantItems.first().parents().has($descendantItems.last()).first();
            }

            // all dom manipulation after keyboard input is done here
            function update(currentActiveDescendant, newActiveDescendant) {
                var $currentActiveDescendant = $(currentActiveDescendant);
                var $newActiveDescendant = $(newActiveDescendant);

                // update the aria-activedescendant pointer
                $focusItem.attr('aria-activedescendant', $newActiveDescendant.prop('id'));

                // update the aria-selected state (needed for voiceover)
                $currentActiveDescendant.removeAttr('aria-selected');
                $newActiveDescendant.attr('aria-selected', 'true');

                // inform observers of change
                $widget.trigger('activeDescendantChange', $newActiveDescendant);
            }

            function onLinearNavigationChange(e, data) {
                update($descendantItems.eq(data.fromIndex), $descendantItems.eq(data.toIndex));
            }

            // initialise or update descendant items reference
            function updateActiveDescendantItems() {
                $descendantItems = $widget.find(descendantItemsSelector);

                // ensure items have an id
                $descendantItems.nextId();

                // on first pass retrieve and store descendant items container reference
                if ($descendantItemsContainer === undefined && $descendantItems.length > 0) {
                    $descendantItemsContainer = getDescendantItemsCommonAncestor();

                    // ensure container has an id
                    $descendantItemsContainer.nextId();

                    // focus item must programatically 'own' the container of descendant items
                    $focusItem.attr('aria-owns', $descendantItemsContainer.prop('id'));
                }

                // call linearNavigation plugin. This plugin holds state.
                $widget.linearNavigation(descendantItemsSelector, {activeIndex: -1, clickDelegate: $descendantItems.parent()});
            }

            // listen for updates to descendants (e.g. new autocomplete values)
            // in future maybe use mutation observers?
            $widget.on('activeDescendantItemsChange', updateActiveDescendantItems);

            // remove active descendant attr and class when widget loses focus
            $focusItem.on('blur', function() {
                $focusItem.removeAttr('aria-activedescendant');
                $widget.find('[aria-selected=true]').removeAttr('aria-selected');
            });

            // listen to linearNavigationChange event
            $widget.on('linearNavigationChange', onLinearNavigationChange);

            // initialise state on first pass
            updateActiveDescendantItems();

            // store data on widget
            $.data($widget, pluginName, {installed: true});
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
