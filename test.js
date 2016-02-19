data.forEach(function(html) {

    describe("when no arrow key has been pressed", function() {

        beforeAll(function() {
            setupSuite(html);
        });

        it("should have 0 idx value on 1st item", function() {
            expect($descendantItems.first().data('jquery-active-descendant').idx).toBe(0);
        });

        it("should have size()-1 idx value on last item ", function() {
            expect($descendantItems.last().data('jquery-active-descendant').idx).toBe($descendantItems.size() - 1);
        });

        it("should contain zero elements with .activedescendant class", function() {
            expect($widget.find('.activedescendant').size()).toBe(0);
        });

        it("should not trigger activeDescendantChange event", function() {
            expect(eventHandlerMocks.onActiveDescendantChange).not.toHaveBeenCalled();
        });

    });

    describe("when arrow down is pressed once", function() {

        beforeAll(function() {
            setupSuite(html);

            $focusItem.trigger('downArrowKeyDown');
        });

        it("should trigger 1 activeDescendantChange event", function() {
            expect(eventHandlerMocks.onActiveDescendantChange).toHaveBeenCalledTimes(1);
        });

        it("should contain only one element with .activedescendant class", function() {
            expect($widget.find('.activedescendant').size()).toBe(1);
        });

        it("first item should have .activedescendant class", function() {
            expect($descendantItems.first().hasClass('activedescendant')).toBe(true);
        });

    });

    describe("when up arrow is pressed once", function() {

        beforeAll(function() {
            setupSuite(html);

            $focusItem.trigger('upArrowKeyDown');
        });

        it("should trigger 1 activeDescendantChange event", function() {
            expect(eventHandlerMocks.onActiveDescendantChange).toHaveBeenCalledTimes(1);
        });

        it("should contain only one element with .activedescendant class", function() {
            expect($widget.find('.activedescendant').size()).toBe(1);
        });

        it("last item should have .activedescendant class", function() {
            expect($descendantItems.last().hasClass('activedescendant')).toBe(true);
        });

    });

    describe("when down arrow is pressed twice", function() {

        beforeAll(function() {
            setupSuite(html);

            $focusItem.trigger('downArrowKeyDown');
            $focusItem.trigger('downArrowKeyDown');
        });

        it("should trigger 2 activeDescendantChange events", function() {
            expect(eventHandlerMocks.onActiveDescendantChange).toHaveBeenCalledTimes(2);
        });

        it("should contain only one element with .activedescendant class", function() {
            expect($widget.find('.activedescendant').size()).toBe(1);
        });

    });

    describe("when up arrow is pressed twice", function() {

        beforeAll(function() {
            setupSuite(html);

            $focusItem.trigger('upArrowKeyDown');
            $focusItem.trigger('upArrowKeyDown');
        });

        it("should trigger 2 activeDescendantChange events", function() {
            expect(eventHandlerMocks.onActiveDescendantChange).toHaveBeenCalledTimes(2);
        });

        it("should contain only one element with .activedescendant class", function() {
            expect($widget.find('.activedescendant').size()).toBe(1);
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

        it(".activedescendant class should loop back to first item", function() {
            expect($descendantItems.first().hasClass('activedescendant')).toBe(true);
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

        it(".activedescendant class should loop around to last item", function() {
            expect($descendantItems.last().hasClass('activedescendant')).toBe(true);
        });

    });

    describe("when widget loses focus after interaction", function() {

        beforeAll(function() {
            setupSuite(html);

            $focusItem.focus();
            $focusItem.trigger('downArrowKeyDown');    
            $('body').attr('tabindex', '-1').focus();
        });

        it("should contain zero elements with .activedescendant class", function() {
            expect($widget.find('.activedescendant').size()).toBe(0);
        });

    });

});
