/**
* @name jquery-active-descendant
* @function $.fn.activeDescendant
* @version 0.2.2
* @author Ian McBurnie <imancburnie@hotmail.com>
* @desc jQuery collection plugin that implements dynamic aria-activedescendant keyboard navigation
* @summary http://www.w3.org/TR/wai-aria-practices/#kbd_general_within
* @fires 'change.activeDescendant' event when activedescendant changes
* @listens Listens to 'init.activeDescendant' to receive new descendant collection
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keys
*/
(function ($, window, document, undefined) {

    $.fn.activeDescendant = function activeDescendant(collection) {

        return this.each(function onEach() {

            var $this = $(this),
                $descendants = $(collection),
                activeDescendantId,
                id;

            $this.nextId();
            $this.commonKeys();

            id = $this.prop('id');
            activeDescendantId = $this.prop('id') + '-activedescendent';
            $this.attr('aria-activedescendant', activeDescendantId);

            $this.on('init.activeDescendant', function(e, collection) {
                $descendants = $(collection);
                $descendants.each(function(itemIdx) {
                    // store index position in element's dataset
                    $(this).eq(0).data(id, {"activedescendant": itemIdx});
                });
            });

            $this.on('downarrow.commonKeyDown', function onDownArrowKeyDown(e) {
                var $activedescendant = $('#' + activeDescendantId),
                    $newActiveDescendant;

                if ($activedescendant.size() === 0) {
                    $newActiveDescendant = $descendants.first();
                    $newActiveDescendant.prop('id', activeDescendantId);
                }
                else {
                    var itemIdx = $activedescendant.data(id).activedescendant,
                        $nextEl = $descendants.eq(itemIdx + 1),
                        hasNextEl = $nextEl.length === 1,
                        $firstEl = $descendants.eq(0);

                    $newActiveDescendant = (hasNextEl) ? $nextEl : $firstEl;

                    $activedescendant.removeAttr('id');
                    $newActiveDescendant.prop('id', activeDescendantId);
                }

                $this.trigger('change.activeDescendant', $newActiveDescendant);
            });

            $this.on('uparrow.commonKeyDown', function onUpArrowKeyDown(e) {
                var $activedescendant = $('#' + activeDescendantId),
                    $newActiveDescendant;

                if ($activedescendant.size() === 0) {
                    $newActiveDescendant = $descendants.last();
                    $newActiveDescendant.prop('id', activeDescendantId);
                }
                else {
                    var itemIdx = $activedescendant.data(id).activedescendant,
                        $prevEl = $descendants.eq(itemIdx - 1),
                        hasPrevEl = $prevEl.length === 1,
                        $lastEl = $descendants.eq($descendants.length-1);

                    $newActiveDescendant = (hasPrevEl) ? $prevEl : $lastEl;

                    $activedescendant.removeAttr('id');
                    $newActiveDescendant.prop('id', activeDescendantId);
                }

                $this.trigger('change.activeDescendant', $newActiveDescendant);
            });

            if (collection) {
                $this.trigger('init.activeDescendant', [collection]);
            }
        });
    };

}(jQuery, window, document));
