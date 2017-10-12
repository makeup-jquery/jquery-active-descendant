/* eslint no-undef: 0 */

data.forEach(function(html) {
    describe("when no arrow key has been pressed", function() {
        beforeAll(function() {
            setupSuite(html);
        });

        it("should have idx data value of 0 on 1st item", function() {
            expect($descendantItems.first().data('jquery-linear-navigation').idx).toBe(0);
        });

        it("should have idx data value of length-1 on last item ", function() {
            expect($descendantItems.last().data('jquery-linear-navigation').idx).toBe($descendantItems.length - 1);
        });

        it("should contain zero elements with aria-selected=true", function() {
            expect($descendantItemsContainer.find('[aria-selected=true]').length).toBe(0);
        });

        it("should not trigger activeDescendantChange event", function() {
            expect(onActiveDescendantChange).not.toHaveBeenCalled();
        });
    });

    describe("when arrow down is pressed once", function() {
        beforeAll(function() {
            setupSuite(html);

            $focusItem.trigger('downArrowKeyDown');
        });

        it("should trigger 1 activeDescendantChange event", function() {
            expect(onActiveDescendantChange).toHaveBeenCalledTimes(1);
        });

        it("should have toIndex:0 as activeDescendantChange event data", function() {
            expect(onActiveDescendantChange.calls.argsFor(0)[1].toIndex).toBe(0);
        });

        it("should contain only one element with active-descendant class", function() {
            expect($descendantItemsContainer.find('.active-descendant').length).toBe(1);
        });

        it("first item should have active-descendant class", function() {
            expect($descendantItems.first().hasClass('active-descendant')).toBe(true);
        });
    });

    describe("when up arrow is pressed once", function() {
        beforeAll(function() {
            setupSuite(html);

            $focusItem.trigger('upArrowKeyDown');
        });

        it("should trigger 1 activeDescendantChange event", function() {
            expect(onActiveDescendantChange).toHaveBeenCalledTimes(1);
        });

        it("should have toIndex:0 in activeDescendantChange event data", function() {
            expect(onActiveDescendantChange.calls.argsFor(0)[1].toIndex).toBe(0);
        });

        it("should contain only one element with active-descendant class", function() {
            expect($descendantItemsContainer.find('.active-descendant').length).toBe(1);
        });

        it("first item should have active-descendant class", function() {
            expect($descendantItems.first().hasClass('active-descendant')).toBe(true);
        });
    });

    describe("when down arrow is pressed twice", function() {
        beforeAll(function() {
            setupSuite(html);
            $focusItem.focus();
            $focusItem.trigger('downArrowKeyDown');
            $focusItem.trigger('downArrowKeyDown');
        });

        it("should trigger 2 activeDescendantChange events", function() {
            expect(onActiveDescendantChange).toHaveBeenCalledTimes(2);
        });

        it("should contain only one element with active-descendant class", function() {
            expect($descendantItemsContainer.find('.active-descendant').length).toBe(1);
        });
    });

    /*
    describe("when up arrow is pressed twice", function() {
        beforeAll(function() {
            setupSuite(html);
            $focusItem.focus();
            $focusItem.trigger('upArrowKeyDown');
            $focusItem.trigger('upArrowKeyDown');
        });

        it("should trigger 2 activeDescendantChange events", function() {
            expect(onActiveDescendantChange).toHaveBeenCalledTimes(2);
        });

        it("should contain only one element with aria-selected=true", function() {
            expect($descendantItemsContainer.find('[aria-selected=true]').length).toBe(1);
        });

    });
    */

    describe("when last item is active and down arrow is pressed", function() {
        beforeAll(function() {
            setupSuite(html);

            // init the activedescendant
            $focusItem.trigger('downArrowKeyDown');

            // manipulate plugin so last item is active
            $focusItem.trigger('downArrowKeyDown');
            $focusItem.trigger('downArrowKeyDown');
            $focusItem.trigger('downArrowKeyDown');
        });

        it("activedescendant id should not wrap back to first item", function() {
            expect($focusItem.attr('aria-activedescendant')).toBe($descendantItems.last().prop('id'));
        });

        it("active-descendant should not wrap back to first item", function() {
            expect($descendantItems.last().hasClass('active-descendant')).toBe(true);
        });

        it("should have toIndex:0 as event data", function() {
            expect(onActiveDescendantChange.calls.argsFor(0)[1].toIndex).toBe(0);
        });
    });

    describe("when first item is active and up arrow is pressed once", function() {
        beforeAll(function() {
            setupSuite(html);

            // init the activedescendant
            $focusItem.trigger('downArrowKeyDown');

            $focusItem.trigger('upArrowKeyDown');
        });

        it("activedescendant id should not wrap around to last item", function() {
            expect($focusItem.attr('aria-activedescendant')).toBe($descendantItems.first().prop('id'));
        });

        it("active-descendant class should not wrap around to last item", function() {
            expect($descendantItems.first().hasClass('active-descendant')).toBe(true);
        });
    });

    describe("when widget loses focus after interaction", function() {
        beforeAll(function() {
            setupSuite(html);

            $focusItem.focus();
            $focusItem.trigger('downArrowKeyDown');
            $('body').attr('tabindex', '-1').focus();
        });

        it("should contain zero elements with active-descendant class", function() {
            expect($descendantItemsContainer.find('.active-descendant').length).toBe(0);
        });
    });
});
