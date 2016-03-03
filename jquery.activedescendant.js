/**
* @file jQuery collection plugin that implements aria-activedescendant keyboard navigation on given widgets
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.9.0
* @requires jquery
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
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

            var $widget = $(this);
            var $focusItem = $widget.find(focusItemSelector);
            var $descendantItems;
            var $descendantItemsContainer;

            // listen for common key down events
            $focusItem.commonKeyDown();

            // retrieve the common ancestor of descendant items (i.e. the container element)
            function getDescendantItemsCommonAncestor() {
                return $descendantItems.first().parents().has($descendantItems.last()).first();
            }

            // all dom manipulation after arrow key press is done here
            function updateDom($activeDescendant, $newActiveDescendant) {
                $focusItem.attr('aria-activedescendant', $newActiveDescendant.prop('id'));
                $activeDescendant.removeAttr('aria-selected');
                $newActiveDescendant.attr('aria-selected', 'true');
                $widget.trigger('activeDescendantChange', $newActiveDescendant);
            }

            // update descendant items reference
            function updateActiveDescendantItems() {
                $descendantItems = $widget.find(descendantItemsSelector);

                // ensure items have an id
                $descendantItems.nextId();

                // store index position in element data. remember, descendants are not always siblings in DOM!
                $descendantItems.each(function(idx, itm) {
                    $(itm).data(pluginName, {'idx': idx});
                });

                // on first pass retrieve and store descendant items container reference
                if ($descendantItemsContainer === undefined && $descendantItems.length > 0) {
                    $descendantItemsContainer = getDescendantItemsCommonAncestor();

                    // ensure container has an id
                    $descendantItemsContainer.nextId();

                    // focus item must programatically 'own' the container of descendant items
                    $focusItem.attr('aria-owns', $descendantItemsContainer.prop('id'));
                }
            }

            // listen for updates to descendants (e.g. new autocomplete values)
            // in future maybe use mutation observers?
            $widget.on('activeDescendantItemsChange', updateActiveDescendantItems);

            // remove active descendant attr and class when widget loses focus
            $focusItem.on('blur', function() {
                $focusItem.removeAttr('aria-activedescendant');
                $widget.find('[aria-selected=true]').removeAttr('aria-selected');
            });

            // on down arrow key: find out the current & new active descendant and update the DOM
            $focusItem.on('downArrowKeyDown', function onDownArrowKeyDown(e) {
                if ($descendantItems.length > 0) {
                    var $activeDescendant = $widget.find('#' + $focusItem.attr('aria-activedescendant'));
                    var $newActiveDescendant;

                    if ($activeDescendant.length === 0) {
                        $newActiveDescendant = $descendantItems.first();
                    } else {
                        var itemIdx = $activeDescendant.data(pluginName).idx;
                        var $nextEl = $descendantItems.eq(itemIdx + 1);
                        var hasNextEl = $nextEl.length === 1;
                        var $firstEl = $descendantItems.eq(0);

                        $newActiveDescendant = (hasNextEl) ? $nextEl : $firstEl;
                    }

                    updateDom($activeDescendant, $newActiveDescendant);
                }
            });

            // on up arrow key: find out the current & new active descendant and update the DOM
            $focusItem.on('upArrowKeyDown', function onUpArrowKeyDown(e) {
                if ($descendantItems.length > 0) {
                    var $activeDescendant = $widget.find('#' + $focusItem.attr('aria-activedescendant'));
                    var $newActiveDescendant;

                    if ($activeDescendant.length === 0) {
                        $newActiveDescendant = $descendantItems.last();
                    } else {
                        var itemIdx = $activeDescendant.data(pluginName).idx;
                        var $prevEl = $descendantItems.eq(itemIdx - 1);
                        var hasPrevEl = $prevEl.length === 1;
                        var $lastEl = $descendantItems.eq($descendantItems.length - 1);

                        $newActiveDescendant = (hasPrevEl) ? $prevEl : $lastEl;
                    }

                    updateDom($activeDescendant, $newActiveDescendant);
                }
            });

            updateActiveDescendantItems();
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
