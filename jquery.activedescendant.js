/**
* @name jquery-active-descendant
* @function $.fn.activeDescendant
* @version 0.6.0
* @author Ian McBurnie <imancburnie@hotmail.com>
* @desc jQuery collection plugin that implements dynamic aria-activedescendant keyboard navigation
* @summary http://www.w3.org/TR/wai-aria-practices/#kbd_general_within
* @param {object} collection - the jQuery collection of active descendant candidates
* @param {object} options
* @param {options.boolean} useFixedActiveDescendantId - Use a fixed active descendant (default:false)
* @fires 'activeDescendantChange' event when activedescendant changes
* @listens Listens to 'updateActiveDescendantCollection' to receive new descendant items
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
*/
(function ($, window, document, undefined) {

    $.fn.activeDescendant = function activeDescendant(collection, options) {

        options = options || {};

        return this.each(function onEach() {

            var $this = $(this),
                id = $this.prop('id'),
                useFixedActiveDescendantId = options.useFixedActiveDescendantId,
                fixedActiveDescendantId,
                $descendants;

            var getCurrentActiveDescendant = function() {
                return useFixedActiveDescendantId ? $('#' + fixedActiveDescendantId) : $('#' + $this.attr('aria-activedescendant'));
            };

            var updateActiveDescendantDom = function($activedescendant, $newActiveDescendant) {
                if (useFixedActiveDescendantId) {
                    $activedescendant.removeAttr('id');
                    $newActiveDescendant.prop('id', fixedActiveDescendantId);
                }
                else {
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
                    $(this).eq(0).data(id, {"activedescendant": itemIdx});
                });
            });

            $this.on('blur', function() {
                if (!useFixedActiveDescendantId) {
                    $('#' + $this.attr('aria-activedescendant')).removeClass('activedescendant');
                    $this.removeAttr('aria-activedescendant');
                }
            });

            $this.on('downArrowKeyDown', function onDownArrowKeyDown(e) {
                var $activedescendant = getCurrentActiveDescendant(),
                    $newActiveDescendant;

                if ($activedescendant.size() === 0) {
                    $newActiveDescendant = $descendants.first();
                }
                else {
                    var itemIdx = $activedescendant.data(id).activedescendant,
                        $nextEl = $descendants.eq(itemIdx + 1),
                        hasNextEl = $nextEl.length === 1,
                        $firstEl = $descendants.eq(0);

                    $newActiveDescendant = (hasNextEl) ? $nextEl : $firstEl;
                }

                updateActiveDescendantDom($activedescendant, $newActiveDescendant);
                $this.trigger('activeDescendantChange', $newActiveDescendant);
            });

            $this.on('upArrowKeyDown', function onUpArrowKeyDown(e) {
                var $activedescendant = getCurrentActiveDescendant(),
                    $newActiveDescendant;

                if ($activedescendant.size() === 0) {
                    $newActiveDescendant = $descendants.last();
                }
                else {
                    var itemIdx = $activedescendant.data(id).activedescendant,
                        $prevEl = $descendants.eq(itemIdx - 1),
                        hasPrevEl = $prevEl.length === 1,
                        $lastEl = $descendants.eq($descendants.length-1);

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
