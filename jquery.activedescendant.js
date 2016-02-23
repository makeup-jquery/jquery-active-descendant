/**
 * @file jQuery collection plugin that implements aria-activedescendant keyboard navigation on given widgets
 * @author Ian McBurnie <ianmcburnie@hotmail.com>
 */

(function($, window, document, undefined) {

    var pluginName = 'jquery-active-descendant';

    /**
    * jQuery definition to anchor JsDoc comments.
    *
    * @see http://jquery.com/
    * @name $
    * @class jQuery Library
    */

    /**
    * jQuery 'fn' definition to anchor JsDoc comments.
    *
    *
    * @see http://jquery.com/
    * @name fn
    * @class jQuery Plugin Scope
    * @memberof jQuery
    */

    /**
    * jQuery collection plugin that implements aria-activedescendant keyboard navigation on given widgets
    *
    * @class activeDescendant
    * @version 0.8.0
    * @fires activeDescendantChange - when activedescendant changes
    * @listens updateActiveDescendantCollection - to receive new descendant items
    * @param {string} focusItemSelector - targets the focusable descendant item (in relation to widget)
    * @param {string} descendantItemsSelector - targets the descendant items (in relation to widget) that can be active
    * @return {jQuery} chainable jQuery class
    * @requires @ebay/jquery-next-id
    * @requires @ebay/jquery-common-keydown
    * @memberof jQuery.fn
    */

    /**
    * activeDescendantChange event
    *
    * @event activeDescendantChange
    * @type {object}
    * @property {object} event - event object
    * @property {object} newActiveDescendant - new active descendant element
    * @memberof jQuery.fn.activeDescendant
    */

    /**
    * updateActiveDescendantCollection event
    *
    * @event updateActiveDescendantCollection
    * @type {object}
    * @property {object} newActiveDescendantCollection - new active descendant collection
    * @memberof jQuery.fn.activeDescendant
    */

    $.fn.activeDescendant = function activeDescendant(focusItem, descendantItems) {

        return this.each(function onEach() {

            var $widget = $(this);
            var $focusItem = $widget.find(focusItem);
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

            // listen for updates to descendants (e.g. new autocomplete values)
            $widget.on('updateActiveDescendantCollection', function(e, collection) {
                $descendantItems = $widget.find(collection);

                // ensure items have an id
                $descendantItems.nextId();

                // store index position in element data. remember, descendants are not always siblings in DOM!
                $descendantItems.each(function(idx, itm) {
                    $(itm).data(pluginName, {'idx': idx});
                });

                // on first pass retrieve and store descendant items container reference
                if ($descendantItemsContainer === undefined) {
                    $descendantItemsContainer = getDescendantItemsCommonAncestor();

                    // ensure container has an id
                    $descendantItemsContainer.nextId();

                    // focus item must programatically 'own' the container of descendant items
                    $focusItem.attr('aria-owns', $descendantItemsContainer.prop('id'));
                }
            });

            // remove active descendant attr and class when widget loses focus
            $focusItem.on('blur', function() {
                $focusItem.removeAttr('aria-activedescendant');
                $widget.find('[aria-selected=true]').removeAttr('aria-selected');
            });

            // on down arrow key: find out the current & new active descendant and update the DOM
            $focusItem.on('downArrowKeyDown', function onDownArrowKeyDown(e) {
                if ($descendantItems.size() > 0) {
                    var $activeDescendant = $widget.find('#' + $focusItem.attr('aria-activedescendant'));
                    var $newActiveDescendant;

                    if ($activeDescendant.size() === 0) {
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
                if ($descendantItems.size() > 0) {
                    var $activeDescendant = $widget.find('#' + $focusItem.attr('aria-activedescendant'));
                    var $newActiveDescendant;

                    if ($activeDescendant.size() === 0) {
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

            if (descendantItems) {
                $widget.trigger('updateActiveDescendantCollection', [descendantItems]);
            }
        });
    };

}(jQuery, window, document));
