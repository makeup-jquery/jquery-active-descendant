data.forEach(function(html) {

    describe("when no arrow key has been pressed", function() {

        beforeAll(function() {
            setupSuite(html);
        });

        it("should have idx data value of 0 on 1st item", function() {
            expect($descendantItems.first().data('jquery-active-descendant').idx).toBe(0);
        });

        it("should have idx data value of length-1 on last item ", function() {
            expect($descendantItems.last().data('jquery-active-descendant').idx).toBe($descendantItems.length - 1);
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

        it("should have first child item as activeDescendantChange event data", function() {
            expect(onActiveDescendantChange.calls.argsFor(0)[1].id).toBe($descendantItems[0].id);
        });

        it("should contain only one element with aria-selected=true", function() {
            expect($descendantItemsContainer.find('[aria-selected=true]').length).toBe(1);
        });

        it("first item should have aria-selected=true", function() {
            expect($descendantItems.first().attr('aria-selected')).toBe('true');
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

        it("should have last child item as activeDescendantChange event data", function() {
            expect(onActiveDescendantChange.calls.argsFor(0)[1].id).toBe($descendantItems[$descendantItems.length - 1].id);
        });

        it("should contain only one element with aria-selected=true", function() {
            expect($descendantItemsContainer.find('[aria-selected=true]').length).toBe(1);
        });

        it("last item should have aria-selected=true", function() {
            expect($descendantItems.last().attr('aria-selected')).toBe('true');
        });

    });

    describe("when down arrow is pressed twice", function() {

        beforeAll(function() {
            setupSuite(html);

            $focusItem.trigger('downArrowKeyDown');
            $focusItem.trigger('downArrowKeyDown');
        });

        it("should trigger 2 activeDescendantChange events", function() {
            expect(onActiveDescendantChange).toHaveBeenCalledTimes(2);
        });

        it("should contain only one element with aria-selected=true", function() {
            expect($descendantItemsContainer.find('[aria-selected=true]').length).toBe(1);
        });

    });

    describe("when up arrow is pressed twice", function() {

        beforeAll(function() {
            setupSuite(html);

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

    describe("when last item is active and down arrow is pressed", function() {

        beforeAll(function() {
            setupSuite(html);

            // manipulate DOM so that last item is the activedescendant
            $focusItem.attr('aria-activedescendant', $descendantItems.last().prop('id'));
            $descendantItems.last().addClass('activedescendant');

            $focusItem.trigger('downArrowKeyDown');
        });

        it("activedescendant id should loop back to first item", function() {
            expect($focusItem.attr('aria-activedescendant')).toBe($descendantItems.first().prop('id'));
        });

        it("aria-selected=true should loop back to first item", function() {
            expect($descendantItems.first().attr('aria-selected')).toBe('true');
        });

        it("should have first item as event data", function() {
            expect(onActiveDescendantChange.calls.argsFor(0)[1].id).toBe($descendantItems[0].id);
        });

    });

    describe("when first item is active and up arrow is pressed", function() {

        beforeAll(function() {
            setupSuite(html);

            // manipulate DOM so that first item is the activedescendant
            $focusItem.attr('aria-activedescendant', $descendantItems.first().prop('id'));
            $descendantItems.first().addClass('activedescendant');

            $focusItem.trigger('upArrowKeyDown');
        });

        it("activedescendant id should loop around to last item", function() {
            expect($focusItem.attr('aria-activedescendant')).toBe($descendantItems.last().prop('id'));
        });

        it("aria-selected=true should loop around to last item", function() {
            expect($descendantItems.last().attr('aria-selected')).toBe('true');
        });

        it("should have last item as event data", function() {
            expect(onActiveDescendantChange.calls.argsFor(0)[1].id).toBe($descendantItems[$descendantItems.length - 1].id);
        });

    });

    describe("when widget loses focus after interaction", function() {

        beforeAll(function() {
            setupSuite(html);

            $focusItem.focus();
            $focusItem.trigger('downArrowKeyDown');
            $('body').attr('tabindex', '-1').focus();
        });

        it("should contain zero elements with aria-selected=true", function() {
            expect($descendantItemsContainer.find('[aria-selected=true]').length).toBe(0);
        });

    });

});
