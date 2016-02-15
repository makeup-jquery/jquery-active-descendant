describe("jquery.activedescendant.js", function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

    var $body = $('body');
    var dom = '<div class="combobox">'
                + '<input role="combobox">'
                + '<ul role="listbox">'
                    + '<li role="option"></li>'
                    + '<li role="option"></li>'
                    + '<li role="option"></li>'
                + '</ul>'
            + '</div>';
    var $widget;
    var $focusItem;
    var $descendantItems;

    beforeEach(function() {
        $body.empty().append($(dom));
        $widget = $('.combobox');
        $focusItem = $widget.find('[role=combobox]');
        $descendantItems = $widget.find('[role=option]');
    });

    it("should trigger activeDescendantChange event on downArrowKeyDown", function(done) {
        $widget.activeDescendant($focusItem, $descendantItems);
        $widget.on('activeDescendantChange', done);
        $focusItem.trigger('downArrowKeyDown');
    });

    it("should trigger activeDescendantChange event on upArrowKeyDown", function(done) {
        $widget.activeDescendant($focusItem, $descendantItems);
        $widget.on('activeDescendantChange', done);
        $focusItem.trigger('upArrowKeyDown');
    });

    it("should trigger activeDescendantChange event on downArrowKeyDown with existing first activeDescendant", function(done) {
        $descendantItems.first().prop('id', 'widget-activedescendant');
        $widget.activeDescendant($focusItem, $descendantItems);
        $widget.on('activeDescendantChange', done);
        $focusItem.trigger('downArrowKeyDown');
    });

    it("should trigger activeDescendantChange event on downArrowKeyDown with existing last activeDescendant", function(done) {
        $descendantItems.last().prop('id', 'widget-activedescendant');
        $widget.activeDescendant($focusItem, $descendantItems);
        $widget.on('activeDescendantChange', done);
        $focusItem.trigger('downArrowKeyDown');
    });

    it("should trigger activeDescendantChange event on upArrowKeyDown with existing first activeDescendant", function(done) {
        $descendantItems.first().prop('id', 'widget-activedescendant');
        $widget.activeDescendant($focusItem, $descendantItems);
        $widget.on('activeDescendantChange', done);
        $focusItem.trigger('upArrowKeyDown');
    });

    it("should trigger activeDescendantChange event on upArrowKeyDown with existing last activeDescendant", function(done) {
        $descendantItems.last().prop('id', 'widget-activedescendant');
        $widget.activeDescendant($focusItem, $descendantItems);
        $widget.on('activeDescendantChange', done);
        $focusItem.trigger('upArrowKeyDown');
    });

    it("should have correct activedescendant data", function() {
        $widget.activeDescendant($focusItem, $descendantItems);
        expect($descendantItems.first().data('jquery-active-descendant').idx).toBe(0);
        expect($descendantItems.last().data('jquery-active-descendant').idx).toBe(2);
    });
});
