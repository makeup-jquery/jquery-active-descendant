/**
 * @file jQuery collection plugin that implements dynamic aria-activedescendant keyboard navigation
 * @author Ian McBurnie <ianmcburnie@hotmail.com>
 */

(function($, window, document, undefined) {

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
    * jQuery collection plugin that implements dynamic aria-activedescendant keyboard navigation
    *
    * @class activeDescendant
    * @version 0.6.1
    * @param {object} collection - the jQuery collection of active descendant candidates
    * @fires activeDescendantChange - when activedescendant changes
    * @listens updateActiveDescendantCollection - to receive new descendant items
    * @param {object} options
    * @param {boolean} options.useFixedActiveDescendantId - Use a fixed active descendant (default:false)
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

    $.fn.activeDescendant = function activeDescendant(collection, options) {

        options = options || {};

        return this.each(function onEach() {

            var $this = $(this);
            var id = $this.prop('id');
            var useFixedActiveDescendantId = options.useFixedActiveDescendantId;
            var fixedActiveDescendantId;
            var $descendants;

            var getCurrentActiveDescendant = function() {
                return useFixedActiveDescendantId ? $('#' + fixedActiveDescendantId) : $('#' + $this.attr('aria-activedescendant'));
            };

            var updateActiveDescendantDom = function($activedescendant, $newActiveDescendant) {
                if (useFixedActiveDescendantId) {
                    $activedescendant.removeAttr('id');
                    $newActiveDescendant.prop('id', fixedActiveDescendantId);
                } else {
                    $this.attr('aria-activedescendant', $newActiveDescendant.prop('id'));
                    $activedescendant.removeClass('activedescendant');
                    $newActiveDescendant.addClass('activedescendant');
                }
            };

            $this.nextId();
            $this.commonKeyDown();

            if (useFixedActiveDescendantId) {
                fixedActiveDescendantId = $this.prop('id') + '-activedescendant';
                $this.attr('aria-activedescendant', fixedActiveDescendantId);
            }

            $this.on('updateActiveDescendantCollection', function(e, collection) {
                $descendants = $(collection);
                $descendants.nextId();
                $descendants.each(function(itemIdx) {
                    // store index position in element's dataset
                    // remember, descendants are not always siblings in DOM!
                    $(this).eq(0).data(id, {'activedescendant': itemIdx});
                });
            });

            $this.on('blur', function() {
                if (!useFixedActiveDescendantId) {
                    $('#' + $this.attr('aria-activedescendant')).removeClass('activedescendant');
                    $this.removeAttr('aria-activedescendant');
                }
            });

            $this.on('downArrowKeyDown', function onDownArrowKeyDown(e) {
                var $activedescendant = getCurrentActiveDescendant();
                var $newActiveDescendant;

                if ($activedescendant.size() === 0) {
                    $newActiveDescendant = $descendants.first();
                } else {
                    var itemIdx = $activedescendant.data(id).activedescendant;
                    var $nextEl = $descendants.eq(itemIdx + 1);
                    var hasNextEl = $nextEl.length === 1;
                    var $firstEl = $descendants.eq(0);

                    $newActiveDescendant = (hasNextEl) ? $nextEl : $firstEl;
                }

                updateActiveDescendantDom($activedescendant, $newActiveDescendant);
                $this.trigger('activeDescendantChange', $newActiveDescendant);
            });

            $this.on('upArrowKeyDown', function onUpArrowKeyDown(e) {
                var $activedescendant = getCurrentActiveDescendant();
                var $newActiveDescendant;

                if ($activedescendant.size() === 0) {
                    $newActiveDescendant = $descendants.last();
                } else {
                    var itemIdx = $activedescendant.data(id).activedescendant;
                    var $prevEl = $descendants.eq(itemIdx - 1);
                    var hasPrevEl = $prevEl.length === 1;
                    var $lastEl = $descendants.eq($descendants.length - 1);

                    $newActiveDescendant = (hasPrevEl) ? $prevEl : $lastEl;
                }

                updateActiveDescendantDom($activedescendant, $newActiveDescendant);
                $this.trigger('activeDescendantChange', $newActiveDescendant);
            });

            if (collection) {
                $this.trigger('updateActiveDescendantCollection', [collection]);
            }
        });
    };

}(jQuery, window, document));
